import * as ort from 'onnxruntime-web'
import { logger } from '@/utils/logger'
import { AssetSource, loadStaticAsset } from './cache'
import { AI_ASSETS, AI_MODEL_VERSION, AI_ORT_VERSION } from './constants'
import { CommentAiInput, FusionWeightsConfig, computeFusionScore, validateFusionWeightsConfig } from './fusion'
import { WordPieceTokenizer } from './tokenizer'

type EngineStatus = 'idle' | 'loading' | 'ready' | 'failed'

interface PendingItem {
    input: CommentAiInput
    resolve: (score: number) => void
}

const MAX_SCORE_CACHE = 4000
const MAX_BATCH_SIZE = 32
const LONG_SEQ_MAX_BATCH_SIZE = 6

class CommentAiEngine {
    private static instance: CommentAiEngine

    private status: EngineStatus = 'idle'
    private loadPromise: Promise<boolean> | null = null
    private readyCallbacks: Array<() => void> = []
    private loadGeneration = 0

    private session: ort.InferenceSession | null = null
    private tokenizer: WordPieceTokenizer | null = null
    private fusionConfig: FusionWeightsConfig | null = null
    private mjsBlobUrl: string | null = null

    private readonly scoreCache = new Map<string, number>()
    private readonly pendingByRpid = new Map<string, Promise<number>>()
    private pendingQueue: PendingItem[] = []
    private flushScheduled = false
    private inferringChain: Promise<void> = Promise.resolve()

    private constructor() {}

    static getInstance(): CommentAiEngine {
        if (!CommentAiEngine.instance) {
            CommentAiEngine.instance = new CommentAiEngine()
        }
        return CommentAiEngine.instance
    }

    isReady(): boolean {
        return this.status === 'ready'
    }

    private readScoreCache(rpid: string): number | undefined {
        const cached = this.scoreCache.get(rpid)
        if (cached !== undefined) {
            this.scoreCache.delete(rpid)
            this.scoreCache.set(rpid, cached)
        }
        return cached
    }

    private writeScoreCache(rpid: string, score: number): void {
        this.scoreCache.delete(rpid)
        this.scoreCache.set(rpid, score)
        while (this.scoreCache.size > MAX_SCORE_CACHE) {
            const oldest = this.scoreCache.keys().next().value
            if (oldest === undefined) {
                break
            }
            this.scoreCache.delete(oldest)
        }
    }

    getCachedScore(rpid: string): number | undefined {
        return rpid ? this.readScoreCache(rpid) : undefined
    }

    async dispose(): Promise<void> {
        this.loadGeneration++
        this.status = 'idle'
        this.loadPromise = null
        this.readyCallbacks.length = 0
        const queued = this.pendingQueue.splice(0, this.pendingQueue.length)
        queued.forEach((item) => item.resolve(0))
        this.pendingByRpid.clear()
        this.tokenizer = null
        this.fusionConfig = null
        await this.inferringChain.catch(() => {})
        const session = this.session
        this.session = null
        if (session) {
            await session.release().catch(() => {})
        }
        if (this.mjsBlobUrl) {
            URL.revokeObjectURL(this.mjsBlobUrl)
            this.mjsBlobUrl = null
        }
        ;(ort.env.wasm as { wasmBinary?: unknown }).wasmBinary = undefined
    }

    async ensureLoaded(onReady?: () => void): Promise<boolean> {
        if (this.status === 'ready') {
            onReady?.()
            return true
        }
        if (onReady) {
            this.readyCallbacks.push(onReady)
        }
        if (this.status === 'loading' && this.loadPromise) {
            return this.loadPromise
        }
        this.status = 'loading'
        this.loadPromise = this.doLoad(this.loadGeneration)
        return this.loadPromise
    }

    private async doLoad(generation: number): Promise<boolean> {
        const totalStart = performance.now()
        try {
            const [modelAsset, vocabAsset, fusionAsset, ortMjsAsset, ortWasmAsset] = await Promise.all([
                loadStaticAsset(AI_ASSETS.model),
                loadStaticAsset(AI_ASSETS.vocab),
                loadStaticAsset(AI_ASSETS.fusion),
                loadStaticAsset(AI_ASSETS.ortMjs),
                loadStaticAsset(AI_ASSETS.ortWasm),
            ])

            const decoder = new TextDecoder()
            const vocabText = decoder.decode(vocabAsset.buffer)
            const fusionText = decoder.decode(fusionAsset.buffer)

            const tokenizer = new WordPieceTokenizer(vocabText)
            const fusionConfig = validateFusionWeightsConfig(JSON.parse(fusionText))

            if (this.mjsBlobUrl) {
                URL.revokeObjectURL(this.mjsBlobUrl)
            }
            const mjsBlob = new Blob([ortMjsAsset.buffer], { type: 'text/javascript' })
            const mjsBlobUrl = URL.createObjectURL(mjsBlob)
            this.mjsBlobUrl = mjsBlobUrl

            ort.env.wasm.numThreads = 1
            ort.env.wasm.proxy = false
            ort.env.wasm.wasmPaths = { mjs: mjsBlobUrl }
            ort.env.wasm.wasmBinary = new Uint8Array(ortWasmAsset.buffer)

            const sessionStart = performance.now()
            const session = await ort.InferenceSession.create(new Uint8Array(modelAsset.buffer), {
                executionProviders: ['wasm'],
            })
            ;(ort.env.wasm as { wasmBinary?: unknown }).wasmBinary = undefined
            const sessionMs = performance.now() - sessionStart
            if (generation !== this.loadGeneration) {
                await session.release().catch(() => {})
                return false
            }

            this.tokenizer = tokenizer
            this.fusionConfig = fusionConfig
            this.session = session
            this.status = 'ready'

            const sources: Record<string, AssetSource> = {
                model: modelAsset.source,
                vocab: vocabAsset.source,
                fusion: fusionAsset.source,
                ortMjs: ortMjsAsset.source,
                ortWasm: ortWasmAsset.source,
            }
            const totalMs = performance.now() - totalStart
            const assetMs = [
                { name: 'model', asset: modelAsset },
                { name: 'vocab', asset: vocabAsset },
                { name: 'fusion', asset: fusionAsset },
                { name: 'ortMjs', asset: ortMjsAsset },
                { name: 'ortWasm', asset: ortWasmAsset },
            ]
                .map(({ name, asset }) => `${name}:${asset.source}/${asset.elapsedMs.toFixed(1)}ms`)
                .join(',')
            logger.info(
                `[AI] OjinjinNet-Nano v${AI_MODEL_VERSION} (ort ${AI_ORT_VERSION}) ready in ${totalMs.toFixed(1)} ms (assets=[${assetMs}], session=${sessionMs.toFixed(1)} ms), sources=${JSON.stringify(sources)}`,
            )

            const callbacks = this.readyCallbacks.splice(0, this.readyCallbacks.length)
            callbacks.forEach((cb) => {
                try {
                    cb()
                } catch (err) {
                    logger.error('[AI] onReady callback error', err)
                }
            })
            return true
        } catch (err) {
            if (generation === this.loadGeneration) {
                this.status = 'failed'
                this.loadPromise = null
            }
            this.readyCallbacks.length = 0
            if (this.mjsBlobUrl) {
                URL.revokeObjectURL(this.mjsBlobUrl)
                this.mjsBlobUrl = null
            }
            ;(ort.env.wasm as { wasmBinary?: unknown }).wasmBinary = undefined
            logger.error('[AI] Failed to initialize OjinjinNet-Nano', err)
            return false
        }
    }

    scoreComment(input: CommentAiInput): Promise<number> {
        if (input.rpid) {
            const cached = this.readScoreCache(input.rpid)
            if (cached !== undefined) {
                return Promise.resolve(cached)
            }
        }
        if (this.status !== 'ready' || !this.session || !this.tokenizer || !this.fusionConfig) {
            return Promise.resolve(0)
        }
        if (input.rpid) {
            const pending = this.pendingByRpid.get(input.rpid)
            if (pending) {
                return pending
            }
        }
        const promise = new Promise<number>((resolve) => {
            this.pendingQueue.push({ input, resolve })
            if (!this.flushScheduled) {
                this.flushScheduled = true
                queueMicrotask(() => {
                    this.flushScheduled = false
                    const batch = this.pendingQueue.splice(0, this.pendingQueue.length)
                    if (!batch.length) {
                        return
                    }
                    this.inferringChain = this.inferringChain
                        .then(() => this.runBatch(batch))
                        .catch((err) => {
                            logger.error('[AI] Inference batch error', err)
                            batch.forEach((item) => item.resolve(0))
                        })
                })
            }
        })
        if (!input.rpid) {
            return promise
        }
        const rpid = input.rpid
        const tracked = promise.finally(() => {
            if (this.pendingByRpid.get(rpid) === tracked) {
                this.pendingByRpid.delete(rpid)
            }
        })
        this.pendingByRpid.set(rpid, tracked)
        return tracked
    }

    private async runBatch(batch: PendingItem[]): Promise<void> {
        const session = this.session
        const tokenizer = this.tokenizer
        const fusionConfig = this.fusionConfig
        if (!session || !tokenizer || !fusionConfig) {
            batch.forEach((item) => item.resolve(0))
            return
        }
        const start = performance.now()
        const uncachedItems: PendingItem[] = []
        for (const item of batch) {
            const rpid = item.input.rpid
            if (rpid && this.scoreCache.has(rpid)) {
                item.resolve(this.readScoreCache(rpid)!)
            } else {
                uncachedItems.push(item)
            }
        }
        if (!uncachedItems.length) {
            return
        }
        const tokStart = performance.now()
        const seqs = uncachedItems.map((item) => tokenizer.encode(item.input.message.trim(), 192, 140))
        const tokMs = performance.now() - tokStart
        const buckets = new Map<number, number[]>()
        for (let i = 0; i < seqs.length; i++) {
            const len = seqs[i].length
            const bucket = len <= 32 ? 32 : len <= 64 ? 64 : len <= 128 ? 128 : 192
            const list = buckets.get(bucket)
            if (list) list.push(i)
            else buckets.set(bucket, [i])
        }
        const logits = new Float32Array(uncachedItems.length)
        let inferMs = 0
        let yieldMs = 0
        const padId = BigInt(tokenizer.padId)
        const sortedBuckets = Array.from(buckets.keys()).sort((a, b) => a - b)
        for (let bucketPos = 0; bucketPos < sortedBuckets.length; bucketPos++) {
            const bucketKey = sortedBuckets[bucketPos]
            const idxs = buckets.get(bucketKey)!
            const batchSize = bucketKey >= 128 ? LONG_SEQ_MAX_BATCH_SIZE : MAX_BATCH_SIZE
            for (let offset = 0; offset < idxs.length; offset += batchSize) {
                const sub = idxs.slice(offset, offset + batchSize)
                let maxSeqLen = 0
                for (const idx of sub) if (seqs[idx].length > maxSeqLen) maxSeqLen = seqs[idx].length
                const ids = new BigInt64Array(sub.length * maxSeqLen).fill(padId)
                const mask = new BigInt64Array(sub.length * maxSeqLen).fill(0n)
                for (let b = 0; b < sub.length; b++) {
                    const sq = seqs[sub[b]]
                    const rowOffset = b * maxSeqLen
                    for (let t = 0; t < sq.length; t++) {
                        ids[rowOffset + t] = BigInt(sq[t])
                        mask[rowOffset + t] = 1n
                    }
                }
                const inputIdsTensor = new ort.Tensor('int64', ids, [sub.length, maxSeqLen])
                const maskTensor = new ort.Tensor('int64', mask, [sub.length, maxSeqLen])
                const inferStart = performance.now()
                const results = await session.run({ input_ids: inputIdsTensor, attention_mask: maskTensor })
                inferMs += performance.now() - inferStart
                const outData = results.logits.data as Float32Array
                for (let b = 0; b < sub.length; b++) logits[sub[b]] = outData[b]
                inputIdsTensor.dispose?.()
                maskTensor.dispose?.()
                results.logits.dispose?.()
                const isLastSubBatch = bucketPos === sortedBuckets.length - 1 && offset + batchSize >= idxs.length
                if (!isLastSubBatch && inferMs > 12) {
                    const yieldStart = performance.now()
                    await new Promise<void>((resolve) => setTimeout(resolve, 0))
                    yieldMs += performance.now() - yieldStart
                }
            }
        }
        let maxProb = 0
        for (let i = 0; i < uncachedItems.length; i++) {
            const item = uncachedItems[i]
            const prob = computeFusionScore(item.input, logits[i], fusionConfig)
            if (prob > maxProb) maxProb = prob
            if (item.input.rpid) this.writeScoreCache(item.input.rpid, prob)
            item.resolve(prob)
        }
        const totalMs = performance.now() - start
        logger.info(
            `[AI] scored ${uncachedItems.length} comment(s) in ${totalMs.toFixed(2)} ms (tok=${tokMs.toFixed(2)} ms, infer=${inferMs.toFixed(2)} ms, yield=${yieldMs.toFixed(2)} ms, avg=${(totalMs / uncachedItems.length).toFixed(2)} ms/item, maxProb=${maxProb.toFixed(3)})`,
        )
    }
}

export const commentAiEngine = CommentAiEngine.getInstance()

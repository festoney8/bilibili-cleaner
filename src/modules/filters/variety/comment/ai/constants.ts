export type AiFilterLevel = 'conservative' | 'balanced' | 'aggressive'

export const AI_MODEL_VERSION = '1.2.0'
export const AI_MODEL_ASSET_REF = 'assets-v1.2.0'
export const AI_ORT_VERSION = '1.31.1'

export const AI_CACHE_NAME = `bili-cleaner-ai-v${AI_MODEL_VERSION}-ort-${AI_ORT_VERSION}`
export const AI_CACHE_PREFIX = 'bili-cleaner-ai-'
export const AI_IDB_NAME = 'bili-cleaner-ai-cache'
export const AI_IDB_STORE = 'assets'
export const AI_VERSION_KEY = `v${AI_MODEL_VERSION}-ort-${AI_ORT_VERSION}`

export const AI_THRESHOLD_MAP: Record<AiFilterLevel, number> = {
    conservative: 0.85,
    balanced: 0.65,
    aggressive: 0.5,
}

export interface StaticAssetSpec {
    key: string
    urls: string[]
    minBytes: number
    contentType: string
    rejectHtml?: boolean
    sha256?: string
}

const modelAssetUrls = (fileName: string): string[] => [
    `https://raw.githubusercontent.com/LiJiaHua1024/OjinjinNet/${AI_MODEL_ASSET_REF}/nano/v${AI_MODEL_VERSION}/${fileName}`,
    `https://cdn.jsdelivr.net/gh/LiJiaHua1024/OjinjinNet@${AI_MODEL_ASSET_REF}/nano/v${AI_MODEL_VERSION}/${fileName}`,
]

const ortAssetUrls = (fileName: string): string[] => [
    `https://registry.npmmirror.com/onnxruntime-web/${AI_ORT_VERSION}/files/dist/${fileName}`,
    `https://cdn.jsdelivr.net/npm/onnxruntime-web@${AI_ORT_VERSION}/dist/${fileName}`,
]

export const AI_ASSETS = {
    model: {
        key: 'model_int8.onnx',
        urls: modelAssetUrls('model_int8.onnx'),
        minBytes: 100 * 1024,
        contentType: 'application/octet-stream',
        rejectHtml: true,
        sha256: '67e09e5c433116cfb5b54a87f1986139d1ab63f9040abd4eadf497b56da4b615',
    },
    vocab: {
        key: 'vocab.txt',
        urls: modelAssetUrls('vocab.txt'),
        minBytes: 1024,
        contentType: 'text/plain; charset=utf-8',
        rejectHtml: true,
        sha256: '9c952264f101a1488358cab318749adfa9f83980b6704da7f67fe25129846a46',
    },
    fusion: {
        key: 'fusion_weights.json',
        urls: modelAssetUrls('fusion_weights.json'),
        minBytes: 50,
        contentType: 'application/json; charset=utf-8',
        rejectHtml: true,
        sha256: 'cc8821e2952385ea3fb3cd7a2b50a490d50f00cb6bfc0a4f85d0f8a65e5d00ce',
    },
    ortMjs: {
        key: 'ort-wasm-simd-threaded.mjs',
        urls: ortAssetUrls('ort-wasm-simd-threaded.mjs'),
        minBytes: 1024,
        contentType: 'application/javascript; charset=utf-8',
        rejectHtml: true,
        sha256: '30ed0b5cd1182ede931fea448afb567d4dc705ec957af09f108a2be5f770dac3',
    },
    ortWasm: {
        key: 'ort-wasm-simd-threaded.wasm',
        urls: ortAssetUrls('ort-wasm-simd-threaded.wasm'),
        minBytes: 1024 * 1024,
        contentType: 'application/wasm',
        rejectHtml: true,
        sha256: '4b884c203b0fa48d057be3332c65513ff85aa3c5bddd6946acc0fab7ecda001d',
    },
} satisfies Record<string, StaticAssetSpec>

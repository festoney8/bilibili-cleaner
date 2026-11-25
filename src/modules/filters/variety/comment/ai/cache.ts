import { GM_xmlhttpRequest } from '$'
import { logger } from '@/utils/logger'
import { AI_CACHE_NAME, AI_CACHE_PREFIX, AI_IDB_NAME, AI_IDB_STORE, AI_VERSION_KEY, StaticAssetSpec } from './constants'

export type AssetSource = 'cache-storage' | 'indexeddb' | 'network'

export interface LoadedAsset {
    buffer: ArrayBuffer
    source: AssetSource
    url?: string
    elapsedMs: number
}

interface IdbAssetRecord {
    id: string
    versionKey: string
    buffer: ArrayBuffer
    updatedAt: number
}

let cacheStorageCleaned = false
let idbCleaned = false

const buildCacheRequestUrl = (key: string) => `https://bili-cleaner.local/ai/${AI_VERSION_KEY}/${key}`

const isHtmlPayload = (buffer: ArrayBuffer): boolean => {
    const head = new TextDecoder().decode(buffer.slice(0, 64)).trimStart().toLowerCase()
    return head.startsWith('<!doctype') || head.startsWith('<html')
}

const validateBuffer = async (buffer: ArrayBuffer, spec: StaticAssetSpec, verifyHash = false) => {
    if (buffer.byteLength < spec.minBytes) {
        throw new Error(`asset ${spec.key} too small: ${buffer.byteLength} bytes`)
    }
    if (spec.rejectHtml && isHtmlPayload(buffer)) {
        throw new Error(`asset ${spec.key} returned HTML unexpectedly`)
    }
    if (verifyHash && spec.sha256) {
        const digest = await crypto.subtle.digest('SHA-256', buffer)
        const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
        if (hex !== spec.sha256) {
            throw new Error(`asset ${spec.key} sha256 mismatch: ${hex}`)
        }
    }
}

const cleanupOldCacheStorage = async () => {
    if (cacheStorageCleaned || typeof caches === 'undefined') {
        return
    }
    cacheStorageCleaned = true
    try {
        const names = await caches.keys()
        await Promise.all(
            names
                .filter((name) => name.startsWith(AI_CACHE_PREFIX) && name !== AI_CACHE_NAME)
                .map((name) => caches.delete(name)),
        )
    } catch (err) {
        logger.debug('AI cache cleanup failed', err)
    }
}

const readFromCacheStorage = async (spec: StaticAssetSpec): Promise<ArrayBuffer | null> => {
    if (typeof caches === 'undefined') {
        return null
    }
    try {
        await cleanupOldCacheStorage()
        const cache = await caches.open(AI_CACHE_NAME)
        const resp = await cache.match(buildCacheRequestUrl(spec.key))
        if (!resp) {
            return null
        }
        const buf = await resp.arrayBuffer()
        await validateBuffer(buf, spec)
        return buf
    } catch {
        return null
    }
}

const writeToCacheStorage = async (spec: StaticAssetSpec, buffer: ArrayBuffer): Promise<boolean> => {
    if (typeof caches === 'undefined') {
        return false
    }
    try {
        const cache = await caches.open(AI_CACHE_NAME)
        const resp = new Response(buffer.slice(0), {
            headers: { 'Content-Type': spec.contentType },
        })
        await cache.put(buildCacheRequestUrl(spec.key), resp)
        return true
    } catch (err) {
        logger.debug(`AI CacheStorage write failed for ${spec.key}`, err)
        return false
    }
}

const openIdb = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('indexedDB unavailable'))
            return
        }
        const req = indexedDB.open(AI_IDB_NAME, 1)
        req.onupgradeneeded = () => {
            const db = req.result
            if (!db.objectStoreNames.contains(AI_IDB_STORE)) {
                db.createObjectStore(AI_IDB_STORE, { keyPath: 'id' })
            }
        }
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('indexedDB open error'))
    })
}

const cleanupOldIdb = async (db: IDBDatabase) => {
    if (idbCleaned) {
        return
    }
    idbCleaned = true
    try {
        const tx = db.transaction(AI_IDB_STORE, 'readwrite')
        const store = tx.objectStore(AI_IDB_STORE)
        const cursorReq = store.openCursor()
        cursorReq.onsuccess = () => {
            const cursor = cursorReq.result
            if (!cursor) {
                return
            }
            const record = cursor.value as IdbAssetRecord
            if (record.versionKey !== AI_VERSION_KEY) {
                cursor.delete()
            }
            cursor.continue()
        }
    } catch (err) {
        logger.debug('AI IndexedDB cleanup failed', err)
    }
}

const readFromIdb = async (spec: StaticAssetSpec): Promise<ArrayBuffer | null> => {
    try {
        const db = await openIdb()
        await cleanupOldIdb(db)
        const id = `${AI_VERSION_KEY}:${spec.key}`
        return await new Promise<ArrayBuffer | null>((resolve) => {
            const tx = db.transaction(AI_IDB_STORE, 'readonly')
            const req = tx.objectStore(AI_IDB_STORE).get(id)
            req.onsuccess = async () => {
                const rec = req.result as IdbAssetRecord | undefined
                if (!rec || !(rec.buffer instanceof ArrayBuffer)) {
                    resolve(null)
                    return
                }
                try {
                    await validateBuffer(rec.buffer, spec)
                    resolve(rec.buffer)
                } catch {
                    resolve(null)
                }
            }
            req.onerror = () => resolve(null)
        })
    } catch {
        return null
    }
}

const writeToIdb = async (spec: StaticAssetSpec, buffer: ArrayBuffer): Promise<boolean> => {
    try {
        const db = await openIdb()
        const record: IdbAssetRecord = {
            id: `${AI_VERSION_KEY}:${spec.key}`,
            versionKey: AI_VERSION_KEY,
            buffer: buffer.slice(0),
            updatedAt: Date.now(),
        }
        return await new Promise<boolean>((resolve) => {
            const tx = db.transaction(AI_IDB_STORE, 'readwrite')
            tx.objectStore(AI_IDB_STORE).put(record)
            tx.oncomplete = () => resolve(true)
            tx.onerror = () => resolve(false)
        })
    } catch {
        return false
    }
}

const fetchViaGm = (url: string, timeoutMs = 20000): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'arraybuffer',
            timeout: timeoutMs,
            onload: (resp) => {
                if (resp.status >= 200 && resp.status < 300 && resp.response instanceof ArrayBuffer) {
                    resolve(resp.response)
                    return
                }
                reject(new Error(`HTTP ${resp.status} for ${url}`))
            },
            onerror: (err) => {
                reject(new Error(`GM_xmlhttpRequest error for ${url}: ${err?.error || 'network'}`))
            },
            ontimeout: () => {
                reject(new Error(`GM_xmlhttpRequest timeout for ${url}`))
            },
        })
    })
}

/**
 * 按 Cache Storage -> IndexedDB -> GM_xmlhttpRequest（多源回退）加载静态资源
 */
export const loadStaticAsset = async (spec: StaticAssetSpec): Promise<LoadedAsset> => {
    const start = performance.now()

    const cacheBuf = await readFromCacheStorage(spec)
    if (cacheBuf) {
        return {
            buffer: cacheBuf,
            source: 'cache-storage',
            elapsedMs: performance.now() - start,
        }
    }

    const idbBuf = await readFromIdb(spec)
    if (idbBuf) {
        // 尽力回填 Cache Storage
        void writeToCacheStorage(spec, idbBuf)
        return {
            buffer: idbBuf,
            source: 'indexeddb',
            elapsedMs: performance.now() - start,
        }
    }

    const errors: string[] = []
    for (const url of spec.urls) {
        try {
            const buf = await fetchViaGm(url, url === spec.urls[0] ? 5500 : 20000)
            await validateBuffer(buf, spec, true)
            const storedInCache = await writeToCacheStorage(spec, buf)
            if (!storedInCache) {
                await writeToIdb(spec, buf)
            }
            return {
                buffer: buf,
                source: 'network',
                url,
                elapsedMs: performance.now() - start,
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            errors.push(msg)
            logger.debug(`AI asset fallback after failure (${spec.key}): ${msg}`)
        }
    }

    throw new Error(`All sources failed for ${spec.key}: ${errors.join(' | ')}`)
}

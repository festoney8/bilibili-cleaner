const isWhitespace = (ch: string): boolean =>
    ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || /\p{Zs}/u.test(ch)

const isControl = (ch: string): boolean => {
    if (ch === '\t' || ch === '\n' || ch === '\r') {
        return false
    }
    return /\p{Cc}|\p{Cf}/u.test(ch)
}

const isPunctuation = (ch: string): boolean => {
    const cp = ch.codePointAt(0) ?? 0
    if ((cp >= 33 && cp <= 47) || (cp >= 58 && cp <= 64) || (cp >= 91 && cp <= 96) || (cp >= 123 && cp <= 126)) {
        return true
    }
    return /\p{P}/u.test(ch)
}

const isChineseChar = (cp: number): boolean =>
    (cp >= 0x4e00 && cp <= 0x9fff) ||
    (cp >= 0x3400 && cp <= 0x4dbf) ||
    (cp >= 0x20000 && cp <= 0x2a6df) ||
    (cp >= 0x2a700 && cp <= 0x2b73f) ||
    (cp >= 0x2b740 && cp <= 0x2b81f) ||
    (cp >= 0x2b820 && cp <= 0x2ceaf) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0x2f800 && cp <= 0x2fa1f)

const hasNonAscii = (text: string): boolean => {
    for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) >= 0x80) {
            return true
        }
    }
    return false
}

/**
 * 纯 JS BERT WordPiece 分词器，带词片 Map 缓存及头尾拼接截断
 */
export class WordPieceTokenizer {
    readonly padId: number
    readonly unkId: number
    readonly clsId: number
    readonly sepId: number
    private readonly vocab = new Map<string, number>()
    private readonly wpCache = new Map<string, number[]>()

    constructor(vocabText: string) {
        const lines = vocabText.split(/\r?\n/)
        for (let i = 0; i < lines.length; i++) {
            if (i === lines.length - 1 && lines[i] === '') {
                continue
            }
            this.vocab.set(lines[i], i)
        }
        this.padId = this.vocab.get('[PAD]') ?? 0
        this.unkId = this.vocab.get('[UNK]') ?? 100
        this.clsId = this.vocab.get('[CLS]') ?? 101
        this.sepId = this.vocab.get('[SEP]') ?? 102
    }

    private wp(token: string): number[] {
        const cached = this.wpCache.get(token)
        if (cached !== undefined) {
            this.wpCache.delete(token)
            this.wpCache.set(token, cached)
            return cached
        }
        const directId = this.vocab.get(token)
        if (directId !== undefined) {
            const single = [directId]
            this.setWpCache(token, single)
            return single
        }
        const chars = [...token]
        if (chars.length > 100) {
            return [this.unkId]
        }
        const subIds: number[] = []
        let start = 0
        while (start < chars.length) {
            let end = chars.length
            let found = -1
            while (start < end) {
                const sub = (start === 0 ? '' : '##') + chars.slice(start, end).join('')
                const tid = this.vocab.get(sub)
                if (tid !== undefined) {
                    found = tid
                    break
                }
                end--
            }
            if (found === -1) {
                subIds.length = 0
                subIds.push(this.unkId)
                break
            }
            subIds.push(found)
            start = end
        }
        this.setWpCache(token, subIds)
        return subIds
    }

    private setWpCache(token: string, ids: number[]): void {
        this.wpCache.delete(token)
        this.wpCache.set(token, ids)
        while (this.wpCache.size > 8192) {
            const oldest = this.wpCache.keys().next().value
            if (oldest === undefined) break
            this.wpCache.delete(oldest)
        }
    }

    private pushWord(raw: string, ids: number[]) {
        if (!raw) {
            return
        }
        const word = hasNonAscii(raw)
            ? raw
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/\p{Mn}/gu, '')
            : raw.toLowerCase()
        let start = 0
        const len = word.length
        for (let i = 0; i < len;) {
            const cp = word.codePointAt(i) ?? 0
            const step = cp > 0xffff ? 2 : 1
            const ch = word.slice(i, i + step)
            if (isPunctuation(ch)) {
                if (i > start) {
                    for (const t of this.wp(word.slice(start, i))) {
                        ids.push(t)
                    }
                }
                for (const t of this.wp(ch)) {
                    ids.push(t)
                }
                start = i + step
            }
            i += step
        }
        if (start < len) {
            for (const t of this.wp(word.slice(start))) {
                ids.push(t)
            }
        }
    }

    encode(text: string, maxLen = 192, headLen = 140): number[] {
        const ids: number[] = []
        const trimmed = text
        let wordStart = -1

        for (let i = 0; i < trimmed.length;) {
            const cp = trimmed.codePointAt(i) ?? 0
            const step = cp > 0xffff ? 2 : 1
            const ch = trimmed.slice(i, i + step)
            if (cp === 0 || cp === 0xfffd || isControl(ch)) {
                return this.encodeSlow(trimmed, maxLen, headLen)
            }
            if (isWhitespace(ch)) {
                if (wordStart !== -1) {
                    this.pushWord(trimmed.slice(wordStart, i), ids)
                    wordStart = -1
                }
            } else if (isChineseChar(cp)) {
                if (wordStart !== -1) {
                    this.pushWord(trimmed.slice(wordStart, i), ids)
                    wordStart = -1
                }
                const cid = this.vocab.get(ch)
                ids.push(cid !== undefined ? cid : this.unkId)
            } else if (wordStart === -1) {
                wordStart = i
            }
            i += step
        }
        if (wordStart !== -1) {
            this.pushWord(trimmed.slice(wordStart), ids)
        }

        return this.finalizeIds(ids, maxLen, headLen)
    }

    private encodeSlow(text: string, maxLen: number, headLen: number): number[] {
        let cleaned = ''
        for (const ch of text) {
            const cp = ch.codePointAt(0) ?? 0
            if (cp === 0 || cp === 0xfffd || isControl(ch)) {
                continue
            }
            if (isWhitespace(ch)) {
                cleaned += ' '
            } else if (isChineseChar(cp)) {
                cleaned += ` ${ch} `
            } else {
                cleaned += ch
            }
        }
        const ids: number[] = []
        for (const raw of cleaned.replace(/^ +| +$/g, '').split(' ')) {
            if (raw) {
                this.pushWord(raw, ids)
            }
        }
        return this.finalizeIds(ids, maxLen, headLen)
    }

    private finalizeIds(ids: number[], maxLen: number, headLen: number): number[] {
        const budget = maxLen - 2
        if (ids.length > budget) {
            const tailLen = budget - headLen
            return [this.clsId, ...ids.slice(0, headLen), ...ids.slice(ids.length - tailLen), this.sepId]
        }
        return [this.clsId, ...ids, this.sepId]
    }
}

import { error } from '../../../utils/logger'
import { ISubFilter, SelectorFn } from '../core'

export class KeywordFilter implements ISubFilter {
    isEnable = false
    private keywordSet = new Set<string>()
    private mergedRegExp: RegExp | undefined = undefined

    enable(): void {
        this.isEnable = true
    }
    disable(): void {
        this.isEnable = false
    }
    /** 将关键词或正则列表合并为一行正则 */
    private buildRegExp(): void {
        const validParts = []
        for (let word of this.keywordSet) {
            word = word.trim()
            if (word === '' || word === '//') {
                continue
            }
            if (word.startsWith('/') && word.endsWith('/')) {
                word = word.slice(1, -1)
            } else {
                word = word.replace(/[*+?^${}().|[\]\\]/g, '\\$&') // 转义
            }
            try {
                new RegExp(word, 'iu')
                validParts.push(word)
            } catch {}
        }
        try {
            if (validParts.length) {
                this.mergedRegExp = new RegExp(validParts.join('|'), 'iu')
            } else {
                this.mergedRegExp = undefined
            }
        } catch (err) {
            error('keyword filter build RegExp error', err)
        }
    }
    addParam(value: string): void {
        value = value.trim()
        value && this.keywordSet.add(value)
        this.buildRegExp()
    }
    setParam(value: string[]): void {
        this.keywordSet = new Set(value.map((v) => v.trim()).filter((v) => v))
        this.buildRegExp()
    }
    check(el: HTMLElement, selectorFn: SelectorFn): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.isEnable) {
                resolve()
                return
            }
            const value = selectorFn(el)
            if (typeof value !== 'string') {
                resolve()
                return
            }
            this.mergedRegExp?.test(value.trim()) ? reject() : resolve()
        })
    }
}

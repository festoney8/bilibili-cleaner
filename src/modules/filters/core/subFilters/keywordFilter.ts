import { ISubFilter, SelectorFn } from '@/types/filter'
import { error } from '@/utils/logger'

export class KeywordFilter implements ISubFilter {
    isEnable = false
    private keywordSet = new Set<string>()
    private mergedRegExp: RegExp[] = []

    enable(): void {
        this.isEnable = true
    }

    disable(): void {
        this.isEnable = false
    }

    /** 将关键词或正则列表合并为正则 */
    private buildRegExp(): void {
        this.mergedRegExp = []
        const validNormalParts = [] // 普通字串、普通正则
        const validBackrefParts = [] // 包含反向引用的正则
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
                new RegExp(word, 'ius') // check syntax

                if (/\\\d|\\k</.test(word.replaceAll('\\\\', ''))) {
                    validBackrefParts.push(word) // check backreference
                } else {
                    validNormalParts.push(word)
                }
            } catch {}
        }
        try {
            if (validNormalParts.length) {
                this.mergedRegExp.push(new RegExp(validNormalParts.join('|'), 'ius'))
            }
            for (const regex of validBackrefParts) {
                this.mergedRegExp.push(new RegExp(regex, 'ius'))
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
            if (this.isEnable) {
                let value = selectorFn(el)
                if (typeof value === 'string') {
                    value = value.trim()
                    for (const regex of this.mergedRegExp) {
                        if (regex.test(value)) {
                            reject()
                            return
                        }
                    }
                }
            }
            resolve()
        })
    }
}

import { ISubFilter, SelectorFn } from '../core'

export class KeywordFilter implements ISubFilter {
    isEnable = false
    private keywordSet = new Set<string>()

    enable(): void {
        this.isEnable = true
    }
    disable(): void {
        this.isEnable = false
    }
    addParam(value: string): void {
        value = value.trim()
        value && this.keywordSet.add(value)
    }
    setParam(value: string[]): void {
        this.keywordSet = new Set(value.map((v) => v.trim()).filter((v) => v))
    }
    check(el: HTMLElement, selectorFn: SelectorFn): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.isEnable) {
                resolve()
                return
            }
            let value = selectorFn(el)
            if (typeof value !== 'string') {
                resolve()
                return
            }
            value = value.trim().toLowerCase()

            for (const word of this.keywordSet) {
                if (word.startsWith('/') && word.endsWith('/')) {
                    // 正则 iv 模式
                    const pattern = new RegExp(word.slice(1, -1), 'iv')
                    if (pattern.test(value)) {
                        reject()
                        return
                    }
                } else {
                    if (word && value.includes(word.toLowerCase())) {
                        reject()
                        return
                    }
                }
            }
            resolve()
        })
    }
}

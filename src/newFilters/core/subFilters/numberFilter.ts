import { ISubFilter, SelectorFn } from '../core'

export class NumberFilter implements ISubFilter {
    isEnable = false
    private threshold = 0

    enable(): void {
        this.isEnable = true
    }
    disable(): void {
        this.isEnable = false
    }
    setParam(value: number) {
        this.threshold = value
    }
    check(el: HTMLElement, selectorFn: SelectorFn): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.isEnable) {
                resolve()
                return
            }
            const value = selectorFn(el)
            console.log('numberFilter', value, 'threshold', this.threshold)
            if (typeof value === 'number' && value < this.threshold) {
                reject()
                return
            }
            resolve()
        })
    }
}

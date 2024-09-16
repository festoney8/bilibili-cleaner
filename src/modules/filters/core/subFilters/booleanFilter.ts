import { ISubFilter, SelectorFn } from '../../../../types/filter'

export class BooleanFilter implements ISubFilter {
    isEnable = false

    enable(): void {
        this.isEnable = true
    }
    disable(): void {
        this.isEnable = false
    }
    check(el: HTMLElement, selectorFn: SelectorFn): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.isEnable) {
                resolve()
                return
            }
            if (selectorFn(el) === true) {
                reject()
                return
            }
            resolve()
        })
    }
}

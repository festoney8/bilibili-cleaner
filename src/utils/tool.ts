export const debounce = (fn: (...params: any[]) => any, wait: number, immed: boolean = false) => {
    let timer: number | undefined = undefined
    return function (this: any, ...args: any[]) {
        if (timer === undefined && immed) {
            fn.apply(this, args)
        }
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), wait)
        return timer
    }
}

// 匹配BV号
const bvidPattern = /(BV[1-9A-HJ-NP-Za-km-z]+)/
export const matchBvid = (s: string): string | null => {
    const match = bvidPattern.exec(s)
    if (match && match.length >= 2) {
        return match[1]
    }
    return null
}

// 匹配AVBV号
const avidbvidPattern = /(av\d+|BV[1-9A-HJ-NP-Za-km-z]+)/
export const matchAvidBvid = (s: string): string | null => {
    const match = avidbvidPattern.exec(s)
    if (match && match.length >= 2) {
        return match[1]
    }
    return null
}

// 隐藏元素
export const hideEle = (ele: HTMLElement) => {
    ele.style.setProperty('display', 'none', 'important')
}
// 显示元素
export const showEle = (ele: HTMLElement) => {
    if (ele.style.display === 'none') {
        ele.style.removeProperty('display')
    }
}
// 判断是否隐藏中
export const isEleHide = (ele: HTMLElement) => {
    return ele.style.display === 'none'
}

/**
 * 监听元素出现
 * @param watchEle 被监听的元素
 * @param selector 选择器
 * @param isTargetNode 判断Mutation node是否为target的函数
 */
export const waitForEle = async (
    watchEle: HTMLElement | Document,
    selector: string,
    isTargetNode: (node: HTMLElement) => boolean,
): Promise<HTMLElement | null> => {
    if (!selector) {
        return null
    }
    let ele = watchEle.querySelector(selector) as HTMLElement | null
    if (ele) {
        return ele
    }
    return await new Promise<HTMLElement | null>((resolve) => {
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement && isTargetNode(node)) {
                            observer.disconnect()
                            ele = watchEle.querySelector(selector) as HTMLElement | null
                            resolve(ele)
                        }
                    })
                }
            })
        })
        observer.observe(watchEle, { childList: true, subtree: true })
    })
}

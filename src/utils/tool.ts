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
    return bvidPattern.exec(s)?.[1] ?? null
}

// 匹配AVBV号
const avidbvidPattern = /(av\d+|BV[1-9A-HJ-NP-Za-km-z]+)/
export const matchAvidBvid = (s: string): string | null => {
    return avidbvidPattern.exec(s)?.[1] ?? null
}

/**
 * 时间转换成秒
 * @param timeStr 时间字符串 hh:mm:ss 或 mm:ss
 * @returns 秒数
 */
export const convertTimeToSec = (timeStr: string): number => {
    timeStr = timeStr.trim()
    if (/^\d+:\d\d:\d\d$/.test(timeStr)) {
        const parts = timeStr.split(':')
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    }
    if (/^\d\d:\d\d$/.test(timeStr)) {
        const parts = timeStr.split(':')
        return parseInt(parts[0]) * 60 + parseInt(parts[1])
    }
    return Infinity
}

/*
    根据coinLikeRatio计算视频质量
    对爬虫数据中投币点赞比在热门视频中所在排名进行拟合（百分制，4PL Formula）
    保持Quality在5%~80%时的高拟合度

    热门（质量要求适中）：f(x) = (-9.881-168.6)/(1+(x/0.3829)^0.6463)+168.6
    排行榜（较低）：h(x) = (-14.82-115.9)/(1+(x/0.05327)^0.6639)+115.9
    每周必看（严格）：p(x) = (1.534-173.4)/(1+(x/0.7463)^1.401)+173.4
*/
export const calcQuality = (ratio: number): number => {
    const A = -9.881
    const B = 6.463e-1
    const C = 3.829e-1
    const D = 1.686e2
    const ans = (A - D) / (1 + Math.pow(ratio / C, B)) + D
    return ans > 0 ? ans : 0
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

import settings from '../settings'

const startTime: number = performance.now()
let lastTime: number = startTime
let currTime: number = startTime

/**
 * 计时日志wrapper
 * 输出格式: [bili-cleaner] 0.1 / 2.4 ms | XXXXXXXXXXXXXX
 * 第一个时间为上一条日志到本条日志间隔, 第二个时间为脚本开始总时长
 * 使用 performance.now() 做精确计时
 *
 * @param loggingFunc console.log等带级别打印日志的函数
 * @param isEnable 是否打印日志
 * @returns 返回wrap后的日志函数
 */
const wrapper = (loggingFunc: (..._args: any[]) => void | undefined, isEnable: boolean) => {
    if (isEnable) {
        return (...innerArgs: any[]) => {
            currTime = performance.now()
            const during: string = (currTime - lastTime).toFixed(1)
            const total: string = (currTime - startTime).toFixed(1)
            loggingFunc(`[bili-cleaner] ${during} / ${total} ms | ${innerArgs.join(' ')}`)
            lastTime = currTime
        }
    }
    return (..._args: any) => {}
}

export const log = wrapper(console.log, true)
export const error = wrapper(console.error, true)
export const debug = wrapper(console.log, settings.debugRulesMode)
export const debugFilter = wrapper(console.log, settings.debugFiltersMode)

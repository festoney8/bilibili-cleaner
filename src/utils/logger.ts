import { debugMode } from '../setting'

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
 * @param forceEnable 强制启用日志输出, 用于log级别
 * @param isDebugMode 在debug模式启用日志输出, 用于debug和error
 * @returns 返回wrap后的日志函数
 */
const wrapper = (loggingFunc: (..._args: any[]) => void | undefined, forceEnable: boolean, isDebugMode: boolean) => {
    if (forceEnable || isDebugMode) {
        return (...innerArgs: any[]) => {
            currTime = performance.now()
            const during: string = (currTime - lastTime).toFixed(1)
            const total: string = (currTime - startTime).toFixed(1)
            loggingFunc(`[bili-cleaner] ${during} / ${total} ms | ${innerArgs.join(' ')}`)
            lastTime = currTime
        }
    }
    return (..._args: any) => {
        return undefined
    }
}

export const log = wrapper(console.log, true, debugMode)
// debugMode下, 仍使用log级别输出
export const debug = wrapper(console.log, false, debugMode)
export const error = wrapper(console.error, false, debugMode)

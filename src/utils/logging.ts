import { debugMode } from '../setting'

const startTime: number = performance.now()
let lastTime: number = startTime
let currTime: number = startTime

/**
 * 计时日志
 * 输出格式: [bili-cleaner] 0.1 / 2.4 ms | XXXXXXXXXXXXXX
 * 第一个时间为上一条日志到本条日志间隔, 第二个时间为脚本开始总时长
 * 使用 performance.now() 做精确计时
 */
export const log = (...args: any[]) => {
    currTime = performance.now()
    const during: string = (currTime - lastTime).toFixed(1)
    const total: string = (currTime - startTime).toFixed(1)
    console.log(`[bili-cleaner] ${during} / ${total} ms | ${args.join(' ')}`)
    lastTime = currTime
}
/**
 * 在debugMode下, 用log级别打印debug info
 */
export const debug = (...args: any[]) => {
    if (!debugMode) {
        return
    }
    const currTime = performance.now()
    const during: string = (currTime - lastTime).toFixed(1)
    const total: string = (currTime - startTime).toFixed(1)
    console.debug(`[bili-cleaner] ${during} / ${total} ms | ${args.join(' ')}`)
    lastTime = currTime
}
/**
 * 在debugMode下, 打印error信息
 */
export const error = (...args: any[]) => {
    if (!debugMode) {
        return
    }
    const currTime = performance.now()
    const during: string = (currTime - lastTime).toFixed(1)
    const total: string = (currTime - startTime).toFixed(1)
    console.error(`[bili-cleaner] ${during} / ${total} ms | ${args.join(' ')}`)
    lastTime = currTime
}
/**
 * 在debugMode下, 打印error trace
 */
export const trace = () => {
    if (!debugMode) {
        return
    }
    console.trace('[bili-cleaner]')
}

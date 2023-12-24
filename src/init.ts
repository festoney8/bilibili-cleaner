import { log, debug } from './utils/logger'

/**
 * 初始化项目
 * 等待firefox的document.head出现, 用于插入节点, 不对chrome系浏览器进行head处理
 */
export const init = async () => {
    // firefox可捕捉到空head, 让firefox等待head出现+等待head渲染
    // chrome系head永远非空, head渲染完成后仍会出现规则丢失情况, 故此时不处理, 由监听load事件的补丁解决
    if (navigator.userAgent.toLowerCase().includes('firefox') && document.head === null) {
        await waitForHead()
        debug('firefox waitForHead complete')
        // 此时head非空, 可输出innerHTML, 但存在尚未渲染的可能, 仍有概率插入失败, 故观测head的child出现
        await waitForHeadBuild()
        debug('waitForHeadBuild complete')
    }
    log('wait for head complete')
}

/**
 * 观测head出现
 * run-at document-start下, 向head内插入style时小概率报错 TypeError: document.head is null
 * 导致规则载入不全, chrome和firefox均复现，chrome下捕捉不到error, firefox下可捕捉
 * 出现概率低, 多见于首次开启某个页面(猜测是无缓存状态)
 * @see https://github.com/greasemonkey/greasemonkey/issues/2515
 * @returns Promise<void>
 */
const waitForHead = () => {
    return new Promise<void>((resolve) => {
        const observer = new MutationObserver(() => {
            // html元素下出现的第一批childList必定包含head
            observer.disconnect()
            resolve()
        })
        observer.observe(document.documentElement, { childList: true })
    })
}

/**
 * 观测head内子元素, 出现子元素标志着head已构建完成
 * @returns Promise<void>
 */
const waitForHeadBuild = () => {
    return new Promise<void>((resolve) => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target === document.head) {
                    observer.disconnect()
                    resolve()
                }
            }
        })
        observer.observe(document.head, { childList: true })
    })
}

import { log } from './utils/logger'

/**
 * 初始化项目
 * 等待<html>出现+渲染, 用于插入节点
 * pnpm run dev调试时，可能出现由于vite-plugin-monkey抢先监听document
 * 导致脚本载入失败或载入缓慢的情况, 若刷新无效可先build再调试
 */
export const init = async () => {
    await waitForHTMLBuild()
    log('wait for html complete')
}

/** 观测html内出现第一个child, 标志着html tag已渲染 */
const waitForHTMLBuild = () => {
    return new Promise<void>((resolve) => {
        const observer = new MutationObserver(() => {
            if (document.head) {
                observer.disconnect()
                resolve()
            }
        })
        observer.observe(document, { childList: true, subtree: true })
    })
}

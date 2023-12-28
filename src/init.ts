import { log } from './utils/logger'

/**
 * 初始化项目
 * 等待firefox的document.head出现+渲染, 用于插入节点
 */
export const init = async () => {
    // firefox可捕捉到空head, 让firefox等待head渲染出第一波childNode
    // chrome系head永远非空, head渲染完成后仍会出现规则丢失情况, 在此观测纯心理安慰, 最后由监听load事件的补丁解决
    await waitForHeadBuild()
    log('wait for head complete')
}

/**
 * 观测head内子元素, 出现子元素标志着head已构建完成
 * 若只观测head出现，head可能为未渲染状态，向head中插入节点仍可能报错，故观测head渲染完成
 * 耗时<50ms
 * @returns Promise<void>
 */
const waitForHeadBuild = () => {
    return new Promise<void>((resolve) => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.target === document.head) {
                    observer.disconnect()
                    resolve()
                }
            }
        })
        observer.observe(document, { childList: true, subtree: true })
    })
}

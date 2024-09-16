import settings from '../../../settings'
import { SubFilterPair } from '../../../types/filter'
import { error } from '../../../utils/logger'
import { hideEle, showEle } from '../../../utils/tool'

/**
 * 检测元素列表中每个元素是否合法, 隐藏不合法的元素
 * 对选取出的元素内容进行并发检测
 * @param elements 元素列表
 * @param blackPairs 黑名单过滤器与使用的选择函数列表
 * @param whitePairs 白名单过滤器与使用的选择函数列表
 * @param sign 是否标记已检测过
 */
export const coreCheck = async (
    elements: HTMLElement[],
    sign = true,
    blackPairs: SubFilterPair[],
    whitePairs?: SubFilterPair[],
) => {
    try {
        // 黑名单过滤器全部关闭时恢复全部元素
        let isAllDisable = true
        for (const pair of blackPairs) {
            if (pair[0].isEnable) {
                isAllDisable = false
                break
            }
        }
        if (isAllDisable) {
            elements.forEach((el) => showEle(el))
            return
        }

        // 构建黑白名单检测任务
        for (const el of elements) {
            const blackTasks: Promise<void>[] = []
            blackPairs.forEach((pair) => {
                blackTasks.push(pair[0].check(el, pair[1]))
            })

            await Promise.all(blackTasks)
                .then(() => {
                    // 未命中黑名单
                    showEle(el)
                })
                .catch(() => {
                    // 命中黑名单，构建白名单任务
                    const whiteTasks: Promise<void>[] = []
                    whitePairs?.forEach((pair) => {
                        whiteTasks.push(pair[0].check(el, pair[1]))
                    })
                    if (whiteTasks.length) {
                        Promise.all(whiteTasks)
                            .then(() => {
                                // 命中黑名单，未命中白名单
                                hideEle(el)
                            })
                            .catch(() => {
                                // 命中白名单
                                showEle(el)
                            })
                    } else {
                        hideEle(el)
                    }
                })

            // 标记已过滤元素
            sign && el.setAttribute(settings.filterSign, '')
        }
    } catch (err) {
        error('coreCheck error', err)
    }
}

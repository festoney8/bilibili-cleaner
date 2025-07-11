import settings from '@/settings'
import { SubFilterPair } from '@/types/filter'
import { hideEle, showEle } from '@/utils/tool'
import { useThrottleFn } from '@vueuse/core'
import pLimit from 'p-limit'

// 限制并发
const limit = pLimit(10)

const rawCheck = async (
    elements: HTMLElement[],
    enableFilterVisitSign = true,
    hideMode: 'style' | 'sign',
    blackPairs: SubFilterPair[],
    whitePairs?: SubFilterPair[],
    forceBlackPairs?: SubFilterPair[],
): Promise<number> => {
    const toHideIdx = new Set<number>()

    const tasks = elements.map((el, idx) =>
        limit(async () => {
            const blackTasks: Promise<void>[] = []
            blackPairs.forEach((pair) => {
                blackTasks.push(pair[0].check(el, pair[1]))
            })
            const forceBlackTasks: Promise<void>[] = []
            forceBlackPairs?.forEach((pair) => {
                forceBlackTasks.push(pair[0].check(el, pair[1]))
            })
            await Promise.all(blackTasks).catch(async () => {
                // 命中黑名单，构建白名单任务
                const whiteTasks: Promise<void>[] = []
                whitePairs?.forEach((pair) => {
                    whiteTasks.push(pair[0].check(el, pair[1]))
                })
                await Promise.all(whiteTasks)
                    .then(() => {
                        // 命中黑名单，未命中白名单
                        toHideIdx.add(idx)
                    })
                    .catch(() => {})
            })
            await Promise.all(forceBlackTasks).catch(() => {
                // 命中高权限黑名单
                toHideIdx.add(idx)
            })
        }),
    )

    await Promise.all(tasks)
        .catch(() => {})
        .finally(() => {
            // 隐藏元素、标记已访问
            requestAnimationFrame(() => {
                for (let i = 0; i < elements.length; i++) {
                    toHideIdx.has(i) ? hideEle(elements[i], hideMode) : showEle(elements[i], hideMode)
                    enableFilterVisitSign && elements[i].setAttribute(settings.filterVisitSign, '')
                }
            })
        })
    return toHideIdx.size
}

const throttledCheck = useThrottleFn(rawCheck, 50)

/**
 * 检测元素列表中每个元素是否合法, 隐藏不合法的元素
 * 对选取出的元素内容进行并发检测
 * @param elements 元素列表
 * @param enableFilterVisitSign 是否标记已检测过
 * @param hideMode 隐藏模式，style 用display none隐藏，sign 用 attribute 隐藏
 * @param blackPairs 黑名单过滤器与使用的选择函数列表
 * @param whitePairs 白名单过滤器与使用的选择函数列表
 * @param forceBlackPairs 高权限黑名单过滤器与使用的选择函数列表
 * @param noThrottle 是否节流
 */
export const coreCheck = async (
    elements: HTMLElement[],
    enableFilterVisitSign = true,
    hideMode: 'style' | 'sign',
    blackPairs: SubFilterPair[],
    whitePairs?: SubFilterPair[],
    forceBlackPairs?: SubFilterPair[],
    noThrottle?: boolean,
): Promise<number> => {
    if (noThrottle) {
        return rawCheck(elements, enableFilterVisitSign, hideMode, blackPairs, whitePairs, forceBlackPairs)
    }
    return throttledCheck(elements, enableFilterVisitSign, hideMode, blackPairs, whitePairs, forceBlackPairs)
}

import { unsafeWindow } from '$'
import config from '@/config'
import { bigram } from 'n-gram'
import { logger } from './logger'

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

/**
 * 发布日期转换成距今天数
 * @param dateStr 发布时间字符串 'xx小时前' 或 'm-dd'
 * @returns 天数
 */
export const convertDateToDays = (dateStr: string): number => {
    if (dateStr.includes('小时前')) {
        return 0
    }
    dateStr = dateStr.replace('·', '').trim()
    if (/^\d{1,2}-\d{1,2}$/.test(dateStr)) {
        const [month, day] = dateStr.split('-').map(Number)
        let target = new Date(new Date().getFullYear(), month - 1, day).getTime()
        const today = new Date().getTime()
        if (target > today) {
            target = new Date(new Date().getFullYear() - 1, month - 1, day).getTime()
        }
        return (today - target) / 86400000
    }

    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number)
        const target = new Date(year, month - 1, day).getTime()
        const today = new Date().getTime()
        return (today - target) / 86400000
    }
    return 0
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
export const hideEle = (ele: HTMLElement, hideMode: 'style' | 'sign') => {
    if (hideMode === 'sign') {
        // 避免和 greasyfork.org/scripts/481629 冲突
        ele.setAttribute(config.filterHideSign, '')
    } else {
        ele.style.setProperty('display', 'none', 'important')
    }
}
// 显示元素
export const showEle = (ele: HTMLElement, hideMode: 'style' | 'sign') => {
    if (hideMode === 'sign') {
        ele.removeAttribute(config.filterHideSign)
    } else {
        ele.style.removeProperty('display')
    }
}
// 判断是否隐藏中
export const isEleHide = (ele: HTMLElement, hideMode: 'style' | 'sign') => {
    if (hideMode === 'sign') {
        return ele.hasAttribute(config.filterHideSign)
    }
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

/**
 * 对Array去重并保持原序
 * @param arr 输入Array
 * @returns 去重后Array
 */
export const orderedUniq = <T = unknown>(arr: T[]): T[] => {
    return Array.from(new Set(arr))
}

/**
 * 判断是否为 Firefox 浏览器
 * @returns boolean
 */
export const isFirefox = (): boolean => {
    return navigator.userAgent.toLocaleLowerCase().includes('firefox')
}

/**
 * 将全角字符转换为半角字符
 * @param s 输入字符串
 * @returns 转换后的字符串
 */
export const toHalfWidth = (s: string): string => {
    return s.replace(/\u3000/g, ' ').replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
}

/**
 * 在浏览器空闲时执行回调函数
 * @param callback 回调函数
 * @param waitTime 等待时间，单位毫秒，用于不支持 requestIdleCallback 的浏览器
 */
export const runInIdle = (callback: any, waitTime: number) => {
    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(callback)
    } else {
        setTimeout(callback, waitTime)
    }
}

/**
 * 切换播放器模式 helper 方法，只适用于 video 页面和 bangumi 页面
 * @param mode 目标模式
 */
export const playerGoTo = (mode: 'normal' | 'wide' | 'web' | 'mini' | 'full' | 'pip') => {
    const map = {
        normal: 0,
        wide: 1,
        web: 2,
        mini: 3,
        full: 4,
        pip: 5,
    }
    if (typeof unsafeWindow.player?.requestStatue === 'function') {
        unsafeWindow.player.requestStatue(map[mode]).catch((err: unknown) => {
            logger.error(`Failed to switch player mode to ${mode}:`, err)
        })
    }
}

/**
 * 判断是否为可编辑元素
 * @param el 目标元素
 */
export const isEditableElement = (el: Element): boolean => {
    if (!(el instanceof HTMLElement)) {
        return false
    }
    return (
        el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        el.isContentEditable ||
        el.closest('[contenteditable]') !== null
    )
}

// NFKC正规化
const normalizeText = (value: unknown): string => {
    if (typeof value !== 'string') {
        return ''
    }
    return value.normalize('NFKC').toLowerCase().trim()
}

// 视频相关度评分参数
const VIDEO_RELATIVITY_PARAMS = {
    tokenization: {
        segmenterLocale: 'zh',
        segmenterGranularity: 'word' as const,
    },
    scoreWeights: {
        unigramCoverage: 0.75,
        bigramProximity: 0.25,
    },
    fieldWeights: {
        title: 0.6,
        tags: 0.25,
        author: 0.1,
        description: 0.05,
    },
} as const

const tokenizeVideoRelativityText = (value: string, segmenter: Intl.Segmenter): string[] => {
    return Array.from(segmenter.segment(value))
        .filter(({ isWordLike }) => isWordLike)
        .map(({ segment }) => segment)
        .filter(Boolean)
}

const toTokenSet = (tokens: string[]): Set<string> => new Set(tokens)

const toBigramSet = (tokens: string[]): Set<string> => {
    const tokenBigrams = bigram(tokens) as unknown as string[][]
    return new Set(tokenBigrams.map((pair) => pair.join('\u0000')))
}

const calcTokenCoverage = (queryTokens: string[], fieldTokens: string[]): number => {
    if (!queryTokens.length) {
        return 0
    }
    const fieldTokenSet = toTokenSet(fieldTokens)
    const matchedTokenCount = queryTokens.filter((token) => fieldTokenSet.has(token)).length
    return matchedTokenCount / queryTokens.length
}

const calcBigramCoverage = (queryTokens: string[], fieldTokens: string[]): number => {
    const queryBigramSet = toBigramSet(queryTokens)
    if (!queryBigramSet.size) {
        return 0
    }
    const fieldBigramSet = toBigramSet(fieldTokens)
    const matchedBigramCount = Array.from(queryBigramSet).filter((pair) => fieldBigramSet.has(pair)).length
    return matchedBigramCount / queryBigramSet.size
}

const calcVideoRelativityFieldScore = (queryTokens: string[], fieldTokens: string[]): number => {
    const unigramCoverage = calcTokenCoverage(queryTokens, fieldTokens)
    if (queryTokens.length < 2) {
        return unigramCoverage
    }

    const bigramCoverage = calcBigramCoverage(queryTokens, fieldTokens)
    const { unigramCoverage: unigramWeight, bigramProximity: bigramWeight } = VIDEO_RELATIVITY_PARAMS.scoreWeights
    return unigramCoverage * (unigramWeight + bigramWeight * bigramCoverage)
}

const calcVideoRelativityTagsScore = (queryTokens: string[], tags: string[], segmenter: Intl.Segmenter): number => {
    const tagTokens = tags.map((tag) => tokenizeVideoRelativityText(tag, segmenter))
    const allTagTokens = tagTokens.flat()
    const unigramCoverage = calcTokenCoverage(queryTokens, allTagTokens)
    if (queryTokens.length < 2) {
        return unigramCoverage
    }

    const queryBigramSet = toBigramSet(queryTokens)
    const tagBigramUnion = new Set(tagTokens.flatMap((tokens) => Array.from(toBigramSet(tokens))))
    const matchedBigramCount = Array.from(queryBigramSet).filter((queryBigram) => {
        return tagBigramUnion.has(queryBigram)
    }).length
    const bigramCoverage = queryBigramSet.size ? matchedBigramCount / queryBigramSet.size : 0
    const { unigramCoverage: unigramWeight, bigramProximity: bigramWeight } = VIDEO_RELATIVITY_PARAMS.scoreWeights
    return unigramCoverage * (unigramWeight + bigramWeight * bigramCoverage)
}

/**
 * 计算搜索关键词与视频的相关度(0~1)
 * hit_columns非空: 搜索引擎已命中, 返回1
 * hit_columns为空: 按字段加权计算关键词与标题/标签/作者/简介的相关度
 * 数据缺失或浏览器不支持 Intl.Segmenter: 返回undefined
 * @param keyword 搜索关键词
 * @param title 视频标题
 * @param description 视频简介
 * @param author 视频作者
 * @param tags 标签关键词列表
 * @param hitColumns 搜索结果原始数据中的hit_columns字段
 */
export const calcVideoRelativity = (
    keyword: string,
    title: string,
    description: string,
    author: string,
    tags: string[],
    hitColumns: unknown,
): number | undefined => {
    if (!Array.isArray(hitColumns)) {
        return undefined
    }

    // hit_columns 直接命中
    if (hitColumns.length > 0) {
        return 1
    }

    // 正规化
    keyword = normalizeText(keyword)
    title = normalizeText(title)
    description = normalizeText(description)
    author = normalizeText(author)
    tags = tags.map((tag) => normalizeText(tag))

    // 直接命中title/keyword/tag
    if (title.includes(keyword) || author.includes(keyword) || tags.includes(keyword)) {
        return 1
    }

    // 不支持分词器的浏览器
    if (typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') {
        return undefined
    }

    // 分词
    const segmenter = new Intl.Segmenter(VIDEO_RELATIVITY_PARAMS.tokenization.segmenterLocale, {
        granularity: VIDEO_RELATIVITY_PARAMS.tokenization.segmenterGranularity,
    })
    const queryTokens = Array.from(new Set(tokenizeVideoRelativityText(keyword, segmenter)))
    if (!queryTokens.length) {
        return undefined
    }

    // 各字段评分
    const titleScore = calcVideoRelativityFieldScore(queryTokens, tokenizeVideoRelativityText(title, segmenter))
    const descriptionScore = calcVideoRelativityFieldScore(
        queryTokens,
        tokenizeVideoRelativityText(description, segmenter),
    )
    const authorScore = calcVideoRelativityFieldScore(queryTokens, tokenizeVideoRelativityText(author, segmenter))
    const tagsScore = calcVideoRelativityTagsScore(queryTokens, tags, segmenter)
    const {
        title: titleWeight,
        tags: tagsWeight,
        author: authorWeight,
        description: descriptionWeight,
    } = VIDEO_RELATIVITY_PARAMS.fieldWeights

    const finalScore =
        titleWeight * titleScore +
        tagsWeight * tagsScore +
        authorWeight * authorScore +
        descriptionWeight * descriptionScore

    return Math.max(0, Math.min(1, finalScore))
}

import { GM_getValue } from '$'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { convertTimeToSec, matchBvid, showEle, waitForEle } from '../../../../../utils/tool'
import { MainFilter, coreCheck } from '../../../core/core'
import { VideoBvidFilter, VideoDurationFilter, VideoTitleFilter } from '../subFilters/black'
import { VideoTitleWhiteFilter } from '../subFilters/white'

const GM_KEYS = {
    black: {
        duration: {
            statusKey: 'space-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        bvid: {
            statusKey: 'space-bvid-filter-status',
            valueKey: 'global-bvid-filter-value',
        },
        title: {
            statusKey: 'space-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
    },
    white: {
        title: {
            statusKey: 'space-title-keyword-whitelist-filter-status',
            valueKey: 'global-title-keyword-whitelist-filter-value',
        },
    },
}

// 视频列表信息提取
const selectorFns = {
    duration: (video: HTMLElement): SelectorResult => {
        const duration = video.querySelector('span.length')?.textContent?.trim()
        return (duration && convertTimeToSec(duration)) ?? undefined
    },
    title: (video: HTMLElement): SelectorResult => {
        return video.querySelector('a.title')?.textContent?.trim()
    },
    bvid: (video: HTMLElement): SelectorResult => {
        const href = video.querySelector('a.title')?.getAttribute('href')?.trim()
        return (href && matchBvid(href)) ?? undefined
    },
}

// VFSP is VideoFilterSpace
class VFSP extends MainFilter {
    // 黑名单
    static videoBvidFilter = new VideoBvidFilter()
    static videoDurationFilter = new VideoDurationFilter()
    static videoTitleFilter = new VideoTitleFilter()

    // 白名单
    static videoTitleWhiteFilter = new VideoTitleWhiteFilter()

    constructor() {
        super()
        // 黑名单
        VFSP.videoBvidFilter.setParam(GM_getValue(GM_KEYS.black.bvid.valueKey, []))
        VFSP.videoDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        VFSP.videoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
        // 白名单
        VFSP.videoTitleWhiteFilter.setParam(GM_getValue(GM_KEYS.white.title.valueKey, []))
    }

    observe(): void {
        waitForEle(document, '#app', (node: HTMLElement): boolean => {
            return node.id === 'app'
        }).then((ele) => {
            if (!ele) {
                return
            }

            VFSP.target = ele
            log('VFSP target appear')
            VFSP.check('full').then().catch()

            new MutationObserver(() => {
                VFSP.check('full').then().catch() // 空间页始终全量check
            }).observe(VFSP.target, { childList: true, subtree: true })
        })
    }

    static async check(mode?: 'full' | 'incr') {
        if (!VFSP.target) {
            return
        }
        let revertAll = false
        if (!(VFSP.videoBvidFilter.isEnable || VFSP.videoDurationFilter.isEnable || VFSP.videoTitleFilter.isEnable)) {
            revertAll = true
        }
        const timer = performance.now()

        // 提取元素
        let selector
        // 主页视频
        if (/^\/\d+$/.test(location.pathname)) {
            selector = `#page-index .small-item`
        }
        // 投稿视频
        if (/^\/\d+\/video$/.test(location.pathname)) {
            selector = `#submit-video :is(.small-item,.list-item)`
        }
        // 视频合集、视频系列
        if (/^\/\d+\/channel\/(collectiondetail|seriesdetail)/.test(location.pathname)) {
            selector = `:is(#page-collection-detail,#page-series-detail) li.small-item`
        }
        if (!selector) {
            return
        }
        const videos = Array.from(VFSP.target.querySelectorAll<HTMLElement>(selector))
        if (!videos.length) {
            return
        }
        if (revertAll) {
            videos.forEach((v) => showEle(v))
            return
        }

        videos.forEach((v) => {
            log(
                [
                    `space video`,
                    `bvid: ${selectorFns.bvid(v)}`,
                    `duration: ${selectorFns.duration(v)}`,
                    `title: ${selectorFns.title(v)}`,
                ].join('\n'),
            )
        })

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        VFSP.videoBvidFilter.isEnable && blackPairs.push([VFSP.videoBvidFilter, selectorFns.bvid])
        VFSP.videoDurationFilter.isEnable && blackPairs.push([VFSP.videoDurationFilter, selectorFns.duration])
        VFSP.videoTitleFilter.isEnable && blackPairs.push([VFSP.videoTitleFilter, selectorFns.title])

        const whitePairs: SubFilterPair[] = []
        VFSP.videoTitleWhiteFilter.isEnable && whitePairs.push([VFSP.videoTitleWhiteFilter, selectorFns.title])

        // 检测
        const blackCnt = await coreCheck(videos, false, blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        log(`VFSP hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }
}

export const videoFilterSpaceEntry = async () => {
    const vfsp = new VFSP()
    vfsp.observe()
}

export const videoFilterSpaceGroups: Group[] = [
    {
        name: '时长过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.duration.statusKey,
                name: '启用 时长过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFSP.videoDurationFilter.enable()
                    VFSP.check('full').then().catch()
                },
                disableFn: () => {
                    VFSP.videoDurationFilter.disable()
                    VFSP.check('full').then().catch()
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.duration.valueKey,
                name: '设定最低时长（0~300s）',
                noStyle: true,
                minValue: 0,
                maxValue: 300,
                defaultValue: 60,
                disableValue: 0,
                addonText: '秒',
                fn: (value: number) => {
                    VFSP.videoDurationFilter.setParam(value)
                    VFSP.check('full').then().catch()
                },
            },
        ],
    },
    {
        name: '标题关键词过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.title.statusKey,
                name: '启用 标题关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFSP.videoTitleFilter.enable()
                    VFSP.check('full').then().catch()
                },
                disableFn: () => {
                    VFSP.videoTitleFilter.disable()
                    VFSP.check('full').then().catch()
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 标题关键词黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
            },
        ],
    },
    {
        name: 'BV号过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.bvid.statusKey,
                name: '启用 BV号过滤 (右键单击标题)',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFSP.videoBvidFilter.enable()
                    VFSP.check('full').then().catch()
                },
                disableFn: () => {
                    VFSP.videoBvidFilter.disable()
                    VFSP.check('full').then().catch()
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 BV号黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
            },
        ],
    },
    {
        name: '白名单 免过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.white.title.statusKey,
                name: '启用 标题关键词白名单',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFSP.videoTitleWhiteFilter.enable()
                    VFSP.check('full').then().catch()
                },
                disableFn: () => {
                    VFSP.videoTitleWhiteFilter.disable()
                    VFSP.check('full').then().catch()
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 标题关键词白名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
            },
        ],
    },
]

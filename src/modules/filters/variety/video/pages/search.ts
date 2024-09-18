import { GM_getValue } from '$'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { convertTimeToSec, matchBvid, showEle, waitForEle } from '../../../../../utils/tool'
import { coreCheck, MainFilter } from '../../../core/core'
import {
    VideoBvidFilter,
    VideoDurationFilter,
    VideoTitleFilter,
    VideoUploaderFilter,
    VideoUploaderKeywordFilter,
} from '../subFilters/black'
import { VideoTitleWhiteFilter, VideoUploaderWhiteFilter } from '../subFilters/white'

const GM_KEYS = {
    black: {
        duration: {
            statusKey: 'search-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        uploader: {
            statusKey: 'search-uploader-filter-status',
            valueKey: 'global-uploader-filter-value',
        },
        uploaderKeyword: {
            statusKey: 'search-uploader-keyword-filter-status',
            valueKey: 'global-uploader-keyword-filter-value',
        },
        bvid: {
            statusKey: 'search-bvid-filter-status',
            valueKey: 'global-bvid-filter-value',
        },
        title: {
            statusKey: 'search-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
    },
    white: {
        uploader: {
            statusKey: 'search-uploader-whitelist-filter-status',
            valueKey: 'global-uploader-whitelist-filter-value',
        },
        title: {
            statusKey: 'search-title-keyword-whitelist-filter-status',
            valueKey: 'global-title-keyword-whitelist-filter-value',
        },
    },
}

// 视频列表信息提取
const selectorFns = {
    duration: (video: HTMLElement): SelectorResult => {
        const duration = video.querySelector('.bili-video-card__stats__duration')?.textContent?.trim()
        return (duration && convertTimeToSec(duration)) ?? undefined
    },
    title: (video: HTMLElement): SelectorResult => {
        return video.querySelector('.bili-video-card__info--tit')?.textContent?.trim()
    },
    bvid: (video: HTMLElement): SelectorResult => {
        const href =
            video.querySelector('.bili-video-card__wrap > a')?.getAttribute('href') ||
            video.querySelector('.bili-video-card__info--right > a')?.getAttribute('href')
        return (href && matchBvid(href)) ?? undefined
    },
    uploader: (video: HTMLElement): SelectorResult => {
        return video.querySelector('.bili-video-card__info--author')?.textContent?.trim()
    },
}

// VFSE is VideoFilterSearch
class VFSE extends MainFilter {
    // 黑名单
    static videoBvidFilter = new VideoBvidFilter()
    static videoDurationFilter = new VideoDurationFilter()
    static videoTitleFilter = new VideoTitleFilter()
    static videoUploaderFilter = new VideoUploaderFilter()
    static videoUploaderKeywordFilter = new VideoUploaderKeywordFilter()

    // 白名单
    static videoUploaderWhiteFilter = new VideoUploaderWhiteFilter()
    static videoTitleWhiteFilter = new VideoTitleWhiteFilter()

    constructor() {
        super()
        // 黑名单
        VFSE.videoBvidFilter.setParam(GM_getValue(GM_KEYS.black.bvid.valueKey, []))
        VFSE.videoDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        VFSE.videoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
        VFSE.videoUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        VFSE.videoUploaderKeywordFilter.setParam(GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []))
        // 白名单
        VFSE.videoUploaderWhiteFilter.setParam(GM_getValue(GM_KEYS.white.uploader.valueKey, []))
        VFSE.videoTitleWhiteFilter.setParam(GM_getValue(GM_KEYS.white.title.valueKey, []))
    }

    observe(): void {
        waitForEle(document, '.search-layout', (node: HTMLElement): boolean => {
            return node.className.includes('search-layout')
        }).then((ele) => {
            if (!ele) {
                return
            }

            VFSE.target = ele
            log('VFSE target appear')
            VFSE.check('full')

            new MutationObserver(() => {
                VFSE.check('full') // 搜索页始终全量check
            }).observe(VFSE.target, { childList: true, subtree: true })
        })
    }

    static async check(mode?: 'full' | 'incr') {
        if (!VFSE.target) {
            return
        }
        let revertAll = false
        if (
            !(
                VFSE.videoBvidFilter.isEnable ||
                VFSE.videoDurationFilter.isEnable ||
                VFSE.videoTitleFilter.isEnable ||
                VFSE.videoUploaderFilter.isEnable ||
                VFSE.videoUploaderKeywordFilter.isEnable
            )
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 提取元素
        const selector = `.video.search-all-list .video-list > div, .search-page-video .video-list > div, .video-list-item`

        const videos = Array.from(VFSE.target.querySelectorAll<HTMLElement>(selector))
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
                    `search video`,
                    `bvid: ${selectorFns.bvid(v)}`,
                    `duration: ${selectorFns.duration(v)}`,
                    `title: ${selectorFns.title(v)}`,
                    `uploader: ${selectorFns.uploader(v)}`,
                ].join('\n'),
            )
        })

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        VFSE.videoBvidFilter.isEnable && blackPairs.push([VFSE.videoBvidFilter, selectorFns.bvid])
        VFSE.videoDurationFilter.isEnable && blackPairs.push([VFSE.videoDurationFilter, selectorFns.duration])
        VFSE.videoTitleFilter.isEnable && blackPairs.push([VFSE.videoTitleFilter, selectorFns.title])
        VFSE.videoUploaderFilter.isEnable && blackPairs.push([VFSE.videoUploaderFilter, selectorFns.uploader])
        VFSE.videoUploaderKeywordFilter.isEnable &&
            blackPairs.push([VFSE.videoUploaderKeywordFilter, selectorFns.uploader])

        const whitePairs: SubFilterPair[] = []
        VFSE.videoUploaderWhiteFilter.isEnable && whitePairs.push([VFSE.videoUploaderWhiteFilter, selectorFns.uploader])
        VFSE.videoTitleWhiteFilter.isEnable && whitePairs.push([VFSE.videoTitleWhiteFilter, selectorFns.title])

        // 检测
        const blackCnt = await coreCheck(videos, false, blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        log(`VFSE hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }
}

export const videoFilterSearchEntry = async () => {
    const vfe = new VFSE()
    vfe.observe()
}

export const videoFilterSearchGroups: Group[] = [
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
                    VFSE.videoDurationFilter.enable()
                    VFSE.check('full')
                },
                disableFn: () => {
                    VFSE.videoDurationFilter.disable()
                    VFSE.check('full')
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
                    VFSE.videoDurationFilter.setParam(value)
                    VFSE.check('full')
                },
            },
        ],
    },
    {
        name: 'UP主过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.uploader.statusKey,
                name: '启用 UP主过滤 (右键单击UP主)',
                defaultEnable: true,
                noStyle: true,
                enableFn: () => {
                    VFSE.videoUploaderFilter.enable()
                    VFSE.check('full')
                },
                disableFn: () => {
                    VFSE.videoUploaderFilter.disable()
                    VFSE.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 UP主黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.uploaderKeyword.statusKey,
                name: '启用 UP主昵称关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFSE.videoUploaderKeywordFilter.enable()
                    VFSE.check('full')
                },
                disableFn: () => {
                    VFSE.videoUploaderKeywordFilter.disable()
                    VFSE.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 UP主昵称关键词黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
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
                    VFSE.videoTitleFilter.enable()
                    VFSE.check('full')
                },
                disableFn: () => {
                    VFSE.videoTitleFilter.disable()
                    VFSE.check('full')
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
                    VFSE.videoBvidFilter.enable()
                    VFSE.check('full')
                },
                disableFn: () => {
                    VFSE.videoBvidFilter.disable()
                    VFSE.check('full')
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
                id: GM_KEYS.white.uploader.statusKey,
                name: '启用 UP主白名单',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFSE.videoUploaderWhiteFilter.enable()
                    VFSE.check('full')
                },
                disableFn: () => {
                    VFSE.videoUploaderWhiteFilter.disable()
                    VFSE.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 UP主白名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.title.statusKey,
                name: '启用 标题关键词白名单',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFSE.videoTitleWhiteFilter.enable()
                    VFSE.check('full')
                },
                disableFn: () => {
                    VFSE.videoTitleWhiteFilter.disable()
                    VFSE.check('full')
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

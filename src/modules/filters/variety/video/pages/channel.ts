import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { convertDateToDays, convertTimeToSec, matchBvid, showEle, waitForEle } from '../../../../../utils/tool'
import { coreCheck, MainFilter } from '../../../core/core'
import {
    VideoBvidFilter,
    VideoDurationFilter,
    VideoPubdateFilter,
    VideoTitleFilter,
    VideoUploaderFilter,
    VideoUploaderKeywordFilter,
} from '../subFilters/black'
import { VideoTitleWhiteFilter, VideoUploaderWhiteFilter } from '../subFilters/white'

const GM_KEYS = {
    black: {
        duration: {
            statusKey: 'channel-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        uploader: {
            statusKey: 'channel-uploader-filter-status',
            valueKey: 'global-uploader-filter-value',
        },
        uploaderKeyword: {
            statusKey: 'channel-uploader-keyword-filter-status',
            valueKey: 'global-uploader-keyword-filter-value',
        },
        bvid: {
            statusKey: 'channel-bvid-filter-status',
            valueKey: 'global-bvid-filter-value',
        },
        pubdate: {
            statusKey: 'channel-pubdate-filter-status',
            valueKey: 'global-pubdate-filter-value',
        },
        title: {
            statusKey: 'channel-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
    },
    white: {
        uploader: {
            statusKey: 'channel-uploader-whitelist-filter-status',
            valueKey: 'global-uploader-whitelist-filter-value',
        },
        title: {
            statusKey: 'channel-title-keyword-whitelist-filter-status',
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
        return video.querySelector('.bili-video-card__info--tit a')?.textContent?.trim()
    },
    pubdate: (video: HTMLElement): SelectorResult => {
        const pubdate = video.querySelector('.bili-video-card__info--date')?.textContent?.trim()
        return pubdate && convertDateToDays(pubdate)
    },
    bvid: (video: HTMLElement): SelectorResult => {
        const href =
            video.querySelector('.bili-video-card__info--tit a')?.getAttribute('href') ||
            video.querySelector('.bili-video-card__image--link')?.getAttribute('href')
        return (href && matchBvid(href)) ?? undefined
    },
    uploader: (video: HTMLElement): SelectorResult => {
        return video.querySelector('.bili-video-card__info--author')?.textContent?.trim()
    },
}

// VFC is VideoFilterChannel
class VFC extends MainFilter {
    // 黑名单
    static videoBvidFilter = new VideoBvidFilter()
    static videoDurationFilter = new VideoDurationFilter()
    static videoTitleFilter = new VideoTitleFilter()
    static videoPubdateFilter = new VideoPubdateFilter()
    static videoUploaderFilter = new VideoUploaderFilter()
    static videoUploaderKeywordFilter = new VideoUploaderKeywordFilter()

    // 白名单
    static videoUploaderWhiteFilter = new VideoUploaderWhiteFilter()
    static videoTitleWhiteFilter = new VideoTitleWhiteFilter()

    constructor() {
        super()
        // 黑名单
        VFC.videoBvidFilter.setParam(GM_getValue(GM_KEYS.black.bvid.valueKey, []))
        VFC.videoDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        VFC.videoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
        VFC.videoPubdateFilter.setParam(GM_getValue(GM_KEYS.black.pubdate.valueKey, 0))
        VFC.videoUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        VFC.videoUploaderKeywordFilter.setParam(GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []))
        // 白名单
        VFC.videoUploaderWhiteFilter.setParam(GM_getValue(GM_KEYS.white.uploader.valueKey, []))
        VFC.videoTitleWhiteFilter.setParam(GM_getValue(GM_KEYS.white.title.valueKey, []))
    }

    observe(): void {
        waitForEle(document, 'main', (node: HTMLElement): boolean => {
            return node.tagName === 'MAIN'
        }).then((ele) => {
            if (!ele) {
                return
            }

            VFC.target = ele
            log('VFC target appear')
            VFC.check('full')

            new MutationObserver(() => {
                VFC.check('incr')
            }).observe(VFC.target, { childList: true, subtree: true })
        })
    }

    static async check(mode?: 'full' | 'incr') {
        if (!VFC.target) {
            return
        }
        let revertAll = false
        if (
            !(
                VFC.videoBvidFilter.isEnable ||
                VFC.videoDurationFilter.isEnable ||
                VFC.videoTitleFilter.isEnable ||
                VFC.videoUploaderFilter.isEnable ||
                VFC.videoUploaderKeywordFilter.isEnable ||
                VFC.videoPubdateFilter.isEnable
            )
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 提取元素
        let selector = `.bili-video-card[data-report*='.']`
        if (mode === 'incr') {
            selector += `:not([${settings.filterSign}])`
        }
        const videos = Array.from(VFC.target.querySelectorAll<HTMLElement>(selector))
        if (!videos.length) {
            return
        }
        if (revertAll) {
            videos.forEach((v) => showEle(v))
            return
        }

        // videos.forEach((v) => {
        //     log(
        //         [
        //             `channel video`,
        //             `bvid: ${selectorFns.bvid(v)}`,
        //             `duration: ${selectorFns.duration(v)}`,
        //             `title: ${selectorFns.title(v)}`,
        //             `uploader: ${selectorFns.uploader(v)}`,
        //             `pubdate: ${selectorFns.pubdate(v)}`,
        //         ].join('\n'),
        //     )
        // })

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        VFC.videoBvidFilter.isEnable && blackPairs.push([VFC.videoBvidFilter, selectorFns.bvid])
        VFC.videoDurationFilter.isEnable && blackPairs.push([VFC.videoDurationFilter, selectorFns.duration])
        VFC.videoTitleFilter.isEnable && blackPairs.push([VFC.videoTitleFilter, selectorFns.title])
        VFC.videoPubdateFilter.isEnable && blackPairs.push([VFC.videoPubdateFilter, selectorFns.pubdate])
        VFC.videoUploaderFilter.isEnable && blackPairs.push([VFC.videoUploaderFilter, selectorFns.uploader])
        VFC.videoUploaderKeywordFilter.isEnable &&
            blackPairs.push([VFC.videoUploaderKeywordFilter, selectorFns.uploader])

        const whitePairs: SubFilterPair[] = []
        VFC.videoUploaderWhiteFilter.isEnable && whitePairs.push([VFC.videoUploaderWhiteFilter, selectorFns.uploader])
        VFC.videoTitleWhiteFilter.isEnable && whitePairs.push([VFC.videoTitleWhiteFilter, selectorFns.title])

        // 检测
        const blackCnt = await coreCheck(videos, true, blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        log(`VFC hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }
}

export const viderFilterChannelEntry = async () => {
    const f = new VFC()
    f.observe()
}

export const videoFilterChannelGroups: Group[] = [
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
                    VFC.videoDurationFilter.enable()
                    VFC.check('full')
                },
                disableFn: () => {
                    VFC.videoDurationFilter.disable()
                    VFC.check('full')
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
                    VFC.videoDurationFilter.setParam(value)
                    VFC.check('full')
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
                    VFC.videoUploaderFilter.enable()
                    VFC.check('full')
                },
                disableFn: () => {
                    VFC.videoUploaderFilter.disable()
                    VFC.check('full')
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
                    VFC.videoUploaderKeywordFilter.enable()
                    VFC.check('full')
                },
                disableFn: () => {
                    VFC.videoUploaderKeywordFilter.disable()
                    VFC.check('full')
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
                    VFC.videoTitleFilter.enable()
                    VFC.check('full')
                },
                disableFn: () => {
                    VFC.videoTitleFilter.disable()
                    VFC.check('full')
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
                    VFC.videoBvidFilter.enable()
                    VFC.check('full')
                },
                disableFn: () => {
                    VFC.videoBvidFilter.disable()
                    VFC.check('full')
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
        name: '发布日期过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.pubdate.statusKey,
                name: '启用 发布日期过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFC.videoPubdateFilter.enable()
                    VFC.check('full')
                },
                disableFn: () => {
                    VFC.videoPubdateFilter.disable()
                    VFC.check('full')
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.pubdate.valueKey,
                name: '视频发布日 距今不超过',
                noStyle: true,
                minValue: 0,
                maxValue: 500,
                defaultValue: 60,
                disableValue: 0,
                addonText: '天',
                fn: (value: number) => {
                    VFC.videoPubdateFilter.setParam(value)
                    VFC.check('full')
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
                    VFC.videoUploaderWhiteFilter.enable()
                    VFC.check('full')
                },
                disableFn: () => {
                    VFC.videoUploaderWhiteFilter.disable()
                    VFC.check('full')
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
                    VFC.videoTitleWhiteFilter.enable()
                    VFC.check('full')
                },
                disableFn: () => {
                    VFC.videoTitleWhiteFilter.disable()
                    VFC.check('full')
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

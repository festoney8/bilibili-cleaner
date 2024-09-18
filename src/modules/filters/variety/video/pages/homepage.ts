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
import { VideoIsFollowWhiteFilter, VideoTitleWhiteFilter, VideoUploaderWhiteFilter } from '../subFilters/white'

const GM_KEYS = {
    black: {
        duration: {
            statusKey: 'homepage-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        uploader: {
            statusKey: 'homepage-uploader-filter-status',
            valueKey: 'global-uploader-filter-value',
        },
        uploaderKeyword: {
            statusKey: 'homepage-uploader-keyword-filter-status',
            valueKey: 'global-uploader-keyword-filter-value',
        },
        bvid: {
            statusKey: 'homepage-bvid-filter-status',
            valueKey: 'global-bvid-filter-value',
        },
        pubdate: {
            statusKey: 'homepage-pubdate-filter-status',
            valueKey: 'global-pubdate-filter-value',
        },
        title: {
            statusKey: 'homepage-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
    },
    white: {
        uploader: {
            statusKey: 'homepage-uploader-whitelist-filter-status',
            valueKey: 'global-uploader-whitelist-filter-value',
        },
        title: {
            statusKey: 'homepage-title-keyword-whitelist-filter-status',
            valueKey: 'global-title-keyword-whitelist-filter-value',
        },
        isFollow: {
            statusKey: 'homepage-following-whitelist-filter-status',
        },
    },
}

// 视频信息提取函数
const selectorFns = {
    duration: (video: HTMLElement): SelectorResult => {
        const duration = video.querySelector('.bili-video-card__stats__duration')?.textContent?.trim()
        return duration && convertTimeToSec(duration)
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
    isFollow: (video: HTMLElement): SelectorResult => {
        return video.querySelector('.bili-video-card__info--icon-text')?.textContent?.trim() === '已关注'
    },
}

// VFH is VideoFilterHomepage
class VFH extends MainFilter {
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
    static videoIsFollowWhiteFilter = new VideoIsFollowWhiteFilter()

    constructor() {
        super()
        // 黑名单
        VFH.videoBvidFilter.setParam(GM_getValue(GM_KEYS.black.bvid.valueKey, []))
        VFH.videoDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        VFH.videoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
        VFH.videoPubdateFilter.setParam(GM_getValue(GM_KEYS.black.pubdate.valueKey, 0))
        VFH.videoUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        VFH.videoUploaderKeywordFilter.setParam(GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []))
        // 白名单
        VFH.videoUploaderWhiteFilter.setParam(GM_getValue(GM_KEYS.white.uploader.valueKey, []))
        VFH.videoTitleWhiteFilter.setParam(GM_getValue(GM_KEYS.white.title.valueKey, []))
    }

    observe(): void {
        waitForEle(document, '.container', (node: HTMLElement): boolean => {
            return node.classList.contains('container')
        }).then((ele) => {
            if (!ele) {
                return
            }

            VFH.target = ele
            log('VFHome target appear')
            VFH.check('full')

            new MutationObserver(() => {
                VFH.check('incr')
            }).observe(VFH.target, { childList: true })
        })
    }

    static async check(mode?: 'full' | 'incr') {
        if (!VFH.target) {
            return
        }
        let revertAll = false
        if (
            !(
                VFH.videoBvidFilter.isEnable ||
                VFH.videoDurationFilter.isEnable ||
                VFH.videoTitleFilter.isEnable ||
                VFH.videoUploaderFilter.isEnable ||
                VFH.videoUploaderKeywordFilter.isEnable ||
                VFH.videoPubdateFilter.isEnable
            )
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 顶部推荐位 + rcmd视频流
        let selector = `:scope > :is(.feed-card, .bili-video-card.is-rcmd)`
        if (mode === 'incr') {
            selector += `:not([${settings.filterSign}])`
        }
        const videos = Array.from(VFH.target.querySelectorAll<HTMLElement>(selector))
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
        //             `homepage video`,
        //             `bvid: ${selectorFns.bvid(v)}`,
        //             `duration: ${selectorFns.duration(v)}`,
        //             `title: ${selectorFns.title(v)}`,
        //             `uploader: ${selectorFns.uploader(v)}`,
        //             `pubdate: ${selectorFns.pubdate(v)}`,
        //             `isFollow: ${selectorFns.isFollow(v)}`,
        //         ].join('\n'),
        //     )
        // })

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        this.videoBvidFilter.isEnable && blackPairs.push([this.videoBvidFilter, selectorFns.bvid])
        this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns.duration])
        this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns.title])
        this.videoPubdateFilter.isEnable && blackPairs.push([this.videoPubdateFilter, selectorFns.pubdate])
        this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns.uploader])
        this.videoUploaderKeywordFilter.isEnable &&
            blackPairs.push([this.videoUploaderKeywordFilter, selectorFns.uploader])

        const whitePairs: SubFilterPair[] = []
        this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns.uploader])
        this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns.title])
        this.videoIsFollowWhiteFilter.isEnable && whitePairs.push([this.videoIsFollowWhiteFilter, selectorFns.isFollow])

        // 检测
        const blackCnt = await coreCheck(videos, true, blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        log(`VFH hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }
}

export const videoFilterHomepageEntry = async () => {
    const vfh = new VFH()
    vfh.observe()
}

export const videoFilterHomepageGroups: Group[] = [
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
                    VFH.videoDurationFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoDurationFilter.disable()
                    VFH.check('full')
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
                    VFH.videoDurationFilter.setParam(value)
                    VFH.check('full')
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
                    VFH.videoUploaderFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoUploaderFilter.disable()
                    VFH.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 UP主黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                    // alert('VFHome 编辑 UP主黑名单')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.uploaderKeyword.statusKey,
                name: '启用 UP主昵称关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFH.videoUploaderKeywordFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoUploaderKeywordFilter.disable()
                    VFH.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 UP主昵称关键词黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                    // alert('VFHome 编辑 UP主昵称关键词黑名单')
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
                    VFH.videoTitleFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoTitleFilter.disable()
                    VFH.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 标题关键词黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                    // alert('VFHome 编辑 标题关键词黑名单')
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
                    VFH.videoBvidFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoBvidFilter.disable()
                    VFH.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 BV号黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                    // alert('VFHome 编辑 BV号黑名单')
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
                    VFH.videoPubdateFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoPubdateFilter.disable()
                    VFH.check('full')
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
                    VFH.videoPubdateFilter.setParam(value)
                    VFH.check('full')
                },
            },
        ],
    },
    {
        name: '白名单 免过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.white.isFollow.statusKey,
                name: '标有 [已关注] 的视频免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFH.videoIsFollowWhiteFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoIsFollowWhiteFilter.disable()
                    VFH.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.uploader.statusKey,
                name: '启用 UP主白名单',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFH.videoUploaderWhiteFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoUploaderWhiteFilter.disable()
                    VFH.check('full')
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
                    VFH.videoTitleWhiteFilter.enable()
                    VFH.check('full')
                },
                disableFn: () => {
                    VFH.videoTitleWhiteFilter.disable()
                    VFH.check('full')
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

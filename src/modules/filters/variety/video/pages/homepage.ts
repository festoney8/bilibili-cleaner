import { GM_getValue } from '$'
import { Group } from '../../../../../types/collection'
import { SelectorResult } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { convertDateToDays, convertTimeToSec, matchBvid, waitForEle } from '../../../../../utils/tool'
import { MainFilter } from '../../../core/core'
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

// VFHome is VideoFilterHomepage
class VFHome extends MainFilter {
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
        VFHome.videoBvidFilter.setParam(GM_getValue(GM_KEYS.black.bvid.valueKey, []))
        VFHome.videoDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        VFHome.videoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
        VFHome.videoPubdateFilter.setParam(GM_getValue(GM_KEYS.black.pubdate.valueKey, 0))
        VFHome.videoUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        VFHome.videoUploaderKeywordFilter.setParam(GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []))
        // 白名单
        VFHome.videoUploaderWhiteFilter.setParam(GM_getValue(GM_KEYS.white.uploader.valueKey, []))
        VFHome.videoTitleWhiteFilter.setParam(GM_getValue(GM_KEYS.white.title.valueKey, []))
    }

    observe(): void {
        waitForEle(document, '.container', (node: HTMLElement): boolean => {
            return node.classList.contains('container')
        }).then((ele) => {
            if (!ele) {
                return
            }

            VFHome.target = ele
            log('VFHome target appear')
            VFHome.check('full')

            new MutationObserver(() => {
                VFHome.check('incr')
            }).observe(VFHome.target, { childList: true })
        })
    }

    static check(mode?: 'full' | 'incr'): void {
        if (!VFHome.target) {
            return
        }
        if (
            !(
                VFHome.videoBvidFilter.isEnable ||
                VFHome.videoDurationFilter.isEnable ||
                VFHome.videoTitleFilter.isEnable ||
                VFHome.videoUploaderFilter.isEnable ||
                VFHome.videoUploaderKeywordFilter.isEnable
            )
        ) {
            return
        }
        log('VFHome check start')
        log(mode)
    }
}

export const viderFilterHomepageEntry = async () => {
    const f = new VFHome()
    f.observe()
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
                    VFHome.videoDurationFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoDurationFilter.disable()
                    VFHome.check('full')
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.duration.valueKey,
                name: '设定最低时长 (0~300s)',
                noStyle: true,
                minValue: 0,
                maxValue: 300,
                defaultValue: 60,
                disableValue: 0,
                addonText: '秒',
                fn: (value: number) => {
                    // Todo
                    VFHome.check('full')
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
                    VFHome.videoUploaderFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoUploaderFilter.disable()
                    VFHome.check('full')
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
                    VFHome.videoUploaderKeywordFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoUploaderKeywordFilter.disable()
                    VFHome.check('full')
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
                    VFHome.videoTitleFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoTitleFilter.disable()
                    VFHome.check('full')
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
                    VFHome.videoBvidFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoBvidFilter.disable()
                    VFHome.check('full')
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
                    VFHome.videoPubdateFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoPubdateFilter.disable()
                    VFHome.check('full')
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.pubdate.valueKey,
                name: '视频发布日 距今不超过',
                noStyle: true,
                minValue: 0,
                maxValue: 0,
                defaultValue: 0,
                disableValue: 0,
                addonText: '天',
                fn: (value: number) => {
                    // Todo
                    VFHome.check('full')
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
                    VFHome.videoIsFollowWhiteFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoIsFollowWhiteFilter.disable()
                    VFHome.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.uploader.statusKey,
                name: '启用 UP主白名单',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFHome.videoUploaderWhiteFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoUploaderWhiteFilter.disable()
                    VFHome.check('full')
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
                    VFHome.videoTitleWhiteFilter.enable()
                    VFHome.check('full')
                },
                disableFn: () => {
                    VFHome.videoTitleWhiteFilter.disable()
                    VFHome.check('full')
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

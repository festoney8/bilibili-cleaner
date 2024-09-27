import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { IMainFilter, SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { convertDateToDays, convertTimeToSec, matchBvid, showEle, waitForEle } from '../../../../../utils/tool'
import { coreCheck } from '../../../core/core'
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

class VideoFilterChannel implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    videoBvidFilter = new VideoBvidFilter()
    videoDurationFilter = new VideoDurationFilter()
    videoTitleFilter = new VideoTitleFilter()
    videoPubdateFilter = new VideoPubdateFilter()
    videoUploaderFilter = new VideoUploaderFilter()
    videoUploaderKeywordFilter = new VideoUploaderKeywordFilter()

    // 白名单
    videoUploaderWhiteFilter = new VideoUploaderWhiteFilter()
    videoTitleWhiteFilter = new VideoTitleWhiteFilter()

    init() {
        // 黑名单
        this.videoBvidFilter.setParam(GM_getValue(GM_KEYS.black.bvid.valueKey, []))
        this.videoDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        this.videoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
        this.videoPubdateFilter.setParam(GM_getValue(GM_KEYS.black.pubdate.valueKey, 0))
        this.videoUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        this.videoUploaderKeywordFilter.setParam(GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []))
        // 白名单
        this.videoUploaderWhiteFilter.setParam(GM_getValue(GM_KEYS.white.uploader.valueKey, []))
        this.videoTitleWhiteFilter.setParam(GM_getValue(GM_KEYS.white.title.valueKey, []))
    }

    observe() {
        waitForEle(document, 'main', (node: HTMLElement): boolean => {
            return node.tagName === 'MAIN'
        }).then((ele) => {
            if (!ele) {
                return
            }

            this.target = ele
            log('VideoFilterChannel target appear')
            this.check('full').then().catch()

            new MutationObserver(() => {
                this.check('incr').then().catch()
            }).observe(this.target, { childList: true, subtree: true })
        })
    }

    async check(mode?: 'full' | 'incr') {
        if (!this.target) {
            return
        }
        let revertAll = false
        if (
            !(
                this.videoBvidFilter.isEnable ||
                this.videoDurationFilter.isEnable ||
                this.videoTitleFilter.isEnable ||
                this.videoUploaderFilter.isEnable ||
                this.videoUploaderKeywordFilter.isEnable ||
                this.videoPubdateFilter.isEnable
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
        const videos = Array.from(this.target.querySelectorAll<HTMLElement>(selector))
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

        // 检测
        const blackCnt = await coreCheck(videos, true, blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        log(`VideoFilterChannel hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }
}

//==================================================================================================

const mainFilter = new VideoFilterChannel()

export const videoFilterChannelEntry = async () => {
    mainFilter.init()
    mainFilter.observe()
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
                    mainFilter.videoDurationFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.videoDurationFilter.disable()
                    mainFilter.check('full').then().catch()
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
                    mainFilter.videoDurationFilter.setParam(value)
                    mainFilter.check('full').then().catch()
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
                    mainFilter.videoUploaderFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.videoUploaderFilter.disable()
                    mainFilter.check('full').then().catch()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.uploader.valueKey,
                name: '编辑 UP主黑名单',
                description: ['右键屏蔽的UP主会出现在这里'],
                editorTitle: 'UP主 黑名单',
                editorDescription: ['每行一个UP主昵称，保存时自动去重'],
            },
            {
                type: 'switch',
                id: GM_KEYS.black.uploaderKeyword.statusKey,
                name: '启用 UP主昵称关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    mainFilter.videoUploaderKeywordFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.videoUploaderKeywordFilter.disable()
                    mainFilter.check('full').then().catch()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.uploaderKeyword.valueKey,
                name: '编辑 UP主昵称关键词黑名单',
                editorTitle: 'UP主昵称关键词 黑名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认iu模式，无需flag，语法：/abc|\\d+/',
                ],
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
                    mainFilter.videoTitleFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.videoTitleFilter.disable()
                    mainFilter.check('full').then().catch()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.title.valueKey,
                name: '编辑 标题关键词黑名单',
                editorTitle: '标题关键词 黑名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认iu模式，无需flag，语法：/abc|\\d+/',
                ],
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
                    mainFilter.videoBvidFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.videoBvidFilter.disable()
                    mainFilter.check('full').then().catch()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.bvid.valueKey,
                name: '编辑 BV号黑名单',
                description: ['右键屏蔽的BV号会出现在这里'],
                editorTitle: 'BV号 黑名单',
                editorDescription: ['每行一个BV号，保存时自动去重'],
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
                    mainFilter.videoPubdateFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.videoPubdateFilter.disable()
                    mainFilter.check('full').then().catch()
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
                    mainFilter.videoPubdateFilter.setParam(value)
                    mainFilter.check('full').then().catch()
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
                    mainFilter.videoUploaderWhiteFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.videoUploaderWhiteFilter.disable()
                    mainFilter.check('full').then().catch()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.white.uploader.valueKey,
                name: '编辑 UP主白名单',
                editorTitle: 'UP主 白名单',
                editorDescription: ['每行一个UP主昵称，保存时自动去重'],
            },
            {
                type: 'switch',
                id: GM_KEYS.white.title.statusKey,
                name: '启用 标题关键词白名单',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    mainFilter.videoTitleWhiteFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.videoTitleWhiteFilter.disable()
                    mainFilter.check('full').then().catch()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.white.title.valueKey,
                name: '编辑 标题关键词白名单',
                editorTitle: '标题关键词 白名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认iu模式，无需flag，语法：/abc|\\d+/',
                ],
            },
        ],
    },
]

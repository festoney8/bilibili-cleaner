import { GM_getValue, unsafeWindow } from '$'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { convertTimeToSec, isEleHide, matchBvid, showEle, waitForEle } from '../../../../../utils/tool'
import { MainFilter, coreCheck } from '../../../core/core'
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
            statusKey: 'video-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        uploader: {
            statusKey: 'video-uploader-filter-status',
            valueKey: 'global-uploader-filter-value',
        },
        uploaderKeyword: {
            statusKey: 'video-uploader-keyword-filter-status',
            valueKey: 'global-uploader-keyword-filter-value',
        },
        bvid: {
            statusKey: 'video-bvid-filter-status',
            valueKey: 'global-bvid-filter-value',
        },
        title: {
            statusKey: 'video-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
        related: {
            statusKey: 'video-related-filter-status',
        },
    },
    white: {
        uploader: {
            statusKey: 'video-uploader-whitelist-filter-status',
            valueKey: 'global-uploader-whitelist-filter-value',
        },
        title: {
            statusKey: 'video-title-keyword-whitelist-filter-status',
            valueKey: 'global-title-keyword-whitelist-filter-value',
        },
    },
}

// 视频列表信息提取
const selectorFns = {
    duration: (video: HTMLElement): SelectorResult => {
        const duration = video.querySelector('.pic-box span.duration')?.textContent
        return duration ? convertTimeToSec(duration) : undefined
    },
    title: (video: HTMLElement): SelectorResult => {
        return video.querySelector('.info > a p')?.textContent?.trim()
    },
    bvid: (video: HTMLElement): SelectorResult => {
        const href =
            video.querySelector('.info > a')?.getAttribute('href') ||
            video.querySelector('.pic-box .framepreview-box > a')?.getAttribute('href')
        return (href && matchBvid(href)) ?? undefined
    },
    uploader: (video: HTMLElement): SelectorResult => {
        return video.querySelector('.info > .upname .name')?.textContent?.trim()
    },
}

// 是否检测相关视频缓存数据
let enableRelatedCheck = false

// VFV is VideoFilterVideo
class VFV extends MainFilter {
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
        VFV.videoBvidFilter.setParam(GM_getValue(GM_KEYS.black.bvid.valueKey, []))
        VFV.videoDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        VFV.videoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
        VFV.videoUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        VFV.videoUploaderKeywordFilter.setParam(GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []))
        // 白名单
        VFV.videoUploaderWhiteFilter.setParam(GM_getValue(GM_KEYS.white.uploader.valueKey, []))
        VFV.videoTitleWhiteFilter.setParam(GM_getValue(GM_KEYS.white.title.valueKey, []))
    }

    observe(): void {
        waitForEle(document, '#reco_list, .recommend-list-container', (node: HTMLElement): boolean => {
            return node.id === 'reco_list' || node.className === 'recommend-list-container'
        }).then((ele) => {
            if (!ele) {
                return
            }

            VFV.target = ele
            log('VFV target appear')
            VFV.check('full').then().catch()

            new MutationObserver(() => {
                VFV.check('full').then().catch() // 播放页始终全量check
            }).observe(VFV.target, { childList: true, subtree: true })
        })
    }

    static async check(mode?: 'full' | 'incr') {
        if (!VFV.target) {
            return
        }
        let revertAll = false
        if (
            !(
                VFV.videoBvidFilter.isEnable ||
                VFV.videoDurationFilter.isEnable ||
                VFV.videoTitleFilter.isEnable ||
                VFV.videoUploaderFilter.isEnable ||
                VFV.videoUploaderKeywordFilter.isEnable
            )
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 提取元素
        const selector = `.next-play :is(.video-page-card-small, .video-page-operator-card-small),
            .rec-list :is(.video-page-card-small, .video-page-operator-card-small), .recommend-video-card`
        const videos = Array.from(VFV.target.querySelectorAll<HTMLElement>(selector))
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
        //             `video page video`,
        //             `bvid: ${selectorFns.bvid(v)}`,
        //             `duration: ${selectorFns.duration(v)}`,
        //             `title: ${selectorFns.title(v)}`,
        //             `uploader: ${selectorFns.uploader(v)}`,
        //         ].join('\n'),
        //     )
        // })

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        VFV.videoBvidFilter.isEnable && blackPairs.push([VFV.videoBvidFilter, selectorFns.bvid])
        VFV.videoDurationFilter.isEnable && blackPairs.push([VFV.videoDurationFilter, selectorFns.duration])
        VFV.videoTitleFilter.isEnable && blackPairs.push([VFV.videoTitleFilter, selectorFns.title])
        VFV.videoUploaderFilter.isEnable && blackPairs.push([VFV.videoUploaderFilter, selectorFns.uploader])
        VFV.videoUploaderKeywordFilter.isEnable &&
            blackPairs.push([VFV.videoUploaderKeywordFilter, selectorFns.uploader])

        const whitePairs: SubFilterPair[] = []
        VFV.videoUploaderWhiteFilter.isEnable && whitePairs.push([VFV.videoUploaderWhiteFilter, selectorFns.uploader])
        VFV.videoTitleWhiteFilter.isEnable && whitePairs.push([VFV.videoTitleWhiteFilter, selectorFns.title])

        // 检测
        const blackCnt = await coreCheck(videos, false, blackPairs, whitePairs)

        // 缓存数据检测，更新__INITIAL_STATE__.related
        // __INITIAL_STATE__.related 与右侧视频列表绑定
        if (enableRelatedCheck && blackCnt) {
            const blackBvids = new Set<string>()
            for (const video of videos) {
                if (isEleHide(video)) {
                    const url = video.querySelector('.info > a')?.getAttribute('href')
                    if (url) {
                        const bvid = matchBvid(url)
                        bvid && blackBvids.add(bvid)
                    }
                }
            }
            const rel = unsafeWindow.__INITIAL_STATE__?.related
            if (rel?.length && blackBvids.size) {
                unsafeWindow.__INITIAL_STATE__!.related = rel.filter((v) => !(v.bvid && blackBvids.has(v.bvid)))
            }
        }
        const time = (performance.now() - timer).toFixed(1)
        log(`VFV hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }
}

export const videoFilterVideoEntry = async () => {
    const vfv = new VFV()
    vfv.observe()
}

export const videoFilterVideoGroups: Group[] = [
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
                    VFV.videoDurationFilter.enable()
                    VFV.check('full').then().catch()
                },
                disableFn: () => {
                    VFV.videoDurationFilter.disable()
                    VFV.check('full').then().catch()
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
                    VFV.videoDurationFilter.setParam(value)
                    VFV.check('full').then().catch()
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
                    VFV.videoUploaderFilter.enable()
                    VFV.check('full').then().catch()
                },
                disableFn: () => {
                    VFV.videoUploaderFilter.disable()
                    VFV.check('full').then().catch()
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
                    VFV.videoUploaderKeywordFilter.enable()
                    VFV.check('full').then().catch()
                },
                disableFn: () => {
                    VFV.videoUploaderKeywordFilter.disable()
                    VFV.check('full').then().catch()
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
                    VFV.videoTitleFilter.enable()
                    VFV.check('full').then().catch()
                },
                disableFn: () => {
                    VFV.videoTitleFilter.disable()
                    VFV.check('full').then().catch()
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
                    VFV.videoBvidFilter.enable()
                    VFV.check('full').then().catch()
                },
                disableFn: () => {
                    VFV.videoBvidFilter.disable()
                    VFV.check('full').then().catch()
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
        name: '其他过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.related.statusKey,
                name: '启用 相关视频数据过滤 (实验功能)',
                description: [
                    '过滤当前视频的"相关视频"缓存数据',
                    '自动替换接下来播放、播放结束相关视频',
                    '启用后，变动其他过滤功能需刷新页面',
                ],
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    enableRelatedCheck = true
                    VFV.check('full').then().catch()
                },
                disableFn: () => {
                    enableRelatedCheck = false
                    VFV.check('full').then().catch()
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
                    VFV.videoUploaderWhiteFilter.enable()
                    VFV.check('full').then().catch()
                },
                disableFn: () => {
                    VFV.videoUploaderWhiteFilter.disable()
                    VFV.check('full').then().catch()
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
                    VFV.videoTitleWhiteFilter.enable()
                    VFV.check('full').then().catch()
                },
                disableFn: () => {
                    VFV.videoTitleWhiteFilter.disable()
                    VFV.check('full').then().catch()
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

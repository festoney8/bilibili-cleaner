import { GM_getValue } from '$'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { calcQuality, showEle, waitForEle } from '../../../../../utils/tool'
import { MainFilter, coreCheck } from '../../../core/core'
import {
    VideoBvidFilter,
    VideoDimensionFilter,
    VideoDurationFilter,
    VideoPubdateFilter,
    VideoQualityFilter,
    VideoTitleFilter,
    VideoUploaderFilter,
    VideoUploaderKeywordFilter,
} from '../subFilters/black'
import { VideoTitleWhiteFilter, VideoUploaderWhiteFilter } from '../subFilters/white'

const GM_KEYS = {
    black: {
        duration: {
            statusKey: 'popular-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        uploader: {
            statusKey: 'popular-uploader-filter-status',
            valueKey: 'global-uploader-filter-value',
        },
        uploaderKeyword: {
            statusKey: 'popular-uploader-keyword-filter-status',
            valueKey: 'global-uploader-keyword-filter-value',
        },
        bvid: {
            statusKey: 'popular-bvid-filter-status',
            valueKey: 'global-bvid-filter-value',
        },
        title: {
            statusKey: 'popular-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
        quality: {
            statusKey: 'popular-quality-filter-status',
            valueKey: 'global-quality-filter-value',
        },
        dimension: {
            statusKey: 'popular-dimension-filter-status',
        },
    },
    white: {
        uploader: {
            statusKey: 'popular-uploader-whitelist-filter-status',
            valueKey: 'global-uploader-whitelist-filter-value',
        },
        title: {
            statusKey: 'popular-title-keyword-whitelist-filter-status',
            valueKey: 'global-title-keyword-whitelist-filter-value',
        },
    },
}

// 视频列表信息提取
const getVideoData = (video: HTMLElement): any => {
    let videoData
    if (!video.classList.contains('rank-item')) {
        // 热门视频、每周必看
        return (video as any).__vue__?.videoData
    }
    // 排行榜页
    const rank = video.getAttribute('data-rank')
    if (rank && parseInt(rank) > 0) {
        videoData = (video.closest('.rank-list-wrap') as any)?.__vue__?.list?.[parseInt(rank) - 1]
    }
    return videoData
}
const selectorFns = {
    title: (video: HTMLElement): SelectorResult => {
        return getVideoData(video)?.title
    },
    bvid: (video: HTMLElement): SelectorResult => {
        return getVideoData(video)?.bvid
    },
    uploader: (video: HTMLElement): SelectorResult => {
        return getVideoData(video)?.owner?.name
    },
    duration: (video: HTMLElement): SelectorResult => {
        return getVideoData(video)?.duration
    },
    quality: (video: HTMLElement): SelectorResult => {
        const stat = getVideoData(video)?.stat
        if (stat) {
            return calcQuality(stat.coin / stat.like)
        }
        return undefined
    },
    // true竖屏, false横屏
    dimension: (video: HTMLElement): SelectorResult => {
        const dimension = getVideoData(video)?.dimension
        if (dimension) {
            return dimension?.height > dimension?.width
        }
        return undefined
    },
}

// VFP is VideoFilterPopular
class VFP extends MainFilter {
    // 黑名单
    static videoBvidFilter = new VideoBvidFilter()
    static videoDurationFilter = new VideoDurationFilter()
    static videoTitleFilter = new VideoTitleFilter()
    static videoPubdateFilter = new VideoPubdateFilter()
    static videoUploaderFilter = new VideoUploaderFilter()
    static videoUploaderKeywordFilter = new VideoUploaderKeywordFilter()
    static videoQualityFilter = new VideoQualityFilter()
    static videoDimensionFilter = new VideoDimensionFilter()
    // 白名单
    static videoUploaderWhiteFilter = new VideoUploaderWhiteFilter()
    static videoTitleWhiteFilter = new VideoTitleWhiteFilter()

    constructor() {
        super()
        // 黑名单
        VFP.videoBvidFilter.setParam(GM_getValue(GM_KEYS.black.bvid.valueKey, []))
        VFP.videoDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        VFP.videoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
        VFP.videoUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        VFP.videoUploaderKeywordFilter.setParam(GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []))
        VFP.videoQualityFilter.setParam(GM_getValue(GM_KEYS.black.quality.valueKey, 0))
        // 白名单
        VFP.videoUploaderWhiteFilter.setParam(GM_getValue(GM_KEYS.white.uploader.valueKey, []))
        VFP.videoTitleWhiteFilter.setParam(GM_getValue(GM_KEYS.white.title.valueKey, []))
    }

    observe(): void {
        waitForEle(document, '#app', (node: HTMLElement): boolean => {
            return node.id === 'app'
        }).then((ele) => {
            if (!ele) {
                return
            }

            VFP.target = ele
            log('VFP target appear')
            VFP.check('full')

            new MutationObserver(() => {
                VFP.check('full') // 始终全量
            }).observe(VFP.target, { childList: true, subtree: true })
        })
    }

    static async check(mode?: 'full' | 'incr') {
        if (!VFP.target) {
            return
        }
        let revertAll = false
        if (
            !(
                VFP.videoBvidFilter.isEnable ||
                VFP.videoDurationFilter.isEnable ||
                VFP.videoTitleFilter.isEnable ||
                VFP.videoUploaderFilter.isEnable ||
                VFP.videoUploaderKeywordFilter.isEnable ||
                VFP.videoDimensionFilter.isEnable ||
                VFP.videoQualityFilter.isEnable
            )
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 提取元素
        const selector = `.card-list .video-card, .video-list .video-card, .rank-list .rank-item`
        const videos = Array.from(VFP.target.querySelectorAll<HTMLElement>(selector))
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
        //             `popular video`,
        //             `bvid: ${selectorFns.bvid(v)}`,
        //             `duration: ${selectorFns.duration(v)}`,
        //             `title: ${selectorFns.title(v)}`,
        //             `uploader: ${selectorFns.uploader(v)}`,
        //             `quality: ${selectorFns.quality(v)}`,
        //         ].join('\n'),
        //     )
        // })

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        VFP.videoBvidFilter.isEnable && blackPairs.push([VFP.videoBvidFilter, selectorFns.bvid])
        VFP.videoDurationFilter.isEnable && blackPairs.push([VFP.videoDurationFilter, selectorFns.duration])
        VFP.videoTitleFilter.isEnable && blackPairs.push([VFP.videoTitleFilter, selectorFns.title])
        VFP.videoUploaderFilter.isEnable && blackPairs.push([VFP.videoUploaderFilter, selectorFns.uploader])
        VFP.videoUploaderKeywordFilter.isEnable &&
            blackPairs.push([VFP.videoUploaderKeywordFilter, selectorFns.uploader])
        VFP.videoDimensionFilter.isEnable && blackPairs.push([VFP.videoDimensionFilter, selectorFns.dimension])
        VFP.videoQualityFilter.isEnable && blackPairs.push([VFP.videoQualityFilter, selectorFns.quality])

        const whitePairs: SubFilterPair[] = []
        VFP.videoUploaderWhiteFilter.isEnable && whitePairs.push([VFP.videoUploaderWhiteFilter, selectorFns.uploader])
        VFP.videoTitleWhiteFilter.isEnable && whitePairs.push([VFP.videoTitleWhiteFilter, selectorFns.title])

        // 检测
        const blackCnt = await coreCheck(videos, true, blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        log(`VFP hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }
}

export const videoFilterPopularEntry = async () => {
    const vfp = new VFP()
    vfp.observe()
}

export const videoFilterPopularGroups: Group[] = [
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
                    VFP.videoDurationFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoDurationFilter.disable()
                    VFP.check('full')
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
                    VFP.videoDurationFilter.setParam(value)
                    VFP.check('full')
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
                    VFP.videoUploaderFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoUploaderFilter.disable()
                    VFP.check('full')
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
                    VFP.videoUploaderKeywordFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoUploaderKeywordFilter.disable()
                    VFP.check('full')
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
        name: '视频质量过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.dimension.statusKey,
                name: '启用 竖屏视频过滤',
                defaultEnable: true,
                noStyle: true,
                enableFn: () => {
                    VFP.videoDimensionFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoDimensionFilter.disable()
                    VFP.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.quality.statusKey,
                name: '启用 劣质视频过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    VFP.videoQualityFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoQualityFilter.disable()
                    VFP.check('full')
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.quality.valueKey,
                name: '劣质视频过滤百分比 (0~80%)',
                noStyle: true,
                minValue: 0,
                maxValue: 80,
                defaultValue: 25,
                disableValue: 0,
                addonText: '%',
                fn: (value: number) => {
                    VFP.videoQualityFilter.setParam(value)
                    VFP.check('full')
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
                    VFP.videoTitleFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoTitleFilter.disable()
                    VFP.check('full')
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
                    VFP.videoBvidFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoBvidFilter.disable()
                    VFP.check('full')
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
                    VFP.videoUploaderWhiteFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoUploaderWhiteFilter.disable()
                    VFP.check('full')
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
                    VFP.videoTitleWhiteFilter.enable()
                    VFP.check('full')
                },
                disableFn: () => {
                    VFP.videoTitleWhiteFilter.disable()
                    VFP.check('full')
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

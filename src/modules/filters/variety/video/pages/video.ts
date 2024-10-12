import { unsafeWindow } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import {
    ContextMenuTargetHandler,
    FilterContextMenu,
    IMainFilter,
    SelectorResult,
    SubFilterPair,
} from '../../../../../types/filter'
import { debugFilter as debug, error } from '../../../../../utils/logger'
import { isPageBangumi, isPagePlaylist, isPageVideo } from '../../../../../utils/pageType'
import { BiliCleanerStorage } from '../../../../../utils/storage'
import { convertTimeToSec, isEleHide, matchBvid, orderedUniq, showEle, waitForEle } from '../../../../../utils/tool'
import { coreCheck } from '../../../core/core'
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

class VideoFilterVideo implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    videoBvidFilter = new VideoBvidFilter()
    videoDurationFilter = new VideoDurationFilter()
    videoTitleFilter = new VideoTitleFilter()
    videoUploaderFilter = new VideoUploaderFilter()
    videoUploaderKeywordFilter = new VideoUploaderKeywordFilter()

    // 白名单
    videoUploaderWhiteFilter = new VideoUploaderWhiteFilter()
    videoTitleWhiteFilter = new VideoTitleWhiteFilter()

    init() {
        // 黑名单
        this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.bvid.valueKey, []))
        this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.duration.valueKey, 0))
        this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []))
        this.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []))
        this.videoUploaderKeywordFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploaderKeyword.valueKey, []))
        // 白名单
        this.videoUploaderWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.uploader.valueKey, []))
        this.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.title.valueKey, []))
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
                this.videoUploaderKeywordFilter.isEnable
            )
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 提取元素
        const selector = `.next-play :is(.video-page-card-small, .video-page-operator-card-small),
            .rec-list :is(.video-page-card-small, .video-page-operator-card-small), .recommend-video-card`
        const videos = Array.from(this.target.querySelectorAll<HTMLElement>(selector))
        if (!videos.length) {
            return
        }
        if (revertAll) {
            videos.forEach((v) => showEle(v))
            return
        }

        if (settings.enableDebugFilter) {
            videos.forEach((v) => {
                debug(
                    [
                        `VideoFilterVideo`,
                        `bvid: ${selectorFns.bvid(v)}`,
                        `duration: ${selectorFns.duration(v)}`,
                        `title: ${selectorFns.title(v)}`,
                        `uploader: ${selectorFns.uploader(v)}`,
                    ].join('\n'),
                )
            })
        }

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        this.videoBvidFilter.isEnable && blackPairs.push([this.videoBvidFilter, selectorFns.bvid])
        this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns.duration])
        this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns.title])
        this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns.uploader])
        this.videoUploaderKeywordFilter.isEnable &&
            blackPairs.push([this.videoUploaderKeywordFilter, selectorFns.uploader])

        const whitePairs: SubFilterPair[] = []
        this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns.uploader])
        this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns.title])

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
        debug(`VideoFilterVideo hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }

    checkFull() {
        this.check('full')
            .then()
            .catch((err) => {
                error('VideoFilterVideo check full error', err)
            })
    }

    // checkIncr() {
    //     this.check('incr')
    //         .then()
    //         .catch((err) => {
    //             error('VideoFilterVideo check incr error', err)
    //         })
    // }

    observe() {
        waitForEle(
            document,
            '#reco_list, .recommend-list-v1, .recommend-list-container',
            (node: HTMLElement): boolean => {
                return (
                    node.id === 'reco_list' ||
                    ['recommend-list-v1', 'recommend-list-container'].includes(node.className)
                )
            },
        ).then((ele) => {
            if (!ele) {
                return
            }

            debug('VideoFilterVideo target appear')
            this.target = ele
            this.checkFull()

            new MutationObserver(() => {
                this.checkFull() // 播放页始终全量check
            }).observe(this.target, { childList: true, subtree: true })
        })
    }
}

//==================================================================================================

const mainFilter = new VideoFilterVideo()

export const videoFilterVideoEntry = async () => {
    mainFilter.init()
    mainFilter.observe()
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
                    mainFilter.videoDurationFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoDurationFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.duration.valueKey,
                name: '设定最低时长（0~300s）',
                noStyle: true,
                minValue: 0,
                maxValue: 300,
                step: 1,
                defaultValue: 60,
                disableValue: 0,
                addonText: '秒',
                fn: (value: number) => {
                    mainFilter.videoDurationFilter.setParam(value)
                    mainFilter.checkFull()
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
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoUploaderFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.uploader.valueKey,
                name: '编辑 UP主黑名单',
                description: ['右键屏蔽的UP主会出现在首行'],
                editorTitle: 'UP主 黑名单',
                editorDescription: ['每行一个UP主昵称，保存时自动去重'],
                saveFn: async () => {
                    mainFilter.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []))
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.uploaderKeyword.statusKey,
                name: '启用 UP主昵称关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    mainFilter.videoUploaderKeywordFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoUploaderKeywordFilter.disable()
                    mainFilter.checkFull()
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
                saveFn: async () => {
                    mainFilter.videoUploaderKeywordFilter.setParam(
                        BiliCleanerStorage.get(GM_KEYS.black.uploaderKeyword.valueKey, []),
                    )
                    mainFilter.checkFull()
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
                    mainFilter.videoTitleFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoTitleFilter.disable()
                    mainFilter.checkFull()
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
                saveFn: async () => {
                    mainFilter.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []))
                    mainFilter.checkFull()
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
                    mainFilter.videoBvidFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoBvidFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.bvid.valueKey,
                name: '编辑 BV号黑名单',
                description: ['右键屏蔽的BV号会出现在首行'],
                editorTitle: 'BV号 黑名单',
                editorDescription: ['每行一个BV号，保存时自动去重'],
                saveFn: async () => {
                    mainFilter.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.bvid.valueKey, []))
                    mainFilter.checkFull()
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
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    enableRelatedCheck = false
                    mainFilter.checkFull()
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
                defaultEnable: true,
                noStyle: true,
                enableFn: () => {
                    mainFilter.videoUploaderWhiteFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoUploaderWhiteFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.white.uploader.valueKey,
                name: '编辑 UP主白名单',
                editorTitle: 'UP主 白名单',
                editorDescription: ['每行一个UP主昵称，保存时自动去重'],
                saveFn: async () => {
                    mainFilter.videoUploaderWhiteFilter.setParam(
                        BiliCleanerStorage.get(GM_KEYS.white.uploader.valueKey, []),
                    )
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.title.statusKey,
                name: '启用 标题关键词白名单',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    mainFilter.videoTitleWhiteFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoTitleWhiteFilter.disable()
                    mainFilter.checkFull()
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
                saveFn: async () => {
                    mainFilter.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.title.valueKey, []))
                    mainFilter.checkFull()
                },
            },
        ],
    },
]

// 右键菜单handler
export const videoFilterVideoHandler: ContextMenuTargetHandler = (target: HTMLElement): FilterContextMenu[] => {
    if (!(isPageVideo() || isPagePlaylist() || isPageBangumi())) {
        return []
    }

    const menus: FilterContextMenu[] = []
    // UP主
    if (
        target.classList.contains('name') ||
        target.classList.contains('up-name') ||
        target.parentElement?.classList.contains('up-name') ||
        target.closest('.staff-info')
    ) {
        const uploader =
            target.closest('.staff-info')?.querySelector('.staff-name')?.textContent?.trim() ||
            target.textContent?.trim() ||
            target.parentElement?.textContent?.trim()
        const url = target.closest('.upname')?.querySelector(':scope a')?.getAttribute('href')
        const spaceUrl = url?.match(/space\.bilibili\.com\/\d+/)?.[0]

        if (uploader) {
            if (mainFilter.videoUploaderFilter.isEnable) {
                menus.push({
                    name: `屏蔽UP主：${uploader}`,
                    fn: async () => {
                        try {
                            mainFilter.videoUploaderFilter.addParam(uploader)
                            mainFilter.checkFull()
                            const arr: string[] = BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, [])
                            arr.unshift(uploader)
                            BiliCleanerStorage.set<string[]>(GM_KEYS.black.uploader.valueKey, orderedUniq(arr))
                        } catch (err) {
                            error(`videoFilterVideoHandler add uploader ${uploader} failed`, err)
                        }
                    },
                })
            }
            if (mainFilter.videoUploaderWhiteFilter.isEnable) {
                menus.push({
                    name: `将UP主加入白名单`,
                    fn: async () => {
                        try {
                            mainFilter.videoUploaderWhiteFilter.addParam(uploader)
                            mainFilter.checkFull()
                            const arr: string[] = BiliCleanerStorage.get(GM_KEYS.white.uploader.valueKey, [])
                            arr.unshift(uploader)
                            BiliCleanerStorage.set<string[]>(GM_KEYS.white.uploader.valueKey, orderedUniq(arr))
                        } catch (err) {
                            error(`videoFilterVideoHandler add white uploader ${uploader} failed`, err)
                        }
                    },
                })
            }
        }
        if (spaceUrl && (mainFilter.videoUploaderFilter.isEnable || mainFilter.videoUploaderWhiteFilter.isEnable)) {
            menus.push({
                name: `复制主页链接`,
                fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`),
            })
        }
    }
    // BVID
    if (target.classList.contains('title')) {
        const url = target.parentElement?.getAttribute('href')
        if (url && mainFilter.videoBvidFilter.isEnable) {
            const bvid = matchBvid(url)
            if (bvid) {
                menus.push({
                    name: `屏蔽视频 ${bvid}`,
                    fn: async () => {
                        try {
                            mainFilter.videoBvidFilter.addParam(bvid)
                            mainFilter.checkFull()
                            const arr: string[] = BiliCleanerStorage.get(GM_KEYS.black.bvid.valueKey, [])
                            arr.unshift(bvid)
                            BiliCleanerStorage.set<string[]>(GM_KEYS.black.bvid.valueKey, orderedUniq(arr))
                        } catch (err) {
                            error(`videoFilterVideoHandler add bvid ${bvid} failed`, err)
                        }
                    },
                })
                menus.push({
                    name: '复制视频链接',
                    fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch(),
                })
            }
        }
    }
    return menus
}

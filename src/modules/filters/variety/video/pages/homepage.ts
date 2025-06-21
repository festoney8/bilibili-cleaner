import { coreCheck } from '@/modules/filters/core/core'
import settings from '@/settings'
import { Group } from '@/types/collection'
import { ContextMenuTargetHandler, FilterContextMenu, IMainFilter, SelectorResult, SubFilterPair } from '@/types/filter'
import { debugFilter as debug, error } from '@/utils/logger'
import { isPageHomepage } from '@/utils/pageType'
import { BiliCleanerStorage } from '@/utils/storage'
import { convertDateToDays, convertTimeToSec, matchBvid, orderedUniq, showEle, waitForEle } from '@/utils/tool'
import {
    VideoBvidFilter,
    VideoDurationFilter,
    VideoPubdateFilter,
    VideoTitleFilter,
    VideoUploaderFilter,
    VideoUploaderKeywordFilter,
    VideoViewsFilter,
} from '../subFilters/black'
import { VideoIsFollowWhiteFilter, VideoTitleWhiteFilter, VideoUploaderWhiteFilter } from '../subFilters/white'

const GM_KEYS = {
    black: {
        duration: {
            statusKey: 'homepage-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        views: {
            statusKey: 'homepage-views-filter-status',
            valueKey: 'global-views-filter-value',
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
    views: (video: HTMLElement): SelectorResult => {
        const text = video.querySelector('.bili-video-card__stats--text')?.textContent?.trim()
        if (text) {
            if (/\d+(?:\.\d+)?万/.test(text)) {
                return parseFloat(text.replace('万', '')) * 10000
            }
            if (/^\d+$/.test(text)) {
                return parseFloat(text)
            }
        }
        return undefined
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

class VideoFilterHomepage implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    videoBvidFilter = new VideoBvidFilter()
    videoDurationFilter = new VideoDurationFilter()
    videoViewsFilter = new VideoViewsFilter()
    videoTitleFilter = new VideoTitleFilter()
    videoPubdateFilter = new VideoPubdateFilter()
    videoUploaderFilter = new VideoUploaderFilter()
    videoUploaderKeywordFilter = new VideoUploaderKeywordFilter()

    // 白名单
    videoUploaderWhiteFilter = new VideoUploaderWhiteFilter()
    videoTitleWhiteFilter = new VideoTitleWhiteFilter()
    videoIsFollowWhiteFilter = new VideoIsFollowWhiteFilter()

    init() {
        // 黑名单
        this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.bvid.valueKey, []))
        this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.duration.valueKey, 0))
        this.videoViewsFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.views.valueKey, 0))
        this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []))
        this.videoPubdateFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.pubdate.valueKey, 0))
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
                this.videoViewsFilter.isEnable ||
                this.videoTitleFilter.isEnable ||
                this.videoUploaderFilter.isEnable ||
                this.videoUploaderKeywordFilter.isEnable ||
                this.videoPubdateFilter.isEnable
            )
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 顶部推荐位 + rcmd视频流
        let selector = `:scope > :is(.feed-card, .bili-video-card.is-rcmd, .bili-feed-card)`
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

        if (settings.enableDebugFilter) {
            videos.forEach((v) => {
                debug(
                    [
                        `VideoFilterHomepage`,
                        `bvid: ${selectorFns.bvid(v)}`,
                        `duration: ${selectorFns.duration(v)}`,
                        `views: ${selectorFns.views(v)}`,
                        `title: ${selectorFns.title(v)}`,
                        `uploader: ${selectorFns.uploader(v)}`,
                        `pubdate: ${selectorFns.pubdate(v)}`,
                        `isFollow: ${selectorFns.isFollow(v)}`,
                    ].join('\n'),
                )
            })
        }

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns.duration])
        this.videoViewsFilter.isEnable && blackPairs.push([this.videoViewsFilter, selectorFns.views])
        this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns.title])
        this.videoPubdateFilter.isEnable && blackPairs.push([this.videoPubdateFilter, selectorFns.pubdate])
        this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns.uploader])
        this.videoUploaderKeywordFilter.isEnable &&
            blackPairs.push([this.videoUploaderKeywordFilter, selectorFns.uploader])

        const whitePairs: SubFilterPair[] = []
        this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns.uploader])
        this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns.title])
        this.videoIsFollowWhiteFilter.isEnable && whitePairs.push([this.videoIsFollowWhiteFilter, selectorFns.isFollow])

        const forceBlackPairs: SubFilterPair[] = []
        this.videoBvidFilter.isEnable && forceBlackPairs.push([this.videoBvidFilter, selectorFns.bvid])

        // 检测
        const blackCnt = await coreCheck(videos, true, blackPairs, whitePairs, forceBlackPairs)
        const time = (performance.now() - timer).toFixed(1)
        debug(`VideoFilterHomepage hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }

    checkFull() {
        this.check('full').catch((err) => {
            error('VideoFilterHomepage check full error', err)
        })
    }

    checkIncr() {
        this.check('incr').catch((err) => {
            error('VideoFilterHomepage check incr error', err)
        })
    }

    observe() {
        waitForEle(document, '.container', (node: HTMLElement): boolean => {
            return node.classList.contains('container')
        }).then((ele) => {
            if (!ele) {
                return
            }

            debug('VideoFilterHomepage target appear')
            this.target = ele
            this.checkFull()

            new MutationObserver(() => {
                this.checkIncr()
            }).observe(this.target, { childList: true })
        })
    }
}

//==================================================================================================

const mainFilter = new VideoFilterHomepage()

export const videoFilterHomepageEntry = async () => {
    mainFilter.init()
    mainFilter.observe()
}

export const videoFilterHomepageGroups: Group[] = [
    {
        name: '时长过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.duration.statusKey,
                name: '启用 时长过滤',
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
                    '每行一个关键词或正则，不区分大小写、全半角',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认 ius 模式，无需 flag，语法：/abc|\\d+/',
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
                    '每行一个关键词或正则，不区分大小写、全半角',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认 ius 模式，无需 flag，语法：/abc|\\d+/',
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
        name: '发布日期过滤',
        fold: true,
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.pubdate.statusKey,
                name: '启用 发布日期过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.videoPubdateFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoPubdateFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.pubdate.valueKey,
                name: '视频发布日 距今不超过',
                noStyle: true,
                minValue: 0,
                maxValue: 500,
                step: 1,
                defaultValue: 60,
                disableValue: 0,
                addonText: '天',
                fn: (value: number) => {
                    mainFilter.videoPubdateFilter.setParam(value)
                    mainFilter.checkFull()
                },
            },
        ],
    },
    {
        name: '播放量过滤',
        fold: true,
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.views.statusKey,
                name: '启用 播放量过滤',
                description: ['不推荐启用', '会导致刚发布的优质视频被过滤'],
                noStyle: true,
                enableFn: () => {
                    mainFilter.videoViewsFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoViewsFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.views.valueKey,
                name: '设定最低播放量（0~10万）',
                noStyle: true,
                minValue: 0,
                maxValue: 100000,
                step: 1,
                defaultValue: 0,
                disableValue: 0,
                addonText: '次',
                fn: (value: number) => {
                    mainFilter.videoViewsFilter.setParam(value)
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
                id: GM_KEYS.white.isFollow.statusKey,
                name: '标有 [已关注] 的视频免过滤',
                defaultEnable: true,
                noStyle: true,
                enableFn: () => {
                    mainFilter.videoIsFollowWhiteFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.videoIsFollowWhiteFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.uploader.statusKey,
                name: '启用 UP主白名单 (右键单击UP主)',
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
                    '每行一个关键词或正则，不区分大小写、全半角',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认 ius 模式，无需 flag，语法：/abc|\\d+/',
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
export const videoFilterHomepageHandler: ContextMenuTargetHandler = (target: HTMLElement): FilterContextMenu[] => {
    if (!isPageHomepage()) {
        return []
    }

    const menus: FilterContextMenu[] = []
    // UP主
    if (target.closest('.bili-video-card__info--owner')) {
        const uploader = target
            .closest('.bili-video-card__info--owner')
            ?.querySelector('.bili-video-card__info--author')
            ?.textContent?.trim()
        const url = target.closest<HTMLAnchorElement>('.bili-video-card__info--owner')?.href.trim()
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
                            error(`videoFilterHomepageHandler add uploader ${uploader} failed`, err)
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
                            error(`videoFilterHomepageHandler add white uploader ${uploader} failed`, err)
                        }
                    },
                })
            }
        }
        if (spaceUrl && (mainFilter.videoUploaderFilter.isEnable || mainFilter.videoUploaderWhiteFilter.isEnable)) {
            menus.push({
                name: `复制主页链接`,
                fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`).catch(() => {}),
            })
        }
    }
    // BVID
    if (target instanceof HTMLAnchorElement && target.closest('.bili-video-card__info--tit')) {
        const url = target.closest('.bili-video-card__info--tit')?.querySelector('a')?.href
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
                            error(`videoFilterHomepageHandler add bvid ${bvid} failed`, err)
                        }
                    },
                })
                menus.push({
                    name: '复制视频链接',
                    fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).catch(() => {}),
                })
            }
        }
    }
    return menus
}

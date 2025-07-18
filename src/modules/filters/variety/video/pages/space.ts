import { coreCheck } from '@/modules/filters/core/core'
import settings from '@/settings'
import { Group } from '@/types/collection'
import { ContextMenuTargetHandler, FilterContextMenu, IMainFilter, SelectorResult, SubFilterPair } from '@/types/filter'
import { debugFilter as debug, error } from '@/utils/logger'
import { isPageSpace } from '@/utils/pageType'
import { BiliCleanerStorage } from '@/utils/storage'
import { convertTimeToSec, matchBvid, orderedUniq, showEle, waitForEle } from '@/utils/tool'
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
        const duration =
            video.querySelector('span.length')?.textContent?.trim() ||
            video.querySelector('.bili-cover-card__stats .bili-cover-card__stat:nth-last-child(1)')?.textContent?.trim()
        return (duration && convertTimeToSec(duration)) ?? undefined
    },
    title: (video: HTMLElement): SelectorResult => {
        return (
            video.querySelector('a.title')?.textContent?.trim() ||
            video.querySelector('.bili-video-card__title a')?.textContent?.trim()
        )
    },
    bvid: (video: HTMLElement): SelectorResult => {
        const href =
            video.querySelector('a.title')?.getAttribute('href')?.trim() ||
            video.querySelector('.bili-video-card__title a')?.getAttribute('href')?.trim()
        return (href && matchBvid(href)) ?? undefined
    },
}

class VideoFilterSpace implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    videoBvidFilter = new VideoBvidFilter()
    videoDurationFilter = new VideoDurationFilter()
    videoTitleFilter = new VideoTitleFilter()

    // 白名单
    videoTitleWhiteFilter = new VideoTitleWhiteFilter()

    init() {
        // 黑名单
        this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.bvid.valueKey, []))
        this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.duration.valueKey, 0))
        this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []))
        // 白名单
        this.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.title.valueKey, []))
    }

    async check(mode?: 'full' | 'incr') {
        if (!this.target) {
            return
        }
        let revertAll = false
        if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable)) {
            revertAll = true
        }
        const timer = performance.now()

        // 提取元素
        let selector
        // 主页视频
        if (/^\/\d+$/.test(location.pathname)) {
            selector = `#page-index .small-item, .section-wrap.video-section .items__item, .section-wrap.lists-section .video-list__item`
        }
        // 投稿视频
        if (/^\/\d+\/(?:upload\/)?video$/.test(location.pathname)) {
            selector = `#submit-video :is(.small-item,.list-item), .video-list .upload-video-card`
        }
        // 旧版空间页 视频合集、视频系列
        if (/^\/\d+\/channel\/(collectiondetail|seriesdetail)/.test(location.pathname)) {
            selector = `:is(#page-collection-detail,#page-series-detail) li.small-item`
        }
        // 新版空间页 视频合集内视频
        if (/^\/\d+\/lists/.test(location.pathname)) {
            selector = `.space-lists .video-list .video-list__item, .space-list-details .list-video-item`
        }
        if (!selector) {
            return
        }
        const videos = Array.from(this.target.querySelectorAll<HTMLElement>(selector))
        if (!videos.length) {
            return
        }
        if (revertAll) {
            videos.forEach((v) => showEle(v, 'sign'))
            return
        }

        if (settings.enableDebugFilter) {
            videos.forEach((v) => {
                debug(
                    [
                        `VideoFilterSpace`,
                        `bvid: ${selectorFns.bvid(v)}`,
                        `duration: ${selectorFns.duration(v)}`,
                        `title: ${selectorFns.title(v)}`,
                    ].join('\n'),
                )
            })
        }

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns.duration])
        this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns.title])

        const whitePairs: SubFilterPair[] = []
        this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns.title])

        const forceBlackPairs: SubFilterPair[] = []
        this.videoBvidFilter.isEnable && forceBlackPairs.push([this.videoBvidFilter, selectorFns.bvid])

        // 检测
        const blackCnt = await coreCheck(videos, true, 'sign', blackPairs, whitePairs, forceBlackPairs)
        const time = (performance.now() - timer).toFixed(1)
        debug(`VideoFilterSpace hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`)
    }

    checkFull() {
        this.check('full').catch((err) => {
            error('VideoFilterSpace check full error', err)
        })
    }

    // checkIncr() {
    //     this.check('incr')
    //         .catch((err) => {
    //             error('VideoFilterSpace check incr error', err)
    //         })
    // }

    observe() {
        waitForEle(document, '#app', (node: HTMLElement): boolean => {
            return node.id === 'app'
        }).then((ele) => {
            if (!ele) {
                return
            }

            debug('VideoFilterSpace target appear')
            this.target = ele
            this.checkFull()

            new MutationObserver(() => {
                this.checkFull() // 空间页始终全量check
            }).observe(this.target, { childList: true, subtree: true })
        })
    }
}

//==================================================================================================

const mainFilter = new VideoFilterSpace()

export const videoFilterSpaceEntry = async () => {
    mainFilter.init()
    mainFilter.observe()
}

export const videoFilterSpaceGroups: Group[] = [
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
        name: '白名单 免过滤',
        items: [
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
export const videoFilterSpaceHandler: ContextMenuTargetHandler = (target: HTMLElement): FilterContextMenu[] => {
    if (!isPageSpace()) {
        return []
    }

    const menus: FilterContextMenu[] = []
    // BVID
    if (target.closest('.bili-video-card__title')) {
        const url = (target as HTMLAnchorElement).href
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
                            error(`videoFilterSearchHandler add bvid ${bvid} failed`, err)
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

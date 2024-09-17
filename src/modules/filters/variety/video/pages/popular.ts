import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import fetchHook from '../../../../../utils/fetch'
import { error, log } from '../../../../../utils/logger'
import { isPagePopular } from '../../../../../utils/pageType'
import { calcQuality, matchBvid, waitForEle } from '../../../../../utils/tool'
import { coreCheck } from '../../../core/core'
import {
    VideoBvidFilter,
    VideoDimensionFilter,
    VideoDurationFilter,
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

if (isPagePopular()) {
    // 初始化黑名单
    const videoBvidFilter = new VideoBvidFilter()
    videoBvidFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.bvid.valueKey}`, []))

    const videoDurationFilter = new VideoDurationFilter()
    videoDurationFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.duration.valueKey}`, 0))

    const videoTitleFilter = new VideoTitleFilter()
    videoTitleFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.title.valueKey}`, []))

    const videoUploaderFilter = new VideoUploaderFilter()
    videoUploaderFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.uploader.valueKey}`, []))

    const videoUploaderKeywordFilter = new VideoUploaderKeywordFilter()
    videoUploaderKeywordFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.uploaderKeyword.valueKey}`, []))

    const videoQualityFilter = new VideoQualityFilter()
    videoQualityFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.quality.valueKey}`, 0))

    const videoDimensionFilter = new VideoDimensionFilter()

    // 初始化白名单
    const videoUploaderWhiteFilter = new VideoUploaderWhiteFilter()
    videoUploaderWhiteFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.white.uploader.valueKey}`, []))

    const videoTitleWhiteFilter = new VideoTitleWhiteFilter()
    videoTitleWhiteFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.white.title.valueKey}`, []))

    // API信息提取，key为bvid
    const videoInfoMap = new Map<
        string,
        {
            duration: number
            dimension: boolean
            like: number
            coin: number
        }
    >()

    // 获取api resp
    let apiResp: Response | undefined
    fetchHook.addPostFn((input: RequestInfo | URL, init: RequestInit | undefined, resp?: Response) => {
        if (
            typeof input === 'string' &&
            /api\.bilibili\.com.+web-interface\/(ranking|popular\/series\/one|popular\?ps)/.test(input) &&
            init?.method?.toUpperCase() === 'GET' &&
            resp
        ) {
            apiResp = resp.clone()
        }
    })

    // 解析API数据，存入map
    const parseResp = async () => {
        await apiResp
            ?.clone()
            .json()
            .then((json) => {
                json.data.list.forEach((v: any) => {
                    const bvid = v.bvid
                    if (bvid && !videoInfoMap.has(bvid)) {
                        videoInfoMap.set(bvid, {
                            duration: v.duration,
                            dimension: v.dimension.width < v.dimension.height,
                            like: v.stat.like,
                            coin: v.stat.coin,
                        })
                    }
                })
            })
            .catch((err) => {
                error('Error parsing JSON:', err)
            })
            .finally(() => {
                apiResp = undefined
            })
    }

    // 视频列表信息提取
    const selectorFns = {
        title: (video: HTMLElement): SelectorResult => {
            return (
                video.querySelector('.video-card__info .video-name')?.textContent?.trim() ||
                video.querySelector('.info a.title')?.textContent?.trim()
            )
        },
        bvid: (video: HTMLElement): SelectorResult => {
            const href =
                video.querySelector('.video-card__content > a')?.getAttribute('href') ||
                video.querySelector('.content > .img > a')?.getAttribute('href')
            return (href && matchBvid(href)) ?? undefined
        },
        uploader: (video: HTMLElement): SelectorResult => {
            return (
                video.querySelector('span.up-name__text')?.textContent?.trim() ||
                video.querySelector('.data-box.up-name')?.textContent?.trim()
            )
        },
        duration: (video: HTMLElement): SelectorResult => {
            const href =
                video.querySelector('.video-card__content > a')?.getAttribute('href') ||
                video.querySelector('.content > .img > a')?.getAttribute('href')
            if (href) {
                const bvid = matchBvid(href)
                if (bvid) {
                    return videoInfoMap.get(bvid)?.duration
                }
            }
            return undefined
        },
        quality: (video: HTMLElement): SelectorResult => {
            const href =
                video.querySelector('.video-card__content > a')?.getAttribute('href') ||
                video.querySelector('.content > .img > a')?.getAttribute('href')
            if (href) {
                const bvid = matchBvid(href)
                if (bvid) {
                    const coin = videoInfoMap.get(bvid)?.coin
                    const like = videoInfoMap.get(bvid)?.like
                    if (coin && like) {
                        return calcQuality(coin / like)
                    }
                }
            }
            return undefined
        },
        // true竖屏, false横屏
        dimension: (video: HTMLElement): SelectorResult => {
            const href =
                video.querySelector('.video-card__content > a')?.getAttribute('href') ||
                video.querySelector('.content > .img > a')?.getAttribute('href')
            if (href) {
                const bvid = matchBvid(href)
                if (bvid) {
                    return videoInfoMap.get(bvid)?.dimension
                }
            }
            return false
        },
    }

    let vlc: HTMLElement // video list container

    // 检测视频列表
    const checkVideoList = async (fullSite: boolean) => {
        if (!vlc) {
            return
        }
        try {
            // 提取元素
            let selector = ''
            // 热门视频
            if (location.pathname.includes('/v/popular/all')) {
                selector = fullSite ? `.card-list .video-card` : `.card-list .video-card:not([${settings.filterSign}])`
            }
            // 每周必看
            if (location.pathname.includes('/v/popular/weekly')) {
                selector = fullSite
                    ? `.video-list .video-card`
                    : `.video-list .video-card:not([${settings.filterSign}])`
            }
            // 排行榜
            if (location.pathname.includes('/v/popular/rank')) {
                selector = fullSite ? `.rank-list .rank-item` : `.rank-list .rank-item:not([${settings.filterSign}])`
            }

            const videos = Array.from(vlc.querySelectorAll<HTMLElement>(selector))

            // videos.forEach((v) => {
            //     log(
            //         [
            //             ``,
            //             `bvid: ${selectorFns.bvid(v)}`,
            //             `duration: ${selectorFns.duration(v)}`,
            //             `title: ${selectorFns.title(v)}`,
            //             `uploader: ${selectorFns.uploader(v)}`,
            //             `dimension: ${selectorFns.dimension(v)}`,
            //             `quality: ${selectorFns.quality(v)}`,
            //         ].join('\n'),
            //     )
            // })

            // 构建黑白检测任务
            const blackPairs: SubFilterPair[] = []
            videoBvidFilter.isEnable && blackPairs.push([videoBvidFilter, selectorFns.bvid])
            videoDurationFilter.isEnable && blackPairs.push([videoDurationFilter, selectorFns.duration])
            videoTitleFilter.isEnable && blackPairs.push([videoTitleFilter, selectorFns.title])
            videoUploaderFilter.isEnable && blackPairs.push([videoUploaderFilter, selectorFns.uploader])
            videoUploaderKeywordFilter.isEnable && blackPairs.push([videoUploaderKeywordFilter, selectorFns.uploader])
            videoDimensionFilter.isEnable && blackPairs.push([videoDimensionFilter, selectorFns.dimension])
            videoQualityFilter.isEnable && blackPairs.push([videoQualityFilter, selectorFns.quality])

            const whitePairs: SubFilterPair[] = []
            videoUploaderWhiteFilter.isEnable && whitePairs.push([videoUploaderWhiteFilter, selectorFns.uploader])
            videoTitleWhiteFilter.isEnable && whitePairs.push([videoTitleWhiteFilter, selectorFns.title])

            // 检测
            if (videos.length) {
                await coreCheck(videos, true, blackPairs, whitePairs)
                log(`check ${videos.length} videos`)
            }
        } catch (err) {
            error('checkVideoList error', err)
        }
    }

    const check = async (fullSite: boolean) => {
        if (
            videoBvidFilter.isEnable ||
            videoDurationFilter.isEnable ||
            videoTitleFilter.isEnable ||
            videoUploaderFilter.isEnable ||
            videoUploaderKeywordFilter.isEnable ||
            videoDimensionFilter.isEnable ||
            videoQualityFilter.isEnable
        ) {
            if (location.pathname.match(/\/v\/popular\/(?:all|rank|weekly)/)) {
                videoDurationFilter.isEnable || videoDimensionFilter.isEnable || videoQualityFilter.isEnable
                    ? await parseResp()
                    : parseResp().then().catch()
            }
            await checkVideoList(fullSite)
        }
    }

    // // 右键监听, 屏蔽UP主
    // let isContextMenuFuncRunning = false
    // let isContextMenuUploaderEnable = false
    // let isContextMenuBvidEnable = false
    // const contextMenuFunc = () => {
    //     if (isContextMenuFuncRunning) {
    //         return
    //     }
    //     isContextMenuFuncRunning = true
    //     const menu = new ContextMenu()
    //     document.addEventListener('contextmenu', (e) => {
    //         menu.hide()
    //         if (e.target instanceof HTMLElement) {
    //             const target = e.target
    //             if (
    //                 isContextMenuUploaderEnable &&
    //                 (target.classList.contains('up-name__text') || target.classList.contains('up-name'))
    //             ) {
    //                 // 命中UP主
    //                 const uploader = target.textContent?.trim()
    //                 if (uploader) {
    //                     e.preventDefault()
    //                     menu.registerMenu(`◎ 屏蔽UP主：${uploader}`, () => {
    //                         videoUploaderFilter.addParam(uploader)
    //                         check(true).then().catch()
    //                         try {
    //                             const arr: string[] = GM_getValue(`BILICLEANER_${GM_KEYS.black.uploader.valueKey}`, [])
    //                             if (!arr.includes(uploader)) {
    //                                 arr.unshift(uploader)
    //                                 GM_setValue(`BILICLEANER_${GM_KEYS.black.uploader.valueKey}`, arr)
    //                             }
    //                         } catch (err) {
    //                             error('contextMenuFunc addParam error', err)
    //                         }
    //                     })
    //                     menu.registerMenu(`◎ 将UP主加入白名单`, () => {
    //                         videoUploaderWhiteFilter.addParam(uploader)
    //                         check(true).then().catch()
    //                         try {
    //                             const arr: string[] = GM_getValue(`BILICLEANER_${GM_KEYS.white.uploader.valueKey}`, [])
    //                             if (!arr.includes(uploader)) {
    //                                 arr.unshift(uploader)
    //                                 GM_setValue(`BILICLEANER_${GM_KEYS.white.uploader.valueKey}`, arr)
    //                             }
    //                         } catch (err) {
    //                             error('contextMenuFunc addParam error', err)
    //                         }
    //                     })
    //                     menu.show(e.clientX, e.clientY)
    //                 }
    //             } else if (
    //                 isContextMenuBvidEnable &&
    //                 ((target.classList.contains('title') && target.closest('.info a') === target) ||
    //                     target.classList.contains('video-name') ||
    //                     target.classList.contains('lazy-image'))
    //             ) {
    //                 // 命中视频图片/视频标题, 提取bvid
    //                 let href = target.getAttribute('href') || target.parentElement?.getAttribute('href')
    //                 if (!href) {
    //                     href = target
    //                         .closest('.video-card')
    //                         ?.querySelector('.video-card__content > a')
    //                         ?.getAttribute('href')
    //                 }
    //                 if (href) {
    //                     const bvid = matchBvid(href)
    //                     if (bvid) {
    //                         e.preventDefault()
    //                         menu.registerMenu(`屏蔽视频 ${bvid}`, () => {
    //                             videoBvidFilter.addParam(bvid)
    //                             check(true).then().catch()
    //                             try {
    //                                 const arr: string[] = GM_getValue(`BILICLEANER_${GM_KEYS.black.bvid.valueKey}`, [])
    //                                 if (!arr.includes(bvid)) {
    //                                     arr.unshift(bvid)
    //                                     GM_setValue(`BILICLEANER_${GM_KEYS.black.bvid.valueKey}`, arr)
    //                                 }
    //                             } catch (err) {
    //                                 error('contextMenuFunc addParam error', err)
    //                             }
    //                         })
    //                         menu.show(e.clientX, e.clientY)
    //                     }
    //                 }
    //             } else {
    //                 menu.hide()
    //             }
    //         }
    //     })
    // }

    try {
        waitForEle(document, '#app', (node: HTMLElement): boolean => {
            return node.id === 'app'
        }).then((ele) => {
            if (ele) {
                vlc = ele
                check(true).then().catch()
                // 监听视频列表变化
                new MutationObserver(() => {
                    check(true).then().catch()
                }).observe(vlc, { childList: true, subtree: true })
            }
        })
    } catch (err) {
        error(`watch video list error`, err)
    }
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
                enableFn: () => {},
                disableFn: () => {},
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
                fn: (value: number) => {},
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
                enableFn: () => {},
                disableFn: () => {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 UP主黑名单',
                buttonText: '编辑',
                fn: () => {},
            },
            {
                type: 'switch',
                id: GM_KEYS.black.uploaderKeyword.statusKey,
                name: '启用 UP主昵称关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn: () => {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 UP主昵称关键词黑名单',
                buttonText: '编辑',
                fn: () => {},
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
                enableFn: () => {},
                disableFn: () => {},
            },
            {
                type: 'switch',
                id: GM_KEYS.black.quality.statusKey,
                name: '启用 劣质视频过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn: () => {},
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
                fn: (value: number) => {},
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
                enableFn: () => {},
                disableFn: () => {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 标题关键词黑名单',
                buttonText: '编辑',
                fn: () => {},
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
                enableFn: () => {},
                disableFn: () => {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 BV号黑名单',
                buttonText: '编辑',
                fn: () => {},
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
                enableFn: () => {},
                disableFn: () => {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 UP主白名单',
                buttonText: '编辑',
                fn: () => {},
            },
            {
                type: 'switch',
                id: GM_KEYS.white.title.statusKey,
                name: '启用 标题关键词白名单',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn: () => {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 标题关键词白名单',
                buttonText: '编辑',
                fn: () => {},
            },
        ],
    },
]

import { GM_getValue } from '$'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { error, log } from '../../../../../utils/logger'
import { isPageSearch } from '../../../../../utils/pageType'
import { convertTimeToSec, matchBvid, showEle, waitForEle } from '../../../../../utils/tool'
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
            statusKey: 'search-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        uploader: {
            statusKey: 'search-uploader-filter-status',
            valueKey: 'global-uploader-filter-value',
        },
        uploaderKeyword: {
            statusKey: 'search-uploader-keyword-filter-status',
            valueKey: 'global-uploader-keyword-filter-value',
        },
        bvid: {
            statusKey: 'search-bvid-filter-status',
            valueKey: 'global-bvid-filter-value',
        },
        title: {
            statusKey: 'search-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
    },
    white: {
        uploader: {
            statusKey: 'search-uploader-whitelist-filter-status',
            valueKey: 'global-uploader-whitelist-filter-value',
        },
        title: {
            statusKey: 'search-title-keyword-whitelist-filter-status',
            valueKey: 'global-title-keyword-whitelist-filter-value',
        },
        isTop: {
            statusKey: 'search-top-uploader-whitelist-filter-status',
        },
    },
}

if (isPageSearch()) {
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

    // 初始化白名单
    const videoUploaderWhiteFilter = new VideoUploaderWhiteFilter()
    videoUploaderWhiteFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.white.uploader.valueKey}`, []))

    const videoTitleWhiteFilter = new VideoTitleWhiteFilter()
    videoTitleWhiteFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.white.title.valueKey}`, []))

    // 视频列表信息提取
    const selectorFns = {
        duration: (video: HTMLElement): SelectorResult => {
            const duration = video.querySelector('.bili-video-card__stats__duration')?.textContent?.trim()
            return (duration && convertTimeToSec(duration)) ?? undefined
        },
        title: (video: HTMLElement): SelectorResult => {
            return video.querySelector('.bili-video-card__info--tit')?.textContent?.trim()
        },
        bvid: (video: HTMLElement): SelectorResult => {
            const href =
                video.querySelector('.bili-video-card__wrap > a')?.getAttribute('href') ||
                video.querySelector('.bili-video-card__info--right > a')?.getAttribute('href')
            return (href && matchBvid(href)) ?? undefined
        },
        uploader: (video: HTMLElement): SelectorResult => {
            return video.querySelector('.bili-video-card__info--author')?.textContent?.trim()
        },
    }

    let vlc: HTMLElement // video list container

    // 检测视频列表
    const isTopWhite = false
    const checkVideoList = async (_fullSite: boolean) => {
        if (!vlc) {
            return
        }
        try {
            // 提取元素
            // 顶部UP主的视频列表
            const topVideos = Array.from(
                vlc.querySelectorAll<HTMLElement>(`.user-video-info .video-list > .video-list-item`),
            )
            // 普通搜索结果，视频列表
            const contentVideos = Array.from(
                vlc.querySelectorAll<HTMLElement>(
                    `.video.search-all-list .video-list > div, .search-page-video .video-list > div`,
                ),
            )

            // topVideos.forEach((v) => {
            //     log(
            //         [
            //             `topVideos`,
            //             `bvid: ${selectorFns.bvid(v)}`,
            //             `duration: ${selectorFns.duration(v)}`,
            //             `title: ${selectorFns.title(v)}`,
            //             `uploader: ${selectorFns.uploader(v)}`,
            //         ].join('\n'),
            //     )
            // })
            // contentVideos.forEach((v) => {
            //     log(
            //         [
            //             `contentVideos`,
            //             `bvid: ${selectorFns.bvid(v)}`,
            //             `duration: ${selectorFns.duration(v)}`,
            //             `title: ${selectorFns.title(v)}`,
            //             `uploader: ${selectorFns.uploader(v)}`,
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

            const whitePairs: SubFilterPair[] = []
            videoUploaderWhiteFilter.isEnable && whitePairs.push([videoUploaderWhiteFilter, selectorFns.uploader])
            videoTitleWhiteFilter.isEnable && whitePairs.push([videoTitleWhiteFilter, selectorFns.title])

            // 检测
            if (!isTopWhite && topVideos.length) {
                await coreCheck(topVideos, false, blackPairs, whitePairs)
            } else {
                topVideos.forEach((el) => showEle(el))
            }
            contentVideos.length && (await coreCheck(contentVideos, false, blackPairs, whitePairs))
            log(`check ${topVideos.length} topVideos, ${contentVideos.length} contentVideos`)
        } catch (err) {
            error('checkVideoList error', err)
        }
    }

    const check = (fullSite: boolean) => {
        if (
            videoBvidFilter.isEnable ||
            videoDurationFilter.isEnable ||
            videoTitleFilter.isEnable ||
            videoUploaderFilter.isEnable ||
            videoUploaderKeywordFilter.isEnable
        ) {
            checkVideoList(fullSite).then().catch()
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
    //             if (isContextMenuUploaderEnable && e.target.closest('.bili-video-card__info--owner')) {
    //                 // 命中UP主或日期
    //                 const node = e.target
    //                     .closest('.bili-video-card__info--owner')
    //                     ?.querySelector('.bili-video-card__info--author')
    //                 const uploader = node?.textContent?.trim()
    //                 if (uploader) {
    //                     e.preventDefault()
    //                     menu.registerMenu(`◎ 屏蔽UP主：${uploader}`, () => {
    //                         videoUploaderFilter.addParam(uploader)
    //                         check(true)
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
    //                         check(true)
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
    //                     menu.registerMenu(`◎ 复制主页链接`, () => {
    //                         const url = node?.closest('.bili-video-card__info--owner')?.getAttribute('href')
    //                         if (url) {
    //                             const matches = url.match(/space\.bilibili\.com\/\d+/g)
    //                             matches && navigator.clipboard.writeText(`https://${matches[0]}`)
    //                         }
    //                     })
    //                     menu.show(e.clientX, e.clientY)
    //                 }
    //             } else if (isContextMenuBvidEnable && e.target.closest('.bili-video-card__info--tit')) {
    //                 // 命中视频标题, 提取bvid
    //                 const href = e.target
    //                     .closest('.bili-video-card__info--right')
    //                     ?.querySelector(':scope > a')
    //                     ?.getAttribute('href')
    //                 if (href) {
    //                     const bvid = matchBvid(href)
    //                     if (bvid) {
    //                         e.preventDefault()
    //                         menu.registerMenu(`◎ 屏蔽视频 ${bvid}`, () => {
    //                             videoBvidFilter.addParam(bvid)
    //                             check(true)
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
    //                         menu.registerMenu(`◎ 复制视频链接`, () => {
    //                             navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch()
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
        waitForEle(document, '.search-layout', (node: HTMLElement): boolean => {
            return node.className.includes('search-layout')
        }).then((ele) => {
            if (ele) {
                vlc = ele
                check(true)
                // 监听视频列表变化
                new MutationObserver(() => {
                    check(true)
                }).observe(vlc, { childList: true, subtree: true })
            }
        })
    } catch (err) {
        error(`watch video list error`, err)
    }
}

export const videoFilterSearchGroups: Group[] = [
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

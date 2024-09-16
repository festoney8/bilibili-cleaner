import { GM_getValue } from '$'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { error, log } from '../../../../../utils/logger'
import { isPageSpace } from '../../../../../utils/pageType'
import { convertTimeToSec, matchBvid, waitForEle } from '../../../../../utils/tool'
import { coreCheck } from '../../../core/core'
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

if (isPageSpace()) {
    // 初始化黑名单
    const videoBvidFilter = new VideoBvidFilter()
    videoBvidFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.bvid.valueKey}`, []))

    const videoDurationFilter = new VideoDurationFilter()
    videoDurationFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.duration.valueKey}`, 0))

    const videoTitleFilter = new VideoTitleFilter()
    videoTitleFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.title.valueKey}`, []))

    // 初始化白名单
    const videoTitleWhiteFilter = new VideoTitleWhiteFilter()
    videoTitleWhiteFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.white.title.valueKey}`, []))

    // 视频列表信息提取
    const selectorFns = {
        duration: (video: HTMLElement): SelectorResult => {
            const duration = video.querySelector('span.length')?.textContent?.trim()
            return (duration && convertTimeToSec(duration)) ?? undefined
        },
        title: (video: HTMLElement): SelectorResult => {
            return video.querySelector('a.title')?.textContent?.trim()
        },
        bvid: (video: HTMLElement): SelectorResult => {
            const href = video.querySelector('a.title')?.getAttribute('href')?.trim()
            return (href && matchBvid(href)) ?? undefined
        },
    }

    let vlc: HTMLElement // video list container

    // 检测视频列表
    const checkVideoList = async (_fullSite: boolean) => {
        if (!vlc) {
            return
        }
        try {
            // 提取元素
            let videos: HTMLElement[] = []
            // 主页视频
            if (/^\/\d+$/.test(location.pathname)) {
                videos = Array.from(vlc.querySelectorAll<HTMLElement>(`#page-index .small-item`))
            }
            // 投稿视频
            if (/^\/\d+\/video$/.test(location.pathname)) {
                videos = Array.from(vlc.querySelectorAll<HTMLElement>(`#submit-video :is(.small-item,.list-item)`))
            }
            // 视频合集、视频系列
            if (/^\/\d+\/channel\/(collectiondetail|seriesdetail)/.test(location.pathname)) {
                videos = Array.from(
                    vlc.querySelectorAll<HTMLElement>(`:is(#page-collection-detail,#page-series-detail) li.small-item`),
                )
            }

            // videos.forEach((v) => {
            //     log(
            //         [
            //             ``,
            //             `bvid: ${selectorFns.bvid(v)}`,
            //             `duration: ${selectorFns.duration(v)}`,
            //             `title: ${selectorFns.title(v)}`,
            //         ].join('\n'),
            //     )
            // })

            if (videos.length) {
                // 构建黑白检测任务
                const blackPairs: SubFilterPair[] = []
                videoBvidFilter.isEnable && blackPairs.push([videoBvidFilter, selectorFns.bvid])
                videoDurationFilter.isEnable && blackPairs.push([videoDurationFilter, selectorFns.duration])
                videoTitleFilter.isEnable && blackPairs.push([videoTitleFilter, selectorFns.title])

                const whitePairs: SubFilterPair[] = []
                videoTitleWhiteFilter.isEnable && whitePairs.push([videoTitleWhiteFilter, selectorFns.title])

                // 检测
                await coreCheck(videos, false, blackPairs, whitePairs)
                log(`check ${videos.length} videos`)
            }
        } catch (err) {
            error('checkVideoList error', err)
        }
    }

    const check = (fullSite: boolean) => {
        if (videoBvidFilter.isEnable || videoDurationFilter.isEnable || videoTitleFilter.isEnable) {
            checkVideoList(fullSite).then().catch()
        }
    }

    // // 右键监听, 屏蔽UP主
    // let isContextMenuFuncRunning = false
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
    //             // log(e.target.classList)
    //             if (isContextMenuBvidEnable && e.target.classList.contains('title')) {
    //                 // 命中视频标题, 提取bvid
    //                 const href = e.target.getAttribute('href')
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
        waitForEle(document, '#app', (node: HTMLElement): boolean => {
            return node.id === 'app'
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

export const videoFilterSpaceGroups: Group[] = [
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
                name: '设定最低时长 (0~300s)',
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

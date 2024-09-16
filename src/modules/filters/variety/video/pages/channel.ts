import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { error, log } from '../../../../../utils/logger'
import { isPageChannel } from '../../../../../utils/pageType'
import { convertDateToDays, convertTimeToSec, matchBvid, waitForEle } from '../../../../../utils/tool'
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

if (isPageChannel()) {
    // 初始化黑名单
    const videoBvidFilter = new VideoBvidFilter()
    videoBvidFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.bvid.valueKey}`, []))

    const videoDurationFilter = new VideoDurationFilter()
    videoDurationFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.duration.valueKey}`, 0))

    const videoTitleFilter = new VideoTitleFilter()
    videoTitleFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.title.valueKey}`, []))

    const videoPubdateFilter = new VideoPubdateFilter()
    videoPubdateFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.pubdate.valueKey}`, 0))

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

    let vlc: HTMLElement // video list container

    // 检测视频列表
    const checkVideoList = async (fullSite: boolean) => {
        if (!vlc) {
            return
        }
        try {
            // 提取元素
            let videos: HTMLElement[]
            if (!fullSite) {
                videos = Array.from(vlc.querySelectorAll<HTMLElement>(`.bili-video-card:not([${settings.filterSign}])`))
            } else {
                videos = Array.from(vlc.querySelectorAll<HTMLElement>(`.bili-video-card`))
            }

            // videos.forEach((v) => {
            //     log(
            //         [
            //             `videos`,
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
            videoBvidFilter.isEnable && blackPairs.push([videoBvidFilter, selectorFns.bvid])
            videoDurationFilter.isEnable && blackPairs.push([videoDurationFilter, selectorFns.duration])
            videoTitleFilter.isEnable && blackPairs.push([videoTitleFilter, selectorFns.title])
            videoPubdateFilter.isEnable && blackPairs.push([videoPubdateFilter, selectorFns.pubdate])
            videoUploaderFilter.isEnable && blackPairs.push([videoUploaderFilter, selectorFns.uploader])
            videoUploaderKeywordFilter.isEnable && blackPairs.push([videoUploaderKeywordFilter, selectorFns.uploader])

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
    //             // log(e.target.classList)
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
    //             } else if (
    //                 isContextMenuBvidEnable &&
    //                 e.target.parentElement?.classList.contains('bili-video-card__info--tit')
    //             ) {
    //                 // 命中视频标题, 提取bvid
    //                 const node = e.target.parentElement
    //                 const href = node.querySelector(':scope > a')?.getAttribute('href')
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
        waitForEle(document, 'main.channel-layout', (node: HTMLElement): boolean => {
            return node.className === 'channel-layout'
        }).then((ele) => {
            if (ele) {
                vlc = ele
                check(true)
                // 监听视频列表变化
                new MutationObserver(() => {
                    check(false)
                }).observe(vlc, { childList: true, subtree: true })
            }
        })
    } catch (err) {
        error(`watch video list error`, err)
    }
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
        name: '发布日期过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.pubdate.statusKey,
                name: '启用 发布日期过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn: () => {},
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
                fn: (value: number) => {},
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

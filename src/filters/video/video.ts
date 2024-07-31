import { GM_getValue, GM_setValue } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { CheckboxItem, NumberItem, ButtonItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import { debugVideoFilter as debug, error } from '../../utils/logger'
import { isPageVideo, isPageBangumi, isPagePlaylist } from '../../utils/pageType'
import { convertTimeToSec, hideEle, isEleHide, matchBvid, showEle, waitForEle } from '../../utils/tool'
import { SelectorResult, SubFilterPair, coreCheck } from '../core/core'
import {
    VideoBvidFilter,
    VideoDurationFilter,
    VideoTitleFilter,
    VideoUploaderFilter,
    VideoUploaderKeywordFilter,
} from './subFilters/black'
import { VideoUploaderWhiteFilter, VideoTitleWhiteFilter } from './subFilters/white'

const videoPageVideoFilterGroupList: Group[] = []

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
        isNext: {
            statusKey: 'video-next-play-whitelist-filter-status',
        },
        isEnding: {
            statusKey: 'video-ending-whitelist-filter-status',
        },
    },
}

if (isPageVideo() || isPageBangumi() || isPagePlaylist()) {
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

    let videoListContainer: HTMLElement

    // 检测视频列表
    let isNextPlayWhitelistEnable = false
    const checkVideoList = async (_fullSite: boolean) => {
        if (!videoListContainer) {
            return
        }
        try {
            // 提取元素
            const nextVideos = Array.from(
                videoListContainer.querySelectorAll<HTMLElement>(
                    `.next-play :is(.video-page-card-small, .video-page-operator-card-small)`,
                ),
            )
            const rcmdVideos = Array.from(
                videoListContainer.querySelectorAll<HTMLElement>(
                    `.rec-list :is(.video-page-card-small, .video-page-operator-card-small), .recommend-video-card`,
                ),
            )

            // nextVideos.forEach((v) => {
            //     debug(
            //         [
            //             `nextVideos`,
            //             `bvid: ${selectorFns.bvid(v)}`,
            //             `duration: ${selectorFns.duration(v)}`,
            //             `title: ${selectorFns.title(v)}`,
            //             `uploader: ${selectorFns.uploader(v)}`,
            //         ].join('\n'),
            //     )
            // })
            // rcmdVideos.forEach((v) => {
            //     debug(
            //         [
            //             `rcmdVideos`,
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
            if (!isNextPlayWhitelistEnable && nextVideos.length) {
                coreCheck(nextVideos, true, blackPairs, whitePairs)
            } else {
                nextVideos.forEach((el) => showEle(el))
            }
            rcmdVideos.length && coreCheck(rcmdVideos, true, blackPairs, whitePairs)
            debug(`check ${nextVideos.length} next, ${rcmdVideos.length} rcmd videos`)
        } catch (err) {
            error('checkVideoList error', err)
        }
    }

    // 视频结束后筛选播放器内视频
    let isEndingWhitelistEnable = false
    const watchPlayerEnding = () => {
        if (isEndingWhitelistEnable) {
            return
        }
        const video = document.querySelector('video')
        if (!video) {
            return
        }
        const check = () => {
            const rightList = document.querySelectorAll<HTMLElement>(`
                .recommend-video-card,
                :is(.next-play, .rec-list) :is(.video-page-card-small, .video-page-operator-card-small)
            `)
            const blacklistVideoTitle = new Set<string>()
            rightList.forEach((video: HTMLElement) => {
                if (isEleHide(video)) {
                    const title = video.querySelector('.info > a p')?.textContent?.trim()
                    title && blacklistVideoTitle.add(title)
                }
            })
            let cnt = 0
            const endingId = setInterval(() => {
                const endingVideos = document.querySelectorAll<HTMLElement>('.bpx-player-ending-related-item')
                if (endingVideos.length > 0) {
                    endingVideos.forEach((video: HTMLElement) => {
                        const title = video.querySelector('.bpx-player-ending-related-item-title')?.textContent?.trim()
                        if (title && blacklistVideoTitle.has(title)) {
                            hideEle(video)
                        } else {
                            showEle(video)
                        }
                    })
                    clearInterval(endingId)
                }
                ++cnt > 100 && clearInterval(endingId)
            }, 10)
        }
        video.ended ? check() : video.addEventListener('ended', check)
    }

    // 右键监听, 屏蔽UP主
    let isContextMenuFuncRunning = false
    let isContextMenuUploaderEnable = false
    let isContextMenuBvidEnable = false
    const contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        const menu = new ContextMenu()
        document.addEventListener('contextmenu', (e) => {
            menu.hide()
            if (e.target instanceof HTMLElement) {
                const target = e.target
                if (
                    isContextMenuUploaderEnable &&
                    (target.classList.contains('name') ||
                        target.classList.contains('up-name') ||
                        target.parentElement?.classList.contains('up-name') ||
                        target.closest('.staff-info'))
                ) {
                    // 命中UP主
                    const uploader =
                        target.closest('.staff-info')?.querySelector('.staff-name')?.textContent?.trim() ||
                        target.textContent?.trim() ||
                        target.parentElement?.textContent?.trim()
                    if (uploader) {
                        e.preventDefault()
                        menu.registerMenu(`◎ 屏蔽UP主：${uploader}`, () => {
                            videoUploaderFilter.addParam(uploader)
                            checkVideoList(true)
                            try {
                                const arr: string[] = GM_getValue(`BILICLEANER_${GM_KEYS.black.uploader.valueKey}`, [])
                                if (!arr.includes(uploader)) {
                                    arr.unshift(uploader)
                                    GM_setValue(`BILICLEANER_${GM_KEYS.black.uploader.valueKey}`, arr)
                                }
                            } catch (err) {
                                error('contextMenuFunc addParam error', err)
                            }
                        })
                        menu.registerMenu(`◎ 将UP主加入白名单`, () => {
                            videoUploaderWhiteFilter.addParam(uploader)
                            checkVideoList(true)
                            try {
                                const arr: string[] = GM_getValue(`BILICLEANER_${GM_KEYS.white.uploader.valueKey}`, [])
                                if (!arr.includes(uploader)) {
                                    arr.unshift(uploader)
                                    GM_setValue(`BILICLEANER_${GM_KEYS.white.uploader.valueKey}`, arr)
                                }
                            } catch (err) {
                                error('contextMenuFunc addParam error', err)
                            }
                        })
                        const url = target.closest('.upname')?.querySelector(':scope a')?.getAttribute('href')
                        if (url) {
                            const matches = url.match(/space\.bilibili\.com\/\d+/g)
                            matches &&
                                menu.registerMenu(`◎ 复制主页链接`, () => {
                                    navigator.clipboard.writeText(`https://${matches[0]}`).then().catch()
                                })
                        }
                        menu.show(e.clientX, e.clientY)
                    }
                } else if (isContextMenuBvidEnable && target.classList.contains('title')) {
                    // 命中视频标题, 提取bvid
                    const href = target.parentElement?.getAttribute('href')
                    if (href) {
                        const bvid = matchBvid(href)
                        if (bvid) {
                            e.preventDefault()
                            menu.registerMenu(`◎ 屏蔽视频 ${bvid}`, () => {
                                videoBvidFilter.addParam(bvid)
                                checkVideoList(true)
                                try {
                                    const arr: string[] = GM_getValue(`BILICLEANER_${GM_KEYS.black.bvid.valueKey}`, [])
                                    if (!arr.includes(bvid)) {
                                        arr.unshift(bvid)
                                        GM_setValue(`BILICLEANER_${GM_KEYS.black.bvid.valueKey}`, arr)
                                    }
                                } catch (err) {
                                    error('contextMenuFunc addParam error', err)
                                }
                            })
                            menu.registerMenu(`◎ 复制视频链接`, () => {
                                navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch()
                            })
                            menu.show(e.clientX, e.clientY)
                        }
                    }
                } else {
                    menu.hide()
                }
            }
        })
    }

    try {
        waitForEle(document, '#reco_list, .recommend-list-container', (node: HTMLElement): boolean => {
            return node.id === 'reco_list' || node.className === 'recommend-list-container'
        }).then((ele) => {
            if (ele) {
                videoListContainer = ele
                const check = (fullSite: boolean) => {
                    if (
                        videoBvidFilter.isEnable ||
                        videoDurationFilter.isEnable ||
                        videoTitleFilter.isEnable ||
                        videoUploaderFilter.isEnable ||
                        videoUploaderKeywordFilter.isEnable
                    ) {
                        checkVideoList(fullSite)
                    }
                }
                check(true)
                // 监听视频列表变化
                new MutationObserver(() => {
                    check(true)
                }).observe(videoListContainer, { childList: true, subtree: true })
            }
        })
        // 视频播放结束监听
        document.addEventListener('DOMContentLoaded', watchPlayerEnding)
    } catch (err) {
        error(`watch video list error`, err)
    }

    // UI组件, 时长过滤
    const durationItems = [
        // 启用 播放页时长过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.duration.statusKey,
            description: '启用 时长过滤',
            enableFunc: () => {
                videoDurationFilter.enable()
                checkVideoList(true)
            },
            disableFunc: () => {
                videoDurationFilter.disable()
                checkVideoList(true)
            },
        }),
        // 设定最低时长
        new NumberItem({
            itemID: GM_KEYS.black.duration.valueKey,
            description: '设定最低时长 (0~300s)',
            defaultValue: 60,
            minValue: 0,
            maxValue: 300,
            disableValue: 0,
            unit: '秒',
            callback: async (value: number) => {
                videoDurationFilter.setParam(value)
                checkVideoList(true)
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(new Group('video-duration-filter-group', '播放页 时长过滤', durationItems))

    // UI组件, UP主过滤
    const uploaderItems = [
        // 启用 播放页UP主过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.black.uploader.statusKey,
            description: '启用 UP主过滤 (右键单击UP主)',
            defaultStatus: true,
            enableFunc: () => {
                // 启用右键菜单功能
                isContextMenuUploaderEnable = true
                contextMenuFunc()
                videoUploaderFilter.enable()
                checkVideoList(true)
            },
            disableFunc: () => {
                // 禁用右键菜单功能
                isContextMenuUploaderEnable = false
                videoUploaderFilter.disable()
                checkVideoList(true)
            },
        }),
        // 编辑 UP主黑名单
        new ButtonItem({
            itemID: 'video-uploader-edit-button',
            description: '编辑 UP主黑名单',
            name: '编辑',
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.uploader.valueKey,
                    'UP主 黑名单',
                    `每行一个UP主昵称，保存时自动去重`,
                    (values: string[]) => {
                        videoUploaderFilter.setParam(values)
                        checkVideoList(true)
                    },
                ).show()
            },
        }),
        // 启用 UP主昵称关键词过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.uploaderKeyword.statusKey,
            description: '启用 UP主昵称关键词过滤',
            enableFunc: () => {
                videoUploaderKeywordFilter.enable()
                checkVideoList(true)
            },
            disableFunc: () => {
                videoUploaderKeywordFilter.disable()
                checkVideoList(true)
            },
        }),
        // 编辑 UP主昵称关键词黑名单
        new ButtonItem({
            itemID: 'video-uploader-keyword-edit-button',
            description: '编辑 UP主昵称关键词黑名单',
            name: '编辑',
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.uploaderKeyword.valueKey,
                    'UP主昵称关键词 黑名单',
                    `每行一个关键词或正则，不区分大小写\n正则默认iv模式，无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        videoUploaderKeywordFilter.setParam(values)
                        checkVideoList(true)
                    },
                ).show()
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(new Group('video-uploader-filter-group', '播放页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤
    const titleItems = [
        // 启用 播放页关键词过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.title.statusKey,
            description: '启用 标题关键词过滤',
            enableFunc: () => {
                videoTitleFilter.enable()
                checkVideoList(true)
            },
            disableFunc: () => {
                videoTitleFilter.disable()
                checkVideoList(true)
            },
        }),
        // 编辑 关键词黑名单
        new ButtonItem({
            itemID: 'video-title-keyword-edit-button',
            description: '编辑 标题关键词黑名单（支持正则）',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.title.valueKey,
                    '标题关键词 黑名单',
                    `每行一个关键词或正则，不区分大小写\n正则默认iv模式，无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        videoTitleFilter.setParam(values)
                        checkVideoList(true)
                    },
                ).show()
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(
        new Group('video-title-keyword-filter-group', '播放页 标题关键词过滤', titleItems),
    )

    // UI组件, bvid过滤
    const bvidItems = [
        // 启用 播放页 BV号过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.bvid.statusKey,
            description: '启用 BV号过滤 (右键单击标题)',
            enableFunc: () => {
                // 启用 右键功能
                isContextMenuBvidEnable = true
                contextMenuFunc()
                videoBvidFilter.enable()
                checkVideoList(true)
            },
            disableFunc: () => {
                // 禁用 右键功能
                isContextMenuBvidEnable = false
                videoBvidFilter.disable()
                checkVideoList(true)
            },
        }),
        // 编辑 BV号黑名单
        new ButtonItem({
            itemID: 'video-bvid-edit-button',
            description: '编辑 BV号黑名单',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.bvid.valueKey,
                    'BV号 黑名单',
                    `每行一个BV号，保存时自动去重`,
                    (values: string[]) => {
                        videoBvidFilter.setParam(values)
                        checkVideoList(true)
                    },
                ).show()
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(new Group('video-bvid-filter-group', '播放页 BV号过滤', bvidItems))

    // UI组件, 免过滤和白名单
    const whitelistItems = [
        // 接下来播放 免过滤
        new CheckboxItem({
            itemID: GM_KEYS.white.isNext.statusKey,
            description: '接下来播放 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                isNextPlayWhitelistEnable = true
                checkVideoList(true)
            },
            disableFunc: () => {
                isNextPlayWhitelistEnable = false
                checkVideoList(true)
            },
        }),
        // 视频播放结束推荐 免过滤
        new CheckboxItem({
            itemID: GM_KEYS.white.isEnding.statusKey,
            description: '视频播放结束推荐 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                isEndingWhitelistEnable = true
                document
                    .querySelectorAll<HTMLElement>('.bpx-player-ending-related-item')
                    .forEach((e: HTMLElement) => showEle(e))
                checkVideoList(true)
            },
            disableFunc: () => {
                isEndingWhitelistEnable = false
                watchPlayerEnding()
                checkVideoList(true)
            },
        }),
        // 启用 播放页UP主白名单
        new CheckboxItem({
            itemID: GM_KEYS.white.uploader.statusKey,
            description: '启用 UP主白名单',
            enableFunc: () => {
                videoUploaderWhiteFilter.enable()
                checkVideoList(true)
            },
            disableFunc: () => {
                videoUploaderWhiteFilter.disable()
                checkVideoList(true)
            },
        }),
        // 编辑 UP主白名单
        new ButtonItem({
            itemID: 'video-uploader-whitelist-edit-button',
            description: '编辑 UP主白名单',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                new WordList(
                    GM_KEYS.white.uploader.valueKey,
                    'UP主 白名单',
                    `每行一个UP主昵称，保存时自动去重`,
                    (values: string[]) => {
                        videoUploaderWhiteFilter.setParam(values)
                        checkVideoList(true)
                    },
                ).show()
            },
        }),
        // 启用 播放页关键词白名单
        new CheckboxItem({
            itemID: GM_KEYS.white.title.statusKey,
            description: '启用 标题关键词白名单',
            enableFunc: () => {
                videoTitleWhiteFilter.enable()
                checkVideoList(true)
            },
            disableFunc: () => {
                videoTitleWhiteFilter.disable()
                checkVideoList(true)
            },
        }),
        // 编辑 关键词白名单
        new ButtonItem({
            itemID: 'video-title-keyword-whitelist-edit-button',
            description: '编辑 标题关键词白名单（支持正则）',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                new WordList(
                    GM_KEYS.white.title.valueKey,
                    '标题关键词 白名单',
                    `每行一个关键词或正则，不区分大小写\n正则默认iv模式，无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        videoTitleWhiteFilter.setParam(values)
                        checkVideoList(true)
                    },
                ).show()
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(
        new Group('video-whitelist-filter-group', '播放页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { videoPageVideoFilterGroupList }

import { GM_getValue, GM_setValue } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { CheckboxItem, NumberItem, ButtonItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import { debugVideoFilter as debug, error } from '../../utils/logger'
import { isPageSearch } from '../../utils/pageType'
import { convertTimeToSec, matchBvid, showEle, waitForEle } from '../../utils/tool'
import { SelectorResult, SubFilterPair, coreCheck } from '../core/core'
import {
    VideoBvidFilter,
    VideoDurationFilter,
    VideoTitleFilter,
    VideoUploaderFilter,
    VideoUploaderKeywordFilter,
} from './subFilters/black'
import { VideoUploaderWhiteFilter, VideoTitleWhiteFilter } from './subFilters/white'

const searchPageVideoFilterGroupList: Group[] = []

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
    let isTopWhite = false
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
            //     debug(
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
            //     debug(
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
            debug(`check ${topVideos.length} topVideos, ${contentVideos.length} contentVideos`)
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
                if (isContextMenuUploaderEnable && e.target.closest('.bili-video-card__info--owner')) {
                    // 命中UP主或日期
                    const node = e.target
                        .closest('.bili-video-card__info--owner')
                        ?.querySelector('.bili-video-card__info--author')
                    const uploader = node?.textContent?.trim()
                    if (uploader) {
                        e.preventDefault()
                        menu.registerMenu(`◎ 屏蔽UP主：${uploader}`, () => {
                            videoUploaderFilter.addParam(uploader)
                            check(true)
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
                            check(true)
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
                        menu.registerMenu(`◎ 复制主页链接`, () => {
                            const url = node?.closest('.bili-video-card__info--owner')?.getAttribute('href')
                            if (url) {
                                const matches = url.match(/space\.bilibili\.com\/\d+/g)
                                matches && navigator.clipboard.writeText(`https://${matches[0]}`)
                            }
                        })
                        menu.show(e.clientX, e.clientY)
                    }
                } else if (isContextMenuBvidEnable && e.target.closest('.bili-video-card__info--tit')) {
                    // 命中视频标题, 提取bvid
                    const href = e.target
                        .closest('.bili-video-card__info--right')
                        ?.querySelector(':scope > a')
                        ?.getAttribute('href')
                    if (href) {
                        const bvid = matchBvid(href)
                        if (bvid) {
                            e.preventDefault()
                            menu.registerMenu(`◎ 屏蔽视频 ${bvid}`, () => {
                                videoBvidFilter.addParam(bvid)
                                check(true)
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
        waitForEle(document, '.search-content', (node: HTMLElement): boolean => {
            return node.className.includes('search-content')
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

    // UI组件, 时长过滤
    const durationItems = [
        // 启用 搜索页时长过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.duration.statusKey,
            description: '启用 时长过滤',
            enableFunc: () => {
                videoDurationFilter.enable()
                check(true)
            },
            disableFunc: () => {
                videoDurationFilter.disable()
                check(true)
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
                check(true)
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(new Group('search-duration-filter-group', '搜索页 时长过滤', durationItems))

    // UI组件, UP主过滤
    const uploaderItems = [
        // 启用 搜索页UP主过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.black.uploader.statusKey,
            description: '启用 UP主过滤 (右键单击UP主)',
            defaultStatus: true,
            enableFunc: () => {
                // 启用右键菜单功能
                isContextMenuUploaderEnable = true
                contextMenuFunc()
                videoUploaderFilter.enable()
                check(true)
            },
            disableFunc: () => {
                // 禁用右键菜单功能
                isContextMenuUploaderEnable = false
                videoUploaderFilter.disable()
                check(true)
            },
        }),
        // 编辑 UP主黑名单
        new ButtonItem({
            itemID: 'search-uploader-edit-button',
            description: '编辑 UP主黑名单',
            name: '编辑',
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.uploader.valueKey,
                    'UP主 黑名单',
                    `每行一个UP主昵称，保存时自动去重`,
                    (values: string[]) => {
                        videoUploaderFilter.setParam(values)
                        check(true)
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
                check(true)
            },
            disableFunc: () => {
                videoUploaderKeywordFilter.disable()
                check(true)
            },
        }),
        // 编辑 UP主昵称关键词黑名单
        new ButtonItem({
            itemID: 'search-uploader-keyword-edit-button',
            description: '编辑 UP主昵称关键词黑名单',
            name: '编辑',
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.uploaderKeyword.valueKey,
                    'UP主昵称关键词 黑名单',
                    `每行一个关键词或正则，不区分大小写\n正则默认iu模式，无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        videoUploaderKeywordFilter.setParam(values)
                        check(true)
                    },
                ).show()
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(new Group('search-uploader-filter-group', '搜索页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤
    const titleItems = [
        // 启用 搜索页关键词过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.title.statusKey,
            description: '启用 标题关键词过滤',
            enableFunc: () => {
                videoTitleFilter.enable()
                check(true)
            },
            disableFunc: () => {
                videoTitleFilter.disable()
                check(true)
            },
        }),
        // 编辑 关键词黑名单
        new ButtonItem({
            itemID: 'search-title-keyword-edit-button',
            description: '编辑 标题关键词黑名单（支持正则）',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.title.valueKey,
                    '标题关键词 黑名单',
                    `每行一个关键词或正则，不区分大小写\n正则默认iu模式，无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        videoTitleFilter.setParam(values)
                        check(true)
                    },
                ).show()
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(
        new Group('search-title-keyword-filter-group', '搜索页 标题关键词过滤', titleItems),
    )

    // UI组件, bvid过滤
    const bvidItems = [
        // 启用 搜索页 BV号过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.bvid.statusKey,
            description: '启用 BV号过滤 (右键单击标题)',
            enableFunc: () => {
                // 启用 右键功能
                isContextMenuBvidEnable = true
                contextMenuFunc()
                videoBvidFilter.enable()
                check(true)
            },
            disableFunc: () => {
                // 禁用 右键功能
                isContextMenuBvidEnable = false
                videoBvidFilter.disable()
                check(true)
            },
        }),
        // 编辑 BV号黑名单
        new ButtonItem({
            itemID: 'search-bvid-edit-button',
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
                        check(true)
                    },
                ).show()
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(new Group('search-bvid-filter-group', '搜索页 BV号过滤', bvidItems))

    // UI组件, 免过滤和白名单
    const whitelistItems = [
        // 搜索结果顶部UP主视频免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isTop.statusKey,
            description: '搜索结果顶部UP主视频免过滤',
            defaultStatus: true,
            enableFunc: () => {
                isTopWhite = true
                // 触发全站检测
                check(true)
            },
            disableFunc: () => {
                isTopWhite = false
                check(true)
            },
        }),
        // 启用 UP主白名单
        new CheckboxItem({
            itemID: GM_KEYS.white.uploader.statusKey,
            description: '启用 UP主白名单',
            enableFunc: () => {
                videoUploaderWhiteFilter.enable()
                check(true)
            },
            disableFunc: () => {
                videoUploaderWhiteFilter.disable()
                check(true)
            },
        }),
        // 编辑 UP主白名单
        new ButtonItem({
            itemID: 'search-uploader-whitelist-edit-button',
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
                        check(true)
                    },
                ).show()
            },
        }),
        // 启用 标题关键词白名单
        new CheckboxItem({
            itemID: GM_KEYS.white.title.statusKey,
            description: '启用 标题关键词白名单',
            enableFunc: () => {
                videoTitleWhiteFilter.enable()
                check(true)
            },
            disableFunc: () => {
                videoTitleWhiteFilter.disable()
                check(true)
            },
        }),
        // 编辑 关键词白名单
        new ButtonItem({
            itemID: 'search-title-keyword-whitelist-edit-button',
            description: '编辑 标题关键词白名单（支持正则）',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                new WordList(
                    GM_KEYS.white.title.valueKey,
                    '标题关键词 白名单',
                    `每行一个关键词或正则，不区分大小写\n正则默认iu模式，无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        videoTitleWhiteFilter.setParam(values)
                        check(true)
                    },
                ).show()
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(
        new Group('search-whitelist-filter-group', '搜索页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { searchPageVideoFilterGroupList }

import { GM_getValue, GM_setValue } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { CheckboxItem, NumberItem, ButtonItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import settings from '../../settings'
import { error } from '../../utils/logger'
import { isPageChannel } from '../../utils/pageType'
import { convertTimeToSec, matchBvid, waitForEle } from '../../utils/tool'
import { SelectorResult, SubFilterPair, coreCheck } from '../core/core'
import {
    VideoBvidFilter,
    VideoDurationFilter,
    VideoTitleFilter,
    VideoUploaderFilter,
    VideoUploaderKeywordFilter,
} from './subFilters/black'
import { VideoUploaderWhiteFilter, VideoTitleWhiteFilter } from './subFilters/white'

const channelPageVideoFilterGroupList: Group[] = []

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
    const checkVideoList = (fullSite: boolean) => {
        if (!vlc) {
            return
        }
        try {
            // 提取元素
            let feedVideos: HTMLElement[] = []
            if (!fullSite) {
                // 选取增量
                feedVideos = Array.from(
                    vlc.querySelectorAll<HTMLElement>(
                        `.bili-grid .video-card-body .bili-video-card:not([${settings.filterSign}]),
                        .feed-card-body .bili-video-card:not([${settings.filterSign}])`,
                    ),
                )
            } else {
                // 选取全站, 含已过滤
                feedVideos = Array.from(
                    vlc.querySelectorAll<HTMLElement>(
                        `.bili-grid .video-card-body .bili-video-card,
                        .feed-card-body .bili-video-card`,
                    ),
                )
            }

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
            feedVideos.length && coreCheck(feedVideos, true, blackPairs, whitePairs)
            console.log(`check ${feedVideos.length} feedVideos`)
        } catch (err) {
            error('checkVideoList error', err)
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
                // debug(e.target.classList)
                if (isContextMenuUploaderEnable && e.target.closest('.bili-video-card__info--owner')) {
                    // 命中UP主或日期
                    const node = e.target
                        .closest('.bili-video-card__info--owner')
                        ?.querySelector('.bili-video-card__info--author')
                    const uploader = node?.textContent
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
                        menu.registerMenu(`◎ 复制主页链接`, () => {
                            const url = node.closest('.bili-video-card__info--owner')?.getAttribute('href')
                            if (url) {
                                const matches = url.match(/space\.bilibili\.com\/\d+/g)
                                matches && navigator.clipboard.writeText(`https://${matches[0]}`)
                            }
                        })
                        menu.show(e.clientX, e.clientY)
                    }
                } else if (
                    isContextMenuBvidEnable &&
                    e.target.parentElement?.classList.contains('bili-video-card__info--tit')
                ) {
                    // 命中视频标题, 提取bvid
                    const node = e.target.parentElement
                    const href = node.querySelector(':scope > a')?.getAttribute('href')
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
        waitForEle(document, 'main.channel-layout', (node: HTMLElement): boolean => {
            return node.className === 'channel-layout'
        }).then((ele) => {
            if (ele) {
                vlc = ele
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
                    check(false)
                }).observe(vlc, { childList: true, subtree: true })
            }
        })
    } catch (err) {
        error(`watch video list error`, err)
    }

    // UI组件, 时长过滤
    const durationItems = [
        // 启用 频道页时长过滤
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
    channelPageVideoFilterGroupList.push(new Group('channel-duration-filter-group', '频道页 时长过滤', durationItems))

    // UI组件, UP主过滤
    const uploaderItems = [
        // 启用 频道页UP主过滤, 默认开启
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
            itemID: 'channel-uploader-edit-button',
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
            itemID: 'channel-uploader-keyword-edit-button',
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
    channelPageVideoFilterGroupList.push(new Group('channel-uploader-filter-group', '频道页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤
    const titleItems = [
        // 启用 频道页关键词过滤
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
            itemID: 'channel-title-keyword-edit-button',
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
    channelPageVideoFilterGroupList.push(
        new Group('channel-title-keyword-filter-group', '频道页 标题关键词过滤', titleItems),
    )

    // UI组件, bvid过滤
    const bvidItems = [
        // 启用 频道页 BV号过滤
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
            itemID: 'channel-bvid-edit-button',
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
    channelPageVideoFilterGroupList.push(new Group('channel-bvid-filter-group', '频道页 BV号过滤', bvidItems))

    // UI组件, 免过滤和白名单
    const whitelistItems = [
        // 启用 UP主白名单
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
            itemID: 'channel-uploader-whitelist-edit-button',
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
        // 启用 标题关键词白名单
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
            itemID: 'channel-title-keyword-whitelist-edit-button',
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
    channelPageVideoFilterGroupList.push(
        new Group('channel-whitelist-filter-group', '频道页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { channelPageVideoFilterGroupList }

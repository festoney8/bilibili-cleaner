import { GM_getValue, GM_setValue } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { CheckboxItem, NumberItem, ButtonItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import settings from '../../settings'
import { debugVideoFilter as debug, error } from '../../utils/logger'
import { isPageHomepage } from '../../utils/pageType'
import { convertDateToDays, convertTimeToSec, matchBvid, waitForEle } from '../../utils/tool'
import { SelectorResult, SubFilterPair, coreCheck } from '../core/core'
import {
    VideoBvidFilter,
    VideoDurationFilter,
    VideoPubdateFilter,
    VideoTitleFilter,
    VideoUploaderFilter,
    VideoUploaderKeywordFilter,
} from './subFilters/black'
import { VideoUploaderWhiteFilter, VideoTitleWhiteFilter, VideoIsFollowWhiteFilter } from './subFilters/white'

const homepagePageVideoFilterGroupList: Group[] = []

const GM_KEYS = {
    black: {
        duration: {
            statusKey: 'homepage-duration-filter-status',
            valueKey: 'global-duration-filter-value',
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

if (isPageHomepage()) {
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

    const videoIsFollowWhiteFilter = new VideoIsFollowWhiteFilter()

    // 视频列表信息提取
    const selectorFns = {
        duration: (video: HTMLElement): SelectorResult => {
            const duration = video.querySelector('.bili-video-card__stats__duration')?.textContent?.trim()
            return duration && convertTimeToSec(duration)
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

    let vlc: HTMLElement // video list container

    // 检测视频列表
    const checkVideoList = async (fullSite: boolean) => {
        if (!vlc) {
            return
        }
        try {
            // 提取元素
            let feedVideos: HTMLElement[]
            let rcmdVideos: HTMLElement[]

            if (!fullSite) {
                // 增量选取
                // feed: 10个顶部推荐位, 不含已过滤
                feedVideos = Array.from(
                    vlc.querySelectorAll<HTMLElement>(
                        `:scope > .feed-card:not([${settings.filterSign}]):has(.bili-video-card__wrap)`,
                    ),
                )
                // rcmd: 瀑布推荐流, 不含feed, 不含已过滤, 不含未载入
                rcmdVideos = Array.from(
                    vlc.querySelectorAll<HTMLElement>(
                        `:scope > .bili-video-card:not([${settings.filterSign}]):has(.bili-video-card__wrap)`,
                    ),
                )
            } else {
                // 选取全站, 含已过滤的
                feedVideos = Array.from(
                    vlc.querySelectorAll<HTMLElement>(`:scope > .feed-card:has(.bili-video-card__wrap)`),
                )
                rcmdVideos = Array.from(
                    vlc.querySelectorAll<HTMLElement>(`:scope > .bili-video-card:has(.bili-video-card__wrap)`),
                )
            }

            // feedVideos.forEach((v) => {
            //     debug(
            //         [
            //             `feedVideos`,
            //             `bvid: ${selectorFns.bvid(v)}`,
            //             `duration: ${selectorFns.duration(v)}`,
            //             `title: ${selectorFns.title(v)}`,
            //             `uploader: ${selectorFns.uploader(v)}`,
            //             `pubdate: ${selectorFns.pubdate(v)}`,
            //             `isFollow: ${selectorFns.isFollow(v)}`,
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
            //             `pubdate: ${selectorFns.pubdate(v)}`,
            //             `isFollow: ${selectorFns.isFollow(v)}`,
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
            videoIsFollowWhiteFilter.isEnable && whitePairs.push([videoIsFollowWhiteFilter, selectorFns.isFollow])

            // 检测
            feedVideos.length && (await coreCheck(feedVideos, true, blackPairs, whitePairs))
            rcmdVideos.length && (await coreCheck(rcmdVideos, true, blackPairs, whitePairs))
            debug(`check ${feedVideos.length} feedVideos, ${rcmdVideos.length} rcmdVideos`)
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
                // debug(e.target.classList)
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
        waitForEle(document, '.container', (node: HTMLElement): boolean => {
            return node.classList.contains('container')
        }).then((ele) => {
            if (ele) {
                vlc = ele
                check(true)
                // 监听视频列表变化
                new MutationObserver(() => {
                    check(false)
                }).observe(vlc, { childList: true })
            }
        })
    } catch (err) {
        error(`watch video list error`, err)
    }

    // UI组件, 时长过滤
    const durationItems = [
        // 启用 首页时长过滤
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
    homepagePageVideoFilterGroupList.push(new Group('homepage-duration-filter-group', '首页 时长过滤', durationItems))

    // UI组件, UP主过滤
    const uploaderItems = [
        // 启用 首页UP主过滤, 默认开启
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
            itemID: 'homepage-uploader-edit-button',
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
            itemID: 'homepage-uploader-keyword-edit-button',
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
    homepagePageVideoFilterGroupList.push(new Group('homepage-uploader-filter-group', '首页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤
    const titleItems = [
        // 启用 首页关键词过滤
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
            itemID: 'homepage-title-keyword-edit-button',
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
    homepagePageVideoFilterGroupList.push(
        new Group('homepage-title-keyword-filter-group', '首页 标题关键词过滤', titleItems),
    )

    // UI组件, bvid过滤
    const bvidItems = [
        // 启用 首页 BV号过滤
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
            itemID: 'homepage-bvid-edit-button',
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
    homepagePageVideoFilterGroupList.push(new Group('homepage-bvid-filter-group', '首页 BV号过滤', bvidItems))

    // UI组件, 发布日期过滤
    const pubdateItems = [
        // 启用 发布日期过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.pubdate.statusKey,
            description: '启用 发布日期过滤',
            enableFunc: () => {
                videoPubdateFilter.enable()
                check(true)
            },
            disableFunc: () => {
                videoPubdateFilter.disable()
                check(true)
            },
        }),
        // 设定发布日期阈值
        new NumberItem({
            itemID: GM_KEYS.black.pubdate.valueKey,
            description: '视频发布日 距今不超过',
            defaultValue: 60,
            minValue: 1,
            maxValue: 365,
            disableValue: 1,
            unit: '天',
            callback: async (value: number) => {
                videoPubdateFilter.setParam(value)
                check(true)
            },
        }),
    ]
    homepagePageVideoFilterGroupList.push(new Group('homepage-pubdate-filter-group', '首页 发布日期过滤', pubdateItems))

    // UI组件, 免过滤和白名单
    const whitelistItems = [
        // 标有 [已关注] 的视频免过滤
        new CheckboxItem({
            itemID: GM_KEYS.white.isFollow.statusKey,
            description: '标有 [已关注] 的视频免过滤',
            defaultStatus: true,
            enableFunc: () => {
                videoIsFollowWhiteFilter.enable()
                check(true)
            },
            disableFunc: () => {
                videoIsFollowWhiteFilter.disable()
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
            itemID: 'homepage-uploader-whitelist-edit-button',
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
            itemID: 'homepage-title-keyword-whitelist-edit-button',
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
    homepagePageVideoFilterGroupList.push(
        new Group('homepage-whitelist-filter-group', '首页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { homepagePageVideoFilterGroupList }

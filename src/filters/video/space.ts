import { GM_getValue, GM_setValue } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { CheckboxItem, NumberItem, ButtonItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import { debugVideoFilter as debug, error } from '../../utils/logger'
import { isPageSpace } from '../../utils/pageType'
import { convertTimeToSec, matchBvid, waitForEle } from '../../utils/tool'
import { SelectorResult, SubFilterPair, coreCheck } from '../core/core'
import { VideoBvidFilter, VideoDurationFilter, VideoTitleFilter } from './subFilters/black'
import { VideoTitleWhiteFilter } from './subFilters/white'

const spacePageVideoFilterGroupList: Group[] = []

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
            //     debug(
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
                debug(`check ${videos.length} videos`)
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

    // 右键监听, 屏蔽UP主
    let isContextMenuFuncRunning = false
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
                if (isContextMenuBvidEnable && e.target.classList.contains('title')) {
                    // 命中视频标题, 提取bvid
                    const href = e.target.getAttribute('href')
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

    // UI组件, 时长过滤
    const durationItems = [
        // 启用 分区页时长过滤
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
    spacePageVideoFilterGroupList.push(new Group('space-duration-filter-group', '分区页 时长过滤', durationItems))

    // UI组件, 标题关键词过滤
    const titleItems = [
        // 启用 分区页关键词过滤
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
            itemID: 'space-title-keyword-edit-button',
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
    spacePageVideoFilterGroupList.push(
        new Group('space-title-keyword-filter-group', '分区页 标题关键词过滤', titleItems),
    )

    // UI组件, bvid过滤
    const bvidItems = [
        // 启用 分区页 BV号过滤
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
            itemID: 'space-bvid-edit-button',
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
    spacePageVideoFilterGroupList.push(new Group('space-bvid-filter-group', '分区页 BV号过滤', bvidItems))

    // UI组件, 免过滤和白名单
    const whitelistItems = [
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
            itemID: 'space-title-keyword-whitelist-edit-button',
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
    spacePageVideoFilterGroupList.push(
        new Group('space-whitelist-filter-group', '分区页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { spacePageVideoFilterGroupList }

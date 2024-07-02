import { debugVideoFilter as debug, error } from '../../../utils/logger'
import coreFilterInstance, { VideoSelectorFunc } from '../filters/core'
import { ButtonItem, CheckboxItem, NumberItem } from '../../../components/item'
import { Group } from '../../../components/group'
import { isPagePlaylist, isPageVideo } from '../../../utils/pageType'
import { hideEle, isEleHide, matchBvid, showEle, waitForEle } from '../../../utils/tool'
import {
    BvidAction,
    DurationAction,
    TitleKeywordAction,
    TitleKeywordWhitelistAction,
    UploaderAction,
    UploaderKeywordAction,
    UploaderWhitelistAction,
} from './actions/action'
import { ContextMenu } from '../../../components/contextmenu'

const videoPageVideoFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false
// 接下来播放是否免过滤
let isNextPlayWhitelistEnable = true
// 视频结束后播放器内推荐是否免过滤
let isEndingWhitelistEnable = true
if (isPageVideo() || isPagePlaylist()) {
    let videoListContainer: HTMLElement
    // 构建SelectorFunc
    const rcmdSelectorFunc: VideoSelectorFunc = {
        duration: (video: Element): string | null => {
            const duration = video.querySelector('.pic-box span.duration')?.textContent
            return duration ? duration : null
        },
        titleKeyword: (video: Element): string | null => {
            const titleKeyword =
                video.querySelector('.info > a p')?.getAttribute('title') ||
                video.querySelector('.info > a p')?.textContent
            return titleKeyword ? titleKeyword : null
        },
        bvid: (video: Element): string | null => {
            const href =
                video.querySelector('.info > a')?.getAttribute('href') ||
                video.querySelector('.pic-box .framepreview-box > a')?.getAttribute('href')
            if (href) {
                return matchBvid(href)
            }
            return null
        },
        uploader: (video: Element): string | null => {
            const uploader = video.querySelector('.info > .upname .name')?.textContent?.trim()
            return uploader ? uploader : null
        },
    }
    const nextSelectorFunc = rcmdSelectorFunc
    // 检测视频列表
    const checkVideoList = (_fullSite: boolean) => {
        if (!videoListContainer) {
            debug(`checkVideoList videoListContainer not exist`)
            return
        }
        try {
            // 接下来播放
            const nextVideos = videoListContainer.querySelectorAll<HTMLElement>(
                `.next-play .video-page-card-small, .next-play .video-page-operator-card-small`,
            )
            // 推荐列表
            const rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(
                `.rec-list .video-page-card-small, .rec-list .video-page-operator-card-small, .recommend-video-card`,
            )

            // 判断是否筛选接下来播放
            rcmdVideos.length && coreFilterInstance.checkAll([...rcmdVideos], false, rcmdSelectorFunc)
            // debug(`checkVideoList check ${rcmdVideos.length} rcmd videos`)
            if (isNextPlayWhitelistEnable) {
                // 清除隐藏状态
                nextVideos.forEach((video) => showEle(video))
            } else {
                nextVideos.length && coreFilterInstance.checkAll([...nextVideos], false, nextSelectorFunc)
                // debug(`checkVideoList check ${nextVideos.length} next videos`)
            }
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }

    // 配置 行为实例
    const videoDurationAction = new DurationAction(
        'video-duration-filter-status',
        'global-duration-filter-value',
        checkVideoList,
    )
    const videoUploaderAction = new UploaderAction(
        'video-uploader-filter-status',
        'global-uploader-filter-value',
        checkVideoList,
    )
    const videoUploaderKeywordAction = new UploaderKeywordAction(
        'video-uploader-keyword-filter-status',
        'global-uploader-keyword-filter-value',
        checkVideoList,
    )
    const videoBvidAction = new BvidAction('video-bvid-filter-status', 'global-bvid-filter-value', checkVideoList)
    const videoTitleKeywordAction = new TitleKeywordAction(
        'video-title-keyword-filter-status',
        'global-title-keyword-filter-value',
        checkVideoList,
    )
    const videoUploaderWhitelistAction = new UploaderWhitelistAction(
        'video-uploader-whitelist-filter-status',
        'global-uploader-whitelist-filter-value',
        checkVideoList,
    )
    const videoTitleKeywordWhitelistAction = new TitleKeywordWhitelistAction(
        'video-title-keyword-whitelist-filter-status',
        'global-title-keyword-whitelist-filter-value',
        checkVideoList,
    )

    // 监听视频列表内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        const check = async (fullSite: boolean) => {
            if (
                videoDurationAction.status ||
                videoUploaderAction.status ||
                videoUploaderKeywordAction.status ||
                videoBvidAction.status ||
                videoTitleKeywordAction.status
            ) {
                checkVideoList(fullSite)
            }
        }
        if (videoListContainer) {
            check(true).then().catch()
            const videoObserver = new MutationObserver(() => {
                // 播放页右栏载入慢, 始终做全站检测
                check(true).then().catch()
            })
            videoObserver.observe(videoListContainer, { childList: true, subtree: true })
            debug('watchVideoListContainer OK')
        }
    }

    // 视频结束后筛选播放器内视频
    const watchPlayerEnding = () => {
        if (isEndingWhitelistEnable) {
            return
        }
        const video = document.querySelector('video')
        if (!video) {
            return
        }
        const check = () => {
            const rightList = document.querySelectorAll<HTMLElement>(`.next-play .video-page-card-small,
            .next-play .video-page-operator-card-small,
            .rec-list .video-page-card-small,
            .rec-list .video-page-operator-card-small,
            .recommend-video-card`)
            const blacklistVideoTitle = new Set<string>()
            rightList.forEach((video: HTMLElement) => {
                if (isEleHide(video)) {
                    const title =
                        video.querySelector('.info > a p')?.getAttribute('title') ||
                        video.querySelector('.info > a p')?.textContent
                    title && blacklistVideoTitle.add(title)
                }
            })
            let cnt = 0
            const endingInterval = setInterval(() => {
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
                    clearInterval(endingInterval)
                } else {
                    cnt++
                    if (cnt > 100) {
                        clearInterval(endingInterval)
                    }
                }
            }, 10)
        }
        video.ended ? check() : video.addEventListener('ended', check)
    }

    try {
        // 监听视频列表出现
        waitForEle(document, '#reco_list, .recommend-list-container', (node: HTMLElement): boolean => {
            return node.id === 'reco_list' || node.className === 'recommend-list-container'
        }).then((ele) => {
            if (ele) {
                videoListContainer = ele
                watchVideoListContainer()
            }
        })
        // 监听视频播放结束，筛选播放器内视频推荐
        document.addEventListener('DOMContentLoaded', watchPlayerEnding)
    } catch (err) {
        error(err)
        error(`watch video list ERROR`)
    }

    //=======================================================================================

    // 右键监听函数, 播放页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
    const contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        const menu = new ContextMenu()
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            menu.hide()
            if (e.target instanceof HTMLElement) {
                // debug(e.target.classList)
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
                            videoUploaderAction.add(uploader)
                        })
                        menu.registerMenu(`◎ 将UP主加入白名单`, () => {
                            videoUploaderWhitelistAction.add(uploader)
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
                                videoBvidAction.add(bvid)
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
        debug('contextMenuFunc listen contextmenu')
    }

    //=======================================================================================
    // 构建UI菜单

    // UI组件, 时长过滤part
    const durationItems = [
        // 启用 播放页时长过滤
        new CheckboxItem({
            itemID: videoDurationAction.statusKey,
            description: '启用 时长过滤',
            enableFunc: async () => {
                videoDurationAction.enable()
            },
            disableFunc: async () => {
                videoDurationAction.disable()
            },
        }),
        // 设定最低时长
        new NumberItem({
            itemID: videoDurationAction.valueKey,
            description: '设定最低时长 (0~300s)',
            defaultValue: 60,
            minValue: 0,
            maxValue: 300,
            disableValue: 0,
            unit: '秒',
            callback: async (value: number) => {
                videoDurationAction.change(value)
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(new Group('video-duration-filter-group', '播放页 时长过滤', durationItems))

    // UI组件, UP主过滤part
    const uploaderItems = [
        // 启用 播放页UP主过滤
        new CheckboxItem({
            itemID: videoUploaderAction.statusKey,
            description: '启用 UP主过滤 (右键单击UP主)',
            enableFunc: async () => {
                // 启用右键菜单功能
                isContextMenuUploaderEnable = true
                contextMenuFunc()
                videoUploaderAction.enable()
            },
            disableFunc: async () => {
                // 禁用右键菜单功能
                isContextMenuUploaderEnable = false
                videoUploaderAction.disable()
            },
        }),
        // 编辑 UP主黑名单
        new ButtonItem({
            itemID: 'video-uploader-edit-button',
            description: '编辑 UP主黑名单',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: async () => {
                videoUploaderAction.blacklist.show()
            },
        }),
        // 启用 UP主昵称关键词过滤
        new CheckboxItem({
            itemID: videoUploaderKeywordAction.statusKey,
            description: '启用 UP主昵称关键词过滤',
            enableFunc: async () => {
                videoUploaderKeywordAction.enable()
            },
            disableFunc: async () => {
                videoUploaderKeywordAction.disable()
            },
        }),
        // 编辑 UP主昵称关键词黑名单
        new ButtonItem({
            itemID: 'video-uploader-keyword-edit-button',
            description: '编辑 UP主昵称关键词黑名单',
            name: '编辑',
            itemFunc: async () => {
                videoUploaderKeywordAction.blacklist.show()
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(new Group('video-uploader-filter-group', '播放页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤part
    const titleKeywordItems = [
        // 启用 播放页关键词过滤
        new CheckboxItem({
            itemID: videoTitleKeywordAction.statusKey,
            description: '启用 标题关键词过滤',
            enableFunc: async () => {
                videoTitleKeywordAction.enable()
            },
            disableFunc: async () => {
                videoTitleKeywordAction.disable()
            },
        }),
        // 编辑 关键词黑名单
        new ButtonItem({
            itemID: 'video-title-keyword-edit-button',
            description: '编辑 标题关键词黑名单（支持正则）',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: async () => {
                videoTitleKeywordAction.blacklist.show()
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(
        new Group('video-title-keyword-filter-group', '播放页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤part
    const bvidItems = [
        // 启用 播放页 BV号过滤
        new CheckboxItem({
            itemID: videoBvidAction.statusKey,
            description: '启用 BV号过滤 (右键单击标题)',
            enableFunc: async () => {
                // 启用 右键功能
                isContextMenuBvidEnable = true
                contextMenuFunc()
                videoBvidAction.enable()
            },
            disableFunc: async () => {
                // 禁用 右键功能
                isContextMenuBvidEnable = false
                videoBvidAction.disable()
            },
        }),
        // 编辑 BV号黑名单
        new ButtonItem({
            itemID: 'video-bvid-edit-button',
            description: '编辑 BV号黑名单',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: async () => {
                videoBvidAction.blacklist.show()
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(new Group('video-bvid-filter-group', '播放页 BV号过滤', bvidItems))

    // UI组件, 免过滤和白名单part
    const whitelistItems = [
        // 接下来播放 免过滤
        new CheckboxItem({
            itemID: 'video-next-play-whitelist-filter-status',
            description: '接下来播放 免过滤',
            defaultStatus: true,
            enableFunc: async () => {
                isNextPlayWhitelistEnable = true
                checkVideoList(true)
            },
            disableFunc: async () => {
                isNextPlayWhitelistEnable = false
                checkVideoList(true)
            },
        }),
        // 视频播放结束推荐 免过滤
        new CheckboxItem({
            itemID: 'video-ending-whitelist-filter-status',
            description: '视频播放结束推荐 免过滤',
            defaultStatus: true,
            enableFunc: async () => {
                isEndingWhitelistEnable = true
                document
                    .querySelectorAll<HTMLElement>('.bpx-player-ending-related-item')
                    .forEach((e: HTMLElement) => showEle(e))
            },
            disableFunc: async () => {
                isEndingWhitelistEnable = false
                watchPlayerEnding()
            },
        }),
        // 启用 播放页UP主白名单
        new CheckboxItem({
            itemID: videoUploaderWhitelistAction.statusKey,
            description: '启用 UP主白名单',
            enableFunc: async () => {
                videoUploaderWhitelistAction.enable()
            },
            disableFunc: async () => {
                videoUploaderWhitelistAction.disable()
            },
        }),
        // 编辑 UP主白名单
        new ButtonItem({
            itemID: 'video-uploader-whitelist-edit-button',
            description: '编辑 UP主白名单',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: async () => {
                videoUploaderWhitelistAction.whitelist.show()
            },
        }),
        // 启用 播放页关键词白名单
        new CheckboxItem({
            itemID: videoTitleKeywordWhitelistAction.statusKey,
            description: '启用 标题关键词白名单',
            enableFunc: async () => {
                videoTitleKeywordWhitelistAction.enable()
            },
            disableFunc: async () => {
                videoTitleKeywordWhitelistAction.disable()
            },
        }),
        // 编辑 关键词白名单
        new ButtonItem({
            itemID: 'video-title-keyword-whitelist-edit-button',
            description: '编辑 标题关键词白名单（支持正则）',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: async () => {
                videoTitleKeywordWhitelistAction.whitelist.show()
            },
        }),
    ]
    videoPageVideoFilterGroupList.push(
        new Group('video-whitelist-filter-group', '播放页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { videoPageVideoFilterGroupList }

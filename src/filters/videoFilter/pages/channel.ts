import { debugVideoFilter as debug, error } from '../../../utils/logger'
import { ButtonItem, CheckboxItem, NumberItem } from '../../../components/item'
import { Group } from '../../../components/group'
import coreFilterInstance, { VideoSelectorFunc } from '../filters/core'
import settings from '../../../settings'
import { isPageChannel } from '../../../utils/page-type'
import { matchBvid, waitForEle } from '../../../utils/tool'
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

const channelPageVideoFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false

if (isPageChannel()) {
    let videoListContainer: HTMLElement
    // 构建SelectorFunc
    const feedSelectorFunc: VideoSelectorFunc = {
        duration: (video: Element): string | null => {
            const duration = video.querySelector('span.bili-video-card__stats__duration')?.textContent
            return duration ? duration : null
        },
        titleKeyword: (video: Element): string | null => {
            const titleKeyword =
                video.querySelector('h3.bili-video-card__info--tit')?.getAttribute('title') ||
                video.querySelector('h3.bili-video-card__info--tit a')?.textContent
            return titleKeyword ? titleKeyword : null
        },
        bvid: (video: Element): string | null => {
            const href =
                video.querySelector('h3.bili-video-card__info--tit a')?.getAttribute('href') ||
                video.querySelector('a.bili-video-card__image--link')?.getAttribute('href')
            return href ? matchBvid(href) : null
        },
        uploader: (video: Element): string | null => {
            const uploader = video.querySelector('span.bili-video-card__info--author')?.textContent
            return uploader ? uploader : null
        },
    }
    // 检测视频列表
    const checkVideoList = (fullSite: boolean) => {
        // debug('checkVideoList start')
        if (!videoListContainer) {
            // 在container未出现时, 各项屏蔽功能enable会调用checkVideoList, 需要判空
            debug(`checkVideoList videoListContainer not exist`)
            return
        }
        try {
            let feedVideos: HTMLElement[]
            if (!fullSite) {
                // 选取增量
                feedVideos = [
                    ...videoListContainer.querySelectorAll<HTMLElement>(
                        `.bili-grid .video-card-body .bili-video-card:not([${settings.filterSign}]),
                        .feed-card-body .bili-video-card:not([${settings.filterSign}])`,
                    ),
                ]
            } else {
                // 选取全站, 含已过滤
                feedVideos = [
                    ...videoListContainer.querySelectorAll<HTMLElement>(
                        `.bili-grid .video-card-body .bili-video-card,
                        .feed-card-body .bili-video-card`,
                    ),
                ]
            }

            feedVideos.length && coreFilterInstance.checkAll(feedVideos, true, feedSelectorFunc)
            // debug(`checkVideoList check ${feedVideos.length} feed videos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }

    // 初始化 行为实例
    const channelDurationAction = new DurationAction(
        'channel-duration-filter-status',
        'global-duration-filter-value',
        checkVideoList,
    )
    const channelUploaderAction = new UploaderAction(
        'channel-uploader-filter-status',
        'global-uploader-filter-value',
        checkVideoList,
    )
    const channelUploaderKeywordAction = new UploaderKeywordAction(
        'channel-uploader-keyword-filter-status',
        'global-uploader-keyword-filter-value',
        checkVideoList,
    )
    const channelBvidAction = new BvidAction('channel-bvid-filter-status', 'global-bvid-filter-value', checkVideoList)
    const channelTitleKeywordAction = new TitleKeywordAction(
        'channel-title-keyword-filter-status',
        'global-title-keyword-filter-value',
        checkVideoList,
    )
    const channelUploaderWhitelistAction = new UploaderWhitelistAction(
        'channel-uploader-whitelist-filter-status',
        'global-uploader-whitelist-filter-value',
        checkVideoList,
    )
    const channelTitleKeyworldWhitelistAction = new TitleKeywordWhitelistAction(
        'channel-title-keyword-whitelist-filter-status',
        'global-title-keyword-whitelist-filter-value',
        checkVideoList,
    )

    // 监听视频列表内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        const check = async (fillSite: boolean) => {
            if (
                channelDurationAction.status ||
                channelUploaderAction.status ||
                channelUploaderKeywordAction.status ||
                channelBvidAction.status ||
                channelTitleKeywordAction.status
            ) {
                checkVideoList(fillSite)
            }
        }
        if (videoListContainer) {
            // 初次全站检测
            check(true)
            const videoObverser = new MutationObserver(() => {
                // 增量检测
                check(false)
            })
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debug('watchVideoListContainer OK')
        }
    }
    try {
        // 监听视频列表出现
        waitForEle(document, 'main.channel-layout', (node: HTMLElement): boolean => {
            return node.className === 'channel-layout'
        }).then((ele) => {
            if (ele) {
                videoListContainer = ele
                watchVideoListContainer()
            }
        })
    } catch (err) {
        error(err)
        error(`watch video list ERROR`)
    }

    //=======================================================================================

    // 右键监听函数, 频道页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
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
                if (isContextMenuUploaderEnable && e.target.closest('.bili-video-card__info--owner')) {
                    // 命中UP主或日期
                    const node = e.target
                        .closest('.bili-video-card__info--owner')
                        ?.querySelector('.bili-video-card__info--author')
                    const uploader = node?.textContent
                    if (uploader) {
                        e.preventDefault()
                        menu.registerMenu(`◎ 屏蔽UP主：${uploader}`, () => {
                            channelUploaderAction.add(uploader)
                        })
                        menu.registerMenu(`◎ 将UP主加入白名单`, () => {
                            channelUploaderWhitelistAction.add(uploader)
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
                                channelBvidAction.add(bvid)
                            })
                            menu.registerMenu(`◎ 复制视频链接`, () => {
                                navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`)
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

    // UI组件, 时长过滤
    const durationItems = [
        // 启用 频道页时长过滤
        new CheckboxItem({
            itemID: channelDurationAction.statusKey,
            description: '启用 时长过滤',
            /**
             * 需使用匿名函数包装后传参, 否则报错, 下同
             *
             * GPT4(对错未知):
             * 当把一个类的方法作为回调函数直接传递给另一个函数时，
             * 那个方法会失去它的上下文（也就是它的 this 值），因为它被调用的方式改变了。
             * 在这种情况下，this 可能会变成 undefined（严格模式）或全局对象（非严格模式）
             *
             * 可以在传递方法时使用箭头函数来保持 this 的上下文
             */
            itemFunc: () => {
                channelDurationAction.enable()
            },
            callback: () => {
                channelDurationAction.disable()
            },
        }),
        // 设定最低时长
        new NumberItem({
            itemID: channelDurationAction.valueKey,
            description: '设定最低时长 (0~300s)',
            defaultValue: 60,
            minValue: 0,
            maxValue: 300,
            disableValue: 0,
            unit: '秒',
            callback: (value: number) => {
                channelDurationAction.change(value)
            },
        }),
    ]
    channelPageVideoFilterGroupList.push(new Group('channel-duration-filter-group', '频道页 时长过滤', durationItems))

    // UI组件, UP主过滤
    const uploaderItems = [
        // 启用 UP主过滤
        new CheckboxItem({
            itemID: channelUploaderAction.statusKey,
            description: '启用 UP主过滤 (右键单击UP主)',
            itemFunc: () => {
                // 启用右键功能
                isContextMenuUploaderEnable = true
                contextMenuFunc()
                channelUploaderAction.enable()
            },
            callback: () => {
                // 禁用右键功能
                isContextMenuUploaderEnable = false
                channelUploaderAction.disable()
            },
        }),
        // 编辑 UP主黑名单
        new ButtonItem({
            itemID: 'channel-uploader-edit-button',
            description: '编辑 UP主黑名单',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                channelUploaderAction.blacklist.show()
            },
        }),
        // 启用 UP主昵称关键词过滤
        new CheckboxItem({
            itemID: channelUploaderKeywordAction.statusKey,
            description: '启用 UP主昵称关键词过滤',
            itemFunc: () => {
                channelUploaderKeywordAction.enable()
            },
            callback: () => {
                channelUploaderKeywordAction.disable()
            },
        }),
        // 编辑 UP主昵称关键词黑名单
        new ButtonItem({
            itemID: 'channel-uploader-keyword-edit-button',
            description: '编辑 UP主昵称关键词黑名单',
            name: '编辑',
            itemFunc: () => {
                channelUploaderKeywordAction.blacklist.show()
            },
        }),
    ]
    channelPageVideoFilterGroupList.push(new Group('channel-uploader-filter-group', '频道页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤
    const titleKeywordItems = [
        // 启用 频道页关键词过滤
        new CheckboxItem({
            itemID: channelTitleKeywordAction.statusKey,
            description: '启用 标题关键词过滤',
            itemFunc: () => {
                channelTitleKeywordAction.enable()
            },
            callback: () => {
                channelTitleKeywordAction.disable()
            },
        }),
        // 按钮功能：打开titleKeyword黑名单编辑框
        new ButtonItem({
            itemID: 'channel-title-keyword-edit-button',
            description: '编辑 标题关键词黑名单（支持正则）',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                channelTitleKeywordAction.blacklist.show()
            },
        }),
    ]
    channelPageVideoFilterGroupList.push(
        new Group('channel-title-keyword-filter-group', '频道页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤
    const bvidItems = [
        // 启用 频道页BV号过滤
        new CheckboxItem({
            itemID: channelBvidAction.statusKey,
            description: '启用 BV号过滤',
            itemFunc: () => {
                // 启用右键功能
                isContextMenuBvidEnable = true
                contextMenuFunc()
                channelBvidAction.enable()
            },
            callback: () => {
                // 禁用右键功能
                isContextMenuBvidEnable = false
                channelBvidAction.disable()
            },
        }),
        // 按钮功能：打开bvid黑名单编辑框
        new ButtonItem({
            itemID: 'channel-bvid-edit-button',
            description: '编辑 BV号黑名单',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                channelBvidAction.blacklist.show()
            },
        }),
    ]
    channelPageVideoFilterGroupList.push(
        new Group('channel-bvid-filter-group', '频道页 BV号过滤 (右键单击标题)', bvidItems),
    )

    // UI组件, 例外和白名单
    const whitelistItems = [
        // 启用 频道页UP主白名单
        new CheckboxItem({
            itemID: channelUploaderWhitelistAction.statusKey,
            description: '启用 UP主白名单 (右键单击UP主)',
            itemFunc: () => {
                channelUploaderWhitelistAction.enable()
            },
            callback: () => {
                channelUploaderWhitelistAction.disable()
            },
        }),
        // 编辑 UP主白名单
        new ButtonItem({
            itemID: 'channel-uploader-whitelist-edit-button',
            description: '编辑 UP主白名单',
            name: '编辑',
            // 按钮功能：显示白名单编辑器
            itemFunc: () => {
                channelUploaderWhitelistAction.whitelist.show()
            },
        }),
        // 启用 频道页标题关键词白名单
        new CheckboxItem({
            itemID: channelTitleKeyworldWhitelistAction.statusKey,
            description: '启用 标题关键词白名单',
            itemFunc: () => {
                channelTitleKeyworldWhitelistAction.enable()
            },
            callback: () => {
                channelTitleKeyworldWhitelistAction.disable()
            },
        }),
        // 编辑 关键词白名单
        new ButtonItem({
            itemID: 'channel-title-keyword-whitelist-edit-button',
            description: '编辑 标题关键词白名单（支持正则）',
            name: '编辑',
            // 按钮功能：显示白名单编辑器
            itemFunc: () => {
                channelTitleKeyworldWhitelistAction.whitelist.show()
            },
        }),
    ]
    channelPageVideoFilterGroupList.push(
        new Group('channel-whitelist-filter-group', '频道页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { channelPageVideoFilterGroupList }

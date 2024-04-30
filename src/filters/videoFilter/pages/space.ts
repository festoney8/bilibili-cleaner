import { debugVideoFilter as debug, error } from '../../../utils/logger'
import { ButtonItem, CheckboxItem, NumberItem } from '../../../components/item'
import { Group } from '../../../components/group'
import coreFilterInstance, { VideoSelectorFunc } from '../filters/core'
import { isPageSpace } from '../../../utils/page-type'
import { matchBvid, waitForEle } from '../../../utils/tool'
import { BvidAction, DurationAction, TitleKeywordAction, TitleKeywordWhitelistAction } from './actions/action'
import { ContextMenu } from '../../../components/contextmenu'

const spacePageVideoFilterGroupList: Group[] = []

if (isPageSpace()) {
    let videoListContainer: HTMLElement
    // 构建SelectorFunc
    const submitSelectorFunc: VideoSelectorFunc = {
        duration: (video: Element): string | null => {
            const duration = video.querySelector('span.length')?.textContent?.trim()
            return duration ? duration : null
        },
        titleKeyword: (video: Element): string | null => {
            const titleKeyword =
                video.querySelector('a.title')?.textContent?.trim() ||
                video.querySelector('a.title')?.getAttribute('title')?.trim()
            return titleKeyword ? titleKeyword : null
        },
        bvid: (video: Element): string | null => {
            const href = video.querySelector('a.title')?.getAttribute('href')?.trim()
            return href ? matchBvid(href) : null
        },
    }
    const homeSelectorFunc = submitSelectorFunc
    const collectionSelectorFunc = submitSelectorFunc

    // 检测视频列表
    const checkVideoList = (_fullSite: boolean) => {
        // debug('checkVideoList start')
        if (!videoListContainer) {
            // 在container未出现时, 各项屏蔽功能enable会调用checkVideoList, 需要判空
            debug(`checkVideoList videoListContainer not exist`)
            return
        }
        try {
            // 主页视频
            if (location.pathname.match(/^\/\d+$/)) {
                const homeVideos = [...videoListContainer.querySelectorAll<HTMLElement>(`#page-index .small-item`)]
                homeVideos.length && coreFilterInstance.checkAll(homeVideos, false, homeSelectorFunc)
                debug(`checkVideoList check ${homeVideos.length} home video`)
            }
            // 投稿视频
            if (location.pathname.match(/^\/\d+\/video$/)) {
                const submitVideos = [
                    ...videoListContainer.querySelectorAll<HTMLElement>(`#submit-video :is(.small-item,.list-item)`),
                ]
                submitVideos.length && coreFilterInstance.checkAll(submitVideos, false, submitSelectorFunc)
                debug(`checkVideoList check ${submitVideos.length} submit video`)
            }
            // 视频合集、视频系列
            if (location.pathname.match(/^\/\d+\/channel\/(collectiondetail|seriesdetail)/)) {
                const collectionVideos = [
                    ...videoListContainer.querySelectorAll<HTMLElement>(
                        `:is(#page-collection-detail,#page-series-detail) li.small-item`,
                    ),
                ]
                collectionVideos.length && coreFilterInstance.checkAll(collectionVideos, false, collectionSelectorFunc)
                debug(`checkVideoList check ${collectionVideos.length} collection video`)
            }
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }

    // 初始化 行为实例
    const spaceDurationAction = new DurationAction(
        'space-duration-filter-status',
        'global-duration-filter-value',
        checkVideoList,
    )
    const spaceBvidAction = new BvidAction('space-bvid-filter-status', 'global-bvid-filter-value', checkVideoList)
    const spaceTitleKeywordAction = new TitleKeywordAction(
        'space-title-keyword-filter-status',
        'global-title-keyword-filter-value',
        checkVideoList,
    )
    const spaceTitleKeyworldWhitelistAction = new TitleKeywordWhitelistAction(
        'space-title-keyword-whitelist-filter-status',
        'global-title-keyword-whitelist-filter-value',
        checkVideoList,
    )

    // 监听视频列表内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        const check = async (fullSite: boolean) => {
            if (spaceDurationAction.status || spaceBvidAction.status || spaceTitleKeywordAction.status) {
                checkVideoList(fullSite)
            }
        }
        if (videoListContainer) {
            check(true)
            const videoObverser = new MutationObserver(() => {
                // 全量检测
                check(true)
            })
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debug('watchVideoListContainer OK')
        }
    }
    try {
        // 监听视频列表出现
        waitForEle(document, '#app', (node: Node): boolean => {
            return node instanceof HTMLElement && (node as HTMLElement).id === 'app'
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

    // 右键监听函数, 空间页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID
    let isContextMenuFuncRunning = false
    let isContextMenuBvidEnable = false
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
                if (isContextMenuBvidEnable && e.target.classList.contains('title')) {
                    // 命中视频标题, 提取bvid
                    const href = e.target.getAttribute('href')
                    if (href) {
                        const bvid = matchBvid(href)
                        if (bvid) {
                            e.preventDefault()
                            menu.registerMenu(`◎ 屏蔽视频 ${bvid}`, () => {
                                spaceBvidAction.add(bvid)
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

    // 样式补丁，用于主页视频列表过滤后对齐视频
    const patchCSS = `
        @media (min-width: 1420px) {
            #page-index .video .content .small-item:nth-child(4n+1) {padding-left: 7px !important; padding-right: 7px !important;}
            #page-index .video .content .small-item:nth-child(4n+4) {padding-left: 7px !important; padding-right: 7px !important;}
            #page-index .video .content .small-item:nth-child(5n+5) {padding-left: 7px !important; padding-right: 7px !important;}
            #page-index .video .content .small-item:nth-child(5n+1) {padding-left: 7px !important; padding-right: 7px !important;}
            #page-index .video .content .small-item:nth-child(13),
            #page-index .video .content .small-item:nth-child(14),
            #page-index .video .content .small-item:nth-child(15) {display: block}
        }
        #page-index .video .content .small-item:nth-child(4n+1) {padding-left: 7px !important; padding-right: 7px !important;}
        #page-index .video .content .small-item:nth-child(4n+4) {padding-left: 7px !important; padding-right: 7px !important;}
        #page-index .video .content .small-item {padding: 10px 7px !important;}`

    // UI组件, 时长过滤
    const durationItems = [
        // 启用 空间页时长过滤
        new CheckboxItem({
            itemID: spaceDurationAction.statusKey,
            description: '启用 时长过滤',
            itemFunc: () => {
                spaceDurationAction.enable()
            },
            callback: () => {
                spaceDurationAction.disable()
            },
            itemCSS: patchCSS,
        }),
        // 设定最低时长
        new NumberItem({
            itemID: spaceDurationAction.valueKey,
            description: '设定最低时长 (0~300s)',
            defaultValue: 60,
            minValue: 0,
            maxValue: 300,
            disableValue: 0,
            unit: '秒',
            callback: (value: number) => {
                spaceDurationAction.change(value)
            },
        }),
    ]
    spacePageVideoFilterGroupList.push(new Group('space-duration-filter-group', '空间页 时长过滤', durationItems))

    // UI组件, 标题关键词过滤
    const titleKeywordItems = [
        // 启用 空间页关键词过滤
        new CheckboxItem({
            itemID: spaceTitleKeywordAction.statusKey,
            description: '启用 标题关键词过滤',
            itemFunc: () => {
                spaceTitleKeywordAction.enable()
            },
            callback: () => {
                spaceTitleKeywordAction.disable()
            },
            itemCSS: patchCSS,
        }),
        // 编辑 标题关键词黑名单
        new ButtonItem({
            itemID: 'space-title-keyword-edit-button',
            description: '编辑 标题关键词黑名单（支持正则）',
            name: '编辑',
            itemFunc: () => {
                spaceTitleKeywordAction.blacklist.show()
            },
        }),
    ]
    spacePageVideoFilterGroupList.push(
        new Group('space-title-keyword-filter-group', '空间页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤
    const bvidItems = [
        // 启用 空间页BV号过滤
        new CheckboxItem({
            itemID: spaceBvidAction.statusKey,
            description: '启用 BV号过滤',
            itemFunc: () => {
                // 启用右键功能
                isContextMenuBvidEnable = true
                contextMenuFunc()
                spaceBvidAction.enable()
            },
            callback: () => {
                // 禁用右键功能
                isContextMenuBvidEnable = false
                spaceBvidAction.disable()
            },
            itemCSS: patchCSS,
        }),
        // 编辑 BV号黑名单
        new ButtonItem({
            itemID: 'space-bvid-edit-button',
            description: '编辑 BV号黑名单',
            name: '编辑',
            itemFunc: () => {
                spaceBvidAction.blacklist.show()
            },
        }),
    ]
    spacePageVideoFilterGroupList.push(
        new Group('space-bvid-filter-group', '空间页 BV号过滤 (右键单击标题)', bvidItems),
    )

    // UI组件, 例外和白名单
    const whitelistItems = [
        // 启用 空间页标题关键词白名单
        new CheckboxItem({
            itemID: spaceTitleKeyworldWhitelistAction.statusKey,
            description: '启用 标题关键词白名单',
            itemFunc: () => {
                spaceTitleKeyworldWhitelistAction.enable()
            },
            callback: () => {
                spaceTitleKeyworldWhitelistAction.disable()
            },
        }),
        // 编辑 标题关键词白名单
        new ButtonItem({
            itemID: 'space-title-keyword-whitelist-edit-button',
            description: '编辑 标题关键词白名单（支持正则）',
            name: '编辑',
            itemFunc: () => {
                spaceTitleKeyworldWhitelistAction.whitelist.show()
            },
        }),
    ]
    spacePageVideoFilterGroupList.push(
        new Group('space-whitelist-filter-group', '空间页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { spacePageVideoFilterGroupList }

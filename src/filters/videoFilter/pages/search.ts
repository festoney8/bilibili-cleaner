import { debugVideoFilter as debug, error } from '../../../utils/logger'
import { ButtonItem, CheckboxItem, NumberItem } from '../../../components/item'
import { Group } from '../../../components/group'
import coreFilterInstance, { VideoSelectorFunc } from '../filters/core'
import { isPageSearch } from '../../../utils/page-type'
import { ContextMenu } from '../../../components/contextmenu'
import { matchBvid, showEle, waitForEle } from '../../../utils/tool'
import {
    BvidAction,
    DurationAction,
    TitleKeywordAction,
    TitleKeywordWhitelistAction,
    UploaderAction,
    UploaderKeywordAction,
    UploaderWhitelistAction,
} from './actions/action'
import { GM_getValue } from '$'

const searchPageVideoFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false
// 推荐位UP主视频的不被过滤，默认开启
let isTopUploaderWhitelistEnable: boolean = GM_getValue('BILICLEANER_search-top-uploader-whitelist-filter-status', true)

if (isPageSearch()) {
    let videoListContainer: HTMLElement
    // 构建SelectorFunc
    const searchSelectorFunc: VideoSelectorFunc = {
        duration: (video: Element): string | null => {
            const duration = video.querySelector('span.bili-video-card__stats__duration')?.textContent
            return duration ? duration : null
        },
        titleKeyword: (video: Element): string | null => {
            const titleKeyword =
                video.querySelector('h3.bili-video-card__info--tit')?.textContent ||
                video.querySelector('h3.bili-video-card__info--tit')?.getAttribute('title')
            return titleKeyword ? titleKeyword : null
        },
        bvid: (video: Element): string | null => {
            const href =
                video.querySelector('.bili-video-card__wrap > a')?.getAttribute('href') ||
                video.querySelector('.bili-video-card__info--right > a')?.getAttribute('href')
            if (href) {
                return matchBvid(href)
            }
            return null
        },
        uploader: (video: Element): string | null => {
            const uploader = video.querySelector('span.bili-video-card__info--author')?.textContent
            return uploader ? uploader : null
        },
    }
    // 检测视频列表
    const checkVideoList = (_fullSite: boolean) => {
        // debug('checkVideoList start')
        if (!videoListContainer) {
            // 在container未出现时, 各项屏蔽功能enable会调用checkVideoList, 需要判空
            debug(`checkVideoList videoListContainer not exist`)
            return
        }
        try {
            // 顶部UP主的视频列表
            const topVideos = [
                ...videoListContainer.querySelectorAll<HTMLElement>(`.user-video-info .video-list > .video-list-item`),
            ]
            // 普通搜索结果，视频列表
            const contentVideos = [
                ...videoListContainer.querySelectorAll<HTMLElement>(
                    `.video.search-all-list .video-list > div, .search-page-video .video-list > div`,
                ),
            ]

            // 顶部UP主视频白名单
            if (isTopUploaderWhitelistEnable) {
                topVideos.forEach((video) => showEle(video))
            } else {
                topVideos.length && coreFilterInstance.checkAll(topVideos, false, searchSelectorFunc)
                debug(`checkVideoList check ${topVideos.length} top videos`)
            }
            contentVideos.length && coreFilterInstance.checkAll(contentVideos, false, searchSelectorFunc)
            debug(`checkVideoList check ${contentVideos.length} content videos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }
    // 监听视频列表内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        if (videoListContainer) {
            debug('watchVideoListContainer start')
            checkVideoList(true)
            const videoObverser = new MutationObserver(() => {
                checkVideoList(true)
            })
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debug('watchVideoListContainer OK')
        }
    }
    try {
        // 监听视频列表出现
        waitForEle(document, '.search-content', (node: Node): boolean => {
            return node instanceof HTMLElement && (node as HTMLElement).className?.includes('search-content')
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

    // 初始化 行为实例
    const searchDurationAction = new DurationAction(
        'search-duration-filter-status',
        'global-duration-filter-value',
        checkVideoList,
    )
    const searchUploaderAction = new UploaderAction(
        'search-uploader-filter-status',
        'global-uploader-filter-value',
        checkVideoList,
    )
    const searchUploaderKeywordAction = new UploaderKeywordAction(
        'search-uploader-keyword-filter-status',
        'global-uploader-keyword-filter-value',
        checkVideoList,
    )
    const searchBvidAction = new BvidAction('search-bvid-filter-status', 'global-bvid-filter-value', checkVideoList)
    const searchTitleKeywordAction = new TitleKeywordAction(
        'search-title-keyword-filter-status',
        'global-title-keyword-filter-value',
        checkVideoList,
    )
    const searchUploaderWhitelistAction = new UploaderWhitelistAction(
        'search-uploader-whitelist-filter-status',
        'global-uploader-whitelist-filter-value',
        checkVideoList,
    )
    const searchTitleKeyworldWhitelistAction = new TitleKeywordWhitelistAction(
        'search-title-keyword-whitelist-filter-status',
        'global-title-keyword-whitelist-filter-value',
        checkVideoList,
    )

    //=======================================================================================

    // 右键监听函数, 搜索页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
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
                debug(e.target.classList)
                if (
                    isContextMenuUploaderEnable &&
                    (e.target.classList.contains('bili-video-card__info--author') ||
                        e.target.classList.contains('bili-video-card__info--date'))
                ) {
                    // 命中UP主或日期
                    const node = e.target.parentElement?.querySelector('.bili-video-card__info--author')
                    const uploader = node?.textContent
                    if (uploader) {
                        e.preventDefault()
                        const onclickBlack = () => {
                            searchUploaderAction.add(uploader)
                        }
                        const onclickWhite = () => {
                            searchUploaderWhitelistAction.add(uploader)
                        }
                        menu.registerMenu(`◎ 屏蔽UP主：${uploader}`, onclickBlack)
                        menu.registerMenu(`◎ 将UP主加入白名单`, onclickWhite)
                        menu.show(e.clientX, e.clientY)
                    }
                } else if (
                    isContextMenuBvidEnable &&
                    (e.target.classList.contains('bili-video-card__info--tit') ||
                        (e.target.classList.contains('keyword') &&
                            e.target.parentElement?.classList.contains('bili-video-card__info--tit')))
                ) {
                    // 命中视频标题, 提取bvid
                    const node = e.target.closest('.bili-video-card__info--right')
                    const href = node?.querySelector(':scope > a')?.getAttribute('href')
                    if (href) {
                        const bvid = matchBvid(href)
                        if (bvid) {
                            e.preventDefault()
                            const onclick = () => {
                                searchBvidAction.add(bvid)
                            }
                            menu.registerMenu(`屏蔽视频：${bvid}`, onclick)
                            menu.show(e.clientX, e.clientY)
                        }
                    }
                } else {
                    menu.hide()
                }
            }
        })
        // 关闭右键菜单
        document.addEventListener('click', () => {
            menu.hide()
        })
        document.addEventListener('wheel', () => {
            menu.hide()
        })
        debug('contextMenuFunc listen contextmenu')
    }

    //=======================================================================================
    // 构建UI菜单

    // UI组件, 时长过滤part
    const durationItems = [
        new CheckboxItem({
            itemID: searchDurationAction.statusKey,
            description: '启用 时长过滤',
            itemFunc: () => {
                searchDurationAction.enable()
            },
            callback: () => {
                searchDurationAction.disable()
            },
        }),
        new NumberItem({
            itemID: searchDurationAction.valueKey,
            description: '设定最低时长 (0~300s)',
            defaultValue: 60,
            minValue: 0,
            maxValue: 300,
            disableValue: 0,
            unit: '秒',
            callback: (value: number) => {
                searchDurationAction.change(value)
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(new Group('search-duration-filter-group', '搜索页 视频时长过滤', durationItems))

    // UI组件, UP主过滤part
    const uploaderItems = [
        new CheckboxItem({
            itemID: searchUploaderAction.statusKey,
            description: '启用 UP主过滤 (右键单击UP主)',
            itemFunc: () => {
                // 启用右键功能
                isContextMenuUploaderEnable = true
                contextMenuFunc()
                searchUploaderAction.enable()
            },
            callback: () => {
                // 禁用右键功能
                isContextMenuUploaderEnable = false
                searchUploaderAction.disable()
            },
        }),
        // 按钮功能：打开uploader黑名单编辑框
        new ButtonItem({
            itemID: 'search-uploader-edit-button',
            description: '编辑 UP主黑名单',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                searchUploaderAction.blacklist.show()
            },
        }),
        // 启用 昵称关键词过滤
        new CheckboxItem({
            itemID: searchUploaderKeywordAction.statusKey,
            description: '启用 昵称关键词过滤',
            itemFunc: () => {
                searchUploaderKeywordAction.enable()
            },
            callback: () => {
                searchUploaderKeywordAction.disable()
            },
        }),
        // 编辑 昵称关键词黑名单
        new ButtonItem({
            itemID: 'search-uploader-keyword-edit-button',
            description: '编辑 昵称关键词黑名单',
            name: '编辑',
            itemFunc: () => {
                searchUploaderKeywordAction.blacklist.show()
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(new Group('search-uploader-filter-group', '搜索页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤part
    const titleKeywordItems = [
        new CheckboxItem({
            itemID: searchTitleKeywordAction.statusKey,
            description: '启用 标题关键词过滤',
            itemFunc: () => {
                searchTitleKeywordAction.enable()
            },
            callback: () => {
                searchTitleKeywordAction.disable()
            },
        }),
        // 按钮功能：打开titleKeyword黑名单编辑框
        new ButtonItem({
            itemID: 'search-title-keyword-edit-button',
            description: '编辑 标题关键词黑名单（支持正则）',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                searchTitleKeywordAction.blacklist.show()
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(
        new Group('search-title-keyword-filter-group', '搜索页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤part
    const bvidItems = [
        new CheckboxItem({
            itemID: searchBvidAction.statusKey,
            description: '启用 BV号过滤 (右键单击标题)',
            itemFunc: () => {
                // 启用右键功能
                isContextMenuBvidEnable = true
                contextMenuFunc()
                searchBvidAction.enable()
            },
            callback: () => {
                // 禁用右键功能
                isContextMenuBvidEnable = false
                searchBvidAction.disable()
            },
        }),
        // 按钮功能：打开bvid黑名单编辑框
        new ButtonItem({
            itemID: 'search-bvid-edit-button',
            description: '编辑 BV号黑名单',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                searchBvidAction.blacklist.show()
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(new Group('search-bvid-filter-group', '搜索页 BV号过滤', bvidItems))

    // UI组件, 例外和白名单part
    const whitelistItems = [
        // 顶部匹配UP主 免过滤, 默认开启
        new CheckboxItem({
            itemID: 'search-top-uploader-whitelist-filter-status',
            description: '搜索结果顶部UP主视频免过滤',
            defaultStatus: true,
            itemFunc: () => {
                isTopUploaderWhitelistEnable = true
                // 触发全站检测
                checkVideoList(true)
            },
            callback: () => {
                isTopUploaderWhitelistEnable = false
                checkVideoList(true)
            },
        }),
        new CheckboxItem({
            itemID: searchUploaderWhitelistAction.statusKey,
            description: '启用 UP主白名单',
            itemFunc: () => {
                searchUploaderWhitelistAction.enable()
            },
            callback: () => {
                searchUploaderWhitelistAction.disable()
            },
        }),
        new ButtonItem({
            itemID: 'search-uploader-whitelist-edit-button',
            description: '编辑 UP主白名单',
            name: '编辑',
            // 按钮功能：显示白名单编辑器
            itemFunc: () => {
                searchUploaderWhitelistAction.whitelist.show()
            },
        }),
        new CheckboxItem({
            itemID: searchTitleKeyworldWhitelistAction.statusKey,
            description: '启用 标题关键词白名单',
            itemFunc: () => {
                searchTitleKeyworldWhitelistAction.enable()
            },
            callback: () => {
                searchTitleKeyworldWhitelistAction.disable()
            },
        }),
        new ButtonItem({
            itemID: 'search-title-keyword-whitelist-edit-button',
            description: '编辑 标题关键词白名单（支持正则）',
            name: '编辑',
            // 按钮功能：显示白名单编辑器
            itemFunc: () => {
                searchTitleKeyworldWhitelistAction.whitelist.show()
            },
        }),
    ]
    searchPageVideoFilterGroupList.push(
        new Group('search-whitelist-filter-group', '搜索页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { searchPageVideoFilterGroupList }

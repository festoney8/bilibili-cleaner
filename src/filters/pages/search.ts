import { debugFilter, error } from '../../utils/logger'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { Group } from '../../components/group'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import { isPageSearch } from '../../utils/page-type'
import contextMenuInstance from '../../components/contextmenu'
import { matchBvid, showVideo } from '../../utils/tool'
import {
    BvidAction,
    DurationAction,
    TitleKeywordAction,
    TitleKeywordWhitelistAction,
    UploaderAction,
    UploaderWhitelistAction,
} from './actions/action'
import { GM_getValue } from '$'

const searchFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false
// 推荐位UP主视频的不被过滤(实验性)，默认开启
let isTopUploaderWhitelistEnable: boolean = GM_getValue('BILICLEANER_search-top-uploader-whitelist-filter-status', true)

if (isPageSearch()) {
    // 页面载入后监听流程

    // 视频列表外层
    let videoListContainer: HTMLElement
    // 3. 检测视频列表
    const checkVideoList = (_fullSite: boolean) => {
        // debugFilter('checkVideoList start')
        if (!videoListContainer) {
            // 在container未出现时, 各项屏蔽功能enable会调用checkVideoList, 需要判空
            debugFilter(`checkVideoList videoListContainer not exist`)
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

            const contentSelectorFunc: SelectorFunc = {
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
            // topVideo的uploader全返回null
            const topSelectorFunc = contentSelectorFunc

            // 顶部UP主视频白名单
            if (isTopUploaderWhitelistEnable) {
                topVideos.forEach((video) => showVideo(video))
            } else {
                topVideos.length && coreFilterInstance.checkAll(topVideos, false, topSelectorFunc)
                debugFilter(`checkVideoList check ${topVideos.length} top videos`)
            }
            contentVideos.length && coreFilterInstance.checkAll(contentVideos, false, contentSelectorFunc)
            debugFilter(`checkVideoList check ${contentVideos.length} content videos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }
    // 2. 监听 videoListContainer 内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        if (videoListContainer) {
            debugFilter('watchVideoListContainer start')
            checkVideoList(true)
            const videoObverser = new MutationObserver(() => {
                checkVideoList(true)
            })
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debugFilter('watchVideoListContainer OK')
        }
    }
    // 1. 检测/监听 videoListContainer 出现, 出现后监听 videoListContainer 内部变化
    const waitForVideoListContainer = () => {
        // 检测/监听视频列表父节点出现
        videoListContainer = document.querySelector('.search-content') as HTMLFormElement
        if (videoListContainer) {
            debugFilter('videoListContainer exist')
            watchVideoListContainer()
        } else {
            const obverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if (
                                node instanceof HTMLElement &&
                                (node as HTMLElement).className?.includes('search-content')
                            ) {
                                debugFilter('videoListContainer appear')
                                obverser.disconnect()
                                videoListContainer = document.querySelector('.search-content') as HTMLElement
                                watchVideoListContainer()
                            }
                        })
                    }
                })
            })
            obverser.observe(document, { childList: true, subtree: true })
            debugFilter('videoListContainer obverser start')
        }
    }
    try {
        waitForVideoListContainer()
    } catch (err) {
        error(err)
        error(`waitForVideoListContainer ERROR`)
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
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            if (e.target instanceof HTMLElement) {
                debugFilter(e.target.classList)
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
                        contextMenuInstance.registerMenu(`◎ 屏蔽UP主：${uploader}`, onclickBlack)
                        contextMenuInstance.registerMenu(`◎ 将UP主加入白名单`, onclickWhite)
                        contextMenuInstance.show(e.clientX, e.clientY)
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
                            contextMenuInstance.registerMenu(`屏蔽视频：${bvid}`, onclick)
                            contextMenuInstance.show(e.clientX, e.clientY)
                        }
                    }
                } else {
                    contextMenuInstance.hide()
                }
            }
        })
        // 监听左键单击，关闭右键菜单
        document.addEventListener('click', () => {
            contextMenuInstance.hide()
        })
        debugFilter('contextMenuFunc listen contextmenu')
    }

    //=======================================================================================
    // 构建UI菜单
    const durationItems: (CheckboxItem | NumberItem)[] = []
    const titleKeywordItems: (CheckboxItem | ButtonItem)[] = []
    const bvidItems: (CheckboxItem | ButtonItem)[] = []
    const uploaderItems: (CheckboxItem | ButtonItem)[] = []
    const whitelistItems: (CheckboxItem | ButtonItem)[] = []

    // UI组件, 时长过滤part
    {
        durationItems.push(
            new CheckboxItem(
                searchDurationAction.statusKey,
                '启用 搜索页时长过滤',
                false,
                () => {
                    searchDurationAction.enable()
                },
                false,
                null,
                () => {
                    searchDurationAction.disable()
                },
            ),
        )
        durationItems.push(
            new NumberItem(
                searchDurationAction.valueKey,
                '设定最低时长 (0~300s)',
                60,
                0,
                300,
                '秒',
                (value: number) => {
                    searchDurationAction.change(value)
                },
            ),
        )
    }
    searchFilterGroupList.push(new Group('search-duration-filter-group', '搜索页 视频时长过滤', durationItems))

    // UI组件, UP主过滤part
    {
        uploaderItems.push(
            new CheckboxItem(
                searchUploaderAction.statusKey,
                '启用 搜索页UP主过滤',
                false,
                () => {
                    // 启用右键功能
                    isContextMenuUploaderEnable = true
                    contextMenuFunc()
                    searchUploaderAction.enable()
                },
                false,
                null,
                () => {
                    // 禁用右键功能
                    isContextMenuUploaderEnable = false
                    searchUploaderAction.disable()
                },
            ),
        )
        // 按钮功能：打开uploader黑名单编辑框
        uploaderItems.push(
            new ButtonItem(
                'search-uploader-edit-button',
                '编辑 UP主黑名单',
                '编辑',
                // 按钮功能
                () => {
                    searchUploaderAction.blacklist.show()
                },
            ),
        )
    }
    searchFilterGroupList.push(
        new Group('search-uploader-filter-group', '搜索页 UP主过滤 (右键单击UP主)', uploaderItems),
    )

    // UI组件, 标题关键词过滤part
    {
        titleKeywordItems.push(
            new CheckboxItem(
                searchTitleKeywordAction.statusKey,
                '启用 搜索页关键词过滤',
                false,
                () => {
                    searchTitleKeywordAction.enable()
                },
                false,
                null,
                () => {
                    searchTitleKeywordAction.disable()
                },
            ),
        )
        // 按钮功能：打开titleKeyword黑名单编辑框
        titleKeywordItems.push(
            new ButtonItem(
                'search-title-keyword-edit-button',
                '编辑 关键词黑名单（支持正则）',
                '编辑',
                // 按钮功能
                () => {
                    searchTitleKeywordAction.blacklist.show()
                },
            ),
        )
    }
    searchFilterGroupList.push(
        new Group('search-title-keyword-filter-group', '搜索页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤part
    {
        bvidItems.push(
            new CheckboxItem(
                searchBvidAction.statusKey,
                '启用 搜索页BV号过滤',
                false,
                () => {
                    // 启用右键功能
                    isContextMenuBvidEnable = true
                    contextMenuFunc()
                    searchBvidAction.enable()
                },
                false,
                null,
                () => {
                    // 禁用右键功能
                    isContextMenuBvidEnable = false
                    searchBvidAction.disable()
                },
            ),
        )
        // 按钮功能：打开bvid黑名单编辑框
        bvidItems.push(
            new ButtonItem(
                'search-bvid-edit-button',
                '编辑 BV号黑名单',
                '编辑',
                // 按钮功能
                () => {
                    searchBvidAction.blacklist.show()
                },
            ),
        )
    }
    searchFilterGroupList.push(new Group('search-bvid-filter-group', '搜索页 BV号过滤 (右键单击标题)', bvidItems))

    // UI组件, 例外和白名单part
    {
        // 顶部匹配UP主 免过滤
        whitelistItems.push(
            new CheckboxItem(
                'search-top-uploader-whitelist-filter-status',
                '搜索结果顶部UP主视频免过滤 (实验性)',
                false,
                () => {
                    isTopUploaderWhitelistEnable = true
                    // 触发全站检测
                    checkVideoList(true)
                },
                false,
                null,
                () => {
                    isTopUploaderWhitelistEnable = false
                    checkVideoList(true)
                },
            ),
        )
        whitelistItems.push(
            new CheckboxItem(
                searchUploaderWhitelistAction.statusKey,
                '启用 搜索页UP主白名单',
                false,
                () => {
                    searchUploaderWhitelistAction.enable()
                },
                false,
                null,
                () => {
                    searchUploaderWhitelistAction.disable()
                },
            ),
        )
        whitelistItems.push(
            new ButtonItem(
                'search-uploader-whitelist-edit-button',
                '编辑 UP主白名单',
                '编辑',
                // 按钮功能：显示白名单编辑器
                () => {
                    searchUploaderWhitelistAction.whitelist.show()
                },
            ),
        )
        whitelistItems.push(
            new CheckboxItem(
                searchTitleKeyworldWhitelistAction.statusKey,
                '启用 搜索页标题关键词白名单',
                false,
                () => {
                    searchTitleKeyworldWhitelistAction.enable()
                },
                false,
                null,
                () => {
                    searchTitleKeyworldWhitelistAction.disable()
                },
            ),
        )
        whitelistItems.push(
            new ButtonItem(
                'search-title-keyword-whitelist-edit-button',
                '编辑 关键词白名单（支持正则）',
                '编辑',
                // 按钮功能：显示白名单编辑器
                () => {
                    searchTitleKeyworldWhitelistAction.whitelist.show()
                },
            ),
        )
    }
    searchFilterGroupList.push(new Group('search-whitelist-filter-group', '搜索页 白名单设定 (免过滤)', whitelistItems))
}

export { searchFilterGroupList }

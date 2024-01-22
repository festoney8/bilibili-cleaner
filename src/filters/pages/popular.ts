import { debugFilter, error } from '../../utils/logger'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import { ButtonItem, CheckboxItem } from '../../components/item'
import { Group } from '../../components/group'
import settings from '../../settings'
import { isPagePopular } from '../../utils/page-type'
import contextMenuInstance from '../../components/contextmenu'
import { matchBvid } from '../../utils/tool'
import {
    BvidAction,
    TitleKeywordAction,
    TitleKeywordWhitelistAction,
    UploaderAction,
    UploaderWhitelistAction,
} from './actions/action'

const popularFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false

if (isPagePopular()) {
    // 页面载入后监听流程

    // 视频列表外层
    let videoListContainer: HTMLElement
    // 3. 检测视频列表
    const checkVideoList = (fullSite: boolean) => {
        debugFilter('checkVideoList start')
        if (!videoListContainer) {
            debugFilter(`checkVideoList videoListContainer not exist`)
            return
        }
        try {
            // 热门视频
            let hotVideos: NodeListOf<HTMLElement>
            // 每周必看
            let weeklyVideos: NodeListOf<HTMLElement>
            // 排行榜
            let rankVideos: NodeListOf<HTMLElement>
            if (!fullSite) {
                hotVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `.card-list .video-card:not([${settings.filterSign}])`,
                )
                weeklyVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `.video-list .video-card:not([${settings.filterSign}])`,
                )
                rankVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `.rank-list .rank-item:not([${settings.filterSign}])`,
                )
            } else {
                hotVideos = videoListContainer.querySelectorAll<HTMLElement>(`.card-list .video-card`)
                weeklyVideos = videoListContainer.querySelectorAll<HTMLElement>(`.video-list .video-card`)
                rankVideos = videoListContainer.querySelectorAll<HTMLElement>(`.rank-list .rank-item`)
            }

            // 构建SelectorFunc
            const rcmdSelectorFunc: SelectorFunc = {
                // popular页 无duration
                titleKeyword: (video: Element): string | null => {
                    const titleKeyword =
                        video.querySelector('.video-card__info .video-name')?.getAttribute('title') ||
                        video.querySelector('.video-card__info .video-name')?.textContent ||
                        video.querySelector('.info a.title')?.getAttribute('title') ||
                        video.querySelector('.info a.title')?.textContent
                    return titleKeyword ? titleKeyword : null
                },
                bvid: (video: Element): string | null => {
                    const href =
                        video.querySelector('.video-card__content > a')?.getAttribute('href') ||
                        video.querySelector('.content > .img > a')?.getAttribute('href')
                    if (href) {
                        return matchBvid(href)
                    }
                    return null
                },
                uploader: (video: Element): string | null => {
                    const uploader =
                        video.querySelector('span.up-name__text')?.textContent ||
                        video.querySelector('span.up-name__text')?.getAttribute('title') ||
                        video.querySelector('.data-box.up-name')?.textContent
                    return uploader ? uploader : null
                },
            }
            const feedSelectorFunc = rcmdSelectorFunc
            hotVideos.length && coreFilterInstance.checkAll([...hotVideos], false, feedSelectorFunc)
            // debugFilter(`checkVideoList check ${hotVideos.length} hotVideos`)
            weeklyVideos.length && coreFilterInstance.checkAll([...weeklyVideos], false, feedSelectorFunc)
            // debugFilter(`checkVideoList check ${weeklyVideos.length} weeklyVideos`)
            rankVideos.length && coreFilterInstance.checkAll([...rankVideos], false, feedSelectorFunc)
            // debugFilter(`checkVideoList check ${rankVideos.length} rankVideos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
        debugFilter('checkVideoList end')
    }
    // 2. 监听 videoListContainer 内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        if (videoListContainer) {
            debugFilter('watchVideoListContainer start')
            // 初次全站检测
            checkVideoList(true)
            const videoObverser = new MutationObserver(() => {
                // 增量检测
                checkVideoList(true)
            })
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debugFilter('watchVideoListContainer OK')
        }
    }
    // 1. 检测/监听 videoListContainer 出现, 出现后监听 videoListContainer 内部变化
    const waitForVideoListContainer = () => {
        // 检测/监听视频列表父节点出现
        videoListContainer = document.querySelector('#app') as HTMLElement
        if (videoListContainer) {
            debugFilter('videoListContainer exist')
            watchVideoListContainer()
        } else {
            const obverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as HTMLElement).id === 'app') {
                                debugFilter('videoListContainer appear')
                                obverser.disconnect()
                                videoListContainer = document.querySelector('#app') as HTMLElement
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

    // 配置 行为实例
    const popularUploaderAction = new UploaderAction(
        'popular-uploader-filter-status',
        'global-uploader-filter-value',
        checkVideoList,
    )
    const popularBvidAction = new BvidAction('popular-bvid-filter-status', 'global-bvid-filter-value', checkVideoList)
    const popularTitleKeywordAction = new TitleKeywordAction(
        'popular-title-keyword-filter-status',
        'global-title-keyword-filter-value',
        checkVideoList,
    )
    const popularUploaderWhitelistAction = new UploaderWhitelistAction(
        'popular-uploader-whitelist-filter-status',
        'global-uploader-whitelist-filter-value',
        checkVideoList,
    )
    const popularTitleKeywordWhitelistAction = new TitleKeywordWhitelistAction(
        'popular-title-keyword-whitelist-filter-status',
        'global-title-keyword-whitelist-filter-value',
        checkVideoList,
    )
    //=======================================================================================

    // 右键监听函数, 热门页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
    const contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            if (e.target instanceof HTMLElement) {
                const target = e.target
                if (
                    isContextMenuUploaderEnable &&
                    (target.classList.contains('up-name__text') || target.classList.contains('up-name'))
                ) {
                    // 命中UP主
                    const uploader = target.textContent
                    if (uploader) {
                        e.preventDefault()
                        const onclick = () => {
                            popularUploaderAction.add(uploader)
                        }
                        contextMenuInstance.registerMenu(`屏蔽UP主：${uploader}`, onclick)
                        contextMenuInstance.show(e.clientX, e.clientY)
                    }
                } else if (
                    isContextMenuBvidEnable &&
                    ((target.classList.contains('title') && target.closest('.info a') === target) ||
                        target.classList.contains('video-name') ||
                        target.classList.contains('lazy-image'))
                ) {
                    // 命中视频图片/视频标题, 提取bvid
                    let href = target.getAttribute('href') || target.parentElement?.getAttribute('href')
                    if (!href) {
                        href = target
                            .closest('.video-card')
                            ?.querySelector('.video-card__content > a')
                            ?.getAttribute('href')
                    }
                    if (href) {
                        const bvid = matchBvid(href)
                        if (bvid) {
                            e.preventDefault()
                            const onclick = () => {
                                popularBvidAction.add(bvid)
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
    const titleKeywordItems: (CheckboxItem | ButtonItem)[] = []
    const bvidItems: (CheckboxItem | ButtonItem)[] = []
    const uploaderItems: (CheckboxItem | ButtonItem)[] = []
    const whitelistItems: (CheckboxItem | ButtonItem)[] = []

    // UI组件, UP主过滤part
    {
        uploaderItems.push(
            new CheckboxItem(
                popularUploaderAction.statusKey,
                '启用 热门页 UP主过滤',
                false,
                () => {
                    // 启用右键功能
                    isContextMenuUploaderEnable = true
                    contextMenuFunc()
                    popularUploaderAction.enable()
                },
                false,
                null,
                () => {
                    // 禁用右键功能
                    isContextMenuUploaderEnable = false
                    popularUploaderAction.disable()
                },
            ),
        )
        // 按钮功能：打开uploader黑名单编辑框
        uploaderItems.push(
            new ButtonItem(
                'popular-uploader-edit-button',
                '编辑 UP主黑名单',
                '编辑',
                // 按钮功能
                () => {
                    popularUploaderAction.blacklist.show()
                },
            ),
        )
    }
    popularFilterGroupList.push(
        new Group('popular-uploader-filter-group', '热门页 UP主过滤 (右键单击UP主)', uploaderItems),
    )

    // UI组件, 标题关键词过滤part
    {
        titleKeywordItems.push(
            new CheckboxItem(
                popularTitleKeywordAction.statusKey,
                '启用 热门页 关键词过滤',
                false,
                () => {
                    popularTitleKeywordAction.enable()
                },
                false,
                null,
                () => {
                    popularTitleKeywordAction.disable()
                },
            ),
        )
        // 按钮功能：打开titleKeyword黑名单编辑框
        titleKeywordItems.push(
            new ButtonItem(
                'popular-title-keyword-edit-button',
                '编辑 关键词黑名单',
                '编辑',
                // 按钮功能
                () => {
                    popularTitleKeywordAction.blacklist.show()
                },
            ),
        )
    }
    popularFilterGroupList.push(
        new Group('popular-title-keyword-filter-group', '热门页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤part
    {
        bvidItems.push(
            new CheckboxItem(
                popularBvidAction.statusKey,
                '启用 热门页 BV号过滤',
                false,
                () => {
                    // 启用右键功能
                    isContextMenuBvidEnable = true
                    contextMenuFunc()
                    popularBvidAction.enable()
                },
                false,
                null,
                () => {
                    // 禁用右键功能
                    isContextMenuBvidEnable = false
                    popularBvidAction.disable()
                },
            ),
        )
        // 按钮功能：打开bvid黑名单编辑框
        bvidItems.push(
            new ButtonItem(
                'popular-bvid-edit-button',
                '编辑 BV号黑名单',
                '编辑',
                // 按钮功能
                () => {
                    popularBvidAction.blacklist.show()
                },
            ),
        )
    }
    popularFilterGroupList.push(new Group('popular-bvid-filter-group', '热门页 BV号过滤 (右键单击标题)', bvidItems))

    // UI组件, 例外和白名单part
    {
        whitelistItems.push(
            new CheckboxItem(
                popularUploaderWhitelistAction.statusKey,
                '启用 热门页 UP主白名单',
                false,
                () => {
                    popularUploaderWhitelistAction.enable()
                },
                false,
                null,
                () => {
                    popularUploaderWhitelistAction.disable()
                },
            ),
        )
        whitelistItems.push(
            new ButtonItem(
                'popular-uploader-whitelist-edit-button',
                '编辑 UP主白名单',
                '编辑',
                // 按钮功能：显示白名单编辑器
                () => {
                    popularUploaderWhitelistAction.whitelist.show()
                },
            ),
        )
        whitelistItems.push(
            new CheckboxItem(
                popularTitleKeywordWhitelistAction.statusKey,
                '启用 热门页 标题关键词白名单',
                false,
                () => {
                    popularTitleKeywordWhitelistAction.enable()
                },
                false,
                null,
                () => {
                    popularTitleKeywordWhitelistAction.disable()
                },
            ),
        )
        whitelistItems.push(
            new ButtonItem(
                'popular-title-keyword-whitelist-edit-button',
                '编辑 标题关键词白名单',
                '编辑',
                // 按钮功能：显示白名单编辑器
                () => {
                    popularTitleKeywordWhitelistAction.whitelist.show()
                },
            ),
        )
    }
    popularFilterGroupList.push(
        new Group('popular-whitelist-filter-group', '热门页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { popularFilterGroupList }

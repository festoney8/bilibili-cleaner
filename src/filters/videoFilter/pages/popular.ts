import { debugVideoFilter as debug, error } from '../../../utils/logger'
import coreFilterInstance, { VideoSelectorFunc } from '../filters/core'
import { ButtonItem, CheckboxItem } from '../../../components/item'
import { Group } from '../../../components/group'
import settings from '../../../settings'
import { isPagePopular } from '../../../utils/page-type'
import { ContextMenu } from '../../../components/contextmenu'
import { matchBvid, waitForEle } from '../../../utils/tool'
import {
    BvidAction,
    TitleKeywordAction,
    TitleKeywordWhitelistAction,
    UploaderAction,
    UploaderKeywordAction,
    UploaderWhitelistAction,
} from './actions/action'

const popularPageVideoFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false

if (isPagePopular()) {
    let videoListContainer: HTMLElement
    // 构建SelectorFunc
    const hotSelectorFunc: VideoSelectorFunc = {
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
    // 检测视频列表
    const checkVideoList = (fullSite: boolean) => {
        // debug('checkVideoList start')
        if (!videoListContainer) {
            debug(`checkVideoList videoListContainer not exist`)
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

            hotVideos.length && coreFilterInstance.checkAll([...hotVideos], false, hotSelectorFunc)
            // debug(`checkVideoList check ${hotVideos.length} hotVideos`)
            weeklyVideos.length && coreFilterInstance.checkAll([...weeklyVideos], false, hotSelectorFunc)
            // debug(`checkVideoList check ${weeklyVideos.length} weeklyVideos`)
            rankVideos.length && coreFilterInstance.checkAll([...rankVideos], false, hotSelectorFunc)
            // debug(`checkVideoList check ${rankVideos.length} rankVideos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }
    // 监听视频列表内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        if (videoListContainer) {
            debug('watchVideoListContainer start')
            // 初次全站检测
            checkVideoList(true)
            const videoObverser = new MutationObserver(() => {
                // 增量检测
                checkVideoList(true)
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

    // 配置 行为实例
    const popularUploaderAction = new UploaderAction(
        'popular-uploader-filter-status',
        'global-uploader-filter-value',
        checkVideoList,
    )
    const popularUploaderKeywordAction = new UploaderKeywordAction(
        'popular-uploader-keyword-filter-status',
        'global-uploader-keyword-filter-value',
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
        const menu = new ContextMenu()
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            menu.hide()
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
                        const onclickBlack = () => {
                            popularUploaderAction.add(uploader)
                        }
                        const onclickWhite = () => {
                            popularUploaderWhitelistAction.add(uploader)
                        }
                        menu.registerMenu(`◎ 屏蔽UP主：${uploader}`, onclickBlack)
                        menu.registerMenu(`◎ 将UP主加入白名单`, onclickWhite)
                        menu.show(e.clientX, e.clientY)
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

    // UI组件, UP主过滤part
    const uploaderItems = [
        // 启用 热门页 UP主过滤
        new CheckboxItem({
            itemID: popularUploaderAction.statusKey,
            description: '启用 UP主过滤 (右键单击UP主)',
            itemFunc: () => {
                // 启用右键功能
                isContextMenuUploaderEnable = true
                contextMenuFunc()
                popularUploaderAction.enable()
            },
            callback: () => {
                // 禁用右键功能
                isContextMenuUploaderEnable = false
                popularUploaderAction.disable()
            },
        }),
        // 按钮功能：打开uploader黑名单编辑框
        new ButtonItem({
            itemID: 'popular-uploader-edit-button',
            description: '编辑 UP主黑名单',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                popularUploaderAction.blacklist.show()
            },
        }),
        // 启用 UP主昵称关键词过滤
        new CheckboxItem({
            itemID: popularUploaderKeywordAction.statusKey,
            description: '启用 UP主昵称关键词过滤',
            itemFunc: () => {
                popularUploaderKeywordAction.enable()
            },
            callback: () => {
                popularUploaderKeywordAction.disable()
            },
        }),
        // 编辑 UP主昵称关键词黑名单
        new ButtonItem({
            itemID: 'popular-uploader-keyword-edit-button',
            description: '编辑 UP主昵称关键词黑名单',
            name: '编辑',
            itemFunc: () => {
                popularUploaderKeywordAction.blacklist.show()
            },
        }),
    ]
    popularPageVideoFilterGroupList.push(new Group('popular-uploader-filter-group', '热门页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤part
    const titleKeywordItems = [
        // 启用 热门页 关键词过滤
        new CheckboxItem({
            itemID: popularTitleKeywordAction.statusKey,
            description: '启用 标题关键词过滤',
            itemFunc: () => {
                popularTitleKeywordAction.enable()
            },
            callback: () => {
                popularTitleKeywordAction.disable()
            },
        }),
        // 按钮功能：打开titleKeyword黑名单编辑框
        new ButtonItem({
            itemID: 'popular-title-keyword-edit-button',
            description: '编辑 标题关键词黑名单（支持正则）',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                popularTitleKeywordAction.blacklist.show()
            },
        }),
    ]
    popularPageVideoFilterGroupList.push(
        new Group('popular-title-keyword-filter-group', '热门页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤part
    const bvidItems = [
        // 启用 热门页 BV号过滤
        new CheckboxItem({
            itemID: popularBvidAction.statusKey,
            description: '启用 BV号过滤 (右键单击标题)',
            itemFunc: () => {
                // 启用右键功能
                isContextMenuBvidEnable = true
                contextMenuFunc()
                popularBvidAction.enable()
            },
            callback: () => {
                // 禁用右键功能
                isContextMenuBvidEnable = false
                popularBvidAction.disable()
            },
        }),
        // 按钮功能：打开bvid黑名单编辑框
        new ButtonItem({
            itemID: 'popular-bvid-edit-button',
            description: '编辑 BV号黑名单',
            name: '编辑',
            // 按钮功能
            itemFunc: () => {
                popularBvidAction.blacklist.show()
            },
        }),
    ]
    popularPageVideoFilterGroupList.push(new Group('popular-bvid-filter-group', '热门页 BV号过滤', bvidItems))

    // UI组件, 例外和白名单part
    const whitelistItems = [
        // 启用 热门页 UP主白名单
        new CheckboxItem({
            itemID: popularUploaderWhitelistAction.statusKey,
            description: '启用 UP主白名单 (右键单击UP主)',
            itemFunc: () => {
                popularUploaderWhitelistAction.enable()
            },
            callback: () => {
                popularUploaderWhitelistAction.disable()
            },
        }),
        // 编辑 UP主白名单
        new ButtonItem({
            itemID: 'popular-uploader-whitelist-edit-button',
            description: '编辑 UP主白名单',
            name: '编辑',
            // 按钮功能：显示白名单编辑器
            itemFunc: () => {
                popularUploaderWhitelistAction.whitelist.show()
            },
        }),
        // 启用 热门页 标题关键词白名单
        new CheckboxItem({
            itemID: popularTitleKeywordWhitelistAction.statusKey,
            description: '启用 标题关键词白名单',
            itemFunc: () => {
                popularTitleKeywordWhitelistAction.enable()
            },
            callback: () => {
                popularTitleKeywordWhitelistAction.disable()
            },
        }),
        // 编辑 关键词白名单
        new ButtonItem({
            itemID: 'popular-title-keyword-whitelist-edit-button',
            description: '编辑 标题关键词白名单（支持正则）',
            name: '编辑',
            // 按钮功能：显示白名单编辑器
            itemFunc: () => {
                popularTitleKeywordWhitelistAction.whitelist.show()
            },
        }),
    ]
    popularPageVideoFilterGroupList.push(
        new Group('popular-whitelist-filter-group', '热门页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { popularPageVideoFilterGroupList }

import { debugFilter, error } from '../../utils/logger'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { Group } from '../../components/group'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import settings from '../../settings'
import { isPageHomepage } from '../../utils/page-type'
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

const homepageFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false
// 带已关注tag的视频不被过滤(实验性)
let isFollowingWhitelistEnable: boolean = GM_getValue('BILICLEANER_homepage-following-whitelist-filter-status', true)

if (isPageHomepage()) {
    // 页面载入后监听流程

    // 视频列表外层
    let videoListContainer: HTMLElement
    // 3. 检测视频列表
    const checkVideoList = (fullSite: boolean) => {
        // debugFilter('checkVideoList start')
        if (!videoListContainer) {
            // 在container未出现时, 各项屏蔽功能enable会调用checkVideoList, 需要判空
            debugFilter(`checkVideoList videoListContainer not exist`)
            return
        }
        try {
            let feedVideos: HTMLElement[]
            let rcmdVideos: HTMLElement[]
            if (!fullSite) {
                // 选取增量视频
                // feed: 10个顶部推荐位, 不含已过滤
                feedVideos = [
                    ...videoListContainer.querySelectorAll<HTMLElement>(
                        `:scope > .feed-card:not([${settings.filterSign}])`,
                    ),
                ]
                // rcmd: 瀑布推荐流, 不含feed, 不含已过滤, 不含未载入
                rcmdVideos = [
                    ...videoListContainer.querySelectorAll<HTMLElement>(
                        `:scope > .bili-video-card.is-rcmd:not([${settings.filterSign}])`,
                    ),
                ]
            } else {
                // 选取全站, 含已过滤的
                feedVideos = [...videoListContainer.querySelectorAll<HTMLElement>(`:scope > .feed-card`)]
                rcmdVideos = [...videoListContainer.querySelectorAll<HTMLElement>(`:scope > .bili-video-card.is-rcmd`)]
            }

            // 筛掉带有已关注标记的视频
            if (isFollowingWhitelistEnable) {
                feedVideos = feedVideos.filter((video) => {
                    const icontext = video.querySelector('.bili-video-card__info--icon-text')?.textContent?.trim()
                    if (icontext === '已关注') {
                        // 清除隐藏状态
                        showVideo(video)
                    }
                    return icontext !== '已关注'
                })
                rcmdVideos = rcmdVideos.filter((video) => {
                    const icontext = video.querySelector('.bili-video-card__info--icon-text')?.textContent?.trim()
                    if (icontext === '已关注') {
                        // 清除隐藏状态
                        showVideo(video)
                    }
                    return icontext !== '已关注'
                })
            }

            // 构建SelectorFunc
            const rcmdSelectorFunc: SelectorFunc = {
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
                        video.querySelector('a.bili-video-card__image--link')?.getAttribute('href') ||
                        video.querySelector('a.bili-video-card__image--link')?.getAttribute('data-target-url')
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
            const feedSelectorFunc = rcmdSelectorFunc
            feedVideos.length && coreFilterInstance.checkAll(feedVideos, true, feedSelectorFunc)
            // debugFilter(`checkVideoList check ${rcmdVideos.length} rcmd videos`)
            rcmdVideos.length && coreFilterInstance.checkAll(rcmdVideos, true, rcmdSelectorFunc)
            // debugFilter(`checkVideoList check ${feedVideos.length} feed videos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }
    // 2. 监听 videoListContainer 内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        if (videoListContainer) {
            debugFilter('watchVideoListContainer start')
            // 初次全站检测
            checkVideoList(true)
            const videoObverser = new MutationObserver(() => {
                // 增量检测
                checkVideoList(false)
            })
            videoObverser.observe(videoListContainer, { childList: true })
            debugFilter('watchVideoListContainer OK')
        }
    }
    // 1. 检测/监听 videoListContainer 出现, 出现后监听 videoListContainer 内部变化
    const waitForVideoListContainer = () => {
        // 检测/监听视频列表父节点出现
        videoListContainer = document.querySelector('.container.is-version8') as HTMLFormElement
        if (videoListContainer) {
            debugFilter('videoListContainer exist')
            watchVideoListContainer()
        } else {
            const obverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as HTMLElement).className === 'container is-version8') {
                                debugFilter('videoListContainer appear')
                                obverser.disconnect()
                                videoListContainer = document.querySelector('.container.is-version8') as HTMLElement
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
    const homepageDurationAction = new DurationAction(
        'homepage-duration-filter-status',
        'global-duration-filter-value',
        checkVideoList,
    )
    const homepageUploaderAction = new UploaderAction(
        'homepage-uploader-filter-status',
        'global-uploader-filter-value',
        checkVideoList,
    )
    const homepageBvidAction = new BvidAction('homepage-bvid-filter-status', 'global-bvid-filter-value', checkVideoList)
    const homepageTitleKeywordAction = new TitleKeywordAction(
        'homepage-title-keyword-filter-status',
        'global-title-keyword-filter-value',
        checkVideoList,
    )
    const homepageUploaderWhitelistAction = new UploaderWhitelistAction(
        'homepage-uploader-whitelist-filter-status',
        'global-uploader-whitelist-filter-value',
        checkVideoList,
    )
    const homepageTitleKeyworldWhitelistAction = new TitleKeywordWhitelistAction(
        'homepage-title-keyword-whitelist-filter-status',
        'global-title-keyword-whitelist-filter-value',
        checkVideoList,
    )

    //=======================================================================================

    // 右键监听函数, 首页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
    const contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            if (e.target instanceof HTMLElement) {
                // debugFilter(e.target.classList)
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
                            homepageUploaderAction.add(uploader)
                        }
                        const onclickWhite = () => {
                            homepageUploaderWhitelistAction.add(uploader)
                        }
                        contextMenuInstance.registerMenu(`◎ 屏蔽UP主：${uploader}`, onclickBlack)
                        contextMenuInstance.registerMenu(`◎ 将UP主加入白名单`, onclickWhite)
                        contextMenuInstance.show(e.clientX, e.clientY)
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
                            const onclick = () => {
                                homepageBvidAction.add(bvid)
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
                homepageDurationAction.statusKey,
                '启用 首页时长过滤',
                false,
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
                () => {
                    homepageDurationAction.enable()
                },
                false,
                null,
                () => {
                    homepageDurationAction.disable()
                },
            ),
        )
        durationItems.push(
            new NumberItem(
                homepageDurationAction.valueKey,
                '设定最低时长 (0~300s)',
                60,
                0,
                300,
                '秒',
                (value: number) => {
                    homepageDurationAction.change(value)
                },
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-duration-filter-group', '首页 视频时长过滤', durationItems))

    // UI组件, UP主过滤part
    {
        uploaderItems.push(
            new CheckboxItem(
                homepageUploaderAction.statusKey,
                '启用 首页UP主过滤',
                false,
                () => {
                    // 启用右键功能
                    isContextMenuUploaderEnable = true
                    contextMenuFunc()
                    homepageUploaderAction.enable()
                },
                false,
                null,
                () => {
                    // 禁用右键功能
                    isContextMenuUploaderEnable = false
                    homepageUploaderAction.disable()
                },
            ),
        )
        // 按钮功能：打开uploader黑名单编辑框
        uploaderItems.push(
            new ButtonItem(
                'homepage-uploader-edit-button',
                '编辑 UP主黑名单',
                '编辑',
                // 按钮功能
                () => {
                    homepageUploaderAction.blacklist.show()
                },
            ),
        )
    }
    homepageFilterGroupList.push(
        new Group('homepage-uploader-filter-group', '首页 UP主过滤 (右键单击UP主)', uploaderItems),
    )

    // UI组件, 标题关键词过滤part
    {
        titleKeywordItems.push(
            new CheckboxItem(
                homepageTitleKeywordAction.statusKey,
                '启用 首页关键词过滤',
                false,
                () => {
                    homepageTitleKeywordAction.enable()
                },
                false,
                null,
                () => {
                    homepageTitleKeywordAction.disable()
                },
            ),
        )
        // 按钮功能：打开titleKeyword黑名单编辑框
        titleKeywordItems.push(
            new ButtonItem(
                'homepage-title-keyword-edit-button',
                '编辑 关键词黑名单',
                '编辑',
                // 按钮功能
                () => {
                    homepageTitleKeywordAction.blacklist.show()
                },
            ),
        )
    }
    homepageFilterGroupList.push(
        new Group('homepage-title-keyword-filter-group', '首页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤part
    {
        bvidItems.push(
            new CheckboxItem(
                homepageBvidAction.statusKey,
                '启用 首页BV号过滤',
                false,
                () => {
                    // 启用右键功能
                    isContextMenuBvidEnable = true
                    contextMenuFunc()
                    homepageBvidAction.enable()
                },
                false,
                null,
                () => {
                    // 禁用右键功能
                    isContextMenuBvidEnable = false
                    homepageBvidAction.disable()
                },
            ),
        )
        // 按钮功能：打开bvid黑名单编辑框
        bvidItems.push(
            new ButtonItem(
                'homepage-bvid-edit-button',
                '编辑 BV号黑名单',
                '编辑',
                // 按钮功能
                () => {
                    homepageBvidAction.blacklist.show()
                },
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-bvid-filter-group', '首页 BV号过滤 (右键单击标题)', bvidItems))

    // UI组件, 例外和白名单part
    {
        // 已关注UP主 免过滤, 默认开启
        whitelistItems.push(
            new CheckboxItem(
                'homepage-following-whitelist-filter-status',
                '标有 [已关注] 的视频免过滤 (实验性)',
                true,
                () => {
                    isFollowingWhitelistEnable = true
                    // 触发全站检测
                    checkVideoList(true)
                },
                false,
                null,
                () => {
                    isFollowingWhitelistEnable = false
                    checkVideoList(true)
                },
            ),
        )
        whitelistItems.push(
            new CheckboxItem(
                homepageUploaderWhitelistAction.statusKey,
                '启用 首页UP主白名单',
                false,
                () => {
                    homepageUploaderWhitelistAction.enable()
                },
                false,
                null,
                () => {
                    homepageUploaderWhitelistAction.disable()
                },
            ),
        )
        whitelistItems.push(
            new ButtonItem(
                'homepage-uploader-whitelist-edit-button',
                '编辑 UP主白名单',
                '编辑',
                // 按钮功能：显示白名单编辑器
                () => {
                    homepageUploaderWhitelistAction.whitelist.show()
                },
            ),
        )
        whitelistItems.push(
            new CheckboxItem(
                homepageTitleKeyworldWhitelistAction.statusKey,
                '启用 首页标题关键词白名单',
                false,
                () => {
                    homepageTitleKeyworldWhitelistAction.enable()
                },
                false,
                null,
                () => {
                    homepageTitleKeyworldWhitelistAction.disable()
                },
            ),
        )
        whitelistItems.push(
            new ButtonItem(
                'homepage-title-keyword-whitelist-edit-button',
                '编辑 标题关键词白名单',
                '编辑',
                // 按钮功能：显示白名单编辑器
                () => {
                    homepageTitleKeyworldWhitelistAction.whitelist.show()
                },
            ),
        )
    }
    homepageFilterGroupList.push(
        new Group('homepage-whitelist-filter-group', '首页 白名单设定 (免过滤)', whitelistItems),
    )
}

export { homepageFilterGroupList }

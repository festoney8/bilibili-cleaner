import { debugFilter, error } from '../../utils/logger'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { Group } from '../../components/group'
import { isPageVideo } from '../../utils/page-type'
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

const videoFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false
// 接下来播放是否免过滤
let isNextPlayWhitelistEnable: boolean = GM_getValue('BILICLEANER_video-next-play-whitelist-filter-status', true)

if (isPageVideo()) {
    // 页面载入后监听流程

    // 视频列表外层
    let videoListContainer: HTMLElement | undefined = undefined
    // 3. 检测视频列表
    const checkVideoList = (_fullSite: boolean) => {
        // debugFilter('checkVideoList start')
        if (!videoListContainer) {
            debugFilter(`checkVideoList videoListContainer not exist`)
            return
        }
        try {
            // 接下来播放
            const nextVideos = videoListContainer.querySelectorAll<HTMLElement>(
                `.next-play .video-page-card-small, .next-play .video-page-operator-card-small`,
            )
            // 推荐列表
            const rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(
                `.rec-list .video-page-card-small, .rec-list .video-page-operator-card-small`,
            )
            // 构建SelectorFunc
            const rcmdSelectorFunc: SelectorFunc = {
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
                    const uploader = video.querySelector('.info > .upname a')?.textContent
                    return uploader ? uploader : null
                },
            }
            const nextSelectorFunc = rcmdSelectorFunc

            // 判断是否筛选接下来播放
            rcmdVideos.length && coreFilterInstance.checkAll([...rcmdVideos], false, rcmdSelectorFunc)
            // debugFilter(`checkVideoList check ${rcmdVideos.length} rcmd videos`)
            if (isNextPlayWhitelistEnable) {
                // 清除隐藏状态
                nextVideos.forEach((video) => showVideo(video))
            } else {
                nextVideos.length && coreFilterInstance.checkAll([...nextVideos], false, nextSelectorFunc)
                // debugFilter(`checkVideoList check ${nextVideos.length} next videos`)
            }
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
        // debugFilter('checkVideoList end')
    }
    // 2. 监听 videoListContainer 内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        if (videoListContainer) {
            debugFilter('watchVideoListContainer start')
            // 播放页右栏载入慢, 始终做全站检测
            checkVideoList(true)
            const videoObverser = new MutationObserver(() => {
                checkVideoList(true)
            })
            // 播放页需监听subtree
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debugFilter('watchVideoListContainer OK')
        }
    }
    // 1. 检测/监听 videoListContainer 出现, 出现后监听 videoListContainer 内部变化
    const waitForVideoListContainer = () => {
        debugFilter(`waitForVideoListContainer start`)
        // 检测/监听视频列表父节点出现
        videoListContainer = document.getElementById('reco_list') as HTMLFormElement
        if (videoListContainer) {
            debugFilter('videoListContainer exist')
            watchVideoListContainer()
        } else {
            const obverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if (node instanceof HTMLElement && (node as HTMLElement).id === 'reco_list') {
                                debugFilter('videoListContainer appear')
                                obverser.disconnect()
                                videoListContainer = document.getElementById('reco_list') as HTMLElement
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
    //=======================================================================================

    // 右键监听函数, 播放页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
    const contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            if (e.target instanceof HTMLElement) {
                // debugFilter(e.target.classList)
                const target = e.target
                if (
                    isContextMenuUploaderEnable &&
                    target.classList.contains('name')
                    // target.closest('.upname span.name') === target
                ) {
                    // 命中UP主
                    const uploader = target.textContent
                    if (uploader) {
                        e.preventDefault()
                        const onclickBlack = () => {
                            videoUploaderAction.add(uploader)
                        }
                        const onclickWhite = () => {
                            videoUploaderWhitelistAction.add(uploader)
                        }
                        contextMenuInstance.registerMenu(`◎ 屏蔽UP主：${uploader}`, onclickBlack)
                        contextMenuInstance.registerMenu(`◎ 将UP主加入白名单`, onclickWhite)
                        contextMenuInstance.show(e.clientX, e.clientY)
                    }
                } else if (
                    isContextMenuBvidEnable &&
                    target.classList.contains('title')
                    // target.closest('.info > a > p') === target
                ) {
                    // 命中视频标题, 提取bvid
                    const href = target.parentElement?.getAttribute('href')
                    if (href) {
                        const bvid = matchBvid(href)
                        if (bvid) {
                            e.preventDefault()
                            const onclick = () => {
                                videoBvidAction.add(bvid)
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
                videoDurationAction.statusKey,
                '启用 播放页 时长过滤',
                false,
                () => {
                    videoDurationAction.enable()
                },
                false,
                null,
                () => {
                    videoDurationAction.disable()
                },
            ),
        )
        durationItems.push(
            new NumberItem(videoDurationAction.valueKey, '设定最低时长 (0~300s)', 60, 0, 300, '秒', (value: number) =>
                videoDurationAction.change(value),
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-duration-filter-group', '播放页 视频时长过滤', durationItems))

    // UI组件, UP主过滤part
    {
        uploaderItems.push(
            new CheckboxItem(
                videoUploaderAction.statusKey,
                '启用 播放页 UP主过滤',
                false,
                () => {
                    // 启用右键菜单功能
                    isContextMenuUploaderEnable = true
                    contextMenuFunc()
                    videoUploaderAction.enable()
                },
                false,
                null,
                () => {
                    // 禁用右键菜单功能
                    isContextMenuUploaderEnable = false
                    videoUploaderAction.disable()
                },
            ),
        )
        uploaderItems.push(
            new ButtonItem(
                'video-uploader-edit-button',
                '编辑 UP主黑名单',
                '编辑',
                // 按钮功能：打开编辑器
                () => {
                    videoUploaderAction.blacklist.show()
                },
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-uploader-filter-group', '播放页 UP主过滤 (右键单击UP主)', uploaderItems))

    // UI组件, 标题关键词过滤part
    {
        titleKeywordItems.push(
            new CheckboxItem(
                videoTitleKeywordAction.statusKey,
                '启用 播放页关键词过滤',
                false,
                () => {
                    videoTitleKeywordAction.enable()
                },
                false,
                null,
                () => {
                    videoTitleKeywordAction.disable()
                },
            ),
        )
        titleKeywordItems.push(
            new ButtonItem(
                'video-title-keyword-edit-button',
                '编辑 关键词黑名单（支持正则）',
                '编辑',
                // 按钮功能：打开编辑器
                () => {
                    videoTitleKeywordAction.blacklist.show()
                },
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-title-keyword-filter-group', '播放页 标题关键词过滤', titleKeywordItems))

    // UI组件, bvid过滤part
    {
        bvidItems.push(
            new CheckboxItem(
                videoBvidAction.statusKey,
                '启用 播放页 BV号过滤',
                false,
                () => {
                    // 启用 右键功能
                    isContextMenuBvidEnable = true
                    contextMenuFunc()
                    videoBvidAction.enable()
                },
                false,
                null,
                () => {
                    // 禁用 右键功能
                    isContextMenuBvidEnable = false
                    videoBvidAction.disable()
                },
            ),
        )
        bvidItems.push(
            new ButtonItem(
                'video-bvid-edit-button',
                '编辑 BV号黑名单',
                '编辑',
                // 按钮功能：打开编辑器
                () => {
                    videoBvidAction.blacklist.show()
                },
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-bvid-filter-group', '播放页 BV号过滤 (右键单击标题)', bvidItems))

    // UI组件, 免过滤和白名单part
    {
        // 不过滤接下来播放, 默认开启
        whitelistItems.push(
            new CheckboxItem(
                'video-next-play-whitelist-filter-status',
                '接下来播放 免过滤',
                true,
                () => {
                    isNextPlayWhitelistEnable = true
                    checkVideoList(true)
                },
                false,
                null,
                () => {
                    isNextPlayWhitelistEnable = false
                    checkVideoList(true)
                },
            ),
        )
        whitelistItems.push(
            new CheckboxItem(
                videoUploaderWhitelistAction.statusKey,
                '启用 播放页UP主白名单',
                false,
                () => {
                    videoUploaderWhitelistAction.enable()
                },
                false,
                null,
                () => {
                    videoUploaderWhitelistAction.disable()
                },
            ),
        )
        whitelistItems.push(
            new ButtonItem(
                'video-uploader-whitelist-edit-button',
                '编辑 UP主白名单',
                '编辑',
                // 按钮功能：打开编辑器
                () => {
                    videoUploaderWhitelistAction.whitelist.show()
                },
            ),
        )
        whitelistItems.push(
            new CheckboxItem(
                videoTitleKeywordWhitelistAction.statusKey,
                '启用 播放页关键词白名单',
                false,
                () => {
                    videoTitleKeywordWhitelistAction.enable()
                },
                false,
                null,
                () => {
                    videoTitleKeywordWhitelistAction.disable()
                },
            ),
        )
        whitelistItems.push(
            new ButtonItem(
                'video-title-keyword-whitelist-edit-button',
                '编辑 关键词白名单（支持正则）',
                '编辑',
                // 按钮功能：打开编辑器
                () => {
                    videoTitleKeywordWhitelistAction.whitelist.show()
                },
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-whitelist-filter-group', '播放页 白名单设定 (免过滤)', whitelistItems))
}

export { videoFilterGroupList }

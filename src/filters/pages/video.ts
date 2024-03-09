import { debugFilter, error } from '../../utils/logger'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { Group } from '../../components/group'
import { isPageVideo } from '../../utils/page-type'
import contextMenuInstance from '../../components/contextmenu'
import { matchBvid, showVideo, waitForEle } from '../../utils/tool'
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
    let videoListContainer: HTMLElement
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
    // 检测视频列表
    const checkVideoList = (_fullSite: boolean) => {
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
    }

    // 监听视频列表内部变化, 有变化时检测视频列表
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

    try {
        // 监听视频列表出现
        waitForEle(document, '#reco_list', (node: Node): boolean => {
            return node instanceof HTMLElement && (node as HTMLElement).id === 'reco_list'
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

    // UI组件, 时长过滤part
    const durationItems = [
        // 启用 播放页时长过滤
        new CheckboxItem({
            itemID: videoDurationAction.statusKey,
            description: '启用 播放页时长过滤',
            itemFunc: () => {
                videoDurationAction.enable()
            },
            callback: () => {
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
            callback: (value: number) => {
                videoDurationAction.change(value)
            },
        }),
    ]
    videoFilterGroupList.push(new Group('video-duration-filter-group', '播放页 视频时长过滤', durationItems))

    // UI组件, UP主过滤part
    const uploaderItems = [
        // 启用 播放页UP主过滤
        new CheckboxItem({
            itemID: videoUploaderAction.statusKey,
            description: '启用 播放页UP主过滤',
            itemFunc: () => {
                // 启用右键菜单功能
                isContextMenuUploaderEnable = true
                contextMenuFunc()
                videoUploaderAction.enable()
            },
            callback: () => {
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
            itemFunc: () => {
                videoUploaderAction.blacklist.show()
            },
        }),
    ]
    videoFilterGroupList.push(new Group('video-uploader-filter-group', '播放页 UP主过滤 (右键单击UP主)', uploaderItems))

    // UI组件, 标题关键词过滤part
    const titleKeywordItems = [
        // 启用 播放页关键词过滤
        new CheckboxItem({
            itemID: videoTitleKeywordAction.statusKey,
            description: '启用 播放页关键词过滤',
            itemFunc: () => {
                videoTitleKeywordAction.enable()
            },
            callback: () => {
                videoTitleKeywordAction.disable()
            },
        }),
        // 编辑 关键词黑名单
        new ButtonItem({
            itemID: 'video-title-keyword-edit-button',
            description: '编辑 关键词黑名单（支持正则）',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                videoTitleKeywordAction.blacklist.show()
            },
        }),
    ]
    videoFilterGroupList.push(new Group('video-title-keyword-filter-group', '播放页 标题关键词过滤', titleKeywordItems))

    // UI组件, bvid过滤part
    const bvidItems = [
        // 启用 播放页 BV号过滤
        new CheckboxItem({
            itemID: videoBvidAction.statusKey,
            description: '启用 播放页BV号过滤',
            itemFunc: () => {
                // 启用 右键功能
                isContextMenuBvidEnable = true
                contextMenuFunc()
                videoBvidAction.enable()
            },
            callback: () => {
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
            itemFunc: () => {
                videoBvidAction.blacklist.show()
            },
        }),
    ]
    videoFilterGroupList.push(new Group('video-bvid-filter-group', '播放页 BV号过滤 (右键单击标题)', bvidItems))

    // UI组件, 免过滤和白名单part
    const whitelistItems = [
        // 接下来播放 免过滤
        new CheckboxItem({
            itemID: 'video-next-play-whitelist-filter-status',
            description: '接下来播放 免过滤',
            defaultStatus: true,
            itemFunc: () => {
                isNextPlayWhitelistEnable = true
                checkVideoList(true)
            },
            callback: () => {
                isNextPlayWhitelistEnable = false
                checkVideoList(true)
            },
        }),
        // 启用 播放页UP主白名单
        new CheckboxItem({
            itemID: videoUploaderWhitelistAction.statusKey,
            description: '启用 播放页UP主白名单',
            itemFunc: () => {
                videoUploaderWhitelistAction.enable()
            },
            callback: () => {
                videoUploaderWhitelistAction.disable()
            },
        }),
        // 编辑 UP主白名单
        new ButtonItem({
            itemID: 'video-uploader-whitelist-edit-button',
            description: '编辑 UP主白名单',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                videoUploaderWhitelistAction.whitelist.show()
            },
        }),
        // 启用 播放页关键词白名单
        new CheckboxItem({
            itemID: videoTitleKeywordWhitelistAction.statusKey,
            description: '启用 播放页关键词白名单',
            itemFunc: () => {
                videoTitleKeywordWhitelistAction.enable()
            },
            callback: () => {
                videoTitleKeywordWhitelistAction.disable()
            },
        }),
        // 编辑 关键词白名单
        new ButtonItem({
            itemID: 'video-title-keyword-whitelist-edit-button',
            description: '编辑 关键词白名单（支持正则）',
            name: '编辑',
            // 按钮功能：打开编辑器
            itemFunc: () => {
                videoTitleKeywordWhitelistAction.whitelist.show()
            },
        }),
    ]
    videoFilterGroupList.push(new Group('video-whitelist-filter-group', '播放页 白名单设定 (免过滤)', whitelistItems))
}

export { videoFilterGroupList }

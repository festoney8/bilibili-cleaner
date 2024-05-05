// @ts-ignore isolatedModules
import { GM_getValue, GM_registerMenuCommand, GM_unregisterMenuCommand } from '$'
import { log, error, debugMain as debug } from './utils/logger'
import { init } from './init'
import { Group } from './components/group'
import { homepageGroupList } from './rules/homepage'
import { commonGroupList } from './rules/common'
import { videoGroupList } from './rules/video'
import { bangumiGroupList } from './rules/bangumi'
import { searchGroupList } from './rules/search'
import { liveGroupList } from './rules/live'
import { dynamicGroupList } from './rules/dynamic'
import { popularGroupList } from './rules/popular'
import {
    isPageBangumi,
    isPageChannel,
    isPageHomepage,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageSpace,
    isPageVideo,
} from './utils/page-type'
import { homepagePageVideoFilterGroupList } from './filters/videoFilter/pages/homepage'
import { videoPageVideoFilterGroupList } from './filters/videoFilter/pages/video'
import { popularPageVideoFilterGroupList } from './filters/videoFilter/pages/popular'
import { searchPageVideoFilterGroupList } from './filters/videoFilter/pages/search'
import { SideBtn } from './components/sideBtn'
import { channelGroupList } from './rules/channel'
import { channelPageVideoFilterGroupList } from './filters/videoFilter/pages/channel'
import { videoPageCommentFilterGroupList } from './filters/commentFilter/pages/video'
import { spacePageVideoFilterGroupList } from './filters/videoFilter/pages/space'
import { Panel } from './components/panel'

const main = async () => {
    // 载入元素屏蔽规则
    const RULE_GROUPS = [
        ...homepageGroupList,
        ...popularGroupList,
        ...videoGroupList,
        ...bangumiGroupList,
        ...searchGroupList,
        ...dynamicGroupList,
        ...liveGroupList,
        ...channelGroupList,
        ...commonGroupList,
    ]
    RULE_GROUPS.forEach((e) => e.enableGroup())

    // 载入视频过滤器
    const VIDEO_FILTER_GROUPS = [
        ...homepagePageVideoFilterGroupList,
        ...videoPageVideoFilterGroupList,
        ...popularPageVideoFilterGroupList,
        ...searchPageVideoFilterGroupList,
        ...channelPageVideoFilterGroupList,
        ...spacePageVideoFilterGroupList,
    ]
    VIDEO_FILTER_GROUPS.forEach((e) => e.enableGroup())

    // 载入评论过滤器
    const COMMENT_FILTER_GROUPS = [...videoPageCommentFilterGroupList]
    COMMENT_FILTER_GROUPS.forEach((e) => e.enableGroup())

    // 监听各种形式的URL变化 (普通监听无法检测到切换视频)
    let lastURL = location.href
    setInterval(() => {
        const currURL = location.href
        if (currURL !== lastURL) {
            RULE_GROUPS.forEach((e) => e.reloadGroup())
            lastURL = currURL
        }
    }, 500)

    // 全局启动/关闭快捷键 chrome: Alt+B，firefox: Ctrl+Alt+B
    let isGroupEnable = true
    document.addEventListener('keydown', (event) => {
        if (
            event.altKey &&
            ['b', 'B'].includes(event.key) &&
            (event.ctrlKey || navigator.userAgent.toLocaleLowerCase().includes('chrome'))
        ) {
            debug('hotkey detected')
            if (isGroupEnable) {
                RULE_GROUPS.forEach((e) => e.disableGroup())
            } else {
                RULE_GROUPS.forEach((e) => e.enableGroup(false))
            }
            isGroupEnable = !isGroupEnable
        }
    })

    // 创建panel，插入功能
    const panel = new Panel()
    const createPanelWithMode = (mode: string, groups: Group[]) => {
        switch (panel.mode) {
            case undefined:
                panel.create()
                panel.mode = mode
                groups.forEach((e) => {
                    e.insertGroup()
                    e.insertGroupItems()
                })
                panel.show()
                break
            case mode:
                panel.show()
                break
            default:
                panel.clearGroups()
                panel.mode = mode
                groups.forEach((e) => {
                    e.insertGroup()
                    e.insertGroupItems()
                })
                panel.show()
        }
    }

    // 记录reg menu ID
    const regIDs: string[] = []
    const unregister = () => {
        regIDs.forEach((regID) => GM_unregisterMenuCommand(regID))
        regIDs.splice(0, regIDs.length)
    }
    const register = () => {
        regIDs.push(GM_registerMenuCommand('✅页面净化设置', () => createPanelWithMode('rule', RULE_GROUPS)))
        if (
            isPageHomepage() ||
            isPageVideo() ||
            isPagePopular() ||
            isPageSearch() ||
            isPageChannel() ||
            isPagePlaylist() ||
            isPageSpace()
        ) {
            regIDs.push(
                GM_registerMenuCommand('✅视频过滤设置', () => createPanelWithMode('videoFilter', VIDEO_FILTER_GROUPS)),
            )
        }
        if (isPageVideo() || isPageBangumi() || isPagePlaylist()) {
            regIDs.push(
                GM_registerMenuCommand('✅评论过滤设置', () =>
                    createPanelWithMode('commentFilter', COMMENT_FILTER_GROUPS),
                ),
            )
        }
        // 快捷按钮
        if (
            isPageHomepage() ||
            isPageVideo() ||
            isPagePopular() ||
            isPageSearch() ||
            isPageChannel() ||
            isPagePlaylist() ||
            isPageSpace()
        ) {
            const videoFilterSideBtnID = 'video-filter-side-btn'
            const sideBtn = new SideBtn(videoFilterSideBtnID, '视频过滤', () => {
                panel.isShowing ? panel.hide() : createPanelWithMode('videoFilter', VIDEO_FILTER_GROUPS)
            })
            if (GM_getValue(`BILICLEANER_${videoFilterSideBtnID}`, false)) {
                sideBtn.enable()
                regIDs.push(
                    GM_registerMenuCommand('⚡️关闭 视频过滤 快捷按钮', () => {
                        sideBtn.disable()
                        unregister()
                        register()
                    }),
                )
            } else {
                regIDs.push(
                    GM_registerMenuCommand('⚡️启用 视频过滤 快捷按钮', () => {
                        sideBtn.enable()
                        unregister()
                        register()
                    }),
                )
            }
        }
        if (isPageVideo() || isPageBangumi() || isPagePlaylist()) {
            const commentFilterSideBtnID = 'comment-filter-side-btn'
            const sideBtn = new SideBtn(commentFilterSideBtnID, '评论过滤', () => {
                panel.isShowing ? panel.hide() : createPanelWithMode('commentFilter', COMMENT_FILTER_GROUPS)
            })
            if (GM_getValue(`BILICLEANER_${commentFilterSideBtnID}`, false)) {
                sideBtn.enable()
                regIDs.push(
                    GM_registerMenuCommand('⚡️关闭 评论过滤 快捷按钮', () => {
                        sideBtn.disable()
                        unregister()
                        register()
                    }),
                )
            } else {
                regIDs.push(
                    GM_registerMenuCommand('⚡️启用 评论过滤 快捷按钮', () => {
                        sideBtn.enable()
                        unregister()
                        register()
                    }),
                )
            }
        }
    }
    register()
}

try {
    log('script start')
    await init()
    await main()
    log('script end')
} catch (err) {
    error(err)
}

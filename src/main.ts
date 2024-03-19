// @ts-ignore isolatedModules
import { GM_getValue, GM_registerMenuCommand } from '$'
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
    isPagePopular,
    isPageSearch,
    isPageVideo,
} from './utils/page-type'
import { homepagePageVideoFilterGroupList } from './filters/videoFilter/pages/homepage'
import { videoPageVideoFilterGroupList } from './filters/videoFilter/pages/video'
import { popularPageVideoFilterGroupList } from './filters/videoFilter/pages/popular'
import { searchPageVideoFilterGroupList } from './filters/videoFilter/pages/search'
import { SideBtn } from './components/sideBtn'
import { channelGroupList } from './rules/channel'
import { channelPageVideoFilterGroupList } from './filters/videoFilter/pages/channel'
import panelInstance from './components/panel'
import { videoPageCommentFilterGroupList } from './filters/commentFilter/pages/video'

log('script start')

const main = async () => {
    // 初始化
    try {
        await init()
    } catch (err) {
        error(err)
        error('init error, try continue')
    }

    // 载入元素屏蔽规则
    const RULE_GROUPS: Group[] = [
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
    const VIDEO_FILTER_GROUPS: Group[] = [
        ...homepagePageVideoFilterGroupList,
        ...videoPageVideoFilterGroupList,
        ...popularPageVideoFilterGroupList,
        ...searchPageVideoFilterGroupList,
        ...channelPageVideoFilterGroupList,
    ]
    VIDEO_FILTER_GROUPS.forEach((e) => e.enableGroup())

    // 载入评论过滤器
    const COMMENT_FILTER_GROUPS: Group[] = [...videoPageCommentFilterGroupList]
    COMMENT_FILTER_GROUPS.forEach((e) => e.enableGroup())

    // 监听各种形式的URL变化 (普通监听无法检测到切换视频)
    let lastURL = location.href
    setInterval(() => {
        const currURL = location.href
        if (currURL !== lastURL) {
            debug('url change detected')
            RULE_GROUPS.forEach((e) => e.reloadGroup())
            lastURL = currURL
            debug('url change reload groups complete')
        }
    }, 500)

    // 全局启动/关闭快捷键 chrome: Alt+B，firefox: Ctrl+Alt+B
    let isGroupEnable = true
    document.addEventListener('keydown', (event) => {
        let flag = false
        if (event.altKey && event.ctrlKey && (event.key === 'b' || event.key === 'B')) {
            flag = true
        } else if (event.altKey && (event.key === 'b' || event.key === 'B')) {
            if (navigator.userAgent.toLocaleLowerCase().includes('chrome')) {
                flag = true
            }
        }
        if (flag) {
            debug('hotkey detected')
            if (isGroupEnable) {
                RULE_GROUPS.forEach((e) => e.disableGroup())
                isGroupEnable = false
            } else {
                RULE_GROUPS.forEach((e) => e.enableGroup(false))
                isGroupEnable = true
            }
        }
    })

    // 注册油猴菜单, 根据功能模式显示不同panel
    const createPanelWithMode = (mode: string, groups: Group[]) => {
        switch (panelInstance.mode) {
            case undefined:
                debug(`${mode} panel create start`)
                panelInstance.create()
                panelInstance.mode = mode
                groups.forEach((e) => {
                    e.insertGroup()
                    e.insertGroupItems()
                })
                panelInstance.show()
                debug(`${mode} panel create complete`)
                break
            case mode:
                debug(`${mode} panel exist, just show it`)
                panelInstance.show()
                break
            default:
                debug(`${mode} panel replace other panel`)
                panelInstance.clearGroups()
                panelInstance.mode = mode
                groups.forEach((e) => {
                    e.insertGroup()
                    e.insertGroupItems()
                })
                panelInstance.show()
                debug(`${mode} panel replace complete`)
        }
    }
    // 页面净化设置
    GM_registerMenuCommand('✅页面净化设置', () => {
        createPanelWithMode('rule', RULE_GROUPS)
    })
    // 视频过滤设置
    if (isPageHomepage() || isPageVideo() || isPagePopular() || isPageSearch() || isPageChannel()) {
        GM_registerMenuCommand('✅视频过滤设置', () => {
            createPanelWithMode('videoFilter', VIDEO_FILTER_GROUPS)
        })
    }
    // 评论过滤设置
    if (isPageVideo() || isPageBangumi()) {
        GM_registerMenuCommand('✅评论过滤设置', () => {
            createPanelWithMode('commentFilter', COMMENT_FILTER_GROUPS)
        })
    }
    // 视频过滤 快捷按钮
    if (isPageHomepage() || isPageVideo() || isPagePopular() || isPageSearch() || isPageChannel()) {
        const videoFilterSideBtnID = 'video-filter-side-btn'
        const sideBtn = new SideBtn(
            videoFilterSideBtnID,
            '视频过滤',
            () => {
                createPanelWithMode('videoFilter', VIDEO_FILTER_GROUPS)
            },
            () => {
                panelInstance.hide()
            },
        )
        if (GM_getValue(`BILICLEANER_${videoFilterSideBtnID}`, false)) {
            sideBtn.enable()
            GM_registerMenuCommand('⚡️关闭 视频过滤 快捷按钮 (刷新)', () => {
                sideBtn.disable()
            })
        } else {
            GM_registerMenuCommand('⚡️启用 视频过滤 快捷按钮 (刷新)', () => {
                sideBtn.enable()
            })
        }
    }
    // 评论过滤 快捷按钮
    if (isPageVideo() || isPageBangumi()) {
        const commentFilterSideBtnID = 'comment-filter-side-btn'
        const sideBtn = new SideBtn(
            commentFilterSideBtnID,
            '评论过滤',
            () => {
                createPanelWithMode('commentFilter', COMMENT_FILTER_GROUPS)
            },
            () => {
                panelInstance.hide()
            },
        )
        if (GM_getValue(`BILICLEANER_${commentFilterSideBtnID}`, false)) {
            sideBtn.enable()
            GM_registerMenuCommand('⚡️关闭 评论过滤 快捷按钮 (刷新)', () => {
                sideBtn.disable()
            })
        } else {
            GM_registerMenuCommand('⚡️启用 评论过滤 快捷按钮 (刷新)', () => {
                sideBtn.enable()
            })
        }
    }
    debug('register menu complete')
}

try {
    await main()
} catch (err) {
    error(err)
}
log('script end')

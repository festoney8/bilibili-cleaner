// @ts-ignore isolatedModules
import { GM_registerMenuCommand } from '$'
import { log, error, debug } from './utils/logger'
import { init } from './init'
import { Panel } from './core/panel'
import { Group } from './core/group'
import { homepageGroupList } from './pages/homepage'
import { commonGroupList } from './pages/common'
import { videoGroupList } from './pages/video'
import { bangumiGroupList } from './pages/bangumi'
import { searchGroupList } from './pages/search'
import { liveGroupList } from './pages/live'
import { dynamicGroupList } from './pages/dynamic'
import { popularGroupList } from './pages/popular'

log('script start')

const main = async () => {
    // 初始化
    try {
        await init()
    } catch (err) {
        error(err)
        error('init error, try continue')
    }

    // 载入规则
    const GROUPS: Group[] = [
        ...homepageGroupList,
        ...popularGroupList,
        ...videoGroupList,
        ...bangumiGroupList,
        ...searchGroupList,
        ...dynamicGroupList,
        ...liveGroupList,
        ...commonGroupList,
    ]
    GROUPS.forEach((e) => e.enableGroup())

    // 监听各种形式的URL变化 (普通监听无法检测到切换视频)
    let lastURL = location.href
    setInterval(() => {
        const currURL = location.href
        if (currURL !== lastURL) {
            debug('url change detected')
            GROUPS.forEach((e) => e.reloadGroup())
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
            debug('keydown Alt+B detected')
            if (isGroupEnable) {
                GROUPS.forEach((e) => e.disableGroup())
                isGroupEnable = false
            } else {
                GROUPS.forEach((e) => e.enableGroup(true))
                isGroupEnable = true
            }
        }
    })

    // 注册油猴插件菜单
    const openSettings = () => {
        const panel = document.getElementById('bili-cleaner') as HTMLFormElement
        if (panel) {
            // 再次打开panel, 显示上次位置
            panel.style.removeProperty('display')
            return
        }
        debug('panel create start')
        const newPanel = new Panel()
        newPanel.createPanel()
        GROUPS.forEach((e) => {
            e.insertGroup()
            e.insertGroupItems()
        })
        debug('panel create complete')
    }
    GM_registerMenuCommand('设置', openSettings)
    debug('register menu complete')
}

try {
    await main()
} catch (err) {
    error(err)
}
log('script end')

// @ts-ignore isolatedModules
import { GM_registerMenuCommand } from '$'
import { log, error, debug } from './utils/logger'
import { init } from './init'
import { Panel } from './core/panel'
import { Group } from './core/group'
import { homepageGroup } from './pages/homepage'
import { commonGroup } from './pages/common'
import { videoGroup } from './pages/video'
import { bangumiGroup } from './pages/bangumi'
import { searchGroup } from './pages/search'
import { liveGroup } from './pages/live'
import { dynamicGroup } from './pages/dynamic'

log('script start')

const main = () => {
    // 初始化
    try {
        init()
    } catch (err) {
        error('init error, try continue')
    }

    // 载入规则
    const GROUPS: Group[] = []
    homepageGroup.isEmpty() || GROUPS.push(homepageGroup)
    videoGroup.isEmpty() || GROUPS.push(videoGroup)
    bangumiGroup.isEmpty() || GROUPS.push(bangumiGroup)
    searchGroup.isEmpty() || GROUPS.push(searchGroup)
    dynamicGroup.isEmpty() || GROUPS.push(dynamicGroup)
    liveGroup.isEmpty() || GROUPS.push(liveGroup)
    commonGroup.isEmpty() || GROUPS.push(commonGroup)
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

    // chrome系浏览器补丁
    // firefox可用观测head解决head null, chrome系观测到head构建后仍小可能出bug, 只出现在bangumi page
    // 测试可知, 从document-start开始, chrome系的head永远非null, head内插入style均成功
    // 在DOMContentLoaded时, style数量正确
    // 在readyState=complete后, style数量有概率会减少, 规则丢失, 原因不明
    // 故在bangumi page监听load, 二次检查解决规则载入不全问题
    if (location.pathname.startsWith('/bangumi/play') && navigator.userAgent.toLowerCase().includes('chrome')) {
        window.addEventListener('load', () => {
            debug('chrome patch, recheck start')
            for (let i = GROUPS.length - 1; i >= 0; i--) {
                GROUPS[i].enableGroup()
            }
            debug('chrome patch, recheck complete')
        })
    }

    // 注册油猴插件菜单
    const openSettings = () => {
        if (document.getElementById('bili-cleaner')) {
            return
        }
        debug('panel create start')
        const panel = new Panel()
        panel.createPanel()
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
    main()
} catch (err) {
    error(err)
}

log('script end')

// @ts-ignore isolatedModules
import { init } from './init'
import { log, error, debug } from './utils/logging'
import { Panel } from './core/panel'
import { GM_registerMenuCommand } from '$'

log('script start')

try {
    init()
} catch (err) {
    error(err)
    error('FATAL ERROR, EXIT')
}

const openSettings = () => {
    if (document.getElementById('bili-cleaner')) {
        return
    }
    debug('panel create start')
    const panel = new Panel()
    panel.createPanel()
    // GROUPS.forEach((e) => {
    //     e.insertGroup()
    //     e.insertItems()
    // })
    debug('panel create complete')
}
// 注册油猴插件菜单
GM_registerMenuCommand('设置', openSettings)
debug('register menu complete')
log('script end')

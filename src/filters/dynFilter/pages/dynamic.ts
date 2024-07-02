import { Group } from '../../../components/group'
import { CheckboxItem, ButtonItem } from '../../../components/item'
import { debugDynFilter as debug, error } from '../../../utils/logger'
import { isPageDynamic } from '../../../utils/pageType'
import { waitForEle } from '../../../utils/tool'
import { DynUploaderAction } from './actions/action'
import coreDynFilterInstance, { DynSelectorFunc } from '../filters/core'
import settings from '../../../settings'
import { ContextMenu } from '../../../components/contextmenu'

const dynamicPageDynFilterGroupList: Group[] = []

// 右键菜单功能
let isContextMenuFuncRunning = false
let isContextMenuDynUploaderEnable = false

if (isPageDynamic()) {
    let dynListContainer: HTMLElement

    const dynSelectorFunc: DynSelectorFunc = {
        dynUploader: (dyn: Element): string | null => {
            const dynUploader = dyn.querySelector('.bili-dyn-title__text')?.textContent?.trim()
            return dynUploader ? dynUploader : null
        },
    }

    // 检测动态列表
    const checkDynList = (fullSite: boolean) => {
        if (!dynListContainer) {
            debug(`checkDynList dynListContainer not exist`)
            return
        }
        // 排除查看指定用户动态的情况
        if (!dynListContainer.querySelector('.bili-dyn-list-tabs')) {
            return
        }
        try {
            let dyns
            if (fullSite) {
                dyns = dynListContainer.querySelectorAll<HTMLElement>(`.bili-dyn-list__item`)
            } else {
                dyns = dynListContainer.querySelectorAll<HTMLElement>(
                    `.bili-dyn-list__item:not([${settings.filterSign}])`,
                )
            }
            dyns.length && coreDynFilterInstance.checkAll([...dyns], true, dynSelectorFunc)
            debug(`check ${dyns.length} dyns`)
        } catch (err) {
            error(err)
            error('checkDynList error')
        }
    }

    // 配置 行为实例
    const dynUploaderAction = new DynUploaderAction(
        'dynamic-dyn-uploader-filter-status',
        'dynamic-dyn-uploader-filter-value',
        checkDynList,
    )

    // 监听动态列表内部变化, 有变化时检测动态列表
    const watchDynListContainer = () => {
        const check = async (fullSite: boolean) => {
            if (dynUploaderAction.status) {
                checkDynList(fullSite)
            }
        }
        if (dynListContainer) {
            // 初次全站检测
            check(true).then().catch()
            const dynObserver = new MutationObserver(() => {
                // 增量检测
                check(false).then().catch()
            })
            dynObserver.observe(dynListContainer, { childList: true, subtree: true })
        }
    }

    try {
        waitForEle(
            document,
            '.bili-dyn-home--member',
            (node: HTMLElement): boolean => node.className === 'bili-dyn-home--member',
        ).then((ele) => {
            if (ele) {
                dynListContainer = ele
                watchDynListContainer()
            }
        })
    } catch (err) {
        error(err)
        error(`watch dyn list ERROR`)
    }

    //=======================================================================================

    // 右键监听函数, 屏蔽动态用户
    const contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        const menu = new ContextMenu()
        document.addEventListener('contextmenu', (e) => {
            menu.hide()
            if (e.target instanceof HTMLElement) {
                const target = e.target
                if (isContextMenuDynUploaderEnable && target.classList.contains('bili-dyn-title__text')) {
                    if (document.querySelector('.bili-dyn-list-tabs')) {
                        // 命中用户
                        const dynUploader = target.textContent?.trim()
                        if (dynUploader) {
                            e.preventDefault()
                            menu.registerMenu(`隐藏用户：${dynUploader}`, () => {
                                dynUploaderAction.add(dynUploader)
                            })
                            menu.show(e.clientX, e.clientY)
                        }
                    }
                } else {
                    menu.hide()
                }
            }
        })
        debug('contextMenuFunc listen contextmenu')
    }

    //=======================================================================================
    // 构建UI菜单

    // UI组件, 用户名过滤part
    const dynUploaderItems = [
        // 启用 用户名过滤
        new CheckboxItem({
            itemID: dynUploaderAction.statusKey,
            description: '启用 用户名过滤 (右键单击用户名)\n不取关用户，仅隐藏他的动态',
            enableFunc: async () => {
                // 启用右键菜单功能
                isContextMenuDynUploaderEnable = true
                contextMenuFunc()
                dynUploaderAction.enable()
            },
            disableFunc: async () => {
                // 禁用右键菜单功能
                isContextMenuDynUploaderEnable = false
                dynUploaderAction.disable()
            },
        }),
        // 编辑 用户名列表
        new ButtonItem({
            itemID: 'dyn-dynUploader-edit-button',
            description: '编辑 用户名列表',
            name: '编辑',
            itemFunc: async () => {
                dynUploaderAction.blacklist.show()
            },
        }),
    ]
    dynamicPageDynFilterGroupList.push(new Group('dyn-dynUploader-filter-group', '动态页 用户过滤', dynUploaderItems))
}

export { dynamicPageDynFilterGroupList }

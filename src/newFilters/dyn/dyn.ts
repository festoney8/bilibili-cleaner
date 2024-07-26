import { GM_getValue, GM_setValue } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import settings from '../../settings'
import { error } from '../../utils/logger'
import { isPageDynamic, isPageSpace } from '../../utils/pageType'
import { convertTimeToSec, showEle, waitForEle } from '../../utils/tool'
import { coreCheck, SelectorResult, SubFilterPair } from '../core/core'
import { DynDurationFilter, DynUploaderFilter, DynVideoTitleFilter } from './subFilters/black'

const GM_KEYS = {
    black: {
        uploader: {
            statusKey: 'dyn-uploader-filter-status',
            valueKey: 'dyn-uploader-filter-value',
        },
        duration: {
            statusKey: 'dyn-duration-filter-status',
            valueKey: 'global-duration-filter-value',
        },
        title: {
            statusKey: 'dyn-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
    },
}

const dynamicPageDynFilterGroupList: Group[] = []

if (isPageDynamic() || isPageSpace()) {
    // 初始化黑名单
    const dynUploaderFilter = new DynUploaderFilter()
    dynUploaderFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.uploader.valueKey}`, []))
    const dynDurationFilter = new DynDurationFilter()
    dynDurationFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.duration.valueKey}`, 0))
    const dynVideoTitleFilter = new DynVideoTitleFilter()
    dynVideoTitleFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.title.valueKey}`, []))

    let dynListContainer: HTMLElement // 动态列表容器
    let isAllDyn = true // 是否为全部动态

    // 动态信息提取
    const selectorFns = {
        uploader: (dyn: Element): SelectorResult => {
            if (!isAllDyn) {
                return undefined
            }
            return dyn.querySelector('.bili-dyn-title__text')?.textContent?.trim()
        },
        duration: (dyn: Element): SelectorResult => {
            const time = dyn.querySelector('.bili-dyn-card-video__cover-shadow .duration-time')?.textContent?.trim()
            return time ? convertTimeToSec(time) : undefined
        },
        title: (dyn: Element): SelectorResult => {
            return dyn.querySelector('.bili-dyn-card-video__title')?.textContent?.trim()
        },
    }

    // 右键监听, 屏蔽动态用户
    let isContextMenuFuncRunning = false
    let isContextMenuUploaderEnable = false
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
                if (isContextMenuUploaderEnable && target.classList.contains('bili-dyn-title__text')) {
                    if (document.querySelector('.bili-dyn-list-tabs')) {
                        // 命中用户
                        const uploader = target.textContent?.trim()
                        if (uploader) {
                            e.preventDefault()
                            menu.registerMenu(`隐藏用户：${uploader}`, () => {
                                dynUploaderFilter.addParam(uploader)
                                checkDynList(true)
                                try {
                                    const arr: string[] = GM_getValue(
                                        `BILICLEANER_${GM_KEYS.black.uploader.valueKey}`,
                                        [],
                                    )
                                    if (!arr.includes(uploader)) {
                                        arr.unshift(uploader)
                                        GM_setValue(`BILICLEANER_${GM_KEYS.black.uploader.valueKey}`, arr)
                                    }
                                } catch (err) {
                                    error('contextMenuFunc addParam error', err)
                                }
                            })
                            menu.show(e.clientX, e.clientY)
                        }
                    }
                } else {
                    menu.hide()
                }
            }
        })
    }

    // 检测动态列表
    const checkDynList = (fullSite: boolean) => {
        if (!dynListContainer) {
            return
        }

        // 是否选中全部动态
        isAllDyn = !!dynListContainer.querySelector('.bili-dyn-list-tabs')

        try {
            // 提取元素
            let dyns: HTMLElement[] = []
            if (fullSite) {
                dyns = Array.from(dynListContainer.querySelectorAll<HTMLElement>(`.bili-dyn-list__item`))
            } else {
                dyns = Array.from(
                    dynListContainer.querySelectorAll<HTMLElement>(
                        `.bili-dyn-list__item:not([${settings.filterSign}])`,
                    ),
                )
            }
            // 构建黑白检测任务
            if (dyns.length) {
                const blackPairs: SubFilterPair[] = []
                dynUploaderFilter.isEnable && blackPairs.push([dynUploaderFilter, selectorFns.uploader])
                dynDurationFilter.isEnable && blackPairs.push([dynDurationFilter, selectorFns.duration])
                dynVideoTitleFilter.isEnable && blackPairs.push([dynVideoTitleFilter, selectorFns.title])
                coreCheck(dyns, true, blackPairs, [])
            } else {
                dyns.forEach((el) => showEle(el))
            }
            console.log(`check ${dyns.length} dyns`)
        } catch (err) {
            error('checkDynList error', err)
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
                // 监听动态列表内部变化
                checkDynList(true)
                new MutationObserver(() => {
                    checkDynList(false)
                }).observe(dynListContainer, { childList: true, subtree: true })
            }
        })
    } catch (err) {
        error(`watch dyn list ERROR`, err)
    }

    // UI组件, 用户名过滤
    const uploaderItems = [
        // 启用 动态页 用户名过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.uploader.statusKey,
            description: '启用 动态页 用户名过滤\n(右键单击用户名)',
            enableFunc: () => {
                isContextMenuUploaderEnable = true
                contextMenuFunc()
                dynUploaderFilter.enable()
                checkDynList(true)
            },
            disableFunc: () => {
                isContextMenuUploaderEnable = false
                dynUploaderFilter.disable()
                checkDynList(true)
            },
        }),
        // 编辑 用户名列表
        new ButtonItem({
            itemID: 'dyn-uploader-edit-button',
            description: '编辑 用户名列表',
            name: '编辑',
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.uploader.valueKey,
                    '隐藏动态 用户名列表',
                    '每行一个用户名，保存时自动去重',
                    (values: string[]) => {
                        dynUploaderFilter.setParam(values)
                        checkDynList(true)
                    },
                ).show()
            },
        }),
    ]
    dynamicPageDynFilterGroupList.push(new Group('dyn-uploader-filter-group', '动态页 用户过滤', uploaderItems))

    // UI组件, 时长过滤
    const durationItems = [
        // 启用 动态页时长过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.duration.statusKey,
            description: '启用 时长过滤',
            enableFunc: () => {
                dynDurationFilter.enable()
                checkDynList(true)
            },
            disableFunc: () => {
                dynDurationFilter.disable()
                checkDynList(true)
            },
        }),
        // 设定最低时长
        new NumberItem({
            itemID: GM_KEYS.black.duration.valueKey,
            description: '设定最低时长 (0~300s)',
            defaultValue: 60,
            minValue: 0,
            maxValue: 300,
            disableValue: 0,
            unit: '秒',
            callback: async (value: number) => {
                dynDurationFilter.setParam(value)
                checkDynList(true)
            },
        }),
    ]
    dynamicPageDynFilterGroupList.push(new Group('dyn-duration-filter-group', '动态页 时长过滤', durationItems))

    // UI组件, 评论内容过滤
    const titleItems = [
        // 启用 视频标题 关键词过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.title.statusKey,
            description: '启用 视频标题 关键词过滤',
            enableFunc: () => {
                dynVideoTitleFilter.enable()
                checkDynList(true)
            },
            disableFunc: () => {
                dynVideoTitleFilter.disable()
                checkDynList(true)
            },
        }),
        // 编辑 关键词黑名单
        new ButtonItem({
            itemID: 'dyn-title-edit-button',
            description: '编辑 标题关键词黑名单（支持正则）',
            name: '编辑',
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.title.valueKey,
                    '标题关键词 黑名单',
                    `每行一个关键词或正则，不区分大小写\n正则默认iv模式无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        dynVideoTitleFilter.setParam(values)
                        checkDynList(true)
                    },
                ).show()
            },
        }),
    ]
    dynamicPageDynFilterGroupList.push(new Group('dyn-title-filter-group', '动态页 标题关键词过滤', titleItems))
}

export { dynamicPageDynFilterGroupList }

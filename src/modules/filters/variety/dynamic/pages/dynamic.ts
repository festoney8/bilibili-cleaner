import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { error, log } from '../../../../../utils/logger'
import { isPageDynamic, isPageSpace } from '../../../../../utils/pageType'
import { convertTimeToSec, waitForEle } from '../../../../../utils/tool'
import { coreCheck } from '../../../core/core'
import { DynDurationFilter, DynUploaderFilter, DynVideoTitleFilter } from '../subFilters/black'

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
        uploader: (dyn: HTMLElement): SelectorResult => {
            if (!isAllDyn) {
                return undefined
            }
            return dyn.querySelector('.bili-dyn-title__text')?.textContent?.trim()
        },
        duration: (dyn: HTMLElement): SelectorResult => {
            const time = dyn.querySelector('.bili-dyn-card-video__cover-shadow .duration-time')?.textContent?.trim()
            return time ? convertTimeToSec(time) : undefined
        },
        title: (dyn: HTMLElement): SelectorResult => {
            return dyn.querySelector('.bili-dyn-card-video__title')?.textContent?.trim()
        },
    }

    // // 右键监听, 屏蔽动态用户
    // let isContextMenuFuncRunning = false
    // let isContextMenuUploaderEnable = false
    // const contextMenuFunc = () => {
    //     if (isContextMenuFuncRunning) {
    //         return
    //     }
    //     isContextMenuFuncRunning = true
    //     const menu = new ContextMenu()
    //     document.addEventListener('contextmenu', (e) => {
    //         menu.hide()
    //         if (e.target instanceof HTMLElement) {
    //             const target = e.target
    //             if (isContextMenuUploaderEnable && target.classList.contains('bili-dyn-title__text')) {
    //                 if (document.querySelector('.bili-dyn-list-tabs')) {
    //                     // 命中用户
    //                     const uploader = target.textContent?.trim()
    //                     if (uploader) {
    //                         e.preventDefault()
    //                         menu.registerMenu(`隐藏用户动态：${uploader}`, () => {
    //                             dynUploaderFilter.addParam(uploader)
    //                             check(true)
    //                             try {
    //                                 const arr: string[] = GM_getValue(
    //                                     `BILICLEANER_${GM_KEYS.black.uploader.valueKey}`,
    //                                     [],
    //                                 )
    //                                 if (!arr.includes(uploader)) {
    //                                     arr.unshift(uploader)
    //                                     GM_setValue(`BILICLEANER_${GM_KEYS.black.uploader.valueKey}`, arr)
    //                                 }
    //                             } catch (err) {
    //                                 error('contextMenuFunc addParam error', err)
    //                             }
    //                         })
    //                         menu.show(e.clientX, e.clientY)
    //                     }
    //                 }
    //             } else {
    //                 menu.hide()
    //             }
    //         }
    //     })
    // }

    // 检测动态列表
    const checkDynList = async (fullSite: boolean) => {
        if (!dynListContainer) {
            return
        }

        // 是否选中全部动态
        isAllDyn = !!dynListContainer.querySelector('.bili-dyn-list-tabs')

        try {
            // 提取元素
            let dyns: HTMLElement[]
            if (fullSite) {
                dyns = Array.from(dynListContainer.querySelectorAll<HTMLElement>(`.bili-dyn-list__item`))
            } else {
                dyns = Array.from(
                    dynListContainer.querySelectorAll<HTMLElement>(
                        `.bili-dyn-list__item:not([${settings.filterSign}])`,
                    ),
                )
            }

            // dyns.forEach((dyn) => {
            //     log(
            //         [
            //             ``,
            //             `uploader: ${selectorFns.uploader(dyn)}`,
            //             `title: ${selectorFns.title(dyn)}`,
            //             `duration: ${selectorFns.duration(dyn)}`,
            //         ].join('\n'),
            //     )
            // })

            // 构建黑白检测任务
            if (dyns.length) {
                const blackPairs: SubFilterPair[] = []
                dynUploaderFilter.isEnable && blackPairs.push([dynUploaderFilter, selectorFns.uploader])
                dynDurationFilter.isEnable && blackPairs.push([dynDurationFilter, selectorFns.duration])
                dynVideoTitleFilter.isEnable && blackPairs.push([dynVideoTitleFilter, selectorFns.title])
                await coreCheck(dyns, true, blackPairs, [])
                log(`check ${dyns.length} dyns`)
            }
        } catch (err) {
            error('checkDynList error', err)
        }
    }

    const check = (fullSite: boolean) => {
        if (dynUploaderFilter.isEnable || dynDurationFilter.isEnable || dynVideoTitleFilter.isEnable) {
            checkDynList(fullSite).then().catch()
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
                check(true)
                new MutationObserver(() => {
                    check(false)
                }).observe(dynListContainer, { childList: true, subtree: true })
            }
        })
    } catch (err) {
        error(`watch dyn list ERROR`, err)
    }
}

export const dynamicFilterDynamicGroups: Group[] = [
    {
        name: '用户名过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.uploader.statusKey,
                name: '启用 用户名过滤',
                defaultEnable: false,
                noStyle: true,
                description: ['仅隐藏动态，与UP主过滤相互隔离'],
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 用户名列表',
                buttonText: '编辑',
                fn: () => {},
            },
        ],
    },
    {
        name: '动态内视频时长过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.duration.statusKey,
                name: '启用 时长过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'number',
                id: GM_KEYS.black.duration.valueKey,
                name: '设定最低时长（0~300s）',
                minValue: 0,
                maxValue: 300,
                defaultValue: 60,
                disableValue: 0,
                addonText: '秒',
                fn: (value: number) => {},
            },
        ],
    },
    {
        name: '动态内视频标题过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.title.statusKey,
                name: '启用 视频标题 关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 标题关键词黑名单',
                buttonText: '编辑',
                fn: () => {},
            },
        ],
    },
]

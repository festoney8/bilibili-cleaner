import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { convertTimeToSec, showEle, waitForEle } from '../../../../../utils/tool'
import { MainFilter, coreCheck } from '../../../core/core'
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

// 动态信息提取
let isAllDyn = true // 是否为全部动态
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

// DFD is DynamicFilterDynamic
class DFD extends MainFilter {
    // 黑名单
    static dynUploaderFilter = new DynUploaderFilter()
    static dynDurationFilter = new DynDurationFilter()
    static dynVideoTitleFilter = new DynVideoTitleFilter()

    constructor() {
        super()
        // 黑名单
        DFD.dynUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        DFD.dynDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        DFD.dynVideoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
    }

    observe(): void {
        waitForEle(
            document,
            '.bili-dyn-home--member',
            (node: HTMLElement): boolean => node.className === 'bili-dyn-home--member',
        ).then((ele) => {
            if (!ele) {
                return
            }

            DFD.target = ele
            log('DFD target appear')
            DFD.check('full')

            new MutationObserver(() => {
                DFD.check('incr')
            }).observe(DFD.target, { childList: true, subtree: true })
        })
    }

    static async check(mode?: 'full' | 'incr') {
        if (!DFD.target) {
            return
        }
        let revertAll = false
        if (!(DFD.dynUploaderFilter.isEnable || DFD.dynDurationFilter.isEnable || DFD.dynVideoTitleFilter.isEnable)) {
            revertAll = true
        }
        const timer = performance.now()

        // 是否选中全部动态
        isAllDyn = !!DFD.target.querySelector('.bili-dyn-list-tabs')

        // 提取元素
        let selector = `.bili-dyn-list__item`
        if (mode === 'incr') {
            selector += `:not([${settings.filterSign}])`
        }
        const dyns = Array.from(DFD.target.querySelectorAll<HTMLElement>(selector))
        if (!dyns.length) {
            return
        }
        if (revertAll) {
            dyns.forEach((v) => showEle(v))
            return
        }

        // dyns.forEach((dyn) => {
        //     log(
        //         [
        //             `dynamic`,
        //             `uploader: ${selectorFns.uploader(dyn)}`,
        //             `title: ${selectorFns.title(dyn)}`,
        //             `duration: ${selectorFns.duration(dyn)}`,
        //         ].join('\n'),
        //     )
        // })

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        DFD.dynUploaderFilter.isEnable && blackPairs.push([DFD.dynUploaderFilter, selectorFns.uploader])
        DFD.dynDurationFilter.isEnable && blackPairs.push([DFD.dynDurationFilter, selectorFns.duration])
        DFD.dynVideoTitleFilter.isEnable && blackPairs.push([DFD.dynVideoTitleFilter, selectorFns.title])

        // 检测
        const blackCnt = await coreCheck(dyns, true, blackPairs, [])
        const time = (performance.now() - timer).toFixed(1)
        log(`DFD hide ${blackCnt} in ${dyns.length} dyns, mode=${mode}, time=${time}`)
    }
}

export const dynamicFilterDynamicEntry = async () => {
    const dfd = new DFD()
    dfd.observe()
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
                enableFn: () => {
                    DFD.dynUploaderFilter.enable()
                    DFD.check('full')
                },
                disableFn: () => {
                    DFD.dynUploaderFilter.disable()
                    DFD.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 用户名列表',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
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
                enableFn: () => {
                    DFD.dynDurationFilter.enable()
                    DFD.check('full')
                },
                disableFn: () => {
                    DFD.dynDurationFilter.disable()
                    DFD.check('full')
                },
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
                fn: (value: number) => {
                    DFD.dynDurationFilter.setParam(value)
                    DFD.check('full')
                },
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
                enableFn: () => {
                    DFD.dynVideoTitleFilter.enable()
                    DFD.check('full')
                },
                disableFn: () => {
                    DFD.dynVideoTitleFilter.disable()
                    DFD.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 标题关键词黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
            },
        ],
    },
]

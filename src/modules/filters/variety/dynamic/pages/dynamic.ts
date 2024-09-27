import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { IMainFilter, SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { convertTimeToSec, showEle, waitForEle } from '../../../../../utils/tool'
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

class DynamicFilterDynamic implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    dynUploaderFilter = new DynUploaderFilter()
    dynDurationFilter = new DynDurationFilter()
    dynVideoTitleFilter = new DynVideoTitleFilter()

    init() {
        // 黑名单
        this.dynUploaderFilter.setParam(GM_getValue(GM_KEYS.black.uploader.valueKey, []))
        this.dynDurationFilter.setParam(GM_getValue(GM_KEYS.black.duration.valueKey, 0))
        this.dynVideoTitleFilter.setParam(GM_getValue(GM_KEYS.black.title.valueKey, []))
    }

    observe() {
        waitForEle(
            document,
            '.bili-dyn-home--member',
            (node: HTMLElement): boolean => node.className === 'bili-dyn-home--member',
        ).then((ele) => {
            if (!ele) {
                return
            }

            this.target = ele
            log('DynamicFilterDynamic target appear')
            this.check('full').then().catch()

            new MutationObserver(() => {
                this.check('incr').then().catch()
            }).observe(this.target, { childList: true, subtree: true })
        })
    }

    async check(mode?: 'full' | 'incr') {
        if (!this.target) {
            return
        }
        let revertAll = false
        if (
            !(this.dynUploaderFilter.isEnable || this.dynDurationFilter.isEnable || this.dynVideoTitleFilter.isEnable)
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 是否选中全部动态
        isAllDyn = !!this.target.querySelector('.bili-dyn-list-tabs')

        // 提取元素
        let selector = `.bili-dyn-list__item`
        if (mode === 'incr') {
            selector += `:not([${settings.filterSign}])`
        }
        const dyns = Array.from(this.target.querySelectorAll<HTMLElement>(selector))
        if (!dyns.length) {
            return
        }
        if (revertAll) {
            dyns.forEach((v) => showEle(v))
            return
        }

        // dyns.forEach((v) => {
        //     log(
        //         [
        //             `dynamic`,
        //             `uploader: ${selectorFns.uploader(v)}`,
        //             `title: ${selectorFns.title(v)}`,
        //             `duration: ${selectorFns.duration(v)}`,
        //         ].join('\n'),
        //     )
        // })

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        this.dynUploaderFilter.isEnable && blackPairs.push([this.dynUploaderFilter, selectorFns.uploader])
        this.dynDurationFilter.isEnable && blackPairs.push([this.dynDurationFilter, selectorFns.duration])
        this.dynVideoTitleFilter.isEnable && blackPairs.push([this.dynVideoTitleFilter, selectorFns.title])

        // 检测
        const blackCnt = await coreCheck(dyns, true, blackPairs, [])
        const time = (performance.now() - timer).toFixed(1)
        log(`DynamicFilterDynamic hide ${blackCnt} in ${dyns.length} dyns, mode=${mode}, time=${time}`)
    }
}

//==================================================================================================

const mainFilter = new DynamicFilterDynamic()

export const dynamicFilterDynamicEntry = async () => {
    mainFilter.init()
    mainFilter.observe()
}

export const dynamicFilterDynamicGroups: Group[] = [
    {
        name: '动态发布人过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.uploader.statusKey,
                name: '启用 动态发布人过滤 (右键单击用户名)',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    mainFilter.dynUploaderFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.dynUploaderFilter.disable()
                    mainFilter.check('full').then().catch()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.uploader.valueKey,
                name: '编辑 动态发布用户黑名单',
                editorTitle: '动态发布用户 黑名单',
                description: ['右键屏蔽的用户会出现在这里'],
                editorDescription: ['一行一个用户名，保存时自动去重'],
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
                    mainFilter.dynDurationFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.dynDurationFilter.disable()
                    mainFilter.check('full').then().catch()
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
                    mainFilter.dynDurationFilter.setParam(value)
                    mainFilter.check('full').then().catch()
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
                name: '启用 标题关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    mainFilter.dynVideoTitleFilter.enable()
                    mainFilter.check('full').then().catch()
                },
                disableFn: () => {
                    mainFilter.dynVideoTitleFilter.disable()
                    mainFilter.check('full').then().catch()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.title.valueKey,
                name: '编辑 标题关键词黑名单',
                editorTitle: '标题关键词 黑名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认iu模式，无需flag，语法：/abc|\\d+/',
                ],
            },
        ],
    },
]

import { coreCheck } from '@/modules/filters/core/core'
import settings from '@/settings'
import { Group } from '@/types/collection'
import { ContextMenuTargetHandler, FilterContextMenu, IMainFilter, SelectorResult, SubFilterPair } from '@/types/filter'
import { debugFilter as debug, error } from '@/utils/logger'
import { isPageDynamic } from '@/utils/pageType'
import { BiliCleanerStorage } from '@/utils/storage'
import { convertTimeToSec, orderedUniq, showEle, waitForEle } from '@/utils/tool'
import {
    DynContentFilter,
    DynDurationFilter,
    DynDynVideoFilter,
    DynPlaybackFilter,
    DynUploaderFilter,
    DynVideoTitleFilter,
} from '../subFilters/black'

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
        content: {
            statusKey: 'dyn-content-keyword-filter-status',
            valueKey: 'global-content-keyword-filter-value',
        },
        // 动态视频
        dynVideo: {
            statusKey: 'dyn-dyn-video-filter-status',
        },
        // 直播回放
        playback: {
            statusKey: 'dyn-playback-filter-status',
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
    content: (dyn: HTMLElement): SelectorResult => {
        return Array.from(
            dyn.querySelectorAll(
                `.bili-dyn-content :is(
                    .dyn-card-opus__title,
                    .bili-rich-text__content > span:not(.bili-rich-text-module.at),
                    .dyn-card-opus__summary span
                )`,
            ),
        )
            .map((v) => v?.textContent?.trim())
            .filter((v) => v?.trim())
            .join('\n')
    },
    dynVideo: (dyn: HTMLElement): SelectorResult => {
        return !!dyn.querySelector('.bili-dyn-time')?.textContent?.includes('动态视频')
    },
    playback: (dyn: HTMLElement): SelectorResult => {
        return !!dyn.querySelector('.bili-dyn-time')?.textContent?.includes('直播回放')
    },
}

class DynamicFilterDynamic implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    dynUploaderFilter = new DynUploaderFilter()
    dynDurationFilter = new DynDurationFilter()
    dynVideoTitleFilter = new DynVideoTitleFilter()
    dynContentFilter = new DynContentFilter()
    dynDynVideoFilter = new DynDynVideoFilter()
    dynPlaybackFilter = new DynPlaybackFilter()

    init() {
        // 黑名单
        this.dynUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []))
        this.dynDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.duration.valueKey, 0))
        this.dynVideoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []))
        this.dynContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.content.valueKey, []))
    }

    async check(mode?: 'full' | 'incr') {
        if (!this.target) {
            return
        }
        let revertAll = false
        if (
            !(
                this.dynUploaderFilter.isEnable ||
                this.dynDurationFilter.isEnable ||
                this.dynVideoTitleFilter.isEnable ||
                this.dynContentFilter.isEnable ||
                this.dynDynVideoFilter.isEnable ||
                this.dynPlaybackFilter.isEnable
            )
        ) {
            revertAll = true
        }
        const timer = performance.now()

        // 是否选中全部动态
        isAllDyn = !!this.target.querySelector('.bili-dyn-list-tabs')

        // 提取元素
        let selector = `.bili-dyn-list__item`
        if (mode === 'incr') {
            selector += `:not([${settings.filterVisitSign}])`
        }
        const dyns = Array.from(this.target.querySelectorAll<HTMLElement>(selector))
        if (!dyns.length) {
            return
        }
        if (revertAll) {
            dyns.forEach((v) => showEle(v, 'style'))
            return
        }

        if (settings.enableDebugFilter) {
            dyns.forEach((v) => {
                debug(
                    [
                        `DynamicFilterDynamic`,
                        `uploader: ${selectorFns.uploader(v)}`,
                        `title: ${selectorFns.title(v)}`,
                        `duration: ${selectorFns.duration(v)}`,
                        `content: ${selectorFns.content(v)}`,
                        `shortVideo: ${selectorFns.dynVideo(v)}`,
                        `playback: ${selectorFns.playback(v)}`,
                    ].join('\n'),
                )
            })
        }

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        this.dynUploaderFilter.isEnable && blackPairs.push([this.dynUploaderFilter, selectorFns.uploader])
        this.dynDurationFilter.isEnable && blackPairs.push([this.dynDurationFilter, selectorFns.duration])
        this.dynVideoTitleFilter.isEnable && blackPairs.push([this.dynVideoTitleFilter, selectorFns.title])
        this.dynContentFilter.isEnable && blackPairs.push([this.dynContentFilter, selectorFns.content])
        this.dynDynVideoFilter.isEnable && blackPairs.push([this.dynDynVideoFilter, selectorFns.dynVideo])
        this.dynPlaybackFilter.isEnable && blackPairs.push([this.dynPlaybackFilter, selectorFns.playback])

        // 检测
        const blackCnt = await coreCheck(dyns, true, 'style', blackPairs, [])
        const time = (performance.now() - timer).toFixed(1)
        debug(`DynamicFilterDynamic hide ${blackCnt} in ${dyns.length} dyns, mode=${mode}, time=${time}`)
    }

    checkFull() {
        this.check('full').catch((err) => {
            error('DynamicFilterDynamic check full error', err)
        })
    }

    checkIncr() {
        this.check('incr').catch((err) => {
            error('DynamicFilterDynamic check incr error', err)
        })
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

            debug('DynamicFilterDynamic target appear')
            this.target = ele
            this.checkFull()

            new MutationObserver(() => {
                this.checkIncr()
            }).observe(this.target, { childList: true, subtree: true })
        })
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
                noStyle: true,
                enableFn: () => {
                    mainFilter.dynUploaderFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.dynUploaderFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.uploader.valueKey,
                name: '编辑 动态发布用户黑名单',
                editorTitle: '动态发布用户 黑名单',
                description: ['右键屏蔽的用户会出现在首行'],
                editorDescription: ['一行一个用户名，保存时自动去重'],
                saveFn: async () => {
                    mainFilter.dynUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []))
                    mainFilter.checkFull()
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
                noStyle: true,
                enableFn: () => {
                    mainFilter.dynDurationFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.dynDurationFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.duration.valueKey,
                name: '设定最低时长（0~300s）',
                noStyle: true,
                minValue: 0,
                maxValue: 300,
                step: 1,
                defaultValue: 60,
                disableValue: 0,
                addonText: '秒',
                fn: (value: number) => {
                    mainFilter.dynDurationFilter.setParam(value)
                    mainFilter.checkFull()
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
                noStyle: true,
                enableFn: () => {
                    mainFilter.dynVideoTitleFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.dynVideoTitleFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.title.valueKey,
                name: '编辑 标题关键词黑名单',
                editorTitle: '标题关键词 黑名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写、全半角',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认 ius 模式，无需 flag，语法：/abc|\\d+/',
                ],
                saveFn: async () => {
                    mainFilter.dynVideoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []))
                    mainFilter.checkFull()
                },
            },
        ],
    },
    {
        name: '动态内容过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.content.statusKey,
                name: '启用 动态内容关键词过滤',
                description: ['包含被转发动态内容', '不含动态内视频信息'],
                noStyle: true,
                enableFn: () => {
                    mainFilter.dynContentFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.dynContentFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.content.valueKey,
                name: '编辑 动态内容关键词黑名单',
                editorTitle: '动态内容关键词 黑名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写、全半角',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认 ius 模式，无需 flag，语法：/abc|\\d+/',
                ],
                saveFn: async () => {
                    mainFilter.dynContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.content.valueKey, []))
                    mainFilter.checkFull()
                },
            },
        ],
    },
    {
        name: '按类型过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.dynVideo.statusKey,
                name: '过滤 动态视频',
                noStyle: true,
                enableFn: () => {
                    mainFilter.dynDynVideoFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.dynDynVideoFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.playback.statusKey,
                name: '过滤 直播回放',
                noStyle: true,
                enableFn: () => {
                    mainFilter.dynPlaybackFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.dynPlaybackFilter.disable()
                    mainFilter.checkFull()
                },
            },
        ],
    },
]

// 右键菜单handler
export const dynamicFilterDynamicHandler: ContextMenuTargetHandler = (target: HTMLElement): FilterContextMenu[] => {
    if (!isPageDynamic()) {
        return []
    }
    const menus: FilterContextMenu[] = []
    if (target.classList.contains('bili-dyn-title__text')) {
        const uploader = target.textContent?.trim()
        if (uploader && mainFilter.dynUploaderFilter.isEnable) {
            menus.push({
                name: `隐藏用户动态：${uploader}`,
                fn: async () => {
                    try {
                        mainFilter.dynUploaderFilter.addParam(uploader)
                        mainFilter.checkFull()
                        const arr: string[] = BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, [])
                        arr.unshift(uploader)
                        BiliCleanerStorage.set<string[]>(GM_KEYS.black.uploader.valueKey, orderedUniq(arr))
                    } catch (err) {
                        error(`dynamicFilterDynamicHandler add uploader ${uploader} failed`, err)
                    }
                },
            })
        }
    }
    return menus
}

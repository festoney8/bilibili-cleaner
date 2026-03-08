import { coreCheck } from '@/modules/filters/core/core'
import settings from '@/settings'
import { IMainFilter, SelectorResult, SubFilterPair } from '@/types/filter'
import { debugFilter as debug, error } from '@/utils/logger'
import { BiliCleanerStorage } from '@/utils/storage'
import { DynContentFilter, DynUploaderFilter, DynVideoTitleFilter } from '../subFilters/black'
import { DynContentWhiteFilter, DynVideoTitleWhiteFilter } from '../subFilters/white'

const GM_KEYS = {
    black: {
        uploader: {
            statusKey: 'dyn-uploader-filter-status',
            valueKey: 'dyn-uploader-filter-value',
        },
        title: {
            statusKey: 'dyn-title-keyword-filter-status',
            valueKey: 'global-title-keyword-filter-value',
        },
        content: {
            statusKey: 'dyn-content-keyword-filter-status',
            valueKey: 'global-content-keyword-filter-value',
        },
    },
    white: {
        title: {
            statusKey: 'dyn-video-title-white-filter-status',
            valueKey: 'global-title-keyword-whitelist-filter-value',
        },
        content: {
            statusKey: 'dyn-content-white-filter-status',
            valueKey: 'global-content-keyword-whitelist-filter-value',
        },
    },
}

// 动态信息提取
const selectorFns = {
    uploader: (dyn: HTMLElement): SelectorResult => {
        return dyn.querySelector('.user-name')?.textContent?.trim()
    },
    title: (dyn: HTMLElement): SelectorResult => {
        return dyn.querySelector('.all-in-one-article-title:not(:has(.article-tag))')?.textContent?.trim()
    },
    content: (dyn: HTMLElement): SelectorResult => {
        return dyn.querySelector('.all-in-one-article-title:has(.article-tag)')?.textContent?.replace('专栏', '').trim()
    },
}

class DynamicFilterHeader implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    dynUploaderFilter = new DynUploaderFilter()
    dynVideoTitleFilter = new DynVideoTitleFilter()
    dynContentFilter = new DynContentFilter()
    // 白名单
    dynVideoTitleWhiteFilter = new DynVideoTitleWhiteFilter()
    dynContentWhiteFilter = new DynContentWhiteFilter()

    init() {
        // 黑名单
        this.dynUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []))
        this.dynVideoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []))
        this.dynContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.content.valueKey, []))
        // 白名单
        this.dynVideoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.title.valueKey, []))
        this.dynContentWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.content.valueKey, []))
    }

    async check(mode?: 'full' | 'incr') {
        if (!this.target) {
            return
        }
        const timer = performance.now()

        // 提取元素
        let selector = `#biliHeaderDynScrollCon .dynamic-all > a`
        if (mode === 'incr') {
            selector += `:not([${settings.filterVisitSign}])`
        }
        const dyns = Array.from(this.target.querySelectorAll<HTMLElement>(selector))
        if (!dyns.length) {
            return
        }

        if (settings.enableDebugFilter) {
            dyns.forEach((v) => {
                debug(
                    [
                        `DynamicFilterHeader`,
                        `uploader: ${selectorFns.uploader(v)}`,
                        `title: ${selectorFns.title(v)}`,
                        `content: ${selectorFns.content(v)}`,
                    ].join('\n'),
                )
            })
        }

        // 构建黑白检测任务
        const blackPairs: SubFilterPair[] = []
        this.dynUploaderFilter.isEnable && blackPairs.push([this.dynUploaderFilter, selectorFns.uploader])
        this.dynVideoTitleFilter.isEnable && blackPairs.push([this.dynVideoTitleFilter, selectorFns.title])
        this.dynContentFilter.isEnable && blackPairs.push([this.dynContentFilter, selectorFns.content])
        // 构建白名单任务
        const whitePairs: SubFilterPair[] = []
        this.dynVideoTitleWhiteFilter.isEnable && whitePairs.push([this.dynVideoTitleWhiteFilter, selectorFns.title])
        this.dynContentWhiteFilter.isEnable && whitePairs.push([this.dynContentWhiteFilter, selectorFns.content])

        // 检测
        const blackCnt = await coreCheck(dyns, true, 'style', blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        debug(`DynamicFilterHeader hide ${blackCnt} in ${dyns.length} dyns, mode=${mode}, time=${time}`)
    }

    checkFull() {
        this.check('full').catch((err) => {
            error('DynamicFilterHeader check full error', err)
        })
    }

    // checkIncr() {
    //     this.check('incr').catch((err) => {
    //         error('DynamicFilterHeader check incr error', err)
    //     })
    // }

    observe() {
        let cnt = 0
        const id = setInterval(() => {
            const ele = document.querySelector('.right-entry') as HTMLElement
            if (ele) {
                clearInterval(id)

                debug('DynamicFilterHeader target appear')
                this.target = ele
                this.checkFull()
                new MutationObserver(() => {
                    this.checkFull()
                }).observe(this.target, { childList: true, subtree: true })
            }
            ++cnt > 10 && clearInterval(id)
        }, 1000)
    }
}

//==================================================================================================

const mainFilter = new DynamicFilterHeader()

export const dynamicFilterHeaderEntry = async () => {
    mainFilter.init()
    mainFilter.observe()
    if (BiliCleanerStorage.get(GM_KEYS.black.uploader.statusKey)) {
        mainFilter.dynUploaderFilter.enable()
    }
    if (BiliCleanerStorage.get(GM_KEYS.black.title.statusKey)) {
        mainFilter.dynVideoTitleFilter.enable()
    }
    if (BiliCleanerStorage.get(GM_KEYS.black.content.statusKey)) {
        mainFilter.dynContentFilter.enable()
    }
    if (BiliCleanerStorage.get(GM_KEYS.white.title.statusKey)) {
        mainFilter.dynVideoTitleWhiteFilter.enable()
    }
    if (BiliCleanerStorage.get(GM_KEYS.white.content.statusKey)) {
        mainFilter.dynContentWhiteFilter.enable()
    }
}

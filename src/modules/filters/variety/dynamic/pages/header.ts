import { coreCheck } from '@/modules/filters/core/core'
import settings from '@/settings'
import { IMainFilter, SelectorResult, SubFilterPair } from '@/types/filter'
import { debugFilter as debug, error } from '@/utils/logger'
import { BiliCleanerStorage } from '@/utils/storage'
import { DynContentFilter, DynUploaderFilter, DynVideoTitleFilter } from '../subFilters/black'

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

    init() {
        // 黑名单
        this.dynUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []))
        this.dynVideoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []))
        this.dynContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.content.valueKey, []))
    }

    async check(mode?: 'full' | 'incr') {
        if (!this.target) {
            return
        }
        const timer = performance.now()

        // 提取元素
        let selector = `#biliHeaderDynScrollCon .dynamic-all > a`
        if (mode === 'incr') {
            selector += `:not([${settings.filterSign}])`
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

        // 检测
        const blackCnt = await coreCheck(dyns, true, blackPairs, [])
        const time = (performance.now() - timer).toFixed(1)
        debug(`DynamicFilterHeader hide ${blackCnt} in ${dyns.length} dyns, mode=${mode}, time=${time}`)
    }

    checkFull() {
        this.check('full')
            .then()
            .catch((err) => {
                error('DynamicFilterHeader check full error', err)
            })
    }

    checkIncr() {
        this.check('incr')
            .then()
            .catch((err) => {
                error('DynamicFilterHeader check incr error', err)
            })
    }

    observe() {
        document.addEventListener('DOMContentLoaded', () => {
            let cnt = 0
            const id = setInterval(() => {
                const ele = document.querySelector('.right-entry .v-popover-wrap:nth-of-type(3)') as HTMLElement
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
        })
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
}

import { IListItem, INumberItem, IStringItem, ISwitchItem } from '@/types/item'
import { waitForHead } from '@/utils/init'
import { logger } from '@/utils/logger'
import { GM_getValue } from '$'
import { useMagicKeys } from '@vueuse/core'
import { commentFilters, dynamicFilters, loadFilterStyle, videoFilters } from './filters'
import { loadRuleStyle, rules } from './rules'

const loadSwitchItem = (item: ISwitchItem) => {
    const enable = GM_getValue(item.id, item.defaultEnable)
    if (enable) {
        if (!item.noStyle) {
            document.documentElement.setAttribute(item.attrName ?? item.id, '')
        }
        if (item.enableFn) {
            if (item.enableFnRunAt === 'document-end' && document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    item.enableFn!()?.catch(() => {})
                })
            } else {
                item.enableFn()?.catch(() => {})
            }
        }
    }
}

const loadNumberItem = (item: INumberItem) => {
    const value = GM_getValue(item.id, item.defaultValue)
    if (value !== item.disableValue) {
        if (!item.noStyle) {
            document.documentElement.setAttribute(item.attrName ?? item.id, '')
        }
        item.fn(value)?.catch(() => {})
    }
}

const loadStringItem = (item: IStringItem) => {
    const value = GM_getValue(item.id, item.defaultValue)
    if (value !== item.disableValue) {
        if (!item.noStyle) {
            document.documentElement.setAttribute(item.attrName ?? item.id, '')
        }
        item.fn(value)?.catch(() => {})
    }
}

const loadListItem = (item: IListItem) => {
    const value = GM_getValue(item.id, item.defaultValue)
    for (const option of item.options) {
        if (option.value === value && option.fn) {
            option.fn()?.catch(() => {})
        }
    }
    if (value !== item.disableValue) {
        document.documentElement.setAttribute(item.id, value)
    }
}

/** 载入规则列表 */
const loadRules = () => {
    for (const rule of rules) {
        if (rule.checkFn()) {
            for (const group of rule.groups) {
                for (const item of group.items) {
                    try {
                        switch (item.type) {
                            case 'switch':
                                loadSwitchItem(item)
                                break
                            case 'number':
                                loadNumberItem(item)
                                break
                            case 'list':
                                loadListItem(item)
                                break
                            case 'string':
                                loadStringItem(item)
                                break
                        }
                    } catch (err) {
                        logger.error(
                            `loadRules load item failed, id=${item.id}, name=${item.name}, type=${item.type}`,
                            err,
                        )
                    }
                }
            }
        }
    }
}

/** 载入过滤器 */
const loadFilters = () => {
    const filters = [...videoFilters, ...commentFilters, ...dynamicFilters]
    for (const filter of filters) {
        if (filter.checkFn()) {
            try {
                filter.entry()
                for (const group of filter.groups) {
                    for (const item of group.items) {
                        switch (item.type) {
                            case 'switch':
                                loadSwitchItem(item)
                                break
                            case 'number':
                                loadNumberItem(item)
                                break
                            case 'list':
                                loadListItem(item)
                                break
                            case 'string':
                                loadStringItem(item)
                                break
                        }
                    }
                }
            } catch (err) {
                logger.error(`loadFilters filter ${filter.name} error`, err)
            }
        }
    }
}

/** 快捷键 Alt + B，快速禁用全部 CSS 样式 */
const loadRulesHotKey = () => {
    try {
        useMagicKeys({
            passive: false,
            onEventFired(e) {
                if (e.type === 'keydown' && e.altKey && e.key.toLocaleLowerCase() === 'b') {
                    e.preventDefault()
                    const styleNodes = document.querySelectorAll<HTMLStyleElement>('style.bili-cleaner-css')
                    styleNodes.forEach((node) => (node.disabled = !node.disabled))
                }
            },
        })
    } catch (err) {
        logger.error(`loadRulesHotKey error`, err)
    }
}

export const loadModules = () => {
    waitForHead().then(() => {
        loadRuleStyle()
        loadFilterStyle()
        logger.info('load style done')
    })

    loadRules()
    loadRulesHotKey()
    logger.info('loadRules done')

    loadFilters()
    logger.info('loadFilters done')
}

import { Rule } from '@/types/collection'
import {
    isPageBangumi,
    isPageChannel,
    isPageDynamic,
    isPageFestival,
    isPageHomepage,
    isPageLive,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageSpace,
    isPageVideo,
    isPageWatchlater,
} from '@/utils/pageType'

import { IListItem, INumberItem, IStringItem, ISwitchItem } from '@/types/item'
import { error } from '@/utils/logger'
import { BiliCleanerStorage } from '@/utils/storage'

import { bangumiGroups } from './bangumi'
import { channelGroups } from './channel'
import { commentGroups } from './comment'
import { commonGroups } from './common'
import { debugGroups } from './debug'
import { dynamicGroups } from './dynamic'
import { festivalGroups } from './festival'
import { homepageGroups } from './homepage'
import { liveGroups } from './live'
import { popularGroups } from './popular'
import { searchGroups } from './search'
import { spaceGroups } from './space'
import { videoGroups } from './video'
import { watchlaterGroups } from './watchlater'

import { useMagicKeys } from '@vueuse/core'
import bangumiStyle from './bangumi/index.scss?inline'
import channelStyle from './channel/index.scss?inline'
import commentStyle from './comment/index.scss?inline'
import commonStyle from './common/index.scss?inline'
import dynamicStyle from './dynamic/index.scss?inline'
import festivalStyle from './festival/index.scss?inline'
import homepageStyle from './homepage/index.scss?inline'
import liveStyle from './live/index.scss?inline'
import popularStyle from './popular/index.scss?inline'
import searchStyle from './search/index.scss?inline'
import spaceStyle from './space/index.scss?inline'
import videoStyle from './video/index.scss?inline'
import watchlaterStyle from './watchlater/index.scss?inline'

/** 全部规则 */
export const rules: Rule[] = [
    {
        name: 'homepage',
        groups: homepageGroups,
        style: homepageStyle,
        checkFn: isPageHomepage,
    },
    {
        name: 'video',
        groups: videoGroups,
        style: videoStyle,
        checkFn: () => isPageVideo() || isPagePlaylist(),
    },
    {
        name: 'festival',
        groups: festivalGroups,
        style: festivalStyle,
        checkFn: isPageFestival,
    },
    {
        name: 'bangumi',
        groups: bangumiGroups,
        style: bangumiStyle,
        checkFn: isPageBangumi,
    },
    {
        name: 'dynamic',
        groups: dynamicGroups,
        style: dynamicStyle,
        checkFn: isPageDynamic,
    },
    {
        name: 'live',
        groups: liveGroups,
        style: liveStyle,
        checkFn: isPageLive,
    },
    {
        name: 'popular',
        groups: popularGroups,
        style: popularStyle,
        checkFn: isPagePopular,
    },
    {
        name: 'channel',
        groups: channelGroups,
        style: channelStyle,
        checkFn: isPageChannel,
    },
    {
        name: 'space',
        groups: spaceGroups,
        style: spaceStyle,
        checkFn: isPageSpace,
    },
    {
        name: 'search',
        groups: searchGroups,
        style: searchStyle,
        checkFn: isPageSearch,
    },
    {
        name: 'watchlater',
        groups: watchlaterGroups,
        style: watchlaterStyle,
        checkFn: isPageWatchlater,
    },
    {
        name: 'comment',
        groups: commentGroups,
        style: commentStyle,
        isSpecial: true,
        checkFn: () => isPageVideo() || isPageBangumi() || isPageDynamic() || isPageSpace() || isPagePlaylist(),
    },
    {
        name: 'common',
        groups: commonGroups,
        style: commonStyle,
        isSpecial: true,
        checkFn: () => true,
    },
    {
        name: 'debug',
        groups: debugGroups,
        style: undefined,
        checkFn: isPageSpace,
    },
]

/** 载入当前页面规则列表 */
export const loadRules = () => {
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
                        error(`loadRules load item failed, id=${item.id}, name=${item.name}, type=${item.type}`, err)
                    }
                }
            }
        }
    }
}

/** 载入css, 注入在html节点下, 需在head节点出现后(html节点可插入时)执行 */
export const loadStyles = () => {
    for (const rule of rules) {
        if (rule.checkFn() && rule.style) {
            try {
                const style = document.createElement('style')
                style.className = `bili-cleaner-css ${rule.name}`
                style.textContent = rule.style
                document.documentElement?.appendChild(style)
            } catch (err) {
                error(`loadStyles error, name=${rule.name}`, err)
            }
        }
    }

    // Style HMR
    if (import.meta.env.DEV && import.meta.hot) {
        import.meta.hot.accept(
            [
                './homepage/index.scss?inline',
                './video/index.scss?inline',
                './festival/index.scss?inline',
                './bangumi/index.scss?inline',
                './dynamic/index.scss?inline',
                './live/index.scss?inline',
                './popular/index.scss?inline',
                './channel/index.scss?inline',
                './space/index.scss?inline',
                './search/index.scss?inline',
                './watchlater/index.scss?inline',
                './comment/index.scss?inline',
                './common/index.scss?inline',
            ],
            ([
                homepageModule,
                videoModule,
                festivalModule,
                bangumiModule,
                dynamicModule,
                liveModule,
                popularModule,
                channelModule,
                spaceModule,
                searchModule,
                watchlaterModule,
                commentModule,
                commonModule,
            ]) => {
                if (homepageModule) {
                    const newCSS = homepageModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.homepage')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (videoModule) {
                    const newCSS = videoModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.video')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (festivalModule) {
                    const newCSS = festivalModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.festival')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (bangumiModule) {
                    const newCSS = bangumiModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.bangumi')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (dynamicModule) {
                    const newCSS = dynamicModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.dynamic')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (liveModule) {
                    const newCSS = liveModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.live')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (popularModule) {
                    const newCSS = popularModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.popular')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (channelModule) {
                    const newCSS = channelModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.channel')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (spaceModule) {
                    const newCSS = spaceModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.space')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (searchModule) {
                    const newCSS = searchModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.search')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (watchlaterModule) {
                    const newCSS = watchlaterModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.watchlater')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (commentModule) {
                    const newCSS = commentModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.comment')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
                if (commonModule) {
                    const newCSS = commonModule.default as string
                    const style = document.querySelector('style.bili-cleaner-css.common')
                    if (style && newCSS) {
                        style.textContent = newCSS
                    }
                }
            },
        )
    }
}

const loadSwitchItem = (item: ISwitchItem) => {
    const enable = BiliCleanerStorage.get(item.id, item.defaultEnable)
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
    const value = BiliCleanerStorage.get(item.id, item.defaultValue)
    if (value !== item.disableValue) {
        if (!item.noStyle) {
            document.documentElement.setAttribute(item.attrName ?? item.id, '')
        }
        item.fn(value)?.catch(() => {})
    }
}

const loadStringItem = (item: IStringItem) => {
    const value = BiliCleanerStorage.get(item.id, item.defaultValue)
    if (value !== item.disableValue) {
        if (!item.noStyle) {
            document.documentElement.setAttribute(item.attrName ?? item.id, '')
        }
        item.fn(value)?.catch(() => {})
    }
}

const loadListItem = (item: IListItem) => {
    const value = BiliCleanerStorage.get(item.id, item.defaultValue)
    for (const option of item.options) {
        if (option.value === value && option.fn) {
            option.fn()?.catch(() => {})
        }
    }
    if (value !== item.disableValue) {
        document.documentElement.setAttribute(value, '')
    }
}

/**
 * 快捷键 Alt + B，快速禁用全部 CSS 样式
 */
export const loadRulesHotKey = () => {
    try {
        let isEnable = true
        const toggle = () => {
            const cssNodes = document.querySelectorAll<HTMLStyleElement>('style.bili-cleaner-css')
            if (isEnable) {
                for (const node of cssNodes) {
                    node.innerHTML = '/*' + node.innerHTML + '*/'
                }
            } else {
                for (const node of cssNodes) {
                    node.innerHTML = node.innerHTML.replace(/^\/\*[\s\n]*|[\s\n]*\*\/$/g, '')
                }
            }
            isEnable = !isEnable
        }

        useMagicKeys({
            passive: false,
            onEventFired(e) {
                if (e.type === 'keydown' && e.altKey && e.key.toLocaleLowerCase() === 'b') {
                    e.preventDefault()
                    toggle()
                }
            },
        })
    } catch (err) {
        error(`loadRulesHotKey error`, err)
    }
}

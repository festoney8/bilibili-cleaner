import { GM_getValue } from '$'
import { Filter } from '../../types/collection'
import { INumberItem, ISwitchItem } from '../../types/item'
import {
    isPageBangumi,
    isPageChannel,
    isPageDynamic,
    isPageHomepage,
    isPagePlaylist,
    isPageSearch,
    isPageSpace,
    isPageVideo,
} from '../../utils/pageType'
import { commentFilterBangumiGroups } from './variety/comment/pages/bangumi'
import { commentFilterDynamicGroups } from './variety/comment/pages/dynamic'
import { dynamicFilterDynamicGroups } from './variety/dynamic/pages/dynamic'
import { videoFilterChannelGroups } from './variety/video/pages/channel'
import { videoFilterHomepageGroups, viderFilterHomepageEntry } from './variety/video/pages/homepage'
import { videoFilterPopularGroups } from './variety/video/pages/popular'
import { videoFilterSearchGroups } from './variety/video/pages/search'
import { videoFilterSpaceGroups } from './variety/video/pages/space'
import { videoFilterVideoGroups } from './variety/video/pages/video'

/** 视频过滤器 */
export const videoFilters: Filter[] = [
    // 视频过滤
    {
        name: '首页 视频过滤',
        groups: videoFilterHomepageGroups,
        entry: viderFilterHomepageEntry,
        checkFn: isPageHomepage,
    },
    {
        name: '播放页 视频过滤',
        groups: videoFilterVideoGroups,
        entry: async () => {},
        checkFn: () => isPageVideo() || isPagePlaylist(),
    },
    {
        name: '热门页 视频过滤',
        groups: videoFilterPopularGroups,
        entry: async () => {},
        checkFn: isPageVideo,
    },
    {
        name: '分区页 视频过滤',
        groups: videoFilterChannelGroups,
        entry: async () => {},
        checkFn: isPageChannel,
    },
    {
        name: '搜索页 视频过滤',
        groups: videoFilterSearchGroups,
        entry: async () => {},
        checkFn: isPageSearch,
    },
    {
        name: '空间页 视频过滤',
        groups: videoFilterSpaceGroups,
        entry: async () => {},
        checkFn: isPageSpace,
    },
]

/** 评论过滤器 */
export const commentFilters: Filter[] = [
    {
        name: '视频页/番剧页 视频评论过滤',
        groups: commentFilterBangumiGroups,
        entry: async () => {},
        checkFn: () => isPageVideo() || isPageBangumi() || isPagePlaylist(),
    },
    {
        name: '动态页/空间页 动态评论过滤',
        groups: commentFilterDynamicGroups,
        entry: async () => {},
        checkFn: () => isPageDynamic() || isPageSpace(),
    },
]

/** 动态过滤器 */
export const dynamicFilters: Filter[] = [
    {
        name: '动态页 动态过滤',
        groups: dynamicFilterDynamicGroups,
        entry: async () => {},
        checkFn: isPageDynamic,
    },
]

/** 载入全部过滤器 */
export const loadFilters = () => {
    const filters = [...videoFilters, ...commentFilters, ...dynamicFilters]
    for (const filter of filters) {
        if (filter.checkFn()) {
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
                    }
                }
            }
        }
    }
}

const loadSwitchItem = (item: ISwitchItem) => {
    const enable = GM_getValue(item.id, item.defaultEnable)
    if (enable) {
        if (item.enableFn) {
            if (item.enableFnRunAt === 'document-end' && document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    item.enableFn!()?.then().catch()
                })
            } else {
                item.enableFn()?.then().catch()
            }
        }
    }
}

const loadNumberItem = (item: INumberItem) => {
    const value = GM_getValue(item.id, item.defaultValue)
    if (value !== item.disableValue) {
        item.fn(value)?.then().catch()
    }
}

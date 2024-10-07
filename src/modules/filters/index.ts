import { Filter } from '../../types/collection'
import { INumberItem, ISwitchItem } from '../../types/item'
import { error } from '../../utils/logger'
import {
    isPageBangumi,
    isPageChannel,
    isPageDynamic,
    isPageHomepage,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageSpace,
    isPageVideo,
} from '../../utils/pageType'
import { BiliCleanerStorage } from '../../utils/storage'
import {
    commentFilterDynamicEntry,
    commentFilterDynamicGroups,
    commentFilterDynamicHandler,
} from './variety/comment/pages/dynamic'
import {
    commentFilterSpaceEntry,
    commentFilterSpaceGroups,
    commentFilterSpaceHandler,
} from './variety/comment/pages/space'
import {
    commentFilterVideoEntry,
    commentFilterVideoGroups,
    commentFilterVideoHandler,
} from './variety/comment/pages/video'
import {
    dynamicFilterDynamicEntry,
    dynamicFilterDynamicGroups,
    dynamicFilterDynamicHandler,
} from './variety/dynamic/pages/dynamic'
import {
    videoFilterChannelEntry,
    videoFilterChannelGroups,
    videoFilterChannelHandler,
} from './variety/video/pages/channel'
import {
    videoFilterHomepageEntry,
    videoFilterHomepageGroups,
    videoFilterHomepageHandler,
} from './variety/video/pages/homepage'
import {
    videoFilterPopularEntry,
    videoFilterPopularGroups,
    videoFilterPopularHandler,
} from './variety/video/pages/popular'
import { videoFilterSearchEntry, videoFilterSearchGroups, videoFilterSearchHandler } from './variety/video/pages/search'
import { videoFilterSpaceEntry, videoFilterSpaceGroups } from './variety/video/pages/space'
import { videoFilterVideoEntry, videoFilterVideoGroups, videoFilterVideoHandler } from './variety/video/pages/video'

/** 视频过滤器 */
export const videoFilters: Filter[] = [
    // 视频过滤
    {
        name: '首页 视频过滤',
        groups: videoFilterHomepageGroups,
        entry: videoFilterHomepageEntry,
        checkFn: isPageHomepage,
    },
    {
        name: '播放页 视频过滤',
        groups: videoFilterVideoGroups,
        entry: videoFilterVideoEntry,
        checkFn: () => isPageVideo() || isPagePlaylist(),
    },
    {
        name: '热门页 视频过滤',
        groups: videoFilterPopularGroups,
        entry: videoFilterPopularEntry,
        checkFn: isPagePopular,
    },
    {
        name: '分区页 视频过滤',
        groups: videoFilterChannelGroups,
        entry: videoFilterChannelEntry,
        checkFn: isPageChannel,
    },
    {
        name: '搜索页 视频过滤',
        groups: videoFilterSearchGroups,
        entry: videoFilterSearchEntry,
        checkFn: isPageSearch,
    },
    {
        name: '空间页 视频过滤',
        groups: videoFilterSpaceGroups,
        entry: videoFilterSpaceEntry,
        checkFn: isPageSpace,
    },
]

/** 评论过滤器 */
export const commentFilters: Filter[] = [
    {
        name: '视频页/番剧页 视频评论过滤',
        groups: commentFilterVideoGroups,
        entry: commentFilterVideoEntry,
        checkFn: () => isPageVideo() || isPageBangumi() || isPagePlaylist(),
    },
    {
        name: '动态页 动态评论过滤',
        groups: commentFilterDynamicGroups,
        entry: commentFilterDynamicEntry,
        checkFn: () => isPageDynamic(),
    },
    {
        name: '空间页 动态评论过滤',
        groups: commentFilterSpaceGroups,
        entry: commentFilterSpaceEntry,
        checkFn: () => isPageSpace(),
    },
]

/** 动态过滤器 */
export const dynamicFilters: Filter[] = [
    {
        name: '动态页 动态过滤',
        groups: dynamicFilterDynamicGroups,
        entry: dynamicFilterDynamicEntry,
        checkFn: isPageDynamic,
    },
]

/** 载入全部过滤器 */
export const loadFilters = () => {
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
                        }
                    }
                }
            } catch (err) {
                error(`loadFilters filter ${filter.name} error`, err)
            }
        }
    }
}

const loadSwitchItem = (item: ISwitchItem) => {
    const enable = BiliCleanerStorage.get(item.id, item.defaultEnable)
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
    const value = BiliCleanerStorage.get(item.id, item.defaultValue)
    if (value !== item.disableValue) {
        item.fn(value)?.then().catch()
    }
}

/** 右键菜单功能 */
export const filterContextMenuHandlers = [
    videoFilterVideoHandler,
    videoFilterSearchHandler,
    videoFilterChannelHandler,
    videoFilterPopularHandler,
    videoFilterHomepageHandler,
    dynamicFilterDynamicHandler,
    commentFilterVideoHandler,
    commentFilterDynamicHandler,
    commentFilterSpaceHandler,
]

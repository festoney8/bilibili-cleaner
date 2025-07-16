import settings from '@/settings'
import { Filter } from '@/types/collection'
import {
    isPageBangumi,
    isPageChannel,
    isPageDynamic,
    isPageHomepage,
    isPageLive,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageSpace,
    isPageVideo,
} from '@/utils/pageType'
import {
    commentFilterCommonEntry,
    commentFilterCommonGroups,
    commentFilterCommonHandler,
} from './variety/comment/pages/common'
import {
    dynamicFilterDynamicEntry,
    dynamicFilterDynamicGroups,
    dynamicFilterDynamicHandler,
} from './variety/dynamic/pages/dynamic'
import { dynamicFilterHeaderEntry } from './variety/dynamic/pages/header'
import { dynamicFilterSpaceEntry, dynamicFilterSpaceGroups } from './variety/dynamic/pages/space'
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
import { videoFilterSpaceEntry, videoFilterSpaceGroups, videoFilterSpaceHandler } from './variety/video/pages/space'
import { videoFilterVideoEntry, videoFilterVideoGroups, videoFilterVideoHandler } from './variety/video/pages/video'

/** 视频过滤器 */
export const videoFilters: Filter[] = [
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
        name: '新版分区页 视频过滤',
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
        name: '视频页/番剧页/动态页/空间页 视频评论过滤',
        groups: commentFilterCommonGroups,
        entry: commentFilterCommonEntry,
        checkFn: () => isPageVideo() || isPageBangumi() || isPagePlaylist() || isPageDynamic() || isPageSpace(),
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
    {
        name: '空间页 动态过滤',
        groups: dynamicFilterSpaceGroups,
        entry: dynamicFilterSpaceEntry,
        checkFn: isPageSpace,
    },
    {
        name: '顶栏 动态过滤',
        groups: [],
        entry: dynamicFilterHeaderEntry,
        checkFn: () => !isPageLive(),
    },
]

/** 载入过滤器样式 */
export const loadFilterStyle = () => {
    const style = document.createElement('style')
    style.className = `bili-cleaner-css filter`
    style.textContent = `:is(body, #app, #i_cecream) [${settings.filterHideSign}] {display: none !important;}`
    document.documentElement?.appendChild(style)
}

/** 右键菜单功能 */
export const filterContextMenuHandlers = [
    videoFilterVideoHandler,
    videoFilterSearchHandler,
    videoFilterChannelHandler,
    videoFilterPopularHandler,
    videoFilterHomepageHandler,
    videoFilterSpaceHandler,
    dynamicFilterDynamicHandler,
    commentFilterCommonHandler,
]

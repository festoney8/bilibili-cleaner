import { Collection } from '../../types/collection'
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
import { dynamicFilterDynamicGroups } from './variety/dynamic/pages/dynamic'
import { videoFilterChannelGroups } from './variety/video/pages/channel'
import { videoFilterHomepageGroups } from './variety/video/pages/homepage'
import { videoFilterPopularGroups } from './variety/video/pages/popular'
import { videoFilterSearchGroups } from './variety/video/pages/search'
import { videoFilterSpaceGroups } from './variety/video/pages/space'
import { videoFilterVideoGroups } from './variety/video/pages/video'

export const loadFilters = () => {}

/** 视频过滤功能 */
export const videoFilters: Collection[] = [
    // 视频过滤
    {
        name: '首页 视频过滤',
        groups: videoFilterHomepageGroups,
        checkFn: isPageHomepage,
    },
    {
        name: '播放页 视频过滤',
        groups: videoFilterVideoGroups,
        checkFn: () => isPageVideo() || isPagePlaylist(),
    },
    {
        name: '热门页 视频过滤',
        groups: videoFilterPopularGroups,
        checkFn: isPageVideo,
    },
    {
        name: '分区页 视频过滤',
        groups: videoFilterChannelGroups,
        checkFn: isPageChannel,
    },
    {
        name: '搜索页 视频过滤',
        groups: videoFilterSearchGroups,
        checkFn: isPageSearch,
    },
    {
        name: '空间页 视频过滤',
        groups: videoFilterSpaceGroups,
        checkFn: isPageSpace,
    },
]

/** 评论过滤功能 */
export const commentFilters: Collection[] = [
    {
        name: '视频页/番剧页 视频评论过滤',
        groups: commentFilterBangumiGroups,
        checkFn: () => isPageVideo() || isPageBangumi() || isPagePlaylist(),
    },
    {
        name: '动态页/空间页 动态评论过滤',
        groups: commentFilterBangumiGroups,
        checkFn: () => isPageDynamic() || isPageSpace(),
    },
]

/** 动态过滤功能 */
export const dynamicFilters: Collection[] = [
    {
        name: '动态页 动态过滤',
        groups: dynamicFilterDynamicGroups,
        checkFn: isPageDynamic,
    },
]

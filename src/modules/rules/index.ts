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

import { logger } from '@/utils/logger'

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

import bangumiStyle from './bangumi/index.scss?style'
import channelStyle from './channel/index.scss?style'
import commentStyle from './comment/index.scss?style'
import commonStyle from './common/index.scss?style'
import dynamicStyle from './dynamic/index.scss?style'
import festivalStyle from './festival/index.scss?style'
import homepageStyle from './homepage/index.scss?style'
import liveStyle from './live/index.scss?style'
import popularStyle from './popular/index.scss?style'
import searchStyle from './search/index.scss?style'
import spaceStyle from './space/index.scss?style'
import videoStyle from './video/index.scss?style'
import watchlaterStyle from './watchlater/index.scss?style'

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

/** 载入css, 注入在html节点下, 需在head节点出现后(html节点可插入时)执行 */
export const loadRuleStyle = () => {
    for (const rule of rules) {
        if (rule.checkFn() && rule.style) {
            try {
                // style HMR in prod/dev mode
                rule.style.classList.add('bili-cleaner-css', rule.name)
                document.documentElement?.appendChild(rule.style)
            } catch (err) {
                logger.error(`loadRuleStyle error, name=${rule.name}`, err)
            }
        }
    }
}

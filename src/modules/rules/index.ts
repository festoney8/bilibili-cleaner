import { Rule } from '../../types/rule'
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
  isPageWatchlater,
} from '../../utils/pageType'
import { bangumiGroups } from './bangumi'
import { channelGroups } from './channel'
import { commentGroups } from './comment'
import { commonGroups } from './common'
import { dynamicGroups } from './dynamic'
import { homepageGroups } from './homepage'
import { liveGroups } from './live'
import { popularGroups } from './popular'
import { searchGroups } from './search'
import { spaceGroups } from './space'
import { videoGroups } from './video'

import { GM_getValue } from '$'
import { IListItem, INumberItem, ISwitchItem } from '../../types/item'
import { error } from '../../utils/logger'
import bangumiStyle from './bangumi/index.scss?inline'
import channelStyle from './channel/index.scss?inline'
import commentStyle from './comment/index.scss?inline'
import commonStyle from './common/index.scss?inline'
import dynamicStyle from './dynamic/index.scss?inline'
import homepageStyle from './homepage/index.scss?inline'
import liveStyle from './live/index.scss?inline'
import popularStyle from './popular/index.scss?inline'
import searchStyle from './search/index.scss?inline'
import spaceStyle from './space/index.scss?inline'
import videoStyle from './video/index.scss?inline'
import { watchlaterGroups } from './watchlater'
import watchlaterStyle from './watchlater/index.scss?inline'

/** 全部规则 */
export const rules: Rule[] = [
  {
    name: '首页',
    groups: homepageGroups,
    style: homepageStyle,
    checkFn: isPageHomepage,
  },
  {
    name: '普通播放页',
    groups: videoGroups,
    style: videoStyle,
    checkFn: () => isPageVideo() || isPagePlaylist(),
  },
  {
    name: '番剧播放页',
    groups: bangumiGroups,
    style: bangumiStyle,
    checkFn: isPageBangumi,
  },
  {
    name: '动态页',
    groups: dynamicGroups,
    style: dynamicStyle,
    checkFn: isPageDynamic,
  },
  {
    name: '直播页',
    groups: liveGroups,
    style: liveStyle,
    checkFn: isPageLive,
  },
  {
    name: '热门/排行榜页',
    groups: popularGroups,
    style: popularStyle,
    checkFn: isPagePopular,
  },
  {
    name: '分区页',
    groups: channelGroups,
    style: channelStyle,
    checkFn: isPageChannel,
  },
  {
    name: '空间页',
    groups: spaceGroups,
    style: spaceStyle,
    checkFn: isPageSpace,
  },
  {
    name: '搜索页',
    groups: searchGroups,
    style: searchStyle,
    checkFn: isPageSearch,
  },
  {
    name: '稍后再看页',
    groups: watchlaterGroups,
    style: watchlaterStyle,
    checkFn: isPageWatchlater,
  },
  {
    name: '评论区',
    groups: commentGroups,
    style: commentStyle,
    checkFn: () => isPageVideo() || isPageBangumi() || isPageDynamic() || isPageSpace() || isPagePlaylist(),
  },
  {
    name: '全站通用',
    groups: commonGroups,
    style: commonStyle,
    checkFn: () => true,
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
            }
          } catch (err) {
            error('load item failed', err)
          }
        }
      }
    }
  }
}

/** 载入css, 注入在html节点下, 需在head节点出现后(html节点可插入时)执行 */
export const loadStyles = () => {
  for (const rule of rules) {
    if (rule.checkFn()) {
      const style = document.createElement('style')
      style.className = 'bili-cleaner-css'
      style.textContent = rule.style
      document.documentElement?.appendChild(style)
    }
  }
}

const loadSwitchItem = (item: ISwitchItem) => {
  const enable = GM_getValue(item.id, item.defaultEnable)
  if (enable) {
    if (!item.noStyle) {
      document.documentElement.setAttribute(item.attrName ?? item.id, '')
    }
    if (item.enableFn) {
      if (item.enableFnRunAt === 'document-end') {
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
    if (!item.noStyle) {
      document.documentElement.setAttribute(item.attrName ?? item.id, '')
    }
    item.fn(value)?.then().catch()
  }
}

const loadListItem = (item: IListItem) => {
  const value = GM_getValue(item.id, item.defaultValue)
  if (value !== item.disableValue) {
    document.documentElement.setAttribute(value, '')
  }
}

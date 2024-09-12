import { Group } from '../../types/group'
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
import { dynamicGroups } from './dynamic'
import { homepageGroups } from './homepage'
import { liveGroups } from './live'
import { popularGroups } from './popular'
import { searchGroups } from './search'
import { spaceGroups } from './space'
import { videoGroups } from './video'

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
import watchlaterStyle from './watchlater/index.scss?inline'

const loadGroups = (groups: Group[]) => {
    for (const group of groups) {
        for (const item of group.items) {
            try {
                if ('id' in item) {
                    document.documentElement.setAttribute(item.id, '')
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
}

const loadStyle = (css: string) => {
    const style = document.createElement('style')
    style.textContent = css
    style.className = 'bili-cleaner-css'
    document.documentElement?.appendChild(style)
}

/**
 * 载入当前页面规则列表
 */
export const loadRules = () => {
    loadGroups(commentGroups)

    if (isPageHomepage()) {
        loadGroups(homepageGroups)
    }
    if (isPageVideo() || isPagePlaylist()) {
        loadGroups(videoGroups)
    }
    if (isPageBangumi() || isPageVideo() || isPageDynamic() || isPageSpace() || isPagePlaylist()) {
        loadGroups(commentGroups)
    }
    if (isPageBangumi()) {
        loadGroups(bangumiGroups)
    }
    if (isPageChannel()) {
        loadGroups(channelGroups)
    }
    if (isPageDynamic()) {
        loadGroups(dynamicGroups)
    }
    if (isPageLive()) {
        loadGroups(liveGroups)
    }
    if (isPagePopular()) {
        loadGroups(popularGroups)
    }
    if (isPageSearch()) {
        loadGroups(searchGroups)
    }
    if (isPageSpace()) {
        loadGroups(spaceGroups)
    }
}

/**
 * 载入css, 注入在html节点下, 需在head节点出现后(html节点可插入时)执行
 */
export const loadStyles = () => {
    loadStyle(commonStyle)

    if (isPageHomepage()) {
        loadStyle(homepageStyle)
    }
    if (isPageVideo() || isPagePlaylist()) {
        loadStyle(videoStyle)
    }
    if (isPageBangumi() || isPageVideo() || isPageDynamic() || isPageSpace() || isPagePlaylist()) {
        loadStyle(commentStyle)
    }
    if (isPageBangumi()) {
        loadStyle(bangumiStyle)
    }
    if (isPageChannel()) {
        loadStyle(channelStyle)
    }
    if (isPageDynamic()) {
        loadStyle(dynamicStyle)
    }
    if (isPageLive()) {
        loadStyle(liveStyle)
    }
    if (isPagePopular()) {
        loadStyle(popularStyle)
    }
    if (isPageSearch()) {
        loadStyle(searchStyle)
    }
    if (isPageSpace()) {
        loadStyle(spaceStyle)
    }
    if (isPageWatchlater()) {
        loadStyle(watchlaterStyle)
    }
}
import { Item } from '../../../../types/item'
import {
    isPageBangumi,
    isPageChannel,
    isPageDynamic,
    isPageHomepage,
    isPageLiveHome,
    isPageLiveRoom,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageVideo,
} from '../../../../utils/pageType'
import URLCleanerInstance from '../../../../utils/urlCleaner'

export const commonBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'border-radius',
        name: '页面直角化，去除圆角',
        // 根据当前页面选定attribute name
        attrName: ((): string | undefined => {
            if (isPageDynamic()) {
                return 'border-radius-dynamic'
            }
            if (isPageLiveRoom() || isPageLiveHome()) {
                return 'border-radius-live'
            }
            if (isPageSearch()) {
                return 'border-radius-search'
            }
            if (isPageVideo() || isPagePlaylist()) {
                return 'border-radius-video'
            }
            if (isPageBangumi()) {
                return 'border-radius-bangumi'
            }
            if (isPageHomepage()) {
                return 'border-radius-homepage'
            }
            if (isPagePopular()) {
                return 'border-radius-popular'
            }
            if (isPageChannel()) {
                return 'border-radius-channel'
            }
            return undefined
        })(),
    },
    {
        type: 'switch',
        id: 'beauty-scrollbar',
        name: '美化页面滚动条',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'url-cleaner',
        name: 'URL参数净化 (充电时需关闭)',
        defaultEnable: true,
        /**
         * URL净化，移除query string中的跟踪参数/无用参数
         * 净化掉vd_source参数会导致充电窗口载入失败
         */
        enableFn: async () => {
            const cleanParams = (url: string): string => {
                try {
                    // 直播域名各种iframe页面（天选、抽奖）和活动页特殊处理
                    if (url.match(/live\.bilibili\.com\/(p\/html|activity|blackboard)/)) {
                        return url
                    }
                    const keysToRemove = new Set([
                        'from_source',
                        'spm_id_from',
                        'search_source',
                        'vd_source',
                        'unique_k',
                        'is_story_h5',
                        'from_spmid',
                        'share_plat',
                        'share_medium',
                        'share_from',
                        'share_source',
                        'share_tag',
                        'up_id',
                        'timestamp',
                        'mid',
                        'live_from',
                        'launch_id',
                        'session_id',
                        'share_session_id',
                        'broadcast_type',
                        'is_room_feed',
                        'spmid',
                        'plat_id',
                        'goto',
                        'report_flow_data',
                        'trackid',
                        'live_form',
                        'track_id',
                        'from',
                        'visit_id',
                        'extra_jump_from',
                    ])
                    if (isPageSearch()) {
                        keysToRemove.add('vt')
                    }
                    if (isPageLiveRoom()) {
                        keysToRemove.add('bbid')
                        keysToRemove.add('ts')
                        keysToRemove.add('hotRank')
                        keysToRemove.add('popular_rank')
                    }
                    const urlObj = new URL(url)
                    const params = new URLSearchParams(urlObj.search)

                    const temp = []
                    for (const k of params.keys()) {
                        keysToRemove.has(k) && temp.push(k)
                    }
                    for (const k of temp) {
                        params.delete(k)
                    }
                    params.get('p') === '1' && params.delete('p')

                    urlObj.search = params.toString().replace(/\/$/, '')
                    return urlObj.toString()
                } catch (err) {
                    return url
                }
            }
            URLCleanerInstance.cleanFnArr.push(cleanParams)
            URLCleanerInstance.clean()
        },
    },
    {
        type: 'switch',
        id: 'hide-footer',
        name: '隐藏 页底footer',
    },
]

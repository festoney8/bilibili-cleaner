import { Group } from '../core/group'
import { NormalItem, SeparatorItem } from '../core/item'
import { debug } from '../utils/logger'

/**
 * URL净化，移除query string中的跟踪参数/无用参数
 * 净化掉vd_source参数会导致充电窗口载入失败
 */
const cleanURL = () => {
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
    ])
    const url = location.href
    const urlObj = new URL(url)
    const params = new URLSearchParams(urlObj.search)

    const temp = []
    for (const k of params.keys()) {
        if (keysToRemove.has(k)) {
            temp.push(k)
        }
    }
    for (const k of temp) {
        params.delete(k)
    }
    if (params.has('p') && params.get('p') == '1') {
        params.delete('p')
    }

    urlObj.search = params.toString()
    let newURL = urlObj.toString()
    if (newURL.endsWith('/')) {
        newURL = newURL.slice(0, -1)
    }
    if (newURL !== url) {
        history.replaceState(null, '', newURL)
    }
    debug('cleanURL complete')
}

const commonItems: (NormalItem | SeparatorItem)[] = []

// URL参数净化, 在urlchange时需重载
commonItems.push(new NormalItem('url-cleaner', 'URL参数净化 (需刷新, 给UP充电时需关闭)', false, cleanURL, true, null))

// 滚动条美化, 默认开启
commonItems.push(
    new NormalItem(
        'beauty-scrollbar',
        '美化页面滚动条',
        true,
        undefined,
        false,
        `
        /* WebKit */
        ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
            background: transparent !important;
        }
        ::-webkit-scrollbar:hover {
            background: rgba(128, 128, 128, 0.4) !important;
        }
        ::-webkit-scrollbar-thumb {
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            background-color: rgba(0, 0, 0, 0.4) !important;
            z-index: 2147483647;
            -webkit-border-radius: 8px !important;
            background-clip: content-box !important;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.8) !important;
        }
        ::-webkit-scrollbar-thumb:active {
            background-color: rgba(0, 0, 0, 0.6) !important;
        }

        /* Firefox */
        * {
            scrollbar-color: rgba(0, 0, 0, 0.6) transparent !important;
            scrollbar-width: thin !important;
        }
        `,
    ),
)

// 通用header净化，直播页除外
if (location.host != 'live.bilibili.com') {
    /////////////////////////////////////////////////////////////////////////////////////////
    // 左侧part
    commonItems.push(new SeparatorItem())
    // 隐藏 顶栏-主站Logo
    commonItems.push(
        new NormalItem(
            'common-hide-nav-homepage-logo',
            '隐藏 顶栏-主站Logo',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com"]) svg {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-首页
    commonItems.push(
        new NormalItem(
            'common-hide-nav-homepage',
            '隐藏 顶栏-首页',
            false,
            undefined,
            false,
            `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) span {display: none !important;}
            div.bili-header__bar .left-entry .v-popover-wrap:has(>a[href="//www.bilibili.com"]) div {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-番剧
    commonItems.push(
        new NormalItem(
            'common-hide-nav-anime',
            '隐藏 顶栏-番剧',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com/anime/"])  {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-直播
    commonItems.push(
        new NormalItem(
            'common-hide-nav-live',
            '隐藏 顶栏-直播',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(>a[href="//live.bilibili.com"])  {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-游戏中心
    commonItems.push(
        new NormalItem(
            'common-hide-nav-game',
            '隐藏 顶栏-游戏中心',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(>a[href^="//game.bilibili.com"])  {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-会员购
    commonItems.push(
        new NormalItem(
            'common-hide-nav-vipshop',
            '隐藏 顶栏-会员购',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(>a[href^="//show.bilibili.com"])  {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-漫画
    commonItems.push(
        new NormalItem(
            'common-hide-nav-manga',
            '隐藏 顶栏-漫画',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(>a[href^="//manga.bilibili.com"])  {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-赛事
    commonItems.push(
        new NormalItem(
            'common-hide-nav-match',
            '隐藏 顶栏-赛事',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(>a[href^="//www.bilibili.com/match/"], >a[href^="//www.bilibili.com/v/game/match/"]) {
                display: none !important;
            }`,
        ),
    )
    // 隐藏 顶栏-活动/活动直播
    commonItems.push(
        new NormalItem(
            'common-hide-nav-moveclip',
            '隐藏 顶栏-活动/活动直播',
            false,
            undefined,
            false,
            `div.bili-header__bar li:has(.loc-mc-box) {display: none !important;}
            div.bili-header__bar .left-entry li:not(:has(.v-popover)):has([href^="https://live.bilibili.com/"]) {
                display: none !important;
            }`,
        ),
    )
    // 隐藏 顶栏-百大评选
    commonItems.push(
        new NormalItem(
            'common-hide-nav-bdu',
            '隐藏 顶栏-百大评选',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(a[href*="bilibili.com/BPU20"]) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-下载客户端, 默认开启
    commonItems.push(
        new NormalItem(
            'common-hide-nav-download-app',
            '隐藏 顶栏-下载客户端',
            true,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(a[href="//app.bilibili.com"]) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-所有官方活动(blackboard)
    commonItems.push(
        new NormalItem(
            'common-hide-nav-blackboard',
            '隐藏 顶栏-所有官方活动(blackboard)',
            false,
            undefined,
            false,
            `div.bili-header__bar .left-entry li:has(>a[href*="bilibili.com/blackboard"]) {display: none !important;}
            div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/blackboard"]) {display: none !important;}`,
        ),
    )
    /////////////////////////////////////////////////////////////////////////////////////////
    // 中间part
    commonItems.push(new SeparatorItem())
    // 隐藏 顶栏-搜索框 推荐搜索
    commonItems.push(
        new NormalItem(
            'common-hide-nav-search-rcmd',
            '隐藏 顶栏-搜索框 推荐搜索',
            false,
            undefined,
            false,
            `#nav-searchform .nav-search-input::placeholder {color: transparent;}`,
        ),
    )
    // 隐藏 顶栏-搜索框 搜索历史
    commonItems.push(
        new NormalItem(
            'common-hide-nav-search-history',
            '隐藏 顶栏-搜索框 搜索历史',
            false,
            undefined,
            false,
            `.search-panel .history {display: none;}`,
        ),
    )
    // 隐藏 顶栏-搜索框 bilibili热搜
    commonItems.push(
        new NormalItem(
            'common-hide-nav-search-trending',
            '隐藏 顶栏-搜索框 bilibili热搜',
            false,
            undefined,
            false,
            `.search-panel .trending {display: none;}`,
        ),
    )
    /////////////////////////////////////////////////////////////////////////////////////////
    // 右侧part
    commonItems.push(new SeparatorItem())
    // 隐藏 顶栏-头像
    commonItems.push(
        new NormalItem(
            'common-hide-nav-avatar',
            '隐藏 顶栏-头像',
            false,
            undefined,
            false,
            `.right-entry .v-popover-wrap.header-avatar-wrap {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-大会员, 默认开启
    commonItems.push(
        new NormalItem(
            'common-hide-nav-vip',
            '隐藏 顶栏-大会员',
            true,
            undefined,
            false,
            `.right-entry .vip-wrap:has([href="//account.bilibili.com/big"]) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-消息
    commonItems.push(
        new NormalItem(
            'common-hide-nav-message',
            '隐藏 顶栏-消息',
            false,
            undefined,
            false,
            `.right-entry .v-popover-wrap:has([href^="//message.bilibili.com"], [data-idx="message"]) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-动态
    commonItems.push(
        new NormalItem(
            'common-hide-nav-dynamic',
            '隐藏 顶栏-动态',
            false,
            undefined,
            false,
            `.right-entry .v-popover-wrap:has([href^="//t.bilibili.com"], [data-idx="dynamic"]) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-收藏
    commonItems.push(
        new NormalItem(
            'common-hide-nav-favorite',
            '隐藏 顶栏-收藏',
            false,
            undefined,
            false,
            `.right-entry .v-popover-wrap:has(.header-favorite-container, [data-idx="fav"]) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-历史
    commonItems.push(
        new NormalItem(
            'common-hide-nav-history',
            '隐藏 顶栏-历史',
            false,
            undefined,
            false,
            `.right-entry .v-popover-wrap:has([href="//www.bilibili.com/account/history"], [data-idx="history"]) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-创作中心
    commonItems.push(
        new NormalItem(
            'common-hide-nav-member',
            '隐藏 顶栏-创作中心',
            false,
            undefined,
            false,
            `.right-entry .right-entry-item:has(a[href="//member.bilibili.com/platform/home"], [data-idx="creation"]) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-投稿
    commonItems.push(
        new NormalItem(
            'common-hide-nav-upload',
            '隐藏 顶栏-投稿',
            false,
            undefined,
            false,
            // 不可设定 display: none, 会导致历史和收藏popover显示不全
            `.right-entry .right-entry-item.right-entry-item--upload {visibility: hidden !important;}`,
        ),
    )
}

export const commonGroup = new Group('common', '通用', commonItems)

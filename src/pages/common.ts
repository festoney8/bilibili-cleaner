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
        'extra_jump_from',
    ])
    // 搜索页参数, 意义不明所以做一下判断
    if (location.host === 'search.bilibili.com') {
        keysToRemove.add('vt')
    }
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

const basicItems: NormalItem[] = []
const headerLeftItems: NormalItem[] = []
const headerCenterItems: NormalItem[] = []
const headerRightItems: NormalItem[] = []
// Grouplist
const commonGroupList: Group[] = []

// 通用 页面直角化，去除圆角，根据URL选取CSS
let borderRadiusCSS: myCSS = ''
const host = location.host
const href = location.href
if (host === 't.bilibili.com') {
    borderRadiusCSS = `
        #nav-searchform,
        .nav-search-content,
        .header-upload-entry,
        .v-popover-content,
        .van-popover,
        .v-popover-wrap,
        .v-popover,
        .topic-panel,
        .bili-header .header-upload-entry,
        .bili-dyn-up-list,
        .bili-dyn-publishing,
        .bili-dyn-publishing__action,
        .bili-dyn-sidebar *,
        .bili-dyn-up-list__window,
        .bili-dyn-live-users,
        .bili-dyn-topic-box,
        .bili-dyn-list-notification,
        .bili-dyn-item,
        .bili-dyn-banner,
        .bili-dyn-banner__img,
        .bili-dyn-my-info,
        .bili-dyn-card-video,
        .bili-dyn-list-tabs,
        .bili-album__preview__picture__gif,
        .bili-album__preview__picture__img {
            border-radius: 3px !important;
        }
        .bili-dyn-card-video__cover__mask,
        .bili-dyn-card-video__cover {
            border-radius: 3px 0 0 3px !important;
        }
        .bili-dyn-card-video__body {
            border-radius: 0 3px 3px 0 !important;
        }`
} else if (host === 'live.bilibili.com') {
    borderRadiusCSS = `
        #nav-searchform,
        #player-ctnr,
        .nav-search-content,
        .header-upload-entry,
        .v-popover-content,
        .van-popover,
        .v-popover-wrap,
        .v-popover,
        .aside-area,
        .lower-row .right-ctnr *,
        .panel-main-ctnr,
        .startlive-btn,
        .flip-view,
        .content-wrapper,
        .chat-input-ctnr,
        .announcement-cntr,
        .bl-button--primary {
            border-radius: 3px !important;
        }
        #rank-list-vm,
        .head-info-section {
            border-radius: 3px 3px 0 0 !important;
        }
        .gift-control-section {
            border-radius: 0 0 3px 3px !important;
        }
        .follow-ctnr .right-part {
            border-radius: 0 3px 3px 0 !important;
        }
        .chat-control-panel {
            border-radius: 0 0 3px 3px !important;
        }
        .follow-ctnr .left-part,
        #rank-list-ctnr-box.bgStyle {
            border-radius: 3px 0 0 3px !important;
        }`
} else if (host === 'search.bilibili.com') {
    borderRadiusCSS = `
        #nav-searchform,
        .nav-search-content,
        .v-popover-content,
        .van-popover,
        .v-popover-wrap,
        .v-popover,
        .search-sticky-header *,
        .vui_button,
        .header-upload-entry,
        .search-input-wrap *,
        .search-input-container .search-input-wrap,
        .bili-video-card__cover {
            border-radius: 3px !important;
        }`
} else {
    if (href.startsWith('https://www.bilibili.com/video/')) {
        borderRadiusCSS = `
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover,
            .pic-box,
            .card-box .pic-box .pic,
            .bui-collapse-header,
            .base-video-sections-v1,
            .bili-header .search-panel,
            .bili-header .header-upload-entry,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,
            .video-tag-container .tag-panel .tag-link,
            .video-tag-container .tag-panel .show-more-btn,
            .vcd .cover img,
            .vcd *,
            .upinfo-btn-panel *,
            .fixed-sidenav-storage div,
            .fixed-sidenav-storage a,
            .reply-box-textarea,
            .reply-box-send,
            .reply-box-send:after {
                border-radius: 3px !important;
            }
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap {
                border-radius: 0 3px 3px 0 !important;
            }
            .bpx-player-dm-btn-send .bui-button {
                border-radius: 3px 0 0 3px !important;
            }`
    } else if (href.startsWith('https://www.bilibili.com/bangumi/play/')) {
        borderRadiusCSS = `
            a[class^="mediainfo_mediaCover"],
            a[class^="mediainfo_btnHome"],
            [class^="follow_btnFollow"],
            [class^="vipPaybar_textWrap__QARKv"],
            [class^="eplist_ep_list_wrapper"],
            [class^="RecommendItem_cover"],
            [class^="imageListItem_wrap"] [class^="imageListItem_coverWrap"],
            [class^="navTools_navMenu"] > *,
            [class^="navTools_item"],
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover,
            .pic-box,
            .card-box .pic-box .pic,
            .bui-collapse-header,
            .base-video-sections-v1,
            .bili-header .search-panel,
            .bili-header .header-upload-entry,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,
            .video-tag-container .tag-panel .tag-link,
            .video-tag-container .tag-panel .show-more-btn,
            .vcd .cover img,
            .vcd *,
            .upinfo-btn-panel *,
            .fixed-sidenav-storage div,
            .reply-box-textarea,
            .reply-box-send,
            .reply-box-send:after {
                border-radius: 3px !important;
            }
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap {
                border-radius: 0 3px 3px 0 !important;
            }
            .bpx-player-dm-btn-send .bui-button {
                border-radius: 3px 0 0 3px !important;
            }`
    } else if (href.startsWith('https://www.bilibili.com/') && ['/index.html', '/'].includes(location.pathname)) {
        borderRadiusCSS = `
            #nav-searchform,
            .nav-search-content,
            .history-item,
            .header-upload-entry,
            .bili-header .search-panel,
            .bili-header .header-upload-entry,
            .bili-header__channel .channel-link,
            .channel-entry-more__link,
            .header-channel-fixed-right-item,
            .recommended-swipe-body,
            .bili-video-card .bili-video-card__cover,
            .bili-video-card .bili-video-card__image,
            .bili-video-card .bili-video-card__info--icon-text,
            .bili-live-card,
            .floor-card,
            .floor-card .badge,
            .single-card.floor-card .floor-card-inner,
            .single-card.floor-card .cover-container,
            .primary-btn,
            .flexible-roll-btn,
            .palette-button-wrap .flexible-roll-btn-inner,
            .palette-button-wrap .storage-box,
            .palette-button-wrap,
            .v-popover-content {
                border-radius: 3px !important;
            }
            .bili-video-card__stats {
                border-bottom-left-radius: 3px !important;
                border-bottom-right-radius: 3px !important;
            }
            .floor-card .layer {
                display: none !important;
            }
            .single-card.floor-card {
                border: none !important;
            }`
    }
}

// 基本功能part, basicItems
{
    basicItems.push(new NormalItem('border-radius', '页面直角化，去除圆角', true, undefined, false, borderRadiusCSS))

    // 滚动条美化, 默认开启
    basicItems.push(
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

    // URL参数净化, 在urlchange时需重载, 默认开启
    // 以前会出现URL缺少参数导致充电窗口载入失败报错NaN的bug, 现无法复现, 猜测已修复
    basicItems.push(new NormalItem('url-cleaner', 'URL参数净化 (需刷新)', true, cleanURL, true, null))
}
commonGroupList.push(new Group('common-basic', '通用项 - 基本功能', basicItems))

// 通用header净化，直播页除外
if (location.host != 'live.bilibili.com') {
    // 顶栏左侧part, headerLeftItems
    {
        // 隐藏 顶栏-主站Logo
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-homepage-logo',
                '隐藏 顶栏-主站Logo',
                false,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com"]) svg {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href="//www.bilibili.com"]) .navbar_logo {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-首页
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-homepage',
                '隐藏 顶栏-首页',
                false,
                undefined,
                false,
                `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) span {
                    display: none !important;
                }
                div.bili-header__bar .left-entry .v-popover-wrap:has(>a[href="//www.bilibili.com"]) div {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href="//www.bilibili.com"]) :not(svg) {
                    color: transparent;
                    user-select: none;
                }
                #internationalHeader li.nav-link-item:has(>span>a[href="//www.bilibili.com"]) .navbar_pullup {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-番剧
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-anime',
                '隐藏 顶栏-番剧',
                false,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com/anime/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="bilibili.com/anime"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-直播
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-live',
                '隐藏 顶栏-直播',
                false,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(>a[href="//live.bilibili.com"], >a[href="//live.bilibili.com/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="live.bilibili.com"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-游戏中心
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-game',
                '隐藏 顶栏-游戏中心',
                false,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(>a[href^="//game.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="game.bilibili.com"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-会员购
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-vipshop',
                '隐藏 顶栏-会员购',
                false,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(>a[href^="//show.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="show.bilibili.com"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-漫画
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-manga',
                '隐藏 顶栏-漫画',
                false,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(>a[href^="//manga.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="manga.bilibili.com"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-赛事
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-match',
                '隐藏 顶栏-赛事',
                false,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(>a[href^="//www.bilibili.com/match/"], >a[href^="//www.bilibili.com/v/game/match/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="bilibili.com/match/"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-活动/活动直播
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-moveclip',
                '隐藏 顶栏-活动/活动直播',
                false,
                undefined,
                false,
                `div.bili-header__bar li:has(.loc-mc-box) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:not(:has(.v-popover)):has([href^="https://live.bilibili.com/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(a[href*="live.bilibili.com/blackboard"]) {
                    display: none !important;
                }
                #internationalHeader li.nav-link-item:has(.loc-mc-box, [href^="https://live.bilibili.com/"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-百大评选
        headerLeftItems.push(
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
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-download-app',
                '隐藏 顶栏-下载客户端',
                true,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(a[href="//app.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(a[href="//app.bilibili.com"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-所有官方活动(blackboard)
        headerLeftItems.push(
            new NormalItem(
                'common-hide-nav-blackboard',
                '隐藏 顶栏-所有官方活动(blackboard)',
                false,
                undefined,
                false,
                `div.bili-header__bar .left-entry li:has(>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(.loc-mc-box, span>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }`,
            ),
        )
    }
    commonGroupList.push(new Group('common-header-left', '通用项 - 顶栏 左侧', headerLeftItems))

    // 顶栏中间part, headerCenterItems
    {
        // 隐藏 顶栏-搜索框 推荐搜索
        headerCenterItems.push(
            new NormalItem(
                'common-hide-nav-search-rcmd',
                '隐藏 顶栏-搜索框 推荐搜索',
                false,
                undefined,
                false,
                `#nav-searchform .nav-search-input::placeholder {color: transparent;}
                /* 旧版header */
                #internationalHeader #nav_searchform input::placeholder {color: transparent;}`,
            ),
        )
        // 隐藏 顶栏-搜索框 搜索历史
        headerCenterItems.push(
            new NormalItem(
                'common-hide-nav-search-history',
                '隐藏 顶栏-搜索框 搜索历史',
                false,
                undefined,
                false,
                `.search-panel .history {display: none;}
                /* 旧版header */
                #internationalHeader .nav-search-box .history {display: none !important;}`,
            ),
        )
        // 隐藏 顶栏-搜索框 bilibili热搜
        headerCenterItems.push(
            new NormalItem(
                'common-hide-nav-search-trending',
                '隐藏 顶栏-搜索框 bilibili热搜',
                false,
                undefined,
                false,
                `.search-panel .trending {display: none;}
                /* 旧版header */
                #internationalHeader .nav-search-box .trending {display: none !important;}`,
            ),
        )
    }
    commonGroupList.push(new Group('common-header-center', '通用项 - 顶栏 搜索栏', headerCenterItems))

    // 顶栏右侧part, headerRightItems
    {
        // 隐藏 顶栏-头像
        headerRightItems.push(
            new NormalItem(
                'common-hide-nav-avatar',
                '隐藏 顶栏-头像',
                false,
                undefined,
                false,
                `.right-entry .v-popover-wrap.header-avatar-wrap {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-avatar) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-大会员, 默认开启
        headerRightItems.push(
            new NormalItem(
                'common-hide-nav-vip',
                '隐藏 顶栏-大会员',
                true,
                undefined,
                false,
                `.right-entry .vip-wrap:has([href*="//account.bilibili.com/big"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-vip) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-消息
        headerRightItems.push(
            new NormalItem(
                'common-hide-nav-message',
                '隐藏 顶栏-消息',
                false,
                undefined,
                false,
                `.right-entry .v-popover-wrap:has([href*="//message.bilibili.com"], [data-idx="message"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.nav-item-message) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-动态
        headerRightItems.push(
            new NormalItem(
                'common-hide-nav-dynamic',
                '隐藏 顶栏-动态',
                false,
                undefined,
                false,
                `.right-entry .v-popover-wrap:has([href*="//t.bilibili.com"], [data-idx="dynamic"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.nav-item-dynamic) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-收藏
        headerRightItems.push(
            new NormalItem(
                'common-hide-nav-favorite',
                '隐藏 顶栏-收藏',
                false,
                undefined,
                false,
                `.right-entry .v-popover-wrap:has(.header-favorite-container, [data-idx="fav"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-favorite) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-历史
        headerRightItems.push(
            new NormalItem(
                'common-hide-nav-history',
                '隐藏 顶栏-历史',
                false,
                undefined,
                false,
                `.right-entry .v-popover-wrap:has([href*="www.bilibili.com/account/history"], [data-idx="history"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-history) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-创作中心
        headerRightItems.push(
            new NormalItem(
                'common-hide-nav-member',
                '隐藏 顶栏-创作中心',
                false,
                undefined,
                false,
                `.right-entry .right-entry-item:has(a[href*="//member.bilibili.com/platform/home"], [data-idx="creation"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(a[href="//member.bilibili.com/platform/home"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 顶栏-投稿
        headerRightItems.push(
            new NormalItem(
                'common-hide-nav-upload',
                '隐藏 顶栏-投稿',
                false,
                undefined,
                false,
                // 不可设定 display: none, 会导致历史和收藏popover显示不全
                `.right-entry .right-entry-item.right-entry-item--upload {
                    visibility: hidden !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center >div:has(.mini-upload) {
                    visibility: hidden !important;
                }`,
            ),
        )
    }
    commonGroupList.push(new Group('common-header-right', '通用项 - 顶栏 右侧', headerRightItems))
}

export { commonGroupList }

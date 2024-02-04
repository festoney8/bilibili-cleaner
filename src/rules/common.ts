import { Group } from '../components/group'
import { CheckboxItem, NumberItem, RadioItem } from '../components/item'
import { debug } from '../utils/logger'
import {
    isPageBangumi,
    isPageDynamic,
    isPageHomepage,
    isPageLive,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageVideo,
} from '../utils/page-type'

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
    if (isPageSearch()) {
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

// Grouplist
const commonGroupList: Group[] = []

// 通用 页面直角化，去除圆角，根据URL选取CSS
let borderRadiusCSS: myCSS = ''
if (isPageDynamic()) {
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
} else if (isPageLive()) {
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
} else if (isPageSearch()) {
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
    // 普通播放页, 播放列表页（稍后再看播放页, 收藏夹播放页）
    if (isPageVideo() || isPagePlaylist()) {
        borderRadiusCSS = `
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover,
            .pic-box,
            .action-list-container,
            .actionlist-item-inner .main .cover,
            .recommend-video-card .card-box .pic-box,
            .recommend-video-card .card-box .pic-box .rcmd-cover .rcmd-cover-img .b-img__inner img,
            .actionlist-item-inner .main .cover .cover-img .b-img__inner img,
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
    } else if (isPageBangumi()) {
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
    } else if (isPageHomepage()) {
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
    } else if (isPagePopular()) {
        borderRadiusCSS = `
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover,
            .bili-header .search-panel,
            .bili-header .header-upload-entry,
            .upinfo-btn-panel *,
            .rank-list .rank-item > .content > .img,
            .card-list .video-card .video-card__content, .video-list .video-card .video-card__content,
            .fixed-sidenav-storage div,
            .fixed-sidenav-storage a {
                border-radius: 3px !important;
            }`
    }
}

// 基本功能
const basicItems = [
    new CheckboxItem({
        itemID: 'border-radius',
        description: '页面直角化，去除圆角',
        itemCSS: borderRadiusCSS,
    }),
    // 滚动条美化, 默认开启
    new CheckboxItem({
        itemID: 'beauty-scrollbar',
        description: '美化页面滚动条',
        defaultStatus: true,
        itemCSS: `
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

            /*
            Firefox and Chrome 121+
            https://developer.chrome.com/docs/css-ui/scrollbar-styling
            */
            * {
                scrollbar-color: rgba(0, 0, 0, 0.6) transparent !important;
                scrollbar-width: thin !important;
            }`,
    }),
    // URL参数净化, 在urlchange时需重载, 默认开启, 关闭功能需刷新
    // 以前会出现URL缺少参数导致充电窗口载入失败报错NaN的bug, 现无法复现, 猜测已修复
    new CheckboxItem({
        itemID: 'url-cleaner',
        description: 'URL参数净化',
        defaultStatus: true,
        itemFunc: cleanURL,
        isItemFuncReload: true,
    }),
]
commonGroupList.push(new Group('common-basic', '全站通用项 基本功能', basicItems))
// 通用header净化，直播页除外
if (!isPageLive()) {
    // 顶栏左侧
    const headerLeftItems = [
        // 隐藏 主站Logo
        new CheckboxItem({
            itemID: 'common-hide-nav-homepage-logo',
            description: '隐藏 主站Logo',
            itemCSS: `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com"]) svg {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href="//www.bilibili.com"]) .navbar_logo {
                    display: none !important;
                }`,
        }),
        // 隐藏 首页
        new CheckboxItem({
            itemID: 'common-hide-nav-homepage',
            description: '隐藏 首页',
            itemCSS: `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) span {
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
        }),
        // 隐藏 番剧
        new CheckboxItem({
            itemID: 'common-hide-nav-anime',
            description: '隐藏 番剧',
            itemCSS: `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com/anime/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="bilibili.com/anime"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 直播
        new CheckboxItem({
            itemID: 'common-hide-nav-live',
            description: '隐藏 直播',
            itemCSS: `div.bili-header__bar .left-entry li:has(>a[href="//live.bilibili.com"], >a[href="//live.bilibili.com/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="live.bilibili.com"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 游戏中心
        new CheckboxItem({
            itemID: 'common-hide-nav-game',
            description: '隐藏 游戏中心',
            itemCSS: `div.bili-header__bar .left-entry li:has(>a[href^="//game.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="game.bilibili.com"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 会员购
        new CheckboxItem({
            itemID: 'common-hide-nav-vipshop',
            description: '隐藏 会员购',
            itemCSS: `div.bili-header__bar .left-entry li:has(>a[href^="//show.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="show.bilibili.com"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 漫画
        new CheckboxItem({
            itemID: 'common-hide-nav-manga',
            description: '隐藏 漫画',
            itemCSS: `div.bili-header__bar .left-entry li:has(>a[href^="//manga.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="manga.bilibili.com"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 赛事
        new CheckboxItem({
            itemID: 'common-hide-nav-match',
            description: '隐藏 赛事',
            itemCSS: `div.bili-header__bar .left-entry li:has(>a[href^="//www.bilibili.com/match/"], >a[href^="//www.bilibili.com/v/game/match/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="bilibili.com/match/"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 活动/活动直播
        new CheckboxItem({
            itemID: 'common-hide-nav-moveclip',
            description: '隐藏 活动/活动直播',
            itemCSS: `div.bili-header__bar li:has(.loc-mc-box) {
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
        }),
        // 隐藏 百大评选
        new CheckboxItem({
            itemID: 'common-hide-nav-bdu',
            description: '隐藏 百大评选',
            itemCSS: `div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/BPU20"]) {display: none !important;}`,
        }),
        // 隐藏 下载客户端, 默认开启
        new CheckboxItem({
            itemID: 'common-hide-nav-download-app',
            description: '隐藏 下载客户端',
            defaultStatus: true,
            itemCSS: `div.bili-header__bar .left-entry li:has(a[href="//app.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(a[href="//app.bilibili.com"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 所有官方活动(blackboard)
        new CheckboxItem({
            itemID: 'common-hide-nav-blackboard',
            description: '隐藏 所有官方活动(强制)',
            itemCSS: `div.bili-header__bar .left-entry li:has(>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:has(>a[href*="bilibili.com/video/"]) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/video/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(.loc-mc-box, span>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }`,
        }),
    ]
    commonGroupList.push(new Group('common-header-left', '全站通用项 顶栏 左侧', headerLeftItems))

    // 顶栏中间
    const headerCenterItems = [
        // 隐藏 推荐搜索
        new CheckboxItem({
            itemID: 'common-hide-nav-search-rcmd',
            description: '隐藏 推荐搜索',
            itemCSS: `#nav-searchform .nav-search-input::placeholder {color: transparent;}
                /* 旧版header */
                #internationalHeader #nav_searchform input::placeholder {color: transparent;}`,
        }),
        // 隐藏 搜索历史
        new CheckboxItem({
            itemID: 'common-hide-nav-search-history',
            description: '隐藏 搜索历史',
            itemCSS: `.search-panel .history {display: none;}
                /* 旧版header */
                #internationalHeader .nav-search-box .history {display: none !important;}`,
        }),
        // 隐藏 bilibili热搜
        new CheckboxItem({
            itemID: 'common-hide-nav-search-trending',
            description: '隐藏 bilibili热搜',
            itemCSS: `.search-panel .trending {display: none;}
                /* 旧版header */
                #internationalHeader .nav-search-box .trending {display: none !important;}`,
        }),
    ]
    commonGroupList.push(new Group('common-header-center', '全站通用项 顶栏 搜索框', headerCenterItems))

    // 顶栏右侧
    const headerRightItems = [
        // 隐藏 头像
        new CheckboxItem({
            itemID: 'common-hide-nav-avatar',
            description: '隐藏 头像',
            itemCSS: `.right-entry .v-popover-wrap.header-avatar-wrap {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-avatar) {
                    display: none !important;
                }`,
        }),
        // 隐藏 大会员, 默认开启
        new CheckboxItem({
            itemID: 'common-hide-nav-vip',
            description: '隐藏 大会员',
            defaultStatus: true,
            itemCSS: `.right-entry .vip-wrap:has([href*="//account.bilibili.com/big"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-vip) {
                    display: none !important;
                }`,
        }),
        // 隐藏 消息
        new CheckboxItem({
            itemID: 'common-hide-nav-message',
            description: '隐藏 消息',
            itemCSS: `.right-entry .v-popover-wrap:has([href*="//message.bilibili.com"], [data-idx="message"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.nav-item-message) {
                    display: none !important;
                }`,
        }),
        // 隐藏 消息小红点
        new CheckboxItem({
            itemID: 'common-hide-nav-message-red-num',
            description: '隐藏 消息小红点',
            itemCSS: `.right-entry .v-popover-wrap:has([href*="//message.bilibili.com"], [data-idx="message"]) .red-num--message {
                    display: none !important;
                }`,
        }),
        // 隐藏 动态
        new CheckboxItem({
            itemID: 'common-hide-nav-dynamic',
            description: '隐藏 动态',
            itemCSS: `.right-entry .v-popover-wrap:has([href*="//t.bilibili.com"], [data-idx="dynamic"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.nav-item-dynamic) {
                    display: none !important;
                }`,
        }),
        // 隐藏 动态小红点
        new CheckboxItem({
            itemID: 'common-hide-nav-dynamic-red-num',
            description: '隐藏 动态小红点',
            itemCSS: `.right-entry .v-popover-wrap:has([href*="//t.bilibili.com"], [data-idx="dynamic"]) .red-num--dynamic {
                    display: none !important;
                }`,
        }),
        // 收藏、稍后再看 相关 一组互斥选项
        // 显示收藏 (官方默认), 默认开启
        new RadioItem({
            itemID: 'common-nav-favorite-watchlater-default',
            description: '显示 收藏 (官方默认)\n新增稍后再看视频时，自动切换为稍后再看',
            radioName: 'common-header-fav-option',
            radioItemIDList: [
                'common-nav-favorite-watchlater-default',
                'common-hide-nav-favorite',
                'common-hide-nav-favorite-keep-watchlater',
                'common-nav-keep-watchlater',
            ],
            defaultStatus: true,
        }), // 隐藏 收藏, 隐藏 稍后再看
        new RadioItem({
            itemID: 'common-hide-nav-favorite',
            description: '隐藏 收藏，隐藏 稍后再看',
            radioName: 'common-header-fav-option',
            radioItemIDList: [
                'common-nav-favorite-watchlater-default',
                'common-hide-nav-favorite',
                'common-hide-nav-favorite-keep-watchlater',
                'common-nav-keep-watchlater',
            ],
            itemCSS: `.right-entry .v-popover-wrap:has(.header-favorite-container, [data-idx="fav"]) {
                        display: none !important;
                    }
                    /* 旧版header */
                    #internationalHeader .nav-user-center .item:has(.mini-favorite) {
                        display: none !important;
                    }`,
        }), // 隐藏 收藏, 显示 稍后再看(实验性)
        new RadioItem({
            itemID: 'common-hide-nav-favorite-keep-watchlater',
            description: '隐藏 收藏，显示 稍后再看(实验性)',
            radioName: 'common-header-fav-option',
            radioItemIDList: [
                'common-nav-favorite-watchlater-default',
                'common-hide-nav-favorite',
                'common-hide-nav-favorite-keep-watchlater',
                'common-nav-keep-watchlater',
            ],
            itemCSS: `
                    /* 移除加入稍后再看时的上翻动画 */
                    .right-entry .v-popover-wrap .header-favorite-container-box {
                        animation: unset !important;
                    }
                    .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__up {
                        display: none !important;
                    }
                    .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__down {
                        margin-top: 4px !important;
                    }
                    @media (max-width: 1279.9px) {
                        .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__down {
                            top: 10px;
                        }
                    }`,
        }), // 显示 收藏, 显示 稍后再看(实验性)
        new RadioItem({
            itemID: 'common-nav-keep-watchlater',
            description: '显示 收藏，显示 稍后再看(实验性)',
            radioName: 'common-header-fav-option',
            radioItemIDList: [
                'common-nav-favorite-watchlater-default',
                'common-hide-nav-favorite',
                'common-hide-nav-favorite-keep-watchlater',
                'common-nav-keep-watchlater',
            ],
            itemCSS: `
                    /* 移除加入稍后再看时的上翻动画 */
                    .right-entry .v-popover-wrap .header-favorite-container-box {
                        display: flex !important;
                        animation: unset !important;
                    }
                    .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__down {
                        margin-top: 0 !important;
                    }
                    @media (max-width: 1279.9px) {
                        .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__down {
                            top: 15px;
                        }
                    }`,
        }), // 隐藏 历史
        new CheckboxItem({
            itemID: 'common-hide-nav-history',
            description: '隐藏 历史',
            itemCSS: `
                    .right-entry .v-popover-wrap:has([href*="www.bilibili.com/account/history"], [data-idx="history"]) {
                        display: none !important;
                    }
                    /* 旧版header */
                    #internationalHeader .nav-user-center .item:has(.mini-history) {
                        display: none !important;
                    }`,
        }),
        // 隐藏 创作中心
        new CheckboxItem({
            itemID: 'common-hide-nav-member',
            description: '隐藏 创作中心',
            itemCSS: `.right-entry .right-entry-item:has(a[href*="//member.bilibili.com/platform/home"], [data-idx="creation"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(a[href="//member.bilibili.com/platform/home"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 投稿
        new CheckboxItem({
            itemID: 'common-hide-nav-upload',
            description: '隐藏 投稿',
            // 不可设定 display: none, 会导致历史和收藏popover显示不全
            itemCSS: `.right-entry .right-entry-item.right-entry-item--upload {
                    visibility: hidden !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center >div:has(.mini-upload) {
                    visibility: hidden !important;
                }`,
        }),
    ]
    commonGroupList.push(new Group('common-header-right', '全站通用项 顶栏 右侧', headerRightItems))

    // 顶栏数值设定
    const headerWidthItems = [
        new NumberItem({
            itemID: 'common-header-bar-padding-left',
            description: '顶栏左侧 与页面左边界距离',
            defaultValue: -1,
            minValue: -1,
            maxValue: 2000,
            unit: 'px',
            itemCSS: `.bili-header .bili-header__bar {padding-left: ???px !important;}`,
            itemCSSPlaceholder: '???',
        }),
        new NumberItem({
            itemID: 'common-header-bar-search-width',
            description: '顶栏中间 搜索框宽度',
            defaultValue: -1,
            minValue: -1,
            maxValue: 2000,
            unit: 'px',
            itemCSS: `.bili-header .center-search-container .center-search__bar {
                width: ???px !important;
                max-width: ???px !important;
                min-width: 0px !important;
            }`,
            itemCSSPlaceholder: '???',
        }),
        new NumberItem({
            itemID: 'common-header-bar-padding-right',
            description: '顶栏右侧 与页面右边界距离',
            defaultValue: -1,
            minValue: -1,
            maxValue: 2000,
            unit: 'px',
            itemCSS: `.bili-header .bili-header__bar {padding-right: ???px !important;}`,
            itemCSSPlaceholder: '???',
        }),
    ]
    commonGroupList.push(new Group('common-header-bar-padding', '全站通用项 顶栏 数值设定', headerWidthItems))
}

export { commonGroupList }

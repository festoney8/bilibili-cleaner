import { Group } from '../core/group'
import { NormalItem, SeparatorItem } from '../core/item'

const liveItems: (NormalItem | SeparatorItem)[] = []

/** 直播页面规则, 只适用于直播间内, 不适用于直播首页 */
if (location.host == 'live.bilibili.com') {
    // 隐藏 信息栏-粉丝团
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-upper-row-follow-ctnr',
            '隐藏 信息栏-粉丝团',
            false,
            undefined,
            false,
            `#head-info-vm .upper-row .follow-ctnr {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-xx人看过
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-upper-row-visited',
            '隐藏 信息栏-xx人看过',
            false,
            undefined,
            false,
            `#head-info-vm .upper-row .right-ctnr div:has(.watched-icon) {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-人气
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-upper-row-popular',
            '隐藏 信息栏-人气',
            false,
            undefined,
            false,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-popular) {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-点赞
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-upper-row-like',
            '隐藏 信息栏-点赞',
            false,
            undefined,
            false,
            `#head-info-vm .upper-row .right-ctnr div:has(.like-icon) {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-举报, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-upper-row-report',
            '隐藏 信息栏-举报',
            true,
            undefined,
            false,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-report) {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-分享, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-upper-row-share',
            '隐藏 信息栏-分享',
            true,
            undefined,
            false,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-share) {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-人气榜, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-lower-row-hot-rank',
            '隐藏 信息栏-人气榜',
            true,
            undefined,
            false,
            `#head-info-vm .lower-row .right-ctnr .popular-and-hot-rank {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-礼物
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-lower-row-gift-planet-entry',
            '隐藏 信息栏-礼物',
            false,
            undefined,
            false,
            `#head-info-vm .lower-row .right-ctnr .gift-planet-entry {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-活动, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm-lower-row-activity-gather-entry',
            '隐藏 信息栏-活动',
            true,
            undefined,
            false,
            `#head-info-vm .lower-row .right-ctnr .activity-gather-entry {display: none !important;}`,
        ),
    )
    // 隐藏 信息栏-关闭整个信息栏
    liveItems.push(
        new NormalItem(
            'live-page-head-info-vm',
            '隐藏 信息栏-关闭整个信息栏',
            false,
            undefined,
            false,
            `#head-info-vm {display: none !important;}`,
        ),
    )
    ///////////////////////////////////////////////////////////////////////////
    // 播放器part
    liveItems.push(new SeparatorItem())
    // 隐藏 播放器-右上角反馈, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-head-web-player-icon-feedback',
            '隐藏 播放器-右上角反馈',
            true,
            undefined,
            false,
            `#live-player .web-player-icon-feedback {display: none !important;}`,
        ),
    )
    // 隐藏 播放器-购物小橙车提示, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-head-web-player-shop-popover-vm',
            '隐藏 播放器-购物小橙车提示',
            true,
            undefined,
            false,
            `#shop-popover-vm {display: none !important;}`,
        ),
    )
    // 隐藏 播放器-直播PK特效
    liveItems.push(
        new NormalItem(
            'live-page-head-web-player-awesome-pk-vm',
            '隐藏 播放器-直播PK特效',
            false,
            undefined,
            false,
            `#pk-vm, #awesome-pk-vm {display: none !important;}`,
        ),
    )
    // 隐藏 播放器-滚动礼物通告
    liveItems.push(
        new NormalItem(
            'live-page-head-web-player-announcement-wrapper',
            '隐藏 播放器-滚动礼物通告',
            false,
            undefined,
            false,
            `#live-player .announcement-wrapper {display: none !important;}`,
        ),
    )
    // 隐藏 播放器-幻星互动游戏
    liveItems.push(
        new NormalItem(
            'live-page-head-web-player-game-id',
            '隐藏 播放器-幻星互动游戏',
            false,
            undefined,
            false,
            `#game-id {display: none !important;}`,
        ),
    )
    // 隐藏 播放器-复读计数弹幕
    liveItems.push(
        new NormalItem(
            'live-page-combo-danmaku',
            '隐藏 播放器-复读计数弹幕',
            false,
            undefined,
            false,
            `.danmaku-item-container > div.combo {display: none !important;}`,
        ),
    )
    // 隐藏 播放器-礼物栏
    liveItems.push(
        new NormalItem(
            'live-page-gift-control-vm',
            '隐藏 播放器-礼物栏',
            false,
            undefined,
            false,
            `#gift-control-vm, #gift-control-vm-new {display: none !important;}`,
        ),
    )
    ///////////////////////////////////////////////////////////////////////////
    // 右栏part
    liveItems.push(new SeparatorItem())
    // 隐藏 右侧-高能榜/大航海 (需刷新)
    liveItems.push(
        new NormalItem(
            'live-page-rank-list-vm',
            '隐藏 右侧-高能榜/大航海 (需刷新)',
            false,
            undefined,
            false,
            `#rank-list-vm {display: none !important;}
        #aside-area-vm {overflow: hidden;}
        .chat-history-panel {height: calc(100% - 145px) !important; padding-top: 8px;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 系统提示, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-convention-msg',
            '隐藏 右侧-弹幕栏 系统提示',
            true,
            undefined,
            false,
            `.convention-msg.border-box {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 用户排名
    liveItems.push(
        new NormalItem(
            'live-page-rank-icon',
            '隐藏 右侧-弹幕栏 用户排名',
            false,
            undefined,
            false,
            `.chat-item .rank-icon {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 头衔装扮
    liveItems.push(
        new NormalItem(
            'live-page-title-label',
            '隐藏 右侧-弹幕栏 头衔装扮',
            false,
            undefined,
            false,
            `.chat-item .title-label {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 用户等级, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-wealth-medal-ctnr',
            '隐藏 右侧-弹幕栏 用户等级',
            true,
            undefined,
            false,
            `.chat-item .wealth-medal-ctnr {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 团体勋章
    liveItems.push(
        new NormalItem(
            'live-page-group-medal-ctnr',
            '隐藏 右侧-弹幕栏 团体勋章',
            false,
            undefined,
            false,
            `.chat-item .group-medal-ctnr {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 粉丝牌
    liveItems.push(
        new NormalItem(
            'live-page-fans-medal-item-ctnr',
            '隐藏 右侧-弹幕栏 粉丝牌',
            false,
            undefined,
            false,
            `.chat-item .fans-medal-item-ctnr {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 弹幕的高亮底色
    liveItems.push(
        new NormalItem(
            'live-page-chat-item-background-color',
            '隐藏 右侧-弹幕栏 弹幕的高亮底色',
            false,
            undefined,
            false,
            `.chat-item {background-color: unset !important; border-image-source: unset !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 礼物弹幕
    liveItems.push(
        new NormalItem(
            'live-page-gift-item',
            '隐藏 右侧-弹幕栏 礼物弹幕',
            false,
            undefined,
            false,
            `.chat-item.gift-item, .chat-item.common-danmuku-msg {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 底部滚动提示, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-brush-prompt',
            '隐藏 右侧-弹幕栏 底部滚动提示',
            true,
            undefined,
            false,
            `#brush-prompt {display: none !important;}
            /* 弹幕栏高度 */
            .chat-history-panel .chat-history-list.with-brush-prompt {height: 100% !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 互动框(他们都在说)
    liveItems.push(
        new NormalItem(
            'live-page-combo-card',
            '隐藏 右侧-弹幕栏 互动框(他们都在说)',
            false,
            undefined,
            false,
            `#combo-card:has(.combo-tips) {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕栏 互动框(找TA玩)
    liveItems.push(
        new NormalItem(
            'live-page-service-card-container',
            '隐藏 右侧-弹幕栏 互动框(找TA玩)',
            false,
            undefined,
            false,
            `.play-together-service-card-container {display: none !important;}`,
        ),
    )
    // 右侧-弹幕栏 使弹幕列表紧凑, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-compact-danmaku',
            '右侧-弹幕栏 使弹幕列表紧凑',
            true,
            undefined,
            false,
            `.chat-history-panel .chat-history-list .chat-item.danmaku-item.chat-colorful-bubble {margin: 2px 0 !important;}
        .chat-history-panel .chat-history-list .chat-item {padding: 3px 5px !important; font-size: 1.2rem !important;}
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .user-name {font-size: 1.2rem !important;}
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname {font-size: 1.2rem !important;}
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname .common-nickname-wrapper {font-size: 1.2rem !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕控制按钮 左侧
    liveItems.push(
        new NormalItem(
            'live-page-control-panel-icon-row-left',
            '隐藏 右侧-弹幕控制按钮 左侧',
            false,
            undefined,
            false,
            `#chat-control-panel-vm .control-panel-icon-row .icon-left-part {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕控制按钮 右侧
    liveItems.push(
        new NormalItem(
            'live-page-control-panel-icon-row-right',
            '隐藏 右侧-弹幕控制按钮 右侧',
            false,
            undefined,
            false,
            `#chat-control-panel-vm .control-panel-icon-row .icon-right-part {display: none !important;}`,
        ),
    )
    // 隐藏 右侧-弹幕发送框
    liveItems.push(
        new NormalItem(
            'live-page-chat-input-ctnr',
            '隐藏 右侧-弹幕发送框',
            false,
            undefined,
            false,
            `#chat-control-panel-vm .chat-input-ctnr, #chat-control-panel-vm .bottom-actions {display: none !important;}
        .chat-control-panel {height: unset !important;}
        .chat-history-panel {height: calc(100% - 45px) !important; padding-top: 8px;}
        .chat-history-panel .danmaku-at-prompt {bottom: 50px !important;}`,
        ),
    )
    ///////////////////////////////////////////////////////////////////////////
    // 视频下方页面part
    liveItems.push(new SeparatorItem())
    // 隐藏 视频下方-活动海报, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-flip-view',
            '隐藏 视频下方-活动海报',
            true,
            undefined,
            false,
            `.flip-view {display: none !important;}`,
        ),
    )
    // 隐藏 视频下方-直播间介绍
    liveItems.push(
        new NormalItem(
            'live-page-room-info-ctnr',
            '隐藏 视频下方-直播间介绍',
            false,
            undefined,
            false,
            `#sections-vm .room-info-ctnr {display: none !important;}`,
        ),
    )
    // 隐藏 视频下方-主播动态
    liveItems.push(
        new NormalItem(
            'live-page-room-feed',
            '隐藏 视频下方-主播动态',
            false,
            undefined,
            false,
            `#sections-vm .room-feed {display: none !important;}`,
        ),
    )
    // 隐藏 视频下方-主播公告
    liveItems.push(
        new NormalItem(
            'live-page-announcement-cntr',
            '隐藏 视频下方-主播公告',
            false,
            undefined,
            false,
            `#sections-vm .announcement-cntr {display: none !important;}`,
        ),
    )
    // 隐藏 视频下方-全部内容
    liveItems.push(
        new NormalItem(
            'live-page-sections-vm',
            '隐藏 视频下方-关闭全部内容',
            false,
            undefined,
            false,
            `#sections-vm {display: none !important;}`,
        ),
    )
    ///////////////////////////////////////////////////////////////////////////
    // 顶栏左侧part
    liveItems.push(new SeparatorItem())
    // 隐藏 顶栏-直播LOGO
    liveItems.push(
        new NormalItem(
            'live-page-header-entry-logo',
            '隐藏 顶栏-直播LOGO',
            false,
            undefined,
            false,
            `#main-ctnr a.entry_logo[href="//live.bilibili.com"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-首页
    liveItems.push(
        new NormalItem(
            'live-page-header-entry-title',
            '隐藏 顶栏-首页',
            false,
            undefined,
            false,
            `#main-ctnr a.entry-title[href="//www.bilibili.com"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-直播
    liveItems.push(
        new NormalItem(
            'live-page-header-live',
            '隐藏 顶栏-直播',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="live"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-全部
    liveItems.push(
        new NormalItem(
            'live-page-header-all',
            '隐藏 顶栏-全部',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="all"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-网游
    liveItems.push(
        new NormalItem(
            'live-page-header-net-game',
            '隐藏 顶栏-网游',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="网游"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-手游
    liveItems.push(
        new NormalItem(
            'live-page-header-mobile-game',
            '隐藏 顶栏-手游',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="手游"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-单机游戏
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-game',
            '隐藏 顶栏-单机游戏',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="单机游戏"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-娱乐
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-entertainment',
            '隐藏 顶栏-娱乐',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="娱乐"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-电台
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-radio',
            '隐藏 顶栏-电台',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="电台"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-虚拟主播
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-vtuber',
            '隐藏 顶栏-虚拟主播',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="虚拟主播"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-聊天室
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-chatroom',
            '隐藏 顶栏-聊天室',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="聊天室"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-生活
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-living',
            '隐藏 顶栏-生活',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="生活"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-知识
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-knowledge',
            '隐藏 顶栏-知识',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="知识"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-赛事
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-match',
            '隐藏 顶栏-赛事',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="赛事"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-帮我玩
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-helpmeplay',
            '隐藏 顶栏-帮我玩',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="帮我玩"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-互动玩法
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-interact',
            '隐藏 顶栏-互动玩法',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="互动玩法"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-购物
    liveItems.push(
        new NormalItem(
            'live-page-header-standalone-shopping',
            '隐藏 顶栏-购物',
            false,
            undefined,
            false,
            `#main-ctnr .dp-table-cell a[name="购物"] {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-更多, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-header-showmore-link',
            '隐藏 顶栏-更多',
            true,
            undefined,
            false,
            `#main-ctnr .showmore-link {display: none !important;}`,
        ),
    )
    ///////////////////////////////////////////////////////////////////////////
    // 顶栏中间part
    liveItems.push(new SeparatorItem())
    // 隐藏 顶栏-搜索框内推荐搜索
    liveItems.push(
        new NormalItem(
            'live-page-header-search-block-placeholder',
            '隐藏 顶栏-搜索框内推荐搜索',
            false,
            undefined,
            false,
            `#nav-searchform input::placeholder {visibility: hidden;}`,
        ),
    )
    // 隐藏 顶栏-搜索框
    liveItems.push(
        new NormalItem(
            'live-page-header-search-block',
            '隐藏 顶栏-搜索框',
            false,
            undefined,
            false,
            `#nav-searchform {display: none !important;}`,
        ),
    )
    ///////////////////////////////////////////////////////////////////////////
    // 顶栏右侧part
    liveItems.push(new SeparatorItem())
    // 隐藏 顶栏-头像
    liveItems.push(
        new NormalItem(
            'live-page-header-avatar',
            '隐藏 顶栏-头像',
            false,
            undefined,
            false,
            `#right-part .user-panel {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-动态
    liveItems.push(
        new NormalItem(
            'live-page-header-dynamic',
            '隐藏 顶栏-动态',
            false,
            undefined,
            false,
            `#right-part .shortcuts-ctnr .shortcut-item:has(.link-panel-ctnr) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-签到
    liveItems.push(
        new NormalItem(
            'live-page-header-checkin',
            '隐藏 顶栏-签到',
            false,
            undefined,
            false,
            `#right-part .shortcuts-ctnr .shortcut-item:has(.calendar-checkin) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-幻星互动, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-header-interact',
            '隐藏 顶栏-幻星互动',
            true,
            undefined,
            false,
            `#right-part .shortcuts-ctnr .shortcut-item:has(.fanbox-panel-ctnr) {display: none !important;}`,
        ),
    )
    // 隐藏 顶栏-我要开播, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-header-go-live',
            '隐藏 顶栏-我要开播',
            true,
            undefined,
            false,
            `#right-part .shortcuts-ctnr .shortcut-item:has(.download-panel-ctnr) {visibility: hidden;}`,
        ),
    )
    ///////////////////////////////////////////////////////////////////////////
    // 杂项part
    liveItems.push(new SeparatorItem())
    // 隐藏 右侧浮动按钮-实验室/关注, 默认开启
    liveItems.push(
        new NormalItem(
            'live-page-sidebar-vm',
            '隐藏 右侧浮动按钮-实验室/关注',
            true,
            undefined,
            false,
            `#sidebar-vm {display: none !important;}`,
        ),
    )
    // 页面直角化 去除圆角
    liveItems.push(
        new NormalItem(
            'live-page-border-radius',
            '页面直角化 去除圆角',
            false,
            undefined,
            false,
            `#nav-searchform,
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
            }`,
        ),
    )
}

export const liveGroup = new Group('live', '当前是：直播页', liveItems)

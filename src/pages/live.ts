import { Group } from '../core/group'
import { NormalItem } from '../core/item'

const basicItems: NormalItem[] = []
const infoItems: NormalItem[] = []
const playerItems: NormalItem[] = []
const rightContainerItems: NormalItem[] = []
const belowItems: NormalItem[] = []
const headerLeftItems: NormalItem[] = []
const headerCenterItems: NormalItem[] = []
const headerRightItems: NormalItem[] = []
// GroupList
const liveGroupList: Group[] = []

/** 直播页面规则, 只适用于直播间内, 不适用于直播首页 */
if (location.host === 'live.bilibili.com') {
    // 基本功能part, basicItems
    {
        // 隐藏 页面右侧按钮 实验室/关注, 默认开启
        basicItems.push(
            new NormalItem(
                'live-page-sidebar-vm',
                '隐藏 页面右侧按钮 实验室/关注',
                true,
                undefined,
                false,
                `#sidebar-vm {display: none !important;}`,
            ),
        )
        // 播放器皮肤 恢复默认配色
        basicItems.push(
            new NormalItem(
                'live-page-default-skin',
                '播放器皮肤 恢复默认配色',
                false,
                undefined,
                false,
                `#head-info-vm {
                    background-image: unset !important;
                    /* color不加important, 适配Evolved黑暗模式 */
                    background-color: white;
                }
                .live-title .text {
                    color: #61666D !important;
                }
                .header-info-ctnr .rows-ctnr .upper-row .room-owner-username {
                    color: #18191C !important;
                }
                /* 高权限覆盖 */
                #head-info-vm .live-skin-coloration-area .live-skin-normal-a-text {
                    color: unset !important;
                }
                #head-info-vm .live-skin-coloration-area .live-skin-main-text {
                    color: #61666D !important;
                    fill: #61666D !important;
                }
                /* 右侧弹幕框背景 */
                #chat-control-panel-vm .live-skin-coloration-area .live-skin-main-text {
                    color: #C9CCD0 !important;
                    fill: #C9CCD0 !important;
                }
                #chat-control-panel-vm {
                    background-image: unset !important;
                    background-color: #f6f7f8;
                }
                #chat-control-panel-vm .bl-button--primary {
                    background-color: #23ade5;
                }
                `,
            ),
        )
    }
    liveGroupList.push(new Group('live-basic', '直播页 基本功能', basicItems))

    // 直播信息栏part, infoItems
    {
        // 隐藏 粉丝团
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-upper-row-follow-ctnr',
                '隐藏 粉丝团',
                false,
                undefined,
                false,
                `#head-info-vm .upper-row .follow-ctnr {display: none !important;}`,
            ),
        )
        // 隐藏 xx人看过
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-upper-row-visited',
                '隐藏 xx人看过',
                false,
                undefined,
                false,
                `#head-info-vm .upper-row .right-ctnr div:has(.watched-icon) {display: none !important;}`,
            ),
        )
        // 隐藏 人气
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-upper-row-popular',
                '隐藏 人气',
                false,
                undefined,
                false,
                `#head-info-vm .upper-row .right-ctnr div:has(.icon-popular) {display: none !important;}`,
            ),
        )
        // 隐藏 点赞
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-upper-row-like',
                '隐藏 点赞',
                false,
                undefined,
                false,
                `#head-info-vm .upper-row .right-ctnr div:has(.like-icon) {display: none !important;}`,
            ),
        )
        // 隐藏 举报, 默认开启
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-upper-row-report',
                '隐藏 举报',
                true,
                undefined,
                false,
                `#head-info-vm .upper-row .right-ctnr div:has(.icon-report) {display: none !important;}`,
            ),
        )
        // 隐藏 分享, 默认开启
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-upper-row-share',
                '隐藏 分享',
                true,
                undefined,
                false,
                `#head-info-vm .upper-row .right-ctnr div:has(.icon-share) {display: none !important;}`,
            ),
        )
        // 隐藏 人气榜, 默认开启
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-lower-row-hot-rank',
                '隐藏 人气榜',
                true,
                undefined,
                false,
                `#head-info-vm .lower-row .right-ctnr .popular-and-hot-rank {display: none !important;}`,
            ),
        )
        // 隐藏 礼物
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-lower-row-gift-planet-entry',
                '隐藏 礼物',
                false,
                undefined,
                false,
                `#head-info-vm .lower-row .right-ctnr .gift-planet-entry {display: none !important;}`,
            ),
        )
        // 隐藏 活动, 默认开启
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm-lower-row-activity-gather-entry',
                '隐藏 活动',
                true,
                undefined,
                false,
                `#head-info-vm .lower-row .right-ctnr .activity-gather-entry {display: none !important;}`,
            ),
        )
        // 隐藏 全部直播信息栏
        infoItems.push(
            new NormalItem(
                'live-page-head-info-vm',
                '隐藏 关闭整个信息栏',
                false,
                undefined,
                false,
                `#head-info-vm {display: none !important;}
                /* 补齐圆角, 不可important */
                #player-ctnr {
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                    overflow: hidden;
                }`,
            ),
        )
    }
    liveGroupList.push(new Group('live-info', '直播信息栏', infoItems))

    // 播放器part, playerItems
    {
        // 隐藏 右上角反馈, 默认开启
        playerItems.push(
            new NormalItem(
                'live-page-head-web-player-icon-feedback',
                '隐藏 右上角反馈',
                true,
                undefined,
                false,
                `#live-player .web-player-icon-feedback {display: none !important;}`,
            ),
        )
        // 隐藏 购物小橙车提示, 默认开启
        playerItems.push(
            new NormalItem(
                'live-page-head-web-player-shop-popover-vm',
                '隐藏 购物小橙车提示',
                true,
                undefined,
                false,
                `#shop-popover-vm {display: none !important;}`,
            ),
        )
        // 隐藏 直播PK特效
        playerItems.push(
            new NormalItem(
                'live-page-head-web-player-awesome-pk-vm',
                '隐藏 直播PK特效',
                false,
                undefined,
                false,
                `#pk-vm, #awesome-pk-vm {display: none !important;}`,
            ),
        )
        // 隐藏 滚动礼物通告
        playerItems.push(
            new NormalItem(
                'live-page-head-web-player-announcement-wrapper',
                '隐藏 滚动礼物通告',
                false,
                undefined,
                false,
                `#live-player .announcement-wrapper {display: none !important;}`,
            ),
        )
        // 隐藏 幻星互动游戏, 默认开启
        playerItems.push(
            new NormalItem(
                'live-page-head-web-player-game-id',
                '隐藏 幻星互动游戏',
                true,
                undefined,
                false,
                `#game-id {display: none !important;}`,
            ),
        )
        // 隐藏 复读计数弹幕
        playerItems.push(
            new NormalItem(
                'live-page-combo-danmaku',
                '隐藏 复读计数弹幕',
                false,
                undefined,
                false,
                `.danmaku-item-container > div.combo {display: none !important;}`,
            ),
        )
        // 隐藏 礼物栏
        playerItems.push(
            new NormalItem(
                'live-page-gift-control-vm',
                '隐藏 礼物栏',
                false,
                undefined,
                false,
                `#gift-control-vm, #gift-control-vm-new {display: none !important;}
                /* 补齐圆角, 不可important */
                #player-ctnr {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    overflow: hidden;
                }`,
            ),
        )
    }
    liveGroupList.push(new Group('live-player', '播放器', playerItems))

    // 右栏part, rightContainerItems
    {
        // 隐藏 高能榜/大航海 (需刷新)
        rightContainerItems.push(
            new NormalItem(
                'live-page-rank-list-vm',
                '隐藏 高能榜/大航海 (需刷新)',
                false,
                undefined,
                false,
                `#rank-list-vm {display: none !important;}
                #aside-area-vm {overflow: hidden;}
                .chat-history-panel {height: calc(100% - 145px) !important; padding-top: 8px;}`,
            ),
        )
        // 隐藏 系统提示, 默认开启
        rightContainerItems.push(
            new NormalItem(
                'live-page-convention-msg',
                '隐藏 系统提示',
                true,
                undefined,
                false,
                `.convention-msg.border-box {display: none !important;}`,
            ),
        )
        // 隐藏 用户排名
        rightContainerItems.push(
            new NormalItem(
                'live-page-rank-icon',
                '隐藏 用户排名',
                false,
                undefined,
                false,
                `.chat-item .rank-icon {display: none !important;}`,
            ),
        )
        // 隐藏 头衔装扮
        rightContainerItems.push(
            new NormalItem(
                'live-page-title-label',
                '隐藏 头衔装扮',
                false,
                undefined,
                false,
                `.chat-item .title-label {display: none !important;}`,
            ),
        )
        // 隐藏 用户等级, 默认开启
        rightContainerItems.push(
            new NormalItem(
                'live-page-wealth-medal-ctnr',
                '隐藏 用户等级',
                true,
                undefined,
                false,
                `.chat-item .wealth-medal-ctnr {display: none !important;}`,
            ),
        )
        // 隐藏 团体勋章
        rightContainerItems.push(
            new NormalItem(
                'live-page-group-medal-ctnr',
                '隐藏 团体勋章',
                false,
                undefined,
                false,
                `.chat-item .group-medal-ctnr {display: none !important;}`,
            ),
        )
        // 隐藏 粉丝牌
        rightContainerItems.push(
            new NormalItem(
                'live-page-fans-medal-item-ctnr',
                '隐藏 粉丝牌',
                false,
                undefined,
                false,
                `.chat-item .fans-medal-item-ctnr {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕的高亮底色
        rightContainerItems.push(
            new NormalItem(
                'live-page-chat-item-background-color',
                '隐藏 弹幕的高亮底色',
                false,
                undefined,
                false,
                `.chat-item {background-color: unset !important; border-image-source: unset !important;}`,
            ),
        )
        // 隐藏 礼物弹幕
        rightContainerItems.push(
            new NormalItem(
                'live-page-gift-item',
                '隐藏 礼物弹幕',
                false,
                undefined,
                false,
                `.chat-item.gift-item, .chat-item.common-danmuku-msg {display: none !important;}`,
            ),
        )
        // 隐藏 高能用户提示
        rightContainerItems.push(
            new NormalItem(
                'live-page-chat-item-top3-notice',
                '隐藏 高能用户提示',
                false,
                undefined,
                false,
                `.chat-item.top3-notice {display: none !important;}`,
            ),
        )
        // 隐藏 底部滚动提示, 默认开启
        rightContainerItems.push(
            new NormalItem(
                'live-page-brush-prompt',
                '隐藏 底部滚动提示',
                true,
                undefined,
                false,
                `#brush-prompt {display: none !important;}
                /* 弹幕栏高度 */
                .chat-history-panel .chat-history-list.with-brush-prompt {height: 100% !important;}`,
            ),
        )
        // 隐藏 互动框(他们都在说)
        rightContainerItems.push(
            new NormalItem(
                'live-page-combo-card',
                '隐藏 互动框(他们都在说)',
                false,
                undefined,
                false,
                `#combo-card:has(.combo-tips) {display: none !important;}`,
            ),
        )
        // 隐藏 互动框(找TA玩)
        rightContainerItems.push(
            new NormalItem(
                'live-page-service-card-container',
                '隐藏 互动框(找TA玩)',
                false,
                undefined,
                false,
                `.play-together-service-card-container {display: none !important;}`,
            ),
        )
        // 弹幕栏 使弹幕列表紧凑, 默认开启
        rightContainerItems.push(
            new NormalItem(
                'live-page-compact-danmaku',
                '弹幕栏 使弹幕列表紧凑',
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
        // 隐藏 弹幕控制按钮 左侧
        rightContainerItems.push(
            new NormalItem(
                'live-page-control-panel-icon-row-left',
                '隐藏 弹幕控制按钮 左侧',
                false,
                undefined,
                false,
                `#chat-control-panel-vm .control-panel-icon-row .icon-left-part {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕控制按钮 右侧
        rightContainerItems.push(
            new NormalItem(
                'live-page-control-panel-icon-row-right',
                '隐藏 弹幕控制按钮 右侧',
                false,
                undefined,
                false,
                `#chat-control-panel-vm .control-panel-icon-row .icon-right-part {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕发送框
        rightContainerItems.push(
            new NormalItem(
                'live-page-chat-input-ctnr',
                '隐藏 弹幕发送框',
                false,
                undefined,
                false,
                `#chat-control-panel-vm .chat-input-ctnr, #chat-control-panel-vm .bottom-actions {display: none !important;}
                .chat-control-panel {height: unset !important;}
                .chat-history-panel {height: calc(100% - 45px) !important; padding-top: 8px;}
                .chat-history-panel .danmaku-at-prompt {bottom: 50px !important;}`,
            ),
        )
        // 隐藏 关闭全部互动框和控制栏
        rightContainerItems.push(
            new NormalItem(
                'live-page-chat-control-panel',
                '隐藏 关闭全部互动框和控制栏',
                false,
                undefined,
                false,
                `#chat-control-panel-vm {display: none !important;}
                .chat-history-panel {
                    border-radius: 0 0 12px 12px;
                }
                /* 高权限调高度 */
                #aside-area-vm .chat-history-panel {
                    height: calc(100% - 15px) !important;
                }`,
            ),
        )
    }
    liveGroupList.push(new Group('live-right-container', '右栏 高能榜/弹幕列表', rightContainerItems))

    // 视频下方页面part, belowItems
    {
        // 隐藏 活动海报, 默认开启
        belowItems.push(
            new NormalItem(
                'live-page-flip-view',
                '隐藏 活动海报',
                true,
                undefined,
                false,
                `.flip-view {display: none !important;}`,
            ),
        )
        // 隐藏 直播间介绍
        belowItems.push(
            new NormalItem(
                'live-page-room-info-ctnr',
                '隐藏 直播间介绍',
                false,
                undefined,
                false,
                `#sections-vm .room-info-ctnr {display: none !important;}`,
            ),
        )
        // 隐藏 主播动态
        belowItems.push(
            new NormalItem(
                'live-page-room-feed',
                '隐藏 主播动态',
                false,
                undefined,
                false,
                `#sections-vm .room-feed {display: none !important;}`,
            ),
        )
        // 隐藏 主播公告
        belowItems.push(
            new NormalItem(
                'live-page-announcement-cntr',
                '隐藏 主播公告',
                false,
                undefined,
                false,
                `#sections-vm .announcement-cntr {display: none !important;}`,
            ),
        )
        // 隐藏 全部内容
        belowItems.push(
            new NormalItem(
                'live-page-sections-vm',
                '隐藏 直播下方全部内容',
                false,
                undefined,
                false,
                `#sections-vm {display: none !important;}`,
            ),
        )
    }
    liveGroupList.push(new Group('live-below', '下方页面 主播动态/直播公告', belowItems))

    // 顶栏左侧part, headerLeftItems
    {
        // 隐藏 直播LOGO
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-entry-logo',
                '隐藏 直播LOGO',
                false,
                undefined,
                false,
                `#main-ctnr a.entry_logo[href="//live.bilibili.com"] {display: none !important;}`,
            ),
        )
        // 隐藏 首页
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-entry-title',
                '隐藏 首页',
                false,
                undefined,
                false,
                `#main-ctnr a.entry-title[href="//www.bilibili.com"] {display: none !important;}`,
            ),
        )
        // 隐藏 直播
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-live',
                '隐藏 直播',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="live"] {display: none !important;}`,
            ),
        )
        // 隐藏 全部
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-all',
                '隐藏 全部',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="all"] {display: none !important;}`,
            ),
        )
        // 隐藏 网游
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-net-game',
                '隐藏 网游',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="网游"] {display: none !important;}`,
            ),
        )
        // 隐藏 手游
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-mobile-game',
                '隐藏 手游',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="手游"] {display: none !important;}`,
            ),
        )
        // 隐藏 单机游戏
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-game',
                '隐藏 单机游戏',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="单机游戏"] {display: none !important;}`,
            ),
        )
        // 隐藏 娱乐
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-entertainment',
                '隐藏 娱乐',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="娱乐"] {display: none !important;}`,
            ),
        )
        // 隐藏 电台
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-radio',
                '隐藏 电台',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="电台"] {display: none !important;}`,
            ),
        )
        // 隐藏 虚拟主播
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-vtuber',
                '隐藏 虚拟主播',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="虚拟主播"] {display: none !important;}`,
            ),
        )
        // 隐藏 聊天室
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-chatroom',
                '隐藏 聊天室',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="聊天室"] {display: none !important;}`,
            ),
        )
        // 隐藏 生活
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-living',
                '隐藏 生活',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="生活"] {display: none !important;}`,
            ),
        )
        // 隐藏 知识
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-knowledge',
                '隐藏 知识',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="知识"] {display: none !important;}`,
            ),
        )
        // 隐藏 赛事
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-match',
                '隐藏 赛事',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="赛事"] {display: none !important;}`,
            ),
        )
        // 隐藏 帮我玩
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-helpmeplay',
                '隐藏 帮我玩',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="帮我玩"] {display: none !important;}`,
            ),
        )
        // 隐藏 互动玩法
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-interact',
                '隐藏 互动玩法',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="互动玩法"] {display: none !important;}`,
            ),
        )
        // 隐藏 购物
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-standalone-shopping',
                '隐藏 购物',
                false,
                undefined,
                false,
                `#main-ctnr .dp-table-cell a[name="购物"] {display: none !important;}`,
            ),
        )
        // 隐藏 更多, 默认开启
        headerLeftItems.push(
            new NormalItem(
                'live-page-header-showmore-link',
                '隐藏 顶栏-更多',
                true,
                undefined,
                false,
                `#main-ctnr .showmore-link {display: none !important;}`,
            ),
        )
    }
    liveGroupList.push(new Group('live-header-left', '顶栏 左侧', headerLeftItems))

    // 顶栏中间part, headerCenterItems
    {
        // 隐藏 搜索框 推荐搜索
        headerCenterItems.push(
            new NormalItem(
                'live-page-header-search-block-placeholder',
                '隐藏 搜索框 推荐搜索',
                false,
                undefined,
                false,
                `#nav-searchform input::placeholder {visibility: hidden;}`,
            ),
        )
        // 隐藏 搜索框 搜索历史
        headerCenterItems.push(
            new NormalItem(
                'live-page-header-search-history',
                '隐藏 搜索框 搜索历史',
                false,
                undefined,
                false,
                `#nav-searchform .history {display: none !important;}`,
            ),
        )
        // 隐藏 搜索框 bilibili热搜
        headerCenterItems.push(
            new NormalItem(
                'live-page-header-search-trending',
                '隐藏 搜索框 bilibili热搜',
                false,
                undefined,
                false,
                `#nav-searchform .trending {display: none !important;}`,
            ),
        )
        // 隐藏 关闭搜索框
        headerCenterItems.push(
            new NormalItem(
                'live-page-header-search-block',
                '隐藏 关闭搜索框',
                false,
                undefined,
                false,
                `#nav-searchform {display: none !important;}`,
            ),
        )
    }
    liveGroupList.push(new Group('live-header-center', '顶栏 搜索框', headerCenterItems))

    // 顶栏右侧part, headerRightItems
    {
        // 隐藏 头像
        headerRightItems.push(
            new NormalItem(
                'live-page-header-avatar',
                '隐藏 头像',
                false,
                undefined,
                false,
                `#right-part .user-panel {display: none !important;}`,
            ),
        )
        // 隐藏 动态
        headerRightItems.push(
            new NormalItem(
                'live-page-header-dynamic',
                '隐藏 动态',
                false,
                undefined,
                false,
                `#right-part .shortcuts-ctnr .shortcut-item:has(.link-panel-ctnr) {display: none !important;}`,
            ),
        )
        // 隐藏 签到
        headerRightItems.push(
            new NormalItem(
                'live-page-header-checkin',
                '隐藏 签到',
                false,
                undefined,
                false,
                `#right-part .shortcuts-ctnr .shortcut-item:has(.calendar-checkin) {display: none !important;}`,
            ),
        )
        // 隐藏 幻星互动, 默认开启
        headerRightItems.push(
            new NormalItem(
                'live-page-header-interact',
                '隐藏 幻星互动',
                true,
                undefined,
                false,
                `#right-part .shortcuts-ctnr .shortcut-item:has(.fanbox-panel-ctnr) {display: none !important;}`,
            ),
        )
        // 隐藏 我要开播, 默认开启
        headerRightItems.push(
            new NormalItem(
                'live-page-header-go-live',
                '隐藏 我要开播',
                true,
                undefined,
                false,
                `#right-part .shortcuts-ctnr .shortcut-item:has(.download-panel-ctnr) {visibility: hidden;}`,
            ),
        )
    }
    liveGroupList.push(new Group('live-header-right', '顶栏 右侧', headerRightItems))
}

export { liveGroupList }

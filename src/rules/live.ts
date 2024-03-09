import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { debug } from '../utils/logger'
import { isPageLiveHome, isPageLiveRoom } from '../utils/page-type'

let isCleanLiveDanmakuRunning = false
// 清理计数结尾弹幕
let enableCleanCounter = false
// 清理文字重复多遍的弹幕
let enableCleanRedundant = false
const cleanLiveDanmaku = () => {
    if (!location.pathname.match(/^\/\d+/)) {
        return
    }
    if (isCleanLiveDanmakuRunning) {
        return
    } else {
        isCleanLiveDanmakuRunning = true
    }
    const clean = () => {
        if (!enableCleanCounter && !enableCleanRedundant) {
            return
        }
        const dmList = document.querySelectorAll('#live-player .danmaku-item-container .bili-dm')
        if (!dmList.length) {
            return
        }
        dmList.forEach((dm) => {
            const dmText = dm.textContent?.trim()
            if (dmText) {
                if (enableCleanCounter && dmText.match(/.+[xXΧ×χ✘✖] ?\d+$/)) {
                    debug('match danmaku', dmText)
                    dm.innerHTML = ''
                    return
                }
                // 出现5次及以上
                if (enableCleanRedundant) {
                    // 首尾匹配，直接清空内容
                    if (dmText.match(/(.+)\1{4,}/)) {
                        debug('match danmaku', dmText)
                        dm.innerHTML = ''
                        return
                    }
                }
            }
        })
    }
    setInterval(clean, 500)
}

// GroupList
const liveGroupList: Group[] = []

// 直播页面规则, 只适用于直播间内, 不适用于直播首页
if (isPageLiveRoom()) {
    // 基本功能
    const basicItems = [
        // 隐藏 页面右侧按钮 实验室/关注, 默认开启
        new CheckboxItem({
            itemID: 'live-page-sidebar-vm',
            description: '隐藏 页面右侧按钮 实验室/关注',
            defaultStatus: true,
            itemCSS: `#sidebar-vm {display: none !important;}`,
        }),
        // 播放器皮肤 恢复默认配色
        new CheckboxItem({
            itemID: 'live-page-default-skin',
            description: '播放器皮肤 恢复默认配色',
            itemCSS: `#head-info-vm {
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
        }),
    ]
    liveGroupList.push(new Group('live-basic', '直播页 基本功能', basicItems))

    // 直播信息栏
    const infoItems = [
        // 隐藏 粉丝团
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-upper-row-follow-ctnr',
            description: '隐藏 粉丝团',
            itemCSS: `#head-info-vm .upper-row .follow-ctnr {display: none !important;}`,
        }),
        // 隐藏 xx人看过
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-upper-row-visited',
            description: '隐藏 xx人看过',
            itemCSS: `#head-info-vm .upper-row .right-ctnr div:has(.watched-icon) {display: none !important;}`,
        }),
        // 隐藏 人气
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-upper-row-popular',
            description: '隐藏 人气',
            itemCSS: `#head-info-vm .upper-row .right-ctnr div:has(.icon-popular) {display: none !important;}`,
        }),
        // 隐藏 点赞
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-upper-row-like',
            description: '隐藏 点赞',
            itemCSS: `#head-info-vm .upper-row .right-ctnr div:has(.like-icon) {display: none !important;}`,
        }),
        // 隐藏 举报, 默认开启
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-upper-row-report',
            description: '隐藏 举报',
            defaultStatus: true,
            itemCSS: `
            #head-info-vm .upper-row .right-ctnr div:has(.icon-report, [src*="img/report"]) {display: none !important;}`,
        }),
        // 隐藏 分享, 默认开启
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-upper-row-share',
            description: '隐藏 分享',
            defaultStatus: true,
            itemCSS: `
            #head-info-vm .upper-row .right-ctnr div:has(.icon-share, [src*="img/share"]) {display: none !important;}`,
        }),
        // 隐藏 人气榜, 默认开启
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-lower-row-hot-rank',
            description: '隐藏 人气榜',
            defaultStatus: true,
            itemCSS: `#head-info-vm .lower-row .right-ctnr .popular-and-hot-rank {display: none !important;}`,
        }),
        // 隐藏 礼物
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-lower-row-gift-planet-entry',
            description: '隐藏 礼物',
            itemCSS: `#head-info-vm .lower-row .right-ctnr .gift-planet-entry {display: none !important;}`,
        }),
        // 隐藏 活动, 默认开启
        new CheckboxItem({
            itemID: 'live-page-head-info-vm-lower-row-activity-gather-entry',
            description: '隐藏 活动',
            defaultStatus: true,
            itemCSS: `#head-info-vm .lower-row .right-ctnr .activity-gather-entry {display: none !important;}`,
        }),
        // 隐藏 全部直播信息栏
        new CheckboxItem({
            itemID: 'live-page-head-info-vm',
            description: '隐藏 关闭整个信息栏',
            itemCSS: `#head-info-vm {display: none !important;}
                /* 补齐圆角, 不可important */
                #player-ctnr {
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                    overflow: hidden;
                }`,
        }),
    ]
    liveGroupList.push(new Group('live-info', '直播信息栏', infoItems))

    // 播放器
    const playerItems = [
        // 隐藏 右上角反馈, 默认开启
        new CheckboxItem({
            itemID: 'live-page-head-web-player-icon-feedback',
            description: '隐藏 右上角反馈',
            defaultStatus: true,
            itemCSS: `#live-player .web-player-icon-feedback {display: none !important;}`,
        }),
        // 隐藏 购物小橙车提示, 默认开启
        new CheckboxItem({
            itemID: 'live-page-head-web-player-shop-popover-vm',
            description: '隐藏 购物小橙车提示',
            defaultStatus: true,
            itemCSS: `#shop-popover-vm {display: none !important;}`,
        }),
        // 隐藏 直播PK特效
        new CheckboxItem({
            itemID: 'live-page-head-web-player-awesome-pk-vm',
            description: '隐藏 直播PK特效',
            itemCSS: `#pk-vm, #awesome-pk-vm {display: none !important;}`,
        }),
        // 隐藏 滚动礼物通告
        new CheckboxItem({
            itemID: 'live-page-head-web-player-announcement-wrapper',
            description: '隐藏 滚动礼物通告',
            itemCSS: `#live-player .announcement-wrapper {display: none !important;}`,
        }),
        // 隐藏 幻星互动游戏, 默认开启
        new CheckboxItem({
            itemID: 'live-page-head-web-player-game-id',
            description: '隐藏 幻星互动游戏',
            defaultStatus: true,
            itemCSS: `#game-id {display: none !important;}`,
        }),
        // 隐藏 直播卡顿打分, 默认开启
        new CheckboxItem({
            itemID: 'live-page-head-web-player-research-container',
            description: '隐藏 直播卡顿打分',
            defaultStatus: true,
            itemCSS: `.research-container {display: none !important;}`,
        }),
        // 隐藏 播放器顶部复读计数弹幕
        new CheckboxItem({
            itemID: 'live-page-combo-danmaku',
            description: '隐藏 播放器顶部变动计数弹幕',
            itemCSS: `.danmaku-item-container > div.combo {display: none !important;}`,
        }),
        // 隐藏 计数结尾的弹幕
        new CheckboxItem({
            itemID: 'live-page-clean-counter-danmaku',
            description: '隐藏 计数结尾弹幕，如 ???? x24',
            itemFunc: () => {
                enableCleanCounter = true
                cleanLiveDanmaku()
            },
        }),
        // 隐藏 文字重复多遍的弹幕
        new CheckboxItem({
            itemID: 'live-page-clean-redundant-text-danmaku',
            description: '隐藏 文字重复多遍的弹幕 (n≥5)\n如 prprprprpr, 88888888',
            itemFunc: () => {
                enableCleanRedundant = true
                cleanLiveDanmaku()
            },
        }),
        // // 隐藏 弹幕中重复多遍的emoji
        // new CheckboxItem({
        //     itemID: 'live-page-clean-redundant-emoji-danmaku',
        //     description: '隐藏 弹幕中重复多遍的emoji (n≥3)',
        //     itemCSS: `.danmaku-item-container .bili-dm:has(.bili-dm-emoji:nth-child(3)) .bili-dm-emoji {display: none !important;}`,
        // }),
        // 隐藏 弹幕中的小表情
        new CheckboxItem({
            itemID: 'live-page-clean-all-danmaku-small-emoji',
            description: '隐藏 弹幕中的小表情',
            itemCSS: `.danmaku-item-container .bili-dm .bili-dm-emoji {display: none !important;}`,
        }),
        // 隐藏 弹幕中的大表情
        new CheckboxItem({
            itemID: 'live-page-clean-all-danmaku-big-emoji',
            description: '隐藏 弹幕中的大表情',
            itemCSS: `.danmaku-item-container .bili-dm img[style*="width:45px"] {display: none !important;}`,
        }),
        // 隐藏 礼物栏
        new CheckboxItem({
            itemID: 'live-page-gift-control-vm',
            description: '隐藏 礼物栏',
            itemCSS: `#gift-control-vm, #gift-control-vm-new {display: none !important;}
                /* 补齐圆角, 不可important */
                #player-ctnr {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    overflow: hidden;
                }`,
        }),
        // 全屏下 隐藏弹幕发送框
        new CheckboxItem({
            itemID: 'live-page-fullscreen-danmaku-vm',
            description: '全屏下 隐藏弹幕发送框',
            itemCSS: `#fullscreen-danmaku-vm {display: none !important;}`,
        }),
    ]
    liveGroupList.push(new Group('live-player', '播放器', playerItems))

    // 右栏
    const rightContainerItems = [
        // 隐藏 高能榜/大航海 (需刷新)
        new CheckboxItem({
            itemID: 'live-page-rank-list-vm',
            description: '隐藏 高能榜/大航海 (需刷新)',
            itemCSS: `#rank-list-vm {display: none !important;}
                #aside-area-vm {overflow: hidden;}
                .chat-history-panel {height: calc(100% - 145px) !important; padding-top: 8px;}`,
        }),
        // 隐藏 系统提示, 默认开启
        new CheckboxItem({
            itemID: 'live-page-convention-msg',
            description: '隐藏 系统提示',
            defaultStatus: true,
            itemCSS: `.convention-msg.border-box {display: none !important;}`,
        }),
        // 隐藏 用户排名
        new CheckboxItem({
            itemID: 'live-page-rank-icon',
            description: '隐藏 用户排名',
            itemCSS: `.chat-item .rank-icon {display: none !important;}`,
        }),
        // 隐藏 头衔装扮
        new CheckboxItem({
            itemID: 'live-page-title-label',
            description: '隐藏 头衔装扮',
            itemCSS: `.chat-item .title-label {display: none !important;}`,
        }),
        // 隐藏 用户等级, 默认开启
        new CheckboxItem({
            itemID: 'live-page-wealth-medal-ctnr',
            description: '隐藏 用户等级',
            defaultStatus: true,
            itemCSS: `.chat-item .wealth-medal-ctnr {display: none !important;}`,
        }),
        // 隐藏 团体勋章
        new CheckboxItem({
            itemID: 'live-page-group-medal-ctnr',
            description: '隐藏 团体勋章',
            itemCSS: `.chat-item .group-medal-ctnr {display: none !important;}`,
        }),
        // 隐藏 粉丝牌
        new CheckboxItem({
            itemID: 'live-page-fans-medal-item-ctnr',
            description: '隐藏 粉丝牌',
            itemCSS: `.chat-item .fans-medal-item-ctnr {display: none !important;}`,
        }),
        // 隐藏 弹幕的高亮底色
        new CheckboxItem({
            itemID: 'live-page-chat-item-background-color',
            description: '隐藏 弹幕的高亮底色',
            itemCSS: `.chat-item {background-color: unset !important; border-image-source: unset !important;}`,
        }),
        // 隐藏 礼物弹幕
        new CheckboxItem({
            itemID: 'live-page-gift-item',
            description: '隐藏 礼物弹幕',
            itemCSS: `.chat-item.gift-item, .chat-item.common-danmuku-msg {display: none !important;}`,
        }),
        // 隐藏 高能用户提示
        new CheckboxItem({
            itemID: 'live-page-chat-item-top3-notice',
            description: '隐藏 高能用户提示',
            itemCSS: `.chat-item.top3-notice {display: none !important;}`,
        }),
        // 隐藏 底部滚动提示, 默认开启
        new CheckboxItem({
            itemID: 'live-page-brush-prompt',
            description: '隐藏 底部滚动提示',
            defaultStatus: true,
            itemCSS: `#brush-prompt {display: none !important;}
                /* 弹幕栏高度 */
                .chat-history-panel .chat-history-list.with-brush-prompt {height: 100% !important;}`,
        }),
        // 隐藏 互动框(他们都在说)
        new CheckboxItem({
            itemID: 'live-page-combo-card',
            description: '隐藏 互动框(他们都在说)',
            itemCSS: `#combo-card:has(.combo-tips) {display: none !important;}`,
        }),
        // 隐藏 互动框(找TA玩)
        new CheckboxItem({
            itemID: 'live-page-service-card-container',
            description: '隐藏 互动框(找TA玩)',
            itemCSS: `.play-together-service-card-container {display: none !important;}`,
        }),
        // 弹幕栏 使弹幕列表紧凑, 默认开启
        new CheckboxItem({
            itemID: 'live-page-compact-danmaku',
            description: '弹幕栏 使弹幕列表紧凑',
            defaultStatus: true,
            itemCSS: `.chat-history-panel .chat-history-list .chat-item.danmaku-item.chat-colorful-bubble {margin: 2px 0 !important;}
                .chat-history-panel .chat-history-list .chat-item {padding: 3px 5px !important; font-size: 1.2rem !important;}
                .chat-history-panel .chat-history-list .chat-item.danmaku-item .user-name {font-size: 1.2rem !important;}
                .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname {font-size: 1.2rem !important;}
                .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname .common-nickname-wrapper {font-size: 1.2rem !important;}`,
        }),
        // 隐藏 弹幕控制按钮 左侧
        new CheckboxItem({
            itemID: 'live-page-control-panel-icon-row-left',
            description: '隐藏 弹幕控制按钮 左侧',
            itemCSS: `#chat-control-panel-vm .control-panel-icon-row .icon-left-part {display: none !important;}`,
        }),
        // 隐藏 弹幕控制按钮 右侧
        new CheckboxItem({
            itemID: 'live-page-control-panel-icon-row-right',
            description: '隐藏 弹幕控制按钮 右侧',
            itemCSS: `#chat-control-panel-vm .control-panel-icon-row .icon-right-part {display: none !important;}`,
        }),
        // 隐藏 弹幕发送框
        new CheckboxItem({
            itemID: 'live-page-chat-input-ctnr',
            description: '隐藏 弹幕发送框',
            itemCSS: `#chat-control-panel-vm .chat-input-ctnr, #chat-control-panel-vm .bottom-actions {display: none !important;}
                .chat-control-panel {height: unset !important;}
                .chat-history-panel {height: calc(100% - 45px) !important; padding-top: 8px;}
                .chat-history-panel .danmaku-at-prompt {bottom: 50px !important;}`,
        }),
        // 隐藏 关闭全部互动框和控制栏
        new CheckboxItem({
            itemID: 'live-page-chat-control-panel',
            description: '隐藏 关闭全部互动框和控制栏',
            itemCSS: `#chat-control-panel-vm {display: none !important;}
                /* 高权限调高度 */
                #aside-area-vm .chat-history-panel {height: 100% !important;}`,
        }),
    ]
    liveGroupList.push(new Group('live-right-container', '右栏 高能榜/弹幕列表', rightContainerItems))

    // 视频下方页面
    const belowItems = [
        // 隐藏 活动海报, 默认开启
        new CheckboxItem({
            itemID: 'live-page-flip-view',
            description: '隐藏 活动海报',
            defaultStatus: true,
            itemCSS: `.flip-view {display: none !important;}`,
        }),
        // 隐藏 直播间介绍
        new CheckboxItem({
            itemID: 'live-page-room-info-ctnr',
            description: '隐藏 直播间介绍',
            itemCSS: `#sections-vm .room-info-ctnr {display: none !important;}`,
        }),
        // 隐藏 主播动态
        new CheckboxItem({
            itemID: 'live-page-room-feed',
            description: '隐藏 主播动态',
            itemCSS: `#sections-vm .room-feed {display: none !important;}`,
        }),
        // 隐藏 主播公告
        new CheckboxItem({
            itemID: 'live-page-announcement-cntr',
            description: '隐藏 主播公告',
            itemCSS: `#sections-vm .announcement-cntr {display: none !important;}`,
        }),
        // 隐藏 全部内容
        new CheckboxItem({
            itemID: 'live-page-sections-vm',
            description: '隐藏 直播下方全部内容',
            itemCSS: `#sections-vm {display: none !important;}`,
        }),
    ]
    liveGroupList.push(new Group('live-below', '下方页面 主播动态/直播公告', belowItems))
}

// 直播页顶栏规则
if (isPageLiveHome() || isPageLiveRoom()) {
    // 顶栏左侧
    const headerLeftItems = [
        // 隐藏 直播LOGO
        new CheckboxItem({
            itemID: 'live-page-header-entry-logo',
            description: '隐藏 直播LOGO',
            itemCSS: `#main-ctnr a.entry_logo[href="//live.bilibili.com"] {display: none !important;}`,
        }),
        // 隐藏 首页
        new CheckboxItem({
            itemID: 'live-page-header-entry-title',
            description: '隐藏 首页',
            itemCSS: `#main-ctnr a.entry-title[href="//www.bilibili.com"] {display: none !important;}`,
        }),
        // 隐藏 直播
        new CheckboxItem({
            itemID: 'live-page-header-live',
            description: '隐藏 直播',
            itemCSS: `#main-ctnr .dp-table-cell a[name="live"] {display: none !important;}`,
        }),
        // 隐藏 全部
        new CheckboxItem({
            itemID: 'live-page-header-all',
            description: '隐藏 全部',
            itemCSS: `#main-ctnr .dp-table-cell a[name="all"] {display: none !important;}`,
        }),
        // 隐藏 网游
        new CheckboxItem({
            itemID: 'live-page-header-net-game',
            description: '隐藏 网游',
            itemCSS: `#main-ctnr .dp-table-cell a[name="网游"] {display: none !important;}`,
        }),
        // 隐藏 手游
        new CheckboxItem({
            itemID: 'live-page-header-mobile-game',
            description: '隐藏 手游',
            itemCSS: `#main-ctnr .dp-table-cell a[name="手游"] {display: none !important;}`,
        }),
        // 隐藏 单机游戏
        new CheckboxItem({
            itemID: 'live-page-header-standalone-game',
            description: '隐藏 单机游戏',
            itemCSS: `#main-ctnr .dp-table-cell a[name="单机游戏"] {display: none !important;}`,
        }),
        // 隐藏 娱乐
        new CheckboxItem({
            itemID: 'live-page-header-standalone-entertainment',
            description: '隐藏 娱乐',
            itemCSS: `#main-ctnr .dp-table-cell a[name="娱乐"] {display: none !important;}`,
        }),
        // 隐藏 电台
        new CheckboxItem({
            itemID: 'live-page-header-standalone-radio',
            description: '隐藏 电台',
            itemCSS: `#main-ctnr .dp-table-cell a[name="电台"] {display: none !important;}`,
        }),
        // 隐藏 虚拟主播
        new CheckboxItem({
            itemID: 'live-page-header-standalone-vtuber',
            description: '隐藏 虚拟主播',
            itemCSS: `#main-ctnr .dp-table-cell a[name="虚拟主播"] {display: none !important;}`,
        }),
        // 隐藏 聊天室
        new CheckboxItem({
            itemID: 'live-page-header-standalone-chatroom',
            description: '隐藏 聊天室',
            itemCSS: `#main-ctnr .dp-table-cell a[name="聊天室"] {display: none !important;}`,
        }),
        // 隐藏 生活
        new CheckboxItem({
            itemID: 'live-page-header-standalone-living',
            description: '隐藏 生活',
            itemCSS: `#main-ctnr .dp-table-cell a[name="生活"] {display: none !important;}`,
        }),
        // 隐藏 知识
        new CheckboxItem({
            itemID: 'live-page-header-standalone-knowledge',
            description: '隐藏 知识',
            itemCSS: `#main-ctnr .dp-table-cell a[name="知识"] {display: none !important;}`,
        }),
        // 隐藏 赛事
        new CheckboxItem({
            itemID: 'live-page-header-standalone-match',
            description: '隐藏 赛事',
            itemCSS: `#main-ctnr .dp-table-cell a[name="赛事"] {display: none !important;}`,
        }),
        // 隐藏 帮我玩
        new CheckboxItem({
            itemID: 'live-page-header-standalone-helpmeplay',
            description: '隐藏 帮我玩',
            itemCSS: `#main-ctnr .dp-table-cell a[name="帮我玩"] {display: none !important;}`,
        }),
        // 隐藏 互动玩法
        new CheckboxItem({
            itemID: 'live-page-header-standalone-interact',
            description: '隐藏 互动玩法',
            itemCSS: `#main-ctnr .dp-table-cell a[name="互动玩法"] {display: none !important;}`,
        }),
        // 隐藏 购物
        new CheckboxItem({
            itemID: 'live-page-header-standalone-shopping',
            description: '隐藏 购物',
            itemCSS: `#main-ctnr .dp-table-cell a[name="购物"] {display: none !important;}`,
        }),
        // 隐藏 更多, 默认开启
        new CheckboxItem({
            itemID: 'live-page-header-showmore-link',
            description: '隐藏 顶栏-更多',
            defaultStatus: true,
            itemCSS: `#main-ctnr .showmore-link {display: none !important;}`,
        }),
    ]
    liveGroupList.push(new Group('live-header-left', '顶栏 左侧', headerLeftItems))

    // 顶栏中间, headerCenterItems
    const headerCenterItems = [
        // 隐藏 搜索框 推荐搜索
        new CheckboxItem({
            itemID: 'common-hide-nav-search-rcmd',
            description: '隐藏 搜索框 推荐搜索',
            itemCSS: `#nav-searchform input::placeholder {visibility: hidden;}`,
        }),
        // 隐藏 搜索框 搜索历史
        new CheckboxItem({
            itemID: 'common-hide-nav-search-history',
            description: '隐藏 搜索框 搜索历史',
            itemCSS: `#nav-searchform .history {display: none !important;}`,
        }),
        // 隐藏 搜索框 bilibili热搜
        new CheckboxItem({
            itemID: 'common-hide-nav-search-trending',
            description: '隐藏 搜索框 bilibili热搜',
            itemCSS: `#nav-searchform .trending {display: none !important;}`,
        }),
        // 隐藏 关闭搜索框
        new CheckboxItem({
            itemID: 'live-page-header-search-block',
            description: '隐藏 关闭搜索框',
            itemCSS: `#nav-searchform {display: none !important;}`,
        }),
    ]
    liveGroupList.push(new Group('live-header-center', '顶栏 搜索框', headerCenterItems))

    // 顶栏右侧
    const headerRightItems = [
        // 隐藏 头像
        new CheckboxItem({
            itemID: 'live-page-header-avatar',
            description: '隐藏 头像',
            itemCSS: `#right-part .user-panel {display: none !important;}`,
        }),
        // 隐藏 动态
        new CheckboxItem({
            itemID: 'live-page-header-dynamic',
            description: '隐藏 动态',
            itemCSS: `#right-part .shortcuts-ctnr .shortcut-item:has(.link-panel-ctnr) {display: none !important;}`,
        }),
        // 隐藏 签到
        new CheckboxItem({
            itemID: 'live-page-header-checkin',
            description: '隐藏 签到',
            itemCSS: `#right-part .shortcuts-ctnr .shortcut-item:has(.calendar-checkin) {display: none !important;}`,
        }),
        // 隐藏 幻星互动, 默认开启
        new CheckboxItem({
            itemID: 'live-page-header-interact',
            description: '隐藏 幻星互动',
            defaultStatus: true,
            itemCSS: `#right-part .shortcuts-ctnr .shortcut-item:has(.fanbox-panel-ctnr) {display: none !important;}`,
        }),
        // 隐藏 我要开播, 默认开启
        new CheckboxItem({
            itemID: 'live-page-header-go-live',
            description: '隐藏 我要开播',
            defaultStatus: true,
            itemCSS: `#right-part .shortcuts-ctnr .shortcut-item:has(.download-panel-ctnr) {visibility: hidden;}`,
        }),
    ]
    liveGroupList.push(new Group('live-header-right', '顶栏 右侧', headerRightItems))
}

export { liveGroupList }

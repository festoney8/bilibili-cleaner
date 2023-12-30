import { Group, TitleGroup } from '../core/group'
import { NormalItem } from '../core/item'
import { debug } from '../utils/logger'

const basicItems: NormalItem[] = []
const playerItems: NormalItem[] = []
const playerControlItems: NormalItem[] = []
const danmakuItems: NormalItem[] = []
const toolbarItems: NormalItem[] = []
const rightItems: NormalItem[] = []
const commentItems: NormalItem[] = []
const sidebarItems: NormalItem[] = []
// GroupList
const bangumiGroupList: (Group | TitleGroup)[] = []

/** 覆盖版权视频页分享按钮功能 (疑似firefox在bangumi page覆盖失败) */
let isBangumiSimpleShareBtn = false
const bangumiSimpleShare = () => {
    if (isBangumiSimpleShareBtn) {
        return
    }
    // 监听shareBtn出现
    let shareBtn
    let counter = 0
    const checkElement = setInterval(() => {
        counter++
        shareBtn = document.getElementById('share-container-id')
        if (shareBtn) {
            isBangumiSimpleShareBtn = true
            clearInterval(checkElement)
            // 新增click事件覆盖剪贴板
            shareBtn.addEventListener('click', () => {
                const mainTitle = document.querySelector("[class^='mediainfo_mediaTitle']")?.textContent
                const subTitle = document.getElementById('player-title')?.textContent
                const shareText = `《${mainTitle}》${subTitle} \nhttps://www.bilibili.com${location.pathname}`
                navigator.clipboard.writeText(shareText)
            })
            debug('bangumiSimpleShare complete')
        } else if (counter > 50) {
            clearInterval(checkElement)
            debug('bangumiSimpleShare timeout')
        }
    }, 200)
}

/**
 * 版权视频播放页规则
 * 尽可能与普通播放页video.ts共用itemID, 实现开关状态同步
 * 与普通播放页不同的项目使用独立ID, 并在功能介绍最后用"★"重点标注
 */
if (location.href.startsWith('https://www.bilibili.com/bangumi/play/')) {
    // 标题
    bangumiGroupList.push(new TitleGroup('当前是：版权视频播放页 ★是独有项'))

    // 基本功能part, basicItems
    {
        // 净化分享功能, 默认开启
        basicItems.push(
            new NormalItem(
                'video-page-simple-share',
                '净化分享功能 (需刷新)',
                true,
                bangumiSimpleShare,
                false,
                `#share-container-id [class^='Share_boxBottom'] {display: none !important;}
                #share-container-id [class^='Share_boxTop'] {padding: 15px !important;}
                #share-container-id [class^='Share_boxTopRight'] {display: none !important;}
                #share-container-id [class^='Share_boxTopLeft'] {padding: 0 !important;}`,
            ),
        )
        // 顶栏 滚动页面后不再吸附顶部
        basicItems.push(
            new NormalItem(
                'video-page-hide-fixed-header',
                '顶栏 滚动页面后不再吸附顶部',
                false,
                undefined,
                false,
                `.fixed-header .bili-header__bar {position: relative !important;}`,
            ),
        )
    }
    bangumiGroupList.push(new Group('bangumi-basic', '基本功能', basicItems))

    // 播放器part, playerItems
    {
        // 隐藏 播放器-播放器内标题
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-top-left-title',
                '隐藏 播放器-播放器内标题',
                false,
                undefined,
                false,
                `.bpx-player-top-title {display: none !important;}
            /* 播放器上方阴影渐变 */
            .bpx-player-top-mask {display: none !important;}`,
            ),
        )
        // bangumi独有项：隐藏 播放器-追番/追剧按钮, 默认开启
        playerItems.push(
            new NormalItem(
                'bangumi-page-hide-bpx-player-top-follow',
                '隐藏 播放器-追番/追剧按钮 ★',
                true,
                undefined,
                false,
                `.bpx-player-top-follow {display: none !important;}`,
            ),
        )
        // 隐藏 播放器-反馈按钮, 默认开启
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-top-issue',
                '隐藏 播放器-反馈按钮',
                true,
                undefined,
                false,
                `.bpx-player-top-issue {display: none !important;}`,
            ),
        )
        // 隐藏 播放器-视频暂停时大Logo
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-state-wrap',
                '隐藏 播放器-视频暂停时大Logo',
                false,
                undefined,
                false,
                `.bpx-player-state-wrap {display: none !important;}`,
            ),
        )
        // bangumi独有项：隐藏 播放器-视频内封审核号(非内嵌), 默认开启
        playerItems.push(
            new NormalItem(
                'bangumi-page-hide-bpx-player-record-item-wrap',
                '隐藏 播放器-视频内封审核号(非内嵌) ★',
                true,
                undefined,
                false,
                `.bpx-player-record-item-wrap {display: none !important;}`,
            ),
        )
        // 隐藏 播放器-弹幕悬停点赞/复制/举报
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dialog-wrap',
                '隐藏 播放器-弹幕悬停点赞/复制/举报',
                false,
                undefined,
                false,
                `.bpx-player-dialog-wrap {display: none !important;}`,
            ),
        )
        // 隐藏 播放器-高赞弹幕前点赞按钮
        playerItems.push(
            new NormalItem(
                'video-page-bpx-player-bili-high-icon',
                '隐藏 播放器-高赞弹幕前点赞按钮',
                false,
                undefined,
                false,
                `.bili-high-icon {display: none !important}`,
            ),
        )
        // 播放器-彩色渐变弹幕 变成白色
        playerItems.push(
            new NormalItem(
                'video-page-bpx-player-bili-dm-vip-white',
                '播放器-彩色渐变弹幕 变成白色',
                false,
                undefined,
                false,
                `#bilibili-player .bili-dm>.bili-dm-vip {
                    background: unset !important;
                    background-size: unset !important;
                    /* 父元素未指定 var(--textShadow), 默认重墨描边凑合用 */
                    text-shadow: 1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000 !important;
                    text-stroke: none !important;
                    -webkit-text-stroke: none !important;
                    -moz-text-stroke: none !important;
                    -ms-text-stroke: none !important;
                }`,
            ),
        )
    }
    bangumiGroupList.push(new Group('bangumi-player', '播放器', playerItems))

    // 播放控制part, playerControlItems
    {
        // 隐藏 播放控制-上一个视频
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-prev',
                '隐藏 播放控制-上一个视频',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-prev {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-播放/暂停
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-play',
                '隐藏 播放控制-播放/暂停',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-play {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-下一个视频
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-next',
                '隐藏 播放控制-下一个视频',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-next {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-选集
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-eplist',
                '隐藏 播放控制-选集',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-eplist {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-倍速
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-playbackrate',
                '隐藏 播放控制-倍速',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-playbackrate {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-字幕
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-subtitle',
                '隐藏 播放控制-字幕',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-subtitle {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-音量
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-volume',
                '隐藏 播放控制-音量',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-volume {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-视频设置
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-setting',
                '隐藏 播放控制-视频设置',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-setting {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-画中画(Chrome)
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-pip',
                '隐藏 播放控制-画中画(Chrome)',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-pip {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-宽屏
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-wide',
                '隐藏 播放控制-宽屏',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-wide {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-网页全屏
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-web',
                '隐藏 播放控制-网页全屏',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-web {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-全屏
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-full',
                '隐藏 播放控制-全屏',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-full {display: none !important;}`,
            ),
        )
        // 隐藏 播放控制-底边mini视频进度, 默认开启
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-shadow-progress-area',
                '隐藏 播放控制-底边mini视频进度',
                true,
                undefined,
                false,
                `.bpx-player-shadow-progress-area {display: none !important;}`,
            ),
        )
    }
    bangumiGroupList.push(new Group('bangumi-player-control', '播放控制', playerControlItems))

    // 弹幕栏part, danmakuItems
    {
        // 隐藏 弹幕栏-同时在看人数
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-video-info-online',
                '隐藏 弹幕栏-同时在看人数',
                false,
                undefined,
                false,
                `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕栏-载入弹幕数量
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-video-info-dm',
                '隐藏 弹幕栏-载入弹幕数量',
                false,
                undefined,
                false,
                `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕栏-弹幕启用
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-switch',
                '隐藏 弹幕栏-弹幕启用',
                false,
                undefined,
                false,
                `.bpx-player-dm-switch {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕栏-弹幕显示设置
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-setting',
                '隐藏 弹幕栏-弹幕显示设置',
                false,
                undefined,
                false,
                `.bpx-player-dm-setting {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕栏-弹幕样式
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-video-btn-dm',
                '隐藏 弹幕栏-弹幕样式',
                false,
                undefined,
                false,
                `.bpx-player-video-btn-dm {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕栏-占位文字, 默认开启
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-input',
                '隐藏 弹幕栏-占位文字',
                true,
                undefined,
                false,
                `.bpx-player-dm-input::placeholder {color: transparent !important;}`,
            ),
        )
        // 隐藏 弹幕栏-弹幕礼仪, 默认开启
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-hint',
                '隐藏 弹幕栏-弹幕礼仪',
                true,
                undefined,
                false,
                `.bpx-player-dm-hint {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕栏-发送按钮
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-btn-send',
                '隐藏 弹幕栏-发送按钮',
                false,
                undefined,
                false,
                `.bpx-player-dm-btn-send {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕栏-关闭整个弹幕栏
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-sending-area',
                '隐藏 弹幕栏-关闭整个弹幕栏',
                false,
                undefined,
                false,
                `.bpx-player-sending-area {display: none !important;}
                /* 关闭弹幕栏后 播放器去黑边 */
                #bilibili-player-wrap[class^='video_playerNormal'] {height: calc(var(--video-width)*.5625)}
                #bilibili-player-wrap[class^='video_playerWide'] {height: calc(var(--containerWidth)*.5625)}
                `,
            ),
        )
    }
    bangumiGroupList.push(new Group('bangumi-danmaku', '弹幕栏', danmakuItems))

    // 视频下信息part, toolbarItems
    {
        // 隐藏 视频下方-分享按钮弹出菜单, 默认开启
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-video-share-popover',
                '隐藏 视频下方-分享按钮弹出菜单',
                true,
                undefined,
                false,
                `#share-container-id [class^='Share_share'] {display: none !important;}`,
            ),
        )
        // bangumi独有项：隐藏 视频下方-用手机观看, 默认开启
        toolbarItems.push(
            new NormalItem(
                'bangumi-page-hide-watch-on-phone',
                '隐藏 视频下方-用手机观看 ★',
                true,
                undefined,
                false,
                `.toolbar span:has(>[class^='Phone_mobile']) {display: none !important;}`,
            ),
        )
        // bangumi独有项：隐藏 视频下方-一起看, 默认开启
        toolbarItems.push(
            new NormalItem(
                'bangumi-page-hide-watch-together',
                '隐藏 视频下方-一起看 ★',
                true,
                undefined,
                false,
                `.toolbar span:has(>#watch_together_tab) {display: none !important;}`,
            ),
        )
        // bangumi独有项：隐藏 视频下方-整个工具栏(赞币转)
        toolbarItems.push(
            new NormalItem(
                'bangumi-page-hide-toolbar',
                '隐藏 视频下方-整个工具栏(赞币转) ★',
                false,
                undefined,
                false,
                `.player-left-components .toolbar {display: none !important;}`,
            ),
        )
        // bangumi独有项：隐藏 视频下方-作品介绍
        toolbarItems.push(
            new NormalItem(
                'bangumi-page-hide-media-info',
                '隐藏 视频下方-作品介绍 ★',
                false,
                undefined,
                false,
                `[class^='mediainfo_mediaInfo'] {display: none !important;}`,
            ),
        )
        // bangumi独有项：精简 视频下方-作品介绍, 默认开启
        toolbarItems.push(
            new NormalItem(
                'bangumi-page-simple-media-info',
                '精简 视频下方-作品介绍 ★',
                true,
                undefined,
                false,
                `[class^='mediainfo_btnHome'], [class^='upinfo_upInfoCard'] {display: none !important;}
                [class^='mediainfo_score'] {font-size: 25px !important;}
                [class^='mediainfo_mediaDesc']:has( + [class^='mediainfo_media_desc_section']) {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin-bottom: 8px !important;
                }
                [class^='mediainfo_media_desc_section'] {height: 60px !important;}`,
            ),
        )
        // bangumi独有项：隐藏 视频下方-承包榜
        toolbarItems.push(
            new NormalItem(
                'bangumi-page-hide-sponsor-module',
                '隐藏 视频下方-承包榜 ★',
                false,
                undefined,
                false,
                `#sponsor_module {display: none !important;}`,
            ),
        )
    }
    bangumiGroupList.push(new Group('bangumi-toolbar', '视频下方', toolbarItems))

    // 右栏part, rightItems
    {
        // bangumi独有项：隐藏 右栏-大会员按钮, 默认开启
        rightItems.push(
            new NormalItem(
                'bangumi-page-hide-right-container-section-height',
                '隐藏 右栏-大会员按钮 ★',
                true,
                undefined,
                false,
                `[class^='vipPaybar_'] {display: none !important;}`,
            ),
        )
        // 隐藏 右栏-弹幕列表, 默认开启
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-danmaku',
                '隐藏 右栏-弹幕列表',
                true,
                undefined,
                false,
                `#danmukuBox {display: none !important;}`,
            ),
        )
        // bangumi独有项：隐藏 右栏-视频列表 会员/限免标记
        rightItems.push(
            new NormalItem(
                'bangumi-page-hide-eplist-badge',
                '隐藏 右栏-视频列表 会员/限免标记 ★',
                false,
                undefined,
                false,
                // 蓝色预告badge不可隐藏
                `[class^='eplist_ep_list_wrapper'] [class^='imageListItem_badge']:not([style*='#00C0FF']) {display: none !important;}
                [class^='eplist_ep_list_wrapper'] [class^='numberListItem_badge']:not([style*='#00C0FF']) {display: none !important;}`,
            ),
        )
        // bangumi独有项：隐藏 右栏-相关作品推荐 ★
        rightItems.push(
            new NormalItem(
                'bangumi-page-hide-recommend',
                '隐藏 右栏-相关作品推荐 ★',
                false,
                undefined,
                false,
                `.plp-r [class^='recommend_wrap'] {display: none !important;}`,
            ),
        )
    }
    bangumiGroupList.push(new Group('bangumi-right', '右栏', rightItems))

    // 评论区part, commentItems
    {
        // 隐藏 评论区-活动/notice, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-notice',
                '隐藏 评论区-活动/notice',
                true,
                undefined,
                false,
                `#comment-module .reply-header .reply-notice {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-整个评论框
        commentItems.push(
            new NormalItem(
                'video-page-hide-main-reply-box',
                '隐藏 评论区-整个评论框',
                false,
                undefined,
                false,
                `#comment-module .main-reply-box {height: 0 !important; visibility: hidden !important;}
                #comment-module .reply-list {margin-top: -20px !important;}`,
            ),
        )
        // 隐藏 评论区-页面底部 吸附评论框, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-fixed-reply-box',
                '隐藏 评论区-页面底部 吸附评论框',
                true,
                undefined,
                false,
                `#comment-module .fixed-reply-box {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-评论编辑器内占位文字, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-box-textarea-placeholder',
                '隐藏 评论区-评论编辑器内占位文字',
                true,
                undefined,
                false,
                `#comment-module .main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
                #comment-module .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`,
            ),
        )
        // 隐藏 评论区-评论内容右侧装饰
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-decorate',
                '隐藏 评论区-评论内容右侧装饰',
                false,
                undefined,
                false,
                `#comment-module .reply-decorate {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-ID后粉丝牌
        commentItems.push(
            new NormalItem(
                'video-page-hide-fan-badge',
                '隐藏 评论区-ID后粉丝牌',
                false,
                undefined,
                false,
                `#comment-module .fan-badge {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-一级评论用户等级
        commentItems.push(
            new NormalItem(
                'video-page-hide-user-level',
                '隐藏 评论区-一级评论用户等级',
                false,
                undefined,
                false,
                `#comment-module .user-level {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-二级评论用户等级
        commentItems.push(
            new NormalItem(
                'video-page-hide-sub-user-level',
                '隐藏 评论区-二级评论用户等级',
                false,
                undefined,
                false,
                `#comment-module .sub-user-level {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-用户头像外圈饰品
        commentItems.push(
            new NormalItem(
                'video-page-hide-bili-avatar-pendent-dom',
                '隐藏 评论区-用户头像外圈饰品',
                false,
                undefined,
                false,
                `#comment-module .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            #comment-module .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`,
            ),
        )
        // 隐藏 评论区-用户头像右下小icon
        commentItems.push(
            new NormalItem(
                'video-page-hide-bili-avatar-nft-icon',
                '隐藏 评论区-用户头像右下小icon',
                false,
                undefined,
                false,
                `#comment-module .bili-avatar-nft-icon {display: none !important;}
                #comment-module .bili-avatar-icon {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-评论内容下tag(热评)
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-tag-list',
                '隐藏 评论区-评论内容下tag(热评)',
                false,
                undefined,
                false,
                `#comment-module .reply-tag-list {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-笔记评论前的小Logo, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-note-prefix',
                '隐藏 评论区-笔记评论前的小Logo',
                true,
                undefined,
                false,
                `#comment-module .note-prefix {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-评论内容搜索关键词高亮, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-jump-link-search-word',
                '隐藏 评论区-评论内容搜索关键词高亮',
                true,
                undefined,
                false,
                `#comment-module .reply-content .jump-link.search-word {color: inherit !important;}
                #comment-module .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
                #comment-module .reply-content .icon.search-word {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-二级评论中的@高亮
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-content-user-highlight',
                '隐藏 评论区-二级评论中的@高亮',
                false,
                undefined,
                false,
                `#comment-module .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                #comment-module .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`,
            ),
        )
        // 隐藏 评论区-召唤AI机器人的评论, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-at-reply-at-bots',
                '隐藏 评论区-召唤AI机器人的评论',
                true,
                undefined,
                false,
                // 8455326 @机器工具人
                // 234978716 @有趣的程序员
                // 1141159409 @AI视频小助理
                // 437175450 @AI视频小助理总结一下 (误伤)
                // 1692825065 @AI笔记侠
                // 690155730 @AI视频助手
                // 689670224 @哔哩哔理点赞姬
                // 3494380876859618 @课代表猫
                // 1168527940 @AI课代表呀
                // 439438614 @木几萌Moe
                // 1358327273 @星崽丨StarZai
                // 3546376048741135 @AI沈阳美食家
                // 1835753760 @AI识片酱
                `.reply-item:has(.jump-link.user[data-user-id="8455326"]),
                .reply-item:has(.jump-link.user[data-user-id="234978716"]),
                .reply-item:has(.jump-link.user[data-user-id="1141159409"]),
                .reply-item:has(.jump-link.user[data-user-id="437175450"]),
                .reply-item:has(.jump-link.user[data-user-id="1692825065"]),
                .reply-item:has(.jump-link.user[data-user-id="690155730"]),
                .reply-item:has(.jump-link.user[data-user-id="689670224"]),
                .reply-item:has(.jump-link.user[data-user-id="3494380876859618"]),
                .reply-item:has(.jump-link.user[data-user-id="1168527940"]),
                .reply-item:has(.jump-link.user[data-user-id="439438614"]),
                .reply-item:has(.jump-link.user[data-user-id="1358327273"]),
                .reply-item:has(.jump-link.user[data-user-id="3546376048741135"]),
                .reply-item:has(.jump-link.user[data-user-id="1835753760"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 评论区-包含@的 无人点赞评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-zero-like-at-reply',
                '隐藏 评论区-包含@的 无人点赞评论',
                false,
                undefined,
                false,
                `#comment-module .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-包含@的 全部评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-at-reply-all',
                '隐藏 评论区-包含@的 全部评论',
                false,
                undefined,
                false,
                `#comment-module .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-LV1 无人点赞评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv1-reply',
                '隐藏 评论区-LV1 无人点赞评论',
                false,
                undefined,
                false,
                `#comment-module .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-LV2 无人点赞评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv2-reply',
                '隐藏 评论区-LV2 无人点赞评论',
                false,
                undefined,
                false,
                `#comment-module .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-LV3 无人点赞评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv3-reply',
                '隐藏 评论区-LV3 无人点赞评论',
                false,
                undefined,
                false,
                `#comment-module .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 一级评论 踩/回复/举报 hover时显示, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-root-reply-dislike-reply-btn',
                '隐藏 一级评论 踩/回复/举报 hover时显示',
                true,
                undefined,
                false,
                `#comment-module .reply-info:not(:has(i.disliked)) .reply-btn,
                #comment-module .reply-info:not(:has(i.disliked)) .reply-dislike {
                    visibility: hidden;
                }
                #comment-module .reply-item:hover .reply-info .reply-btn,
                #comment-module .reply-item:hover .reply-info .reply-dislike {
                    visibility: visible !important;
                }`,
            ),
        )
        // 隐藏 二级评论 踩/回复/举报 hover时显示, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-sub-reply-dislike-reply-btn',
                '隐藏 二级评论 踩/回复/举报 hover时显示',
                true,
                undefined,
                false,
                `#comment-module .sub-reply-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
                #comment-module .sub-reply-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                    visibility: hidden;
                }
                #comment-module .sub-reply-container .sub-reply-item:hover .sub-reply-btn,
                #comment-module .sub-reply-container .sub-reply-item:hover .sub-reply-dislike {
                    visibility: visible !important;
                }`,
            ),
        )
        // 隐藏 评论区-大表情
        commentItems.push(
            new NormalItem(
                'video-page-hide-emoji-large',
                '隐藏 评论区-大表情',
                false,
                undefined,
                false,
                `#comment-module .emoji-large {display: none !important;}`,
            ),
        )
        // 评论区-大表情变成小表情
        commentItems.push(
            new NormalItem(
                'video-page-hide-emoji-large-zoom',
                '评论区-大表情变成小表情',
                false,
                undefined,
                false,
                `#comment-module .emoji-large {zoom: .5;}`,
            ),
        )
        // 评论区-用户名 全部大会员色
        commentItems.push(
            new NormalItem(
                'video-page-reply-user-name-color-pink',
                '评论区-用户名 全部大会员色',
                false,
                undefined,
                false,
                `#comment-module .reply-item .user-name, #comment-module .reply-item .sub-user-name {color: #FB7299 !important;}}`,
            ),
        )
        // 评论区-用户名 全部恢复默认色
        commentItems.push(
            new NormalItem(
                'video-page-reply-user-name-color-default',
                '评论区-用户名 全部恢复默认色',
                false,
                undefined,
                false,
                `#comment-module .reply-item .user-name, #comment-module .reply-item .sub-user-name {color: #61666d !important;}}`,
            ),
        )
        // 评论区-笔记图片 查看大图优化, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-reply-view-image-optimize',
                '评论区-笔记图片 查看大图优化',
                true,
                undefined,
                false,
                // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
                `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
                .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
                .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`,
            ),
        )
    }
    bangumiGroupList.push(new Group('bangumi-comment', '评论区', commentItems))

    // 右下角part, sidebarItems
    {
        // bangumi独有项：隐藏 右下角-新版反馈, 默认开启
        sidebarItems.push(
            new NormalItem(
                'bangumi-page-hide-sidenav-issue',
                '隐藏 右下角-新版反馈 ★',
                true,
                undefined,
                false,
                `[class*='navTools_navMenu'] [title='新版反馈'] {display: none !important;}`,
            ),
        )
        // 隐藏 右下角-小窗播放器
        sidebarItems.push(
            new NormalItem(
                'video-page-hide-sidenav-mini',
                '隐藏 右下角-小窗播放器',
                false,
                undefined,
                false,
                `[class*='navTools_navMenu'] [title*='迷你播放器'] {display: none !important;}`,
            ),
        )
        // 隐藏 右下角-客服, 默认开启
        sidebarItems.push(
            new NormalItem(
                'video-page-hide-sidenav-customer-service',
                '隐藏 右下角-客服',
                true,
                undefined,
                false,
                `[class*='navTools_navMenu'] [title='帮助反馈'] {display: none !important;}`,
            ),
        )
        // 隐藏 右下角-回顶部
        sidebarItems.push(
            new NormalItem(
                'video-page-hide-sidenav-back-to-top',
                '隐藏 右下角-回顶部',
                false,
                undefined,
                false,
                `[class*='navTools_navMenu'] [title='返回顶部'] {display: none !important;}`,
            ),
        )
    }
    bangumiGroupList.push(new Group('bangumi-sidebar', '页面右下角', sidebarItems))
}

export { bangumiGroupList }

import { Group } from '../core/group'
import { NormalItem } from '../core/item'
import { debug } from '../utils/logger'

/** BV号转AV号 */
function bv2av() {
    /**
     * bv2av algo by mcfx
     * @see https://www.zhihu.com/question/381784377/answer/1099438784
     * @param x 输入BV号
     * @returns 输出纯数字av号
     */
    function dec(x: string): number {
        const table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
        const tr: { [key: string]: number } = {}
        for (let i = 0; i < 58; i++) {
            tr[table[i]] = i
        }
        const s = [11, 10, 3, 8, 4, 6]
        const xor = 177451812
        const add = 8728348608
        let r = 0
        for (let i = 0; i < 6; i++) {
            r += tr[x[s[i]]] * 58 ** i
        }
        return (r - add) ^ xor
    }

    if (location.href.includes('bilibili.com/video/BV')) {
        const regex = /bilibili.com\/video\/(BV[0-9a-zA-Z]+)/
        const match = regex.exec(location.href)
        if (match) {
            // 保留query string中分P参数, anchor中reply定位
            let partNum = ''
            const params = new URLSearchParams(location.search)
            if (params.has('p')) {
                partNum += `?p=${params.get('p')}`
            }
            const aid = dec(match[1])
            const newURL = `https://www.bilibili.com/video/av${aid}${partNum}${location.hash}`
            history.replaceState(null, '', newURL)
            debug('bv2av complete')
        }
    }
}

/** 净化分享按钮功能 */
let isSimpleShareBtn = false
function simpleShare() {
    if (isSimpleShareBtn) {
        return
    }
    // 监听shareBtn出现
    let shareBtn
    let counter = 0
    const checkElement = setInterval(() => {
        counter++
        shareBtn = document.getElementById('share-btn-outer')
        if (shareBtn) {
            isSimpleShareBtn = true
            clearInterval(checkElement)
            // 新增click事件
            // 若replace element, 会在切换视频后无法更新视频分享数量, 故直接新增click事件覆盖剪贴板
            shareBtn.addEventListener('click', () => {
                let title = document.querySelector('#viewbox_report > h1')?.textContent as string
                if (!'（({【[［《「＜｛〔〖<〈『'.includes(title[0])) {
                    title = `【${title}】`
                }
                let urlPath = location.pathname
                if (urlPath.endsWith('/')) {
                    urlPath = urlPath.slice(0, -1)
                }
                const urlObj = new URL(location.href)
                const params = new URLSearchParams(urlObj.search)
                let shareText = `${title} \nhttps://www.bilibili.com${urlPath}`
                if (params.has('p')) {
                    shareText += `?p=${params.get('p')}`
                }
                navigator.clipboard.writeText(shareText)
            })
            debug('simpleShare complete')
        } else if (counter > 50) {
            clearInterval(checkElement)
            debug('simpleShare timeout')
        }
    }, 200)
}

const basicItems: NormalItem[] = []
const infoItems: NormalItem[] = []
const playerItems: NormalItem[] = []
const playerControlItems: NormalItem[] = []
const danmakuItems: NormalItem[] = []
const toolbarItems: NormalItem[] = []
const upInfoItems: NormalItem[] = []
const rightItems: NormalItem[] = []
const commentItems: NormalItem[] = []
const sidebarItems: NormalItem[] = []
// GroupList
const videoGroupList: Group[] = []

if (location.href.startsWith('https://www.bilibili.com/video/')) {
    // 基本功能part, basicItems
    {
        // BV号转AV号, 在url变化时需重载
        basicItems.push(new NormalItem('video-page-bv2av', 'BV号转AV号 (需刷新)', false, bv2av, true, null))
        // 净化分享, 默认开启
        basicItems.push(
            new NormalItem(
                'video-page-simple-share',
                '净化分享功能 (需刷新)',
                true,
                simpleShare,
                false,
                `.video-share-popover .video-share-dropdown .dropdown-bottom {display: none !important;}
                .video-share-popover .video-share-dropdown .dropdown-top {padding: 15px !important;}
                .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-right {display: none !important;}
                .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-left {padding-right: 0 !important;}`,
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
    videoGroupList.push(new Group('video-basic', '播放页 基本功能', basicItems))

    // 视频信息part, infoItems
    {
        // 隐藏 弹幕数
        infoItems.push(
            new NormalItem(
                'video-page-hide-video-info-danmaku-count',
                '隐藏 弹幕数',
                false,
                undefined,
                false,
                `.video-info-detail .dm {display: none !important;}`,
            ),
        )
        // 隐藏 发布日期
        infoItems.push(
            new NormalItem(
                'video-page-hide-video-info-pubdate',
                '隐藏 发布日期',
                false,
                undefined,
                false,
                `.video-info-detail .pubdate-ip {display: none !important;}`,
            ),
        )
        // 隐藏 版权声明
        infoItems.push(
            new NormalItem(
                'video-page-hide-video-info-copyright',
                '隐藏 版权声明',
                false,
                undefined,
                false,
                `.video-info-detail .copyright {display: none !important;}`,
            ),
        )
        // 隐藏 视频荣誉(排行榜/每周必看)
        infoItems.push(
            new NormalItem(
                'video-page-hide-video-info-honor',
                '隐藏 视频荣誉(排行榜/每周必看)',
                false,
                undefined,
                false,
                `.video-info-detail .honor-rank, .video-info-detail .honor-weekly {display: none !important;}`,
            ),
        )
        // 隐藏 温馨提示(饮酒/危险/AI生成), 默认开启
        infoItems.push(
            new NormalItem(
                'video-page-hide-video-info-argue',
                '隐藏 温馨提示(饮酒/危险/AI生成)',
                true,
                undefined,
                false,
                `.video-info-detail .argue, .video-info-detail .video-argue {display: none !important;}`,
            ),
        )
    }
    videoGroupList.push(new Group('video-info', '视频信息', infoItems))

    // 播放器part, playerItems
    {
        // 隐藏 一键三连弹窗
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-bili-guide-all',
                '隐藏 一键三连弹窗',
                false,
                undefined,
                false,
                `.bpx-player-video-area .bili-guide, .bpx-player-video-area .bili-guide-all {display: none !important;}`,
            ),
        )
        // 隐藏 投票弹窗
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-bili-vote',
                '隐藏 投票弹窗',
                false,
                undefined,
                false,
                `.bpx-player-video-area .bili-vote, .bpx-player-video-area .bili-cmd-shrink {display: none !important;}`,
            ),
        )
        // 隐藏 评分弹窗
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-bili-score',
                '隐藏 评分弹窗',
                false,
                undefined,
                false,
                `.bpx-player-video-area .bili-score {display: none !important;}`,
            ),
        )
        // 隐藏 视频预告
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-bili-reserve',
                '隐藏 视频预告',
                false,
                undefined,
                false,
                `.bpx-player-video-area .bili-reserve {display: none !important;}`,
            ),
        )
        // 隐藏 视频链接
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-bili-link',
                '隐藏 视频链接',
                false,
                undefined,
                false,
                `.bpx-player-video-area .bili-link {display: none !important;}`,
            ),
        )
        // 隐藏 右上角 反馈按钮, 默认开启
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-top-issue',
                '隐藏 右上角 反馈按钮',
                true,
                undefined,
                false,
                `.bpx-player-top-issue {display: none !important;}`,
            ),
        )
        // 隐藏 左上角 播放器内标题
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-top-left-title',
                '隐藏 左上角 播放器内标题',
                false,
                undefined,
                false,
                `.bpx-player-top-title {display: none !important;}
                .bpx-player-top-left-title {display: none !important;}
                /* 播放器上方阴影渐变 */
                .bpx-player-top-mask {display: none !important;}`,
            ),
        )
        // 隐藏 左上角 视频音乐链接
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-top-left-music',
                '隐藏 左上角 视频音乐链接',
                false,
                undefined,
                false,
                `.bpx-player-top-left-music {display: none !important;}`,
            ),
        )
        // 隐藏 左上角 关注UP主, 默认开启
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-top-left-follow',
                '隐藏 左上角 关注UP主',
                true,
                undefined,
                false,
                `.bpx-player-top-left-follow {display: none !important;}`,
            ),
        )
        // 隐藏 视频暂停时大Logo
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-state-wrap',
                '隐藏 视频暂停时大Logo',
                false,
                undefined,
                false,
                `.bpx-player-state-wrap {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕悬停 点赞/复制/举报
        playerItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dialog-wrap',
                '隐藏 弹幕悬停点赞/复制/举报',
                false,
                undefined,
                false,
                `.bpx-player-dialog-wrap {display: none !important;}`,
            ),
        )
        // 隐藏 高赞弹幕前点赞按钮
        playerItems.push(
            new NormalItem(
                'video-page-bpx-player-bili-high-icon',
                '隐藏 高赞弹幕前点赞按钮',
                false,
                undefined,
                false,
                `.bili-dm .bili-high-icon {display: none !important}`,
            ),
        )
        // 彩色渐变弹幕 变成白色
        playerItems.push(
            new NormalItem(
                'video-page-bpx-player-bili-dm-vip-white',
                '彩色渐变弹幕 变成白色',
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
        // CC字幕 字体优化
        playerItems.push(
            new NormalItem(
                'video-page-bpx-player-subtitle-font-family',
                'CC字幕 字体优化 (实验性)',
                false,
                undefined,
                false,
                `#bilibili-player .bpx-player-subtitle-panel-text {
                    font-family: inherit;
                }`,
            ),
        )
        // CC字幕 字体优化
        playerItems.push(
            new NormalItem(
                'video-page-bpx-player-subtitle-text-stroke',
                'CC字幕 字体描边 (实验性)',
                false,
                undefined,
                false,
                `#bilibili-player .bpx-player-subtitle-panel-text {
                    background: unset !important;
                    background-color: rgba(0,0,0,0.7) !important;
                    text-shadow: none !important;
                    background-clip: text !important;
                    text-stroke: 3px transparent !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-stroke: 3px transparent;
                    -moz-background-clip: text !important;
                    -moz-text-stroke: 3px transparent;
                    -ms-background-clip: text !important;
                    -ms-text-stroke: 3px transparent;
                }`,
            ),
        )
    }
    videoGroupList.push(new Group('video-player', '播放器', playerItems))

    // 播放控制part, playerControlItems
    {
        // 隐藏 上一个视频
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-prev',
                '隐藏 上一个视频',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-prev {display: none !important;}`,
            ),
        )
        // 隐藏 播放/暂停
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-play',
                '隐藏 播放/暂停',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-play {display: none !important;}`,
            ),
        )
        // 隐藏 下一个视频
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-next',
                '隐藏 下一个视频',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-next {display: none !important;}`,
            ),
        )
        // 隐藏 章节列表
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-viewpoint',
                '隐藏 章节列表',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-viewpoint {display: none !important;}`,
            ),
        )
        // 隐藏 选集
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-eplist',
                '隐藏 选集',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-eplist {display: none !important;}`,
            ),
        )
        // 隐藏 倍速
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-playbackrate',
                '隐藏 倍速',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-playbackrate {display: none !important;}`,
            ),
        )
        // 隐藏 字幕
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-subtitle',
                '隐藏 字幕',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-subtitle {display: none !important;}`,
            ),
        )
        // 隐藏 音量
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-volume',
                '隐藏 音量',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-volume {display: none !important;}`,
            ),
        )
        // 隐藏 视频设置
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-setting',
                '隐藏 视频设置',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-setting {display: none !important;}`,
            ),
        )
        // 隐藏 画中画(Chrome)
        // Firefox的画中画按钮为浏览器自带，无法通过CSS隐藏，只可通过浏览器设置关闭
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-pip',
                '隐藏 画中画(Chrome)',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-pip {display: none !important;}`,
            ),
        )
        // 隐藏 宽屏
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-wide',
                '隐藏 宽屏',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-wide {display: none !important;}`,
            ),
        )
        // 隐藏 网页全屏
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-web',
                '隐藏 网页全屏',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-web {display: none !important;}`,
            ),
        )
        // 隐藏 全屏
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-ctrl-full',
                '隐藏 全屏',
                false,
                undefined,
                false,
                `.bpx-player-ctrl-full {display: none !important;}`,
            ),
        )
        // 隐藏 底边mini视频进度, 默认开启
        playerControlItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-shadow-progress-area',
                '隐藏 底边mini视频进度',
                true,
                undefined,
                false,
                `.bpx-player-shadow-progress-area {display: none !important;}`,
            ),
        )
    }
    videoGroupList.push(new Group('video-player-control', '播放控制', playerControlItems))

    // 弹幕栏part, danmakuItems
    {
        // 隐藏 同时在看人数
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-video-info-online',
                '隐藏 同时在看人数',
                false,
                undefined,
                false,
                `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`,
            ),
        )
        // 隐藏 载入弹幕数量
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-video-info-dm',
                '隐藏 载入弹幕数量',
                false,
                undefined,
                false,
                `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕启用
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-switch',
                '隐藏 弹幕启用',
                false,
                undefined,
                false,
                `.bpx-player-dm-switch {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕显示设置
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-setting',
                '隐藏 弹幕显示设置',
                false,
                undefined,
                false,
                `.bpx-player-dm-setting {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕样式
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-video-btn-dm',
                '隐藏 弹幕样式',
                false,
                undefined,
                false,
                `.bpx-player-video-btn-dm {display: none !important;}`,
            ),
        )
        // 隐藏 占位文字, 默认开启
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-input',
                '隐藏 占位文字',
                true,
                undefined,
                false,
                `.bpx-player-dm-input::placeholder {color: transparent !important;}`,
            ),
        )
        // 隐藏 弹幕礼仪, 默认开启
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-hint',
                '隐藏 弹幕礼仪',
                true,
                undefined,
                false,
                `.bpx-player-dm-hint {display: none !important;}`,
            ),
        )
        // 隐藏 发送按钮
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-dm-btn-send',
                '隐藏 发送按钮',
                false,
                undefined,
                false,
                `.bpx-player-dm-btn-send {display: none !important;}`,
            ),
        )
        // 隐藏 智能弹幕/广告弹幕
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-postpanel',
                '隐藏 智能弹幕/广告弹幕',
                false,
                undefined,
                false,
                `.bpx-player-postpanel-sug,
                .bpx-player-postpanel-carousel,
                .bpx-player-postpanel-popup {
                    color: transparent !important;
                }`,
            ),
        )
        // 隐藏 关闭整个弹幕栏
        danmakuItems.push(
            new NormalItem(
                'video-page-hide-bpx-player-sending-area',
                '隐藏 关闭整个弹幕栏',
                false,
                undefined,
                false,
                `.bpx-player-sending-area {display: none !important;}
                /* video page的player, height由JS动态设定, 无法去黑边 */
                #bilibili-player-wrap {height: calc(var(--video-width)*.5625)}`,
            ),
        )
    }
    videoGroupList.push(new Group('video-danmaku', '弹幕栏', danmakuItems))

    // 视频下方part, toolbarItems
    {
        // 隐藏 分享按钮弹出菜单, 默认开启
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-video-share-popover',
                '隐藏 分享按钮弹出菜单',
                true,
                undefined,
                false,
                `.video-share-popover {display: none !important;}`,
            ),
        )
        // 隐藏 官方AI总结
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-below-info-video-ai-assistant',
                '隐藏 官方AI总结',
                false,
                undefined,
                false,
                `.video-toolbar-right .video-ai-assistant {display: none !important;}`,
            ),
        )
        // 隐藏 记笔记
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-below-info-video-note',
                '隐藏 记笔记',
                false,
                undefined,
                false,
                `.video-toolbar-right .video-note {display: none !important;}`,
            ),
        )
        // 隐藏 举报/笔记/稍后再看
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-below-info-video-report-menu',
                '隐藏 举报/笔记/稍后再看',
                false,
                undefined,
                false,
                `.video-toolbar-right .video-tool-more {display: none !important;}`,
            ),
        )
        // 隐藏 视频简介
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-below-info-desc',
                '隐藏 视频简介',
                false,
                undefined,
                false,
                `#v_desc {display: none !important;}`,
            ),
        )
        // 隐藏 tag列表
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-below-info-tag',
                '隐藏 tag列表',
                false,
                undefined,
                false,
                `#v_tag {display: none !important;}`,
            ),
        )
        // 隐藏 活动宣传, 默认开启
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-below-activity-vote',
                '隐藏 活动宣传',
                true,
                undefined,
                false,
                `#activity_vote {display: none !important;}`,
            ),
        )
        // 隐藏 广告banner, 默认开启
        toolbarItems.push(
            new NormalItem(
                'video-page-hide-below-bannerAd',
                '隐藏 广告banner',
                true,
                undefined,
                false,
                `#bannerAd {display: none !important;}`,
            ),
        )
    }
    videoGroupList.push(new Group('video-toolbar', '视频下方 工具/简介/Tag', toolbarItems))

    // up主信息part, upInfoItems
    {
        // 隐藏 给UP发消息, 默认开启
        upInfoItems.push(
            new NormalItem(
                'video-page-hide-up-sendmsg',
                '隐藏 给UP发消息',
                true,
                undefined,
                false,
                `.up-detail .send-msg {display: none !important;}`,
            ),
        )
        // 隐藏 UP简介
        upInfoItems.push(
            new NormalItem(
                'video-page-hide-up-description',
                '隐藏 UP简介',
                false,
                undefined,
                false,
                `.up-detail .up-description {display: none !important;}`,
            ),
        )
        // 隐藏 充电
        upInfoItems.push(
            new NormalItem(
                'video-page-hide-up-charge',
                '隐藏 充电',
                false,
                undefined,
                false,
                `.upinfo-btn-panel .new-charge-btn, .upinfo-btn-panel .old-charge-btn {display: none !important;}`,
            ),
        )
        // 隐藏 UP主头像外饰品
        upInfoItems.push(
            new NormalItem(
                'video-page-hide-up-bili-avatar-pendent-dom',
                '隐藏 UP主头像外饰品',
                false,
                undefined,
                false,
                `.up-info-container .bili-avatar-pendent-dom {display: none !important;}
                .up-avatar-wrap .up-avatar {background-color: transparent !important;}`,
            ),
        )
        // 隐藏 创作团队header, 默认开启
        upInfoItems.push(
            new NormalItem(
                'video-page-hide-up-membersinfo-normal-header',
                '隐藏 创作团队header',
                true,
                undefined,
                false,
                `.membersinfo-normal .header {display: none !important;}`,
            ),
        )
    }
    videoGroupList.push(new Group('video-up-info', '右侧 UP主信息', upInfoItems))

    // 右侧视频栏part, rightItems
    {
        // 隐藏 广告, 默认开启
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-ad',
                '隐藏 广告',
                true,
                undefined,
                false,
                `#slide_ad {display: none !important;}
                .ad-report.video-card-ad-small {display: none !important;}
                .video-page-special-card-small {display: none !important;}
                #reco_list {margin-top: 0 !important;}`,
            ),
        )
        // 隐藏 游戏推荐
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-video-page-game-card-small',
                '隐藏 游戏推荐',
                false,
                undefined,
                false,
                `#reco_list .video-page-game-card-small {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕列表, 默认开启
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-danmaku',
                '隐藏 弹幕列表',
                true,
                undefined,
                false,
                `
                /* 不可使用 display:none 否则播放器宽屏模式下danmukuBox的margin-top失效，导致视频覆盖右侧列表 */
                #danmukuBox {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin-bottom: 0 !important;
                }`,
            ),
        )
        // 隐藏 自动连播按钮
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-reco-list-next-play-next-button',
                '隐藏 自动连播按钮',
                false,
                undefined,
                false,
                `#reco_list .next-play .next-button {display: none !important;}`,
            ),
        )
        // 视频合集 增加合集列表高度, 默认开启
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-section-height',
                '视频合集 增加合集列表高度',
                true,
                undefined,
                false,
                `.base-video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important};
                .video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important};`,
            ),
        )
        // 隐藏 视频合集 自动连播
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-section-next-btn',
                '隐藏 视频合集 自动连播',
                false,
                undefined,
                false,
                `.base-video-sections-v1 .next-button {display: none !important;}
                .video-sections-head_first-line .next-button {display: none !important;}`,
            ),
        )
        // 隐藏 视频合集 播放量
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-section-play-num',
                '隐藏 视频合集 播放量',
                false,
                undefined,
                false,
                `.base-video-sections-v1 .play-num {display: none !important;}
                .video-sections-head_second-line .play-num {display: none !important;}`,
            ),
        )
        // 隐藏 视频合集 简介, 默认开启
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-section-abstract',
                '隐藏 视频合集 简介',
                true,
                undefined,
                false,
                `.base-video-sections-v1 .abstract {display: none !important;}
                .base-video-sections-v1 .second-line_left img {display: none !important;}
                .video-sections-head_second-line .abstract {display: none !important;}
                .video-sections-head_second-line .second-line_left img {display: none !important;}`,
            ),
        )
        // 隐藏 视频合集 订阅合集
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-section-subscribe',
                '隐藏 视频合集 订阅合集',
                false,
                undefined,
                false,
                `.base-video-sections-v1 .second-line_right {display: none !important;}
                .video-sections-head_second-line .second-line_right {display: none !important;}`,
            ),
        )
        // 隐藏 分P视频 自动连播
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-multi-page-next-btn',
                '隐藏 分P视频 自动连播',
                false,
                undefined,
                false,
                `#multi_page .next-button {display: none !important;}`,
            ),
        )
        // 隐藏 相关视频 稍后再看按钮
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-reco-list-watch-later-video',
                '隐藏 相关视频 稍后再看按钮',
                false,
                undefined,
                false,
                `#reco_list .watch-later-video {display: none !important;}`,
            ),
        )
        // 隐藏 相关视频 UP主
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-reco-list-rec-list-info-up',
                '隐藏 相关视频 UP主',
                false,
                undefined,
                false,
                `#reco_list .info .upname {
                    display: none !important;
                }
                #reco_list .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }`,
            ),
        )
        // 隐藏 相关视频 播放和弹幕
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-reco-list-rec-list-info-plays',
                '隐藏 相关视频 播放和弹幕',
                false,
                undefined,
                false,
                `#reco_list .info .playinfo {
                    display: none !important;
                }
                #reco_list .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }`,
            ),
        )
        // 隐藏 视频时长
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-duration',
                '隐藏 相关视频 视频时长',
                false,
                undefined,
                false,
                `#reco_list .duration {display: none !important;}`,
            ),
        )
        // 隐藏 全部相关视频
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-reco-list-rec-list',
                '隐藏 全部相关视频',
                false,
                undefined,
                false,
                `#reco_list .rec-list {display: none !important;}`,
            ),
        )
        // 隐藏 活动banner, 默认开启
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-right-bottom-banner',
                '隐藏 活动banner',
                true,
                undefined,
                false,
                `#right-bottom-banner {display: none !important;}`,
            ),
        )
        // 隐藏 直播间推荐, 默认开启
        rightItems.push(
            new NormalItem(
                'video-page-hide-right-container-live',
                '隐藏 直播间推荐',
                true,
                undefined,
                false,
                `.right-container .pop-live-small-mode {display: none !important;}`,
            ),
        )
    }
    videoGroupList.push(new Group('video-right', '右侧 视频栏', rightItems))

    // 评论区part, commentItems
    {
        // 隐藏 活动/notice, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-notice',
                '隐藏 活动/notice',
                true,
                undefined,
                false,
                `#comment .reply-header .reply-notice {display: none !important;}`,
            ),
        )
        // 隐藏 整个评论框
        commentItems.push(
            new NormalItem(
                'video-page-hide-main-reply-box',
                '隐藏 整个评论框',
                false,
                undefined,
                false,
                // 不可使用display: none, 会使底部吸附评论框宽度变化
                `#comment .main-reply-box {height: 0 !important; visibility: hidden !important;}
                #comment .reply-list {margin-top: -20px !important;}`,
            ),
        )
        // 隐藏 页面底部 吸附评论框, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-fixed-reply-box',
                '隐藏 页面底部 吸附评论框',
                true,
                undefined,
                false,
                `#comment .fixed-reply-box {display: none !important;}`,
            ),
        )
        // 隐藏 评论编辑器内占位文字, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-box-textarea-placeholder',
                '隐藏 评论编辑器内占位文字',
                true,
                undefined,
                false,
                `.main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
                .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`,
            ),
        )
        // 隐藏 评论内容右侧装饰
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-decorate',
                '隐藏 评论内容右侧装饰',
                false,
                undefined,
                false,
                `#comment .reply-decorate {display: none !important;}`,
            ),
        )
        // 隐藏 ID后粉丝牌
        commentItems.push(
            new NormalItem(
                'video-page-hide-fan-badge',
                '隐藏 ID后粉丝牌',
                false,
                undefined,
                false,
                `#comment .fan-badge {display: none !important;}`,
            ),
        )
        // 隐藏 一级评论用户等级
        commentItems.push(
            new NormalItem(
                'video-page-hide-user-level',
                '隐藏 一级评论用户等级',
                false,
                undefined,
                false,
                `#comment .user-level {display: none !important;}`,
            ),
        )
        // 隐藏 二级评论用户等级
        commentItems.push(
            new NormalItem(
                'video-page-hide-sub-user-level',
                '隐藏 二级评论用户等级',
                false,
                undefined,
                false,
                `#comment .sub-user-level {display: none !important;}`,
            ),
        )
        // 隐藏 用户头像外圈饰品
        commentItems.push(
            new NormalItem(
                'video-page-hide-bili-avatar-pendent-dom',
                '隐藏 用户头像外圈饰品',
                false,
                undefined,
                false,
                `#comment .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            #comment .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`,
            ),
        )
        // 隐藏 用户头像右下小icon
        commentItems.push(
            new NormalItem(
                'video-page-hide-bili-avatar-nft-icon',
                '隐藏 用户头像右下小icon',
                false,
                undefined,
                false,
                `#comment .bili-avatar-nft-icon {display: none !important;}
                #comment .bili-avatar-icon {display: none !important;}`,
            ),
        )
        // 隐藏 评论内容下tag(UP觉得很赞)
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-tag-list',
                '隐藏 评论内容下tag(UP觉得很赞)',
                false,
                undefined,
                false,
                `#comment .reply-tag-list {display: none !important;}`,
            ),
        )
        // 隐藏 笔记评论前的小Logo, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-note-prefix',
                '隐藏 笔记评论前的小Logo',
                true,
                undefined,
                false,
                `#comment .note-prefix {display: none !important;}`,
            ),
        )
        // 隐藏 评论内容搜索关键词高亮, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-jump-link-search-word',
                '隐藏 评论内容搜索关键词高亮',
                true,
                undefined,
                false,
                `#comment .reply-content .jump-link.search-word {color: inherit !important;}
                #comment .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
                #comment .reply-content .icon.search-word {display: none !important;}`,
            ),
        )
        // 隐藏 二级评论中的@高亮
        commentItems.push(
            new NormalItem(
                'video-page-hide-reply-content-user-highlight',
                '隐藏 二级评论中的@高亮',
                false,
                undefined,
                false,
                `#comment .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                #comment .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`,
            ),
        )
        // 隐藏 召唤AI机器人的评论, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-hide-at-reply-at-bots',
                '隐藏 召唤AI机器人的评论',
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
        // 隐藏 包含@的 无人点赞评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-zero-like-at-reply',
                '隐藏 包含@的 无人点赞评论',
                false,
                undefined,
                false,
                `#comment .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 包含@的 全部评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-at-reply-all',
                '隐藏 包含@的 全部评论',
                false,
                undefined,
                false,
                `#comment .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`,
            ),
        )
        // 隐藏 LV1 无人点赞评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv1-reply',
                '隐藏 LV1 无人点赞评论',
                false,
                undefined,
                false,
                `#comment .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 LV2 无人点赞评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv2-reply',
                '隐藏 LV2 无人点赞评论',
                false,
                undefined,
                false,
                `#comment .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 LV3 无人点赞评论
        commentItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv3-reply',
                '隐藏 LV3 无人点赞评论',
                false,
                undefined,
                false,
                `#comment .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
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
                `#comment .reply-info:not(:has(i.disliked)) .reply-btn,
                #comment .reply-info:not(:has(i.disliked)) .reply-dislike {
                    visibility: hidden;
                }
                #comment .reply-item:hover .reply-btn,
                #comment .reply-item:hover .reply-dislike {
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
                `#comment .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
                #comment .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                    visibility: hidden;
                }
                #comment .sub-reply-item:hover .sub-reply-btn,
                #comment .sub-reply-item:hover .sub-reply-dislike {
                    visibility: visible !important;
                }`,
            ),
        )
        // 隐藏 大表情
        commentItems.push(
            new NormalItem(
                'video-page-hide-emoji-large',
                '隐藏 大表情',
                false,
                undefined,
                false,
                `#comment .emoji-large {display: none !important;}`,
            ),
        )
        // 大表情变成小表情
        commentItems.push(
            new NormalItem(
                'video-page-hide-emoji-large-zoom',
                '大表情变成小表情',
                false,
                undefined,
                false,
                `#comment .emoji-large {zoom: .5;}`,
            ),
        )
        // 用户名 全部大会员色
        commentItems.push(
            new NormalItem(
                'video-page-reply-user-name-color-pink',
                '用户名 全部大会员色',
                false,
                undefined,
                false,
                `#comment .reply-item .user-name, #comment .reply-item .sub-user-name {color: #FB7299 !important;}}`,
            ),
        )
        // 用户名 全部恢复默认色
        commentItems.push(
            new NormalItem(
                'video-page-reply-user-name-color-default',
                '用户名 全部恢复默认色',
                false,
                undefined,
                false,
                `#comment .reply-item .user-name, #comment .reply-item .sub-user-name {color: #61666d !important;}}`,
            ),
        )
        // 笔记图片 查看大图优化, 默认开启
        commentItems.push(
            new NormalItem(
                'video-page-reply-view-image-optimize',
                '笔记图片 查看大图优化',
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
    videoGroupList.push(new Group('video-comment', '评论区', commentItems))

    // 右下角part, sidebarItems
    {
        // 隐藏 小窗播放器
        sidebarItems.push(
            new NormalItem(
                'video-page-hide-sidenav-right-container-live',
                '隐藏 小窗播放器',
                false,
                undefined,
                false,
                `.fixed-sidenav-storage .mini-player-window {display: none !important;}`,
            ),
        )
        // 隐藏 客服, 默认开启
        sidebarItems.push(
            new NormalItem(
                'video-page-hide-sidenav-customer-service',
                '隐藏 客服',
                true,
                undefined,
                false,
                `.fixed-sidenav-storage .customer-service {display: none !important;}`,
            ),
        )
        // 隐藏 回顶部
        sidebarItems.push(
            new NormalItem(
                'video-page-hide-sidenav-back-to-top',
                '隐藏 回顶部',
                false,
                undefined,
                false,
                `.fixed-sidenav-storage .back-to-top {display: none !important;}`,
            ),
        )
    }
    videoGroupList.push(new Group('video-sidebar', '页面右下角 小按钮', sidebarItems))
}

export { videoGroupList }

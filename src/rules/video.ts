import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { debug } from '../utils/logger'
import { matchAvidBvid, matchBvid } from '../utils/tool'
import { isPageBnj, isPagePlaylist, isPageVideo } from '../utils/page-type'

/** BV号转AV号 */
const bv2av = () => {
    /**
     * 可能会出现转换后av号带短横的bug(溢出)，作为后备方案
     * bv2av algo by mcfx
     * @see https://www.zhihu.com/question/381784377/answer/1099438784
     * @param x 输入BV号
     * @returns 输出纯数字av号
     */
    const dec = (x: string): number => {
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
        // 修复一下溢出
        const aid = (r - add) ^ xor
        return aid > 0 ? aid : aid + 2147483648
    }

    // 从window对象获取avid
    const getAid = (): number | undefined => {
        return window.vd?.aid
    }

    if (location.href.includes('bilibili.com/video/BV')) {
        const bvid = matchBvid(location.href)
        if (bvid) {
            // 保留query string中分P参数, anchor中reply定位
            let partNum = ''
            const params = new URLSearchParams(location.search)
            if (params.has('p')) {
                partNum += `?p=${params.get('p')}`
            }
            const aid = getAid() ?? dec(bvid)
            const newURL = `https://www.bilibili.com/video/av${aid}${partNum}${location.hash}`
            history.replaceState(null, '', newURL)
            debug('bv2av complete')
        }
    }
}

/** 净化分享按钮功能, 暂不支持从稍后再看列表、收藏夹列表分享 */
let isSimpleShareBtn = false
const simpleShare = () => {
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
                let title = document.querySelector('#viewbox_report > h1')?.textContent
                if (!title) {
                    // 尝试稍后再看or收藏夹列表
                    title = document.querySelector('.video-title-href')?.textContent
                    if (!title) {
                        return
                    }
                }
                if (
                    !'（({【[［《「＜｛〔〖<〈『'.includes(title[0]) &&
                    !'）)}】]］》」＞｝〕〗>〉』'.includes(title.slice(-1))
                ) {
                    title = `【${title}】`
                }
                // 匹配av号, BV号, 分P号
                const avbv = matchAvidBvid(location.href)
                let shareText = `${title} \nhttps://www.bilibili.com/video/${avbv}`
                const urlObj = new URL(location.href)
                const params = new URLSearchParams(urlObj.search)
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

/** 隐藏弹幕栏时，强行调节播放器高度 */
const overridePlayerHeight = () => {
    // 念咒
    const genSizeCSS = (): string => {
        const e = window.isWide
        const i = window.innerHeight
        const t = Math.max((document.body && document.body.clientWidth) || window.innerWidth, 1100)
        const n = 1680 < innerWidth ? 411 : 350
        const o = (16 * (i - (1690 < innerWidth ? 318 : 308))) / 9
        const r = t - 112 - n
        let d = r < o ? r : o
        if (d < 668) {
            d = 668
        }
        if (1694 < d) {
            d = 1694
        }
        let a = d + n
        if (window.isWide) {
            a -= 125
            d -= 100
        }
        let l
        if (window.hasBlackSide && !window.isWide) {
            l = Math.round((d - 14 + (e ? n : 0)) * 0.5625) + 96
        } else {
            l = Math.round((d + (e ? n : 0)) * 0.5625)
        }
        const s = `
            .video-container-v1 {width: auto;padding: 0 10px;}
            .left-container {width: ${a - n}px;}
            #bilibili-player {width: ${a - (e ? -30 : n)}px;height: ${l}px;position: ${e ? 'relative' : 'static'};}
            #oldfanfollowEntry {position: relative;top: ${e ? `${l + 10}px` : '0'};}
            #danmukuBox {margin-top: ${e ? `${l + 28}px` : '0'};}
            #playerWrap {height: ${l}px;}
            .video-discover {margin-left: ${(a - n) / 2}px;}
            `
        return s.replace(/\n\s*/g, '').trim()
    }

    // override CSS
    // 插入新style覆盖(必须在原style出现后，appendChild在head尾部，权限更高)
    const overrideCSS = () => {
        const overrideStyle = document.getElementById('overrideSetSizeStyle') as HTMLStyleElement
        if (!overrideStyle) {
            const newStyleNode = document.createElement('style')
            newStyleNode.id = 'overrideSetSizeStyle'
            newStyleNode.innerHTML = genSizeCSS()
            document.head.appendChild(newStyleNode)
            debug('override setSize OK')
        } else {
            overrideStyle.innerHTML = genSizeCSS()
            debug('refresh setSize OK')
        }
    }

    // 监听官方style #setSizeStyle 出现
    const observeStyle = new MutationObserver(() => {
        if (document.getElementById('setSizeStyle')) {
            overrideCSS()
            observeStyle.disconnect()
        }
    })
    if (document.head) {
        observeStyle.observe(document.head, { childList: true })
    }

    // 监听宽屏按钮click
    let isWide = window.isWide
    const observeBtn = new MutationObserver(() => {
        const wideBtn = document.querySelector('#bilibili-player .bpx-player-ctrl-wide') as HTMLFormElement
        if (wideBtn) {
            wideBtn.addEventListener('click', () => {
                debug('wideBtn click detected')
                window.isWide = !isWide
                isWide = !isWide
                overrideCSS()
            })
            observeBtn.disconnect()
        }
    })
    document.addEventListener('DOMContentLoaded', () => {
        observeBtn.observe(document, { childList: true, subtree: true })
    })
}

// GroupList
const videoGroupList: Group[] = []

// 普通播放页，稍后再看播放页，收藏夹播放页
if (isPageVideo() || isPagePlaylist()) {
    // 基本功能
    const basicItems = [
        // BV号转AV号, 在url变化时需重载, 关闭功能需刷新
        new CheckboxItem({
            itemID: 'video-page-bv2av',
            description: 'BV号转AV号',
            itemFunc: bv2av,
            isItemFuncReload: true,
        }),
        // 净化分享, 默认开启, 关闭功能需刷新
        new CheckboxItem({
            itemID: 'video-page-simple-share',
            description: '净化分享功能 (充电时需关闭)',
            defaultStatus: true,
            itemFunc: simpleShare,
            itemCSS: `.video-share-popover .video-share-dropdown .dropdown-bottom {display: none !important;}
                .video-share-popover .video-share-dropdown .dropdown-top {padding: 15px !important;}
                .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-right {display: none !important;}
                .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-left {padding-right: 0 !important;}`,
        }),
        // 顶栏 滚动页面后不再吸附顶部
        new CheckboxItem({
            itemID: 'video-page-hide-fixed-header',
            description: '顶栏 滚动页面后不再吸附顶部',
            itemCSS: `.fixed-header .bili-header__bar {position: relative !important;}`,
        }),
        // 播放器和视频信息 交换位置(实验性)
        new CheckboxItem({
            itemID: 'video-page-exchange-player-position',
            description: '播放器和视频信息 交换位置(实验性)',
            itemCSS: `.left-container {
                    display: flex !important;
                    flex-direction: column !important;
                    padding-top: 50px !important;
                }
                #viewbox_report {order: 2;}
                #playerWrap {order: 1;}
                #arc_toolbar_report {order: 3;}
                .left-container-under-player {order: 4;}
                .video-info-container {height: unset !important; padding-top: 16px !important;}
                .video-toolbar-container {padding-top: 12px !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-basic', '播放页 基本功能', basicItems))

    // 视频信息
    const infoItems = [
        // 隐藏 弹幕数
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-danmaku-count',
            description: '隐藏 弹幕数',
            itemCSS: `.video-info-detail .dm {display: none !important;}`,
        }),
        // 隐藏 发布日期
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-pubdate',
            description: '隐藏 发布日期',
            itemCSS: `.video-info-detail .pubdate-ip {display: none !important;}`,
        }),
        // 隐藏 版权声明
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-copyright',
            description: '隐藏 版权声明',
            itemCSS: `.video-info-detail .copyright {display: none !important;}`,
        }),
        // 隐藏 视频荣誉(排行榜/每周必看)
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-honor',
            description: '隐藏 视频荣誉(排行榜/每周必看)',
            itemCSS: `.video-info-detail .honor-rank, .video-info-detail .honor-weekly {display: none !important;}`,
        }),
        // 隐藏 温馨提示(饮酒/危险/AI生成), 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-argue',
            description: '隐藏 温馨提示(饮酒/危险/AI生成)',
            defaultStatus: true,
            itemCSS: `.video-info-detail .argue, .video-info-detail .video-argue {display: none !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-info', '视频信息', infoItems))
}

// 部分适配拜年祭视频页(播放器、弹幕栏规则多数生效)
if (isPageVideo() || isPagePlaylist() || isPageBnj()) {
    // 播放器
    const playerItems = [
        // 隐藏 一键三连弹窗
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-guide-all',
            description: '隐藏 一键三连弹窗',
            itemCSS: `.bpx-player-video-area .bili-guide, .bpx-player-video-area .bili-guide-all {display: none !important;}`,
        }),
        // 隐藏 投票弹窗
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-vote',
            description: '隐藏 投票弹窗',
            itemCSS: `.bpx-player-video-area .bili-vote, .bpx-player-video-area .bili-cmd-shrink {display: none !important;}`,
        }),
        // 隐藏 播放效果调查, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-qoe-feedback',
            description: '隐藏 播放效果调查',
            defaultStatus: true,
            itemCSS: `.bpx-player-video-area .bili-qoeFeedback {display: none !important;}`,
        }),
        // 隐藏 评分弹窗
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-score',
            description: '隐藏 评分弹窗',
            itemCSS: `.bpx-player-video-area .bili-score {display: none !important;}`,
        }),
        // 隐藏 打卡弹窗
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-clock',
            description: '隐藏 打卡弹窗',
            itemCSS: `.bpx-player-video-area .bili-clock {display: none !important;}`,
        }),
        // 隐藏 视频预告
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-reserve',
            description: '隐藏 视频预告',
            itemCSS: `.bpx-player-video-area .bili-reserve {display: none !important;}`,
        }),
        // 隐藏 视频链接
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-link',
            description: '隐藏 视频链接',
            itemCSS: `.bpx-player-video-area .bili-link {display: none !important;}`,
        }),
        // 隐藏 左上角 播放器内标题
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-top-left-title',
            description: '隐藏 左上角 播放器内标题',
            itemCSS: `.bpx-player-top-title {display: none !important;}
                .bpx-player-top-left-title {display: none !important;}
                /* 播放器上方阴影渐变 */
                .bpx-player-top-mask {display: none !important;}`,
        }),
        // 隐藏 左上角 视频音乐链接
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-top-left-music',
            description: '隐藏 左上角 视频音乐链接',
            itemCSS: `.bpx-player-top-left-music {display: none !important;}`,
        }),
        // 隐藏 左上角 关注UP主, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-top-left-follow',
            description: '隐藏 左上角 关注UP主',
            defaultStatus: true,
            itemCSS: `.bpx-player-top-left-follow {display: none !important;}`,
        }),
        // 隐藏 右上角 反馈按钮, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-top-issue',
            description: '隐藏 右上角 反馈按钮',
            defaultStatus: true,
            itemCSS: `.bpx-player-top-issue {display: none !important;}`,
        }),
        // 隐藏 视频暂停时大Logo
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-state-wrap',
            description: '隐藏 视频暂停时大Logo',
            itemCSS: `.bpx-player-state-wrap {display: none !important;}`,
        }),
        // 隐藏 播放结束后视频推荐
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ending-related',
            description: '隐藏 播放结束后视频推荐',
            itemCSS: `
                .bpx-player-ending-related {display: none !important;}
                .bpx-player-ending-content {display: flex !important; align-items: center !important;}`,
        }),
        // 隐藏 弹幕悬停 点赞/复制/举报
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-dialog-wrap',
            description: '隐藏 弹幕悬停点赞/复制/举报',
            itemCSS: `.bpx-player-dialog-wrap {display: none !important;}`,
        }),
        // 隐藏 高赞弹幕前点赞按钮
        new CheckboxItem({
            itemID: 'video-page-bpx-player-bili-high-icon',
            description: '隐藏 高赞弹幕前点赞按钮',
            itemCSS: `.bili-dm .bili-high-icon {display: none !important}`,
        }),
        // 隐藏 爆炸特效弹幕
        new CheckboxItem({
            itemID: 'video-page-bpx-player-bili-dm-boom',
            description: '隐藏 爆炸特效弹幕',
            itemCSS: `.bili-boom {display: none !important}`,
        }),
        // 彩色渐变弹幕 变成白色
        new CheckboxItem({
            itemID: 'video-page-bpx-player-bili-dm-vip-white',
            description: '彩色渐变弹幕 变成白色',
            itemCSS: `#bilibili-player .bili-dm>.bili-dm-vip {
                    background: unset !important;
                    background-size: unset !important;
                    /* 父元素未指定 var(--textShadow), 默认重墨描边凑合用 */
                    text-shadow: 1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000 !important;
                    text-stroke: none !important;
                    -webkit-text-stroke: none !important;
                    -moz-text-stroke: none !important;
                    -ms-text-stroke: none !important;
                }`,
        }),
        // CC字幕 字体优化
        new CheckboxItem({
            itemID: 'video-page-bpx-player-subtitle-font-family',
            description: 'CC字幕 字体优化 (实验性)',
            itemCSS: `#bilibili-player .bpx-player-subtitle-panel-text {
                    font-family: inherit;
                }`,
        }),
        // CC字幕 字体优化
        new CheckboxItem({
            itemID: 'video-page-bpx-player-subtitle-text-stroke',
            description: 'CC字幕 字体描边 (实验性)',
            itemCSS: `#bilibili-player .bpx-player-subtitle-panel-text {
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
        }),
    ]
    videoGroupList.push(new Group('video-player', '播放器', playerItems))

    // 播放控制
    const playerControlItems = [
        // 隐藏 上一个视频
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-prev',
            description: '隐藏 上一个视频',
            itemCSS: `.bpx-player-ctrl-prev {display: none !important;}`,
        }),
        // 隐藏 播放/暂停
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-play',
            description: '隐藏 播放/暂停',
            itemCSS: `.bpx-player-ctrl-play {display: none !important;}`,
        }),
        // 隐藏 下一个视频
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-next',
            description: '隐藏 下一个视频',
            itemCSS: `.bpx-player-ctrl-next {display: none !important;}`,
        }),
        // 隐藏 章节列表
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-viewpoint',
            description: '隐藏 章节列表',
            itemCSS: `.bpx-player-ctrl-viewpoint {display: none !important;}`,
        }),
        // 隐藏 Hi-Res无损
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-flac',
            description: '隐藏 Hi-Res无损',
            itemCSS: `.bpx-player-ctrl-flac {display: none !important;}`,
        }),
        // 隐藏 选集
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-eplist',
            description: '隐藏 选集',
            itemCSS: `.bpx-player-ctrl-eplist {display: none !important;}`,
        }),
        // 隐藏 倍速
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-playbackrate',
            description: '隐藏 倍速',
            itemCSS: `.bpx-player-ctrl-playbackrate {display: none !important;}`,
        }),
        // 隐藏 字幕
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-subtitle',
            description: '隐藏 字幕',
            itemCSS: `.bpx-player-ctrl-subtitle {display: none !important;}`,
        }),
        // 隐藏 音量
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-volume',
            description: '隐藏 音量',
            itemCSS: `.bpx-player-ctrl-volume {display: none !important;}`,
        }),
        // 隐藏 视频设置
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-setting',
            description: '隐藏 视频设置',
            itemCSS: `.bpx-player-ctrl-setting {display: none !important;}`,
        }),
        // 隐藏 画中画(Chrome)
        // Firefox的画中画按钮为浏览器自带，无法通过CSS隐藏，只可通过浏览器设置关闭
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-pip',
            description: '隐藏 画中画(Chrome)',
            itemCSS: `.bpx-player-ctrl-pip {display: none !important;}`,
        }),
        // 隐藏 宽屏
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-wide',
            description: '隐藏 宽屏',
            itemCSS: `.bpx-player-ctrl-wide {display: none !important;}`,
        }),
        // 隐藏 网页全屏
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-web',
            description: '隐藏 网页全屏',
            itemCSS: `.bpx-player-ctrl-web {display: none !important;}`,
        }),
        // 隐藏 全屏
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-full',
            description: '隐藏 全屏',
            itemCSS: `.bpx-player-ctrl-full {display: none !important;}`,
        }),
        // 隐藏 高能进度条 图钉按钮
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-pbp-pin',
            description: '隐藏 高能进度条 图钉按钮',
            itemCSS: `.bpx-player-pbp-pin {display: none !important;}`,
        }),
        // 隐藏 底边mini视频进度, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-shadow-progress-area',
            description: '隐藏 底边mini视频进度',
            defaultStatus: true,
            itemCSS: `.bpx-player-shadow-progress-area {display: none !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-player-control', '播放控制', playerControlItems))

    // 弹幕栏
    const danmakuItems = [
        // 隐藏 同时在看人数
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-video-info-online',
            description: '隐藏 同时在看人数',
            itemCSS: `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`,
        }),
        // 隐藏 载入弹幕数量
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-video-info-dm',
            description: '隐藏 载入弹幕数量',
            itemCSS: `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`,
        }),
        // 隐藏 弹幕启用
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-dm-switch',
            description: '隐藏 弹幕启用',
            itemCSS: `.bpx-player-dm-switch {display: none !important;}`,
        }),
        // 隐藏 弹幕显示设置
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-dm-setting',
            description: '隐藏 弹幕显示设置',
            itemCSS: `.bpx-player-dm-setting {display: none !important;}`,
        }),
        // 隐藏 弹幕样式
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-video-btn-dm',
            description: '隐藏 弹幕样式',
            itemCSS: `.bpx-player-video-btn-dm {display: none !important;}`,
        }),
        // 隐藏 占位文字, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-dm-input',
            description: '隐藏 占位文字',
            defaultStatus: true,
            itemCSS: `.bpx-player-dm-input::placeholder {color: transparent !important;}`,
        }),
        // 隐藏 弹幕礼仪, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-dm-hint',
            description: '隐藏 弹幕礼仪',
            defaultStatus: true,
            itemCSS: `.bpx-player-dm-hint {display: none !important;}`,
        }),
        // 隐藏 发送按钮
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-dm-btn-send',
            description: '隐藏 发送按钮',
            itemCSS: `.bpx-player-dm-btn-send {display: none !important;}`,
        }),
        // 隐藏 智能弹幕 发送提示
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-postpanel',
            description: '隐藏 智能弹幕/广告弹幕',
            itemCSS: `
                .bpx-player-postpanel-sug, .bpx-player-postpanel-carousel, .bpx-player-postpanel-popup {
                    display: none !important;
                }`,
        }),
        // 非全屏下 关闭弹幕栏
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-sending-area',
            description: '非全屏下 关闭弹幕栏 (刷新去黑边)',
            itemFunc: overridePlayerHeight,
            // video page的player height由JS动态设定
            itemCSS: `.bpx-player-sending-area {display: none !important;}
                /* 活动播放器直接去黑边 */
                .page-main-content:has(.festival-video-player) .video-player-box {height: fit-content !important;}
                .festival-video-player {height: fit-content !important;}
                .festival-video-player #bilibili-player:not(.mode-webscreen) {height: calc(100% - 46px) !important;}`,
        }),
        // 全屏下 关闭弹幕输入框
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-video-inputbar',
            description: '全屏下 关闭弹幕输入框',
            itemCSS: `.bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar {
                    display: none !important;
                }
                .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center {
                    padding: 0 15px !important;
                }
                /* 弹幕开关按钮贴紧左侧, 有章节列表时增大列表宽度 */
                .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left {
                    min-width: unset !important;
                }
                .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,
                .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint {
                    width: fit-content !important;
                }`,
        }),
    ]
    videoGroupList.push(new Group('video-danmaku', '弹幕栏', danmakuItems))
}

if (isPageVideo() || isPagePlaylist()) {
    // 视频下方
    const toolbarItems = [
        // 隐藏 分享按钮弹出菜单, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-video-share-popover',
            description: '隐藏 分享按钮弹出菜单',
            defaultStatus: true,
            itemCSS: `.video-share-popover {display: none !important;}`,
        }),
        // 隐藏 官方AI总结
        new CheckboxItem({
            itemID: 'video-page-hide-below-info-video-ai-assistant',
            description: '隐藏 官方AI总结',
            itemCSS: `.video-toolbar-right .video-ai-assistant {display: none !important;}`,
        }),
        // 隐藏 记笔记
        new CheckboxItem({
            itemID: 'video-page-hide-below-info-video-note',
            description: '隐藏 记笔记',
            itemCSS: `.video-toolbar-right .video-note {display: none !important;}`,
        }),
        // 隐藏 举报/笔记/稍后再看
        new CheckboxItem({
            itemID: 'video-page-hide-below-info-video-report-menu',
            description: '隐藏 举报/笔记/稍后再看',
            itemCSS: `.video-toolbar-right .video-tool-more {display: none !important;}`,
        }),
        // 隐藏 视频简介
        new CheckboxItem({
            itemID: 'video-page-hide-below-info-desc',
            description: '隐藏 视频简介',
            itemCSS: `#v_desc {display: none !important;}
                /* 收藏夹和稍后再看 */
                .video-desc-container {display: none !important;}`,
        }),
        // 隐藏 tag列表
        new CheckboxItem({
            itemID: 'video-page-hide-below-info-tag',
            description: '隐藏 tag列表',
            itemCSS: `#v_tag {display: none !important;}
                /* 收藏夹和稍后再看 */
                .video-tag-container {display: none !important;}`,
        }),
        // 隐藏 活动宣传, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-below-activity-vote',
            description: '隐藏 活动宣传',
            defaultStatus: true,
            itemCSS: `#activity_vote {display: none !important;}`,
        }),
        // 隐藏 广告banner, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-below-bannerAd',
            description: '隐藏 广告banner',
            defaultStatus: true,
            itemCSS: `#bannerAd {display: none !important;}`,
        }),
        // 隐藏 投票
        new CheckboxItem({
            itemID: 'video-page-hide-top-vote-card',
            description: '隐藏 投票',
            itemCSS: `.comment-container .top-vote-card {display: none !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-toolbar', '视频下方 工具/简介/Tag', toolbarItems))

    // up主信息
    const upInfoItems = [
        // 隐藏 给UP发消息, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-up-sendmsg',
            description: '隐藏 给UP发消息',
            defaultStatus: true,
            itemCSS: `.up-detail .send-msg {display: none !important;}`,
        }),
        // 隐藏 UP简介
        new CheckboxItem({
            itemID: 'video-page-hide-up-description',
            description: '隐藏 UP简介',
            itemCSS: `.up-detail .up-description {display: none !important;}`,
        }),
        // 隐藏 充电
        new CheckboxItem({
            itemID: 'video-page-hide-up-charge',
            description: '隐藏 充电',
            itemCSS: `.upinfo-btn-panel .new-charge-btn, .upinfo-btn-panel .old-charge-btn {display: none !important;}`,
        }),
        // 隐藏 UP主头像外饰品
        new CheckboxItem({
            itemID: 'video-page-hide-up-bili-avatar-pendent-dom',
            description: '隐藏 UP主头像外饰品',
            itemCSS: `.up-info-container .bili-avatar-pendent-dom {display: none !important;}
                .up-avatar-wrap .up-avatar {background-color: transparent !important;}`,
        }),
        // 隐藏 创作团队header, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-up-membersinfo-normal-header',
            description: '隐藏 创作团队header',
            defaultStatus: true,
            itemCSS: `.membersinfo-normal .header {display: none !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-up-info', '右侧 UP主信息', upInfoItems))

    // 右侧视频栏
    const rightItems = [
        // 隐藏 广告, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-ad',
            description: '隐藏 广告',
            defaultStatus: true,
            itemCSS: `#slide_ad {display: none !important;}
                .ad-report.video-card-ad-small {display: none !important;}
                .video-page-special-card-small {display: none !important;}
                #reco_list {margin-top: 0 !important;}`,
        }),
        // 隐藏 游戏推荐
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-video-page-game-card-small',
            description: '隐藏 游戏推荐',
            itemCSS: `#reco_list .video-page-game-card-small {display: none !important;}`,
        }),
        // 隐藏 弹幕列表, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-danmaku',
            description: '隐藏 弹幕列表',
            defaultStatus: true,
            itemCSS: `
                /* 不可使用 display:none 否则播放器宽屏模式下danmukuBox的margin-top失效，导致视频覆盖右侧列表 */
                #danmukuBox {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin-bottom: 0 !important;
                }`,
        }),
        // 隐藏 自动连播按钮
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-reco-list-next-play-next-button',
            description: '隐藏 自动连播按钮',
            itemCSS: `#reco_list .next-play .next-button {display: none !important;}`,
        }),
        // 视频合集 增加合集列表高度, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-section-height',
            description: '视频合集 增加合集列表高度',
            defaultStatus: true,
            itemCSS: `.base-video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important;}
                .video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important;}`,
        }),
        // 隐藏 视频合集 自动连播
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-section-next-btn',
            description: '隐藏 视频合集 自动连播',
            itemCSS: `.base-video-sections-v1 .next-button {display: none !important;}
                .video-sections-head_first-line .next-button {display: none !important;}`,
        }),
        // 隐藏 视频合集 播放量
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-section-play-num',
            description: '隐藏 视频合集 播放量',
            itemCSS: `.base-video-sections-v1 .play-num {display: none !important;}
                .video-sections-head_second-line .play-num {display: none !important;}`,
        }),
        // 隐藏 视频合集 简介, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-section-abstract',
            description: '隐藏 视频合集 简介',
            defaultStatus: true,
            itemCSS: `.base-video-sections-v1 .abstract {display: none !important;}
                .base-video-sections-v1 .second-line_left img {display: none !important;}
                .video-sections-head_second-line .abstract {display: none !important;}
                .video-sections-head_second-line .second-line_left img {display: none !important;}`,
        }),
        // 隐藏 视频合集 订阅合集
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-section-subscribe',
            description: '隐藏 视频合集 订阅合集',
            itemCSS: `.base-video-sections-v1 .second-line_right {display: none !important;}
                .video-sections-head_second-line .second-line_right {display: none !important;}`,
        }),
        // 隐藏 分P视频 自动连播
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-multi-page-next-btn',
            description: '隐藏 分P视频 自动连播',
            itemCSS: `#multi_page .next-button {display: none !important;}`,
        }),
        // 隐藏 相关视频 视频时长
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-duration',
            description: '隐藏 相关视频 视频时长',
            itemCSS: `#reco_list .duration {display: none !important;}
                /* 适配watchlater, favlist */
                .recommend-list-container .duration {display: none !important;}`,
        }),
        // 隐藏 相关视频 稍后再看按钮
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-reco-list-watch-later-video',
            description: '隐藏 相关视频 稍后再看按钮',
            itemCSS: `#reco_list .watch-later-video {display: none !important;}
                /* 适配watchlater, favlist */
                .recommend-list-container .watch-later-video {display: none !important;}`,
        }),
        // 隐藏 相关视频 UP主
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-reco-list-rec-list-info-up',
            description: '隐藏 相关视频 UP主',
            itemCSS: `#reco_list .info .upname {
                    display: none !important;
                }
                #reco_list .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                /* 适配watchlater, favlist */
                .recommend-list-container .info .upname {
                    display: none !important;
                }
                .recommend-list-container .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }`,
        }),
        // 隐藏 相关视频 播放和弹幕
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-reco-list-rec-list-info-plays',
            description: '隐藏 相关视频 播放和弹幕',
            itemCSS: `#reco_list .info .playinfo {
                    display: none !important;
                }
                #reco_list .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                /* 适配watchlater, favlist */
                .recommend-list-container .info .playinfo {
                    display: none !important;
                }
                .recommend-list-container .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }`,
        }),
        // 隐藏 相关视频 全部列表
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-reco-list-rec-list',
            description: '隐藏 相关视频 全部列表',
            itemCSS: `#reco_list .rec-list {display: none !important;}
                #reco_list .rec-footer {display: none !important;}
                /* 适配watchlater, favlist */
                .recommend-list-container {display: none !important;}`,
        }),
        // 隐藏 活动banner, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-right-bottom-banner',
            description: '隐藏 活动banner',
            defaultStatus: true,
            itemCSS: `#right-bottom-banner {display: none !important;}`,
        }),
        // 隐藏 直播间推荐, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-live',
            description: '隐藏 直播间推荐',
            defaultStatus: true,
            itemCSS: `.right-container .pop-live-small-mode {display: none !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-right', '右侧 视频栏', rightItems))

    // 评论区
    const commentItems = [
        // 隐藏 活动/notice, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-notice',
            description: '隐藏 活动/notice',
            defaultStatus: true,
            itemCSS: `.comment-container .reply-header .reply-notice {display: none !important;}`,
        }),
        // 隐藏 整个评论框
        new CheckboxItem({
            itemID: 'video-page-hide-main-reply-box',
            description: '隐藏 整个评论框',
            // 不可使用display: none, 会使底部吸附评论框宽度变化
            itemCSS: `.comment-container .main-reply-box {height: 0 !important; visibility: hidden !important;}
                .comment-container .reply-list {margin-top: -20px !important;}`,
        }),
        // 隐藏 页面底部 吸附评论框, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-fixed-reply-box',
            description: '隐藏 页面底部 吸附评论框',
            defaultStatus: true,
            itemCSS: `.comment-container .fixed-reply-box {display: none !important;}`,
        }),
        // 隐藏 评论编辑器内占位文字, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-box-textarea-placeholder',
            description: '隐藏 评论编辑器内占位文字',
            defaultStatus: true,
            itemCSS: `.main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
                .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`,
        }),
        // 隐藏 评论内容右侧装饰
        new CheckboxItem({
            itemID: 'video-page-hide-reply-decorate',
            description: '隐藏 评论内容右侧装饰',
            itemCSS: `.comment-container .reply-decorate {display: none !important;}`,
        }),
        // 隐藏 ID后粉丝牌
        new CheckboxItem({
            itemID: 'video-page-hide-fan-badge',
            description: '隐藏 ID后粉丝牌',
            itemCSS: `.comment-container .fan-badge {display: none !important;}`,
        }),
        // 隐藏 一级评论用户等级
        new CheckboxItem({
            itemID: 'video-page-hide-user-level',
            description: '隐藏 一级评论用户等级',
            itemCSS: `.comment-container .user-level {display: none !important;}`,
        }),
        // 隐藏 二级评论用户等级
        new CheckboxItem({
            itemID: 'video-page-hide-sub-user-level',
            description: '隐藏 二级评论用户等级',
            itemCSS: `.comment-container .sub-user-level {display: none !important;}`,
        }),
        // 隐藏 用户头像外圈饰品
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-pendent-dom',
            description: '隐藏 用户头像外圈饰品',
            itemCSS: `.comment-container .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            .comment-container .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`,
        }),
        // 隐藏 用户头像右下小icon
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-nft-icon',
            description: '隐藏 用户头像右下小icon',
            itemCSS: `.comment-container .bili-avatar-nft-icon {display: none !important;}
                .comment-container .bili-avatar-icon {display: none !important;}`,
        }),
        // 隐藏 用户投票 (红方/蓝方)
        new CheckboxItem({
            itemID: 'video-page-hide-vote-info',
            description: '隐藏 用户投票 (红方/蓝方)',
            itemCSS: `.comment-container .vote-info {display: none !important;}`,
        }),
        // 隐藏 评论内容下tag(UP觉得很赞)
        new CheckboxItem({
            itemID: 'video-page-hide-reply-tag-list',
            description: '隐藏 评论内容下tag(UP觉得很赞)',
            itemCSS: `.comment-container .reply-tag-list {display: none !important;}`,
        }),
        // 隐藏 笔记评论前的小Logo, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-note-prefix',
            description: '隐藏 笔记评论前的小Logo',
            defaultStatus: true,
            itemCSS: `.comment-container .note-prefix {display: none !important;}`,
        }),
        // 隐藏 评论内容搜索关键词高亮, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-jump-link-search-word',
            description: '隐藏 评论内容搜索关键词高亮',
            defaultStatus: true,
            itemCSS: `.comment-container .reply-content .jump-link.search-word {color: inherit !important;}
                .comment-container .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
                .comment-container .reply-content .icon.search-word {display: none !important;}`,
        }),
        // 隐藏 二级评论中的@高亮
        new CheckboxItem({
            itemID: 'video-page-hide-reply-content-user-highlight',
            description: '隐藏 二级评论中的@高亮',
            itemCSS: `.comment-container .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                .comment-container .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`,
        }),
        // 隐藏 召唤AI机器人的评论, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-at-reply-at-bots',
            description: '隐藏 召唤AI机器人的评论',
            defaultStatus: true,
            itemCSS:
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
                // 9868463 @AI头脑风暴
                // 358243654 @GPT_5
                // 393788832 @Juice_AI
                // 91394217 @AI全文总结
                // 473018527 @AI视频总结
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
                .reply-item:has(.jump-link.user[data-user-id="1835753760"]),
                .reply-item:has(.jump-link.user[data-user-id="9868463"]),
                .reply-item:has(.jump-link.user[data-user-id="358243654"]),
                .reply-item:has(.jump-link.user[data-user-id="393788832"]),
                .reply-item:has(.jump-link.user[data-user-id="91394217"]),
                .reply-item:has(.jump-link.user[data-user-id="473018527"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 AI机器人发布的评论
        new CheckboxItem({
            itemID: 'video-page-hide-bots-reply',
            description: '隐藏 AI机器人发布的评论',
            defaultStatus: false,
            itemCSS:
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
                // 9868463 @AI头脑风暴
                // 358243654 @GPT_5
                // 393788832 @Juice_AI
                // 91394217 @AI全文总结
                // 473018527 @AI视频总结
                `.reply-item:has(.root-reply-container .user-name[data-user-id="8455326"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="234978716"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1141159409"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="437175450"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1692825065"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="690155730"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="689670224"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="3494380876859618"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1168527940"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="439438614"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1358327273"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="3546376048741135"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1835753760"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="9868463"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="358243654"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="393788832"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="91394217"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="473018527"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 包含@的 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-at-reply',
            description: '隐藏 包含@的 无人点赞评论',
            itemCSS: `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 包含@的 全部评论
        new CheckboxItem({
            itemID: 'video-page-hide-at-reply-all',
            description: '隐藏 包含@的 全部评论',
            itemCSS: `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`,
        }),
        // 隐藏 LV1 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv1-reply',
            description: '隐藏 LV1 无人点赞评论',
            itemCSS: `.comment-container .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 LV2 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv2-reply',
            description: '隐藏 LV2 无人点赞评论',
            itemCSS: `.comment-container .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 LV3 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv3-reply',
            description: '隐藏 LV3 无人点赞评论',
            itemCSS: `.comment-container .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 一级评论 踩/回复 只在hover时显示, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-root-reply-dislike-reply-btn',
            description: '一级评论 踩/回复 只在hover时显示',
            defaultStatus: true,
            itemCSS: `.comment-container .reply-info:not(:has(i.disliked)) .reply-btn,
                .comment-container .reply-info:not(:has(i.disliked)) .reply-dislike {
                    visibility: hidden;
                }
                .comment-container .reply-item:hover .reply-btn,
                .comment-container .reply-item:hover .reply-dislike {
                    visibility: visible !important;
                }`,
        }),
        // 二级评论 踩/回复 只在hover时显示, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-sub-reply-dislike-reply-btn',
            description: '二级评论 踩/回复 只在hover时显示',
            defaultStatus: true,
            itemCSS: `.comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
                .comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                    visibility: hidden;
                }
                .comment-container .sub-reply-item:hover .sub-reply-btn,
                .comment-container .sub-reply-item:hover .sub-reply-dislike {
                    visibility: visible !important;
                }`,
        }),
        // 隐藏 大表情
        new CheckboxItem({
            itemID: 'video-page-hide-emoji-large',
            description: '隐藏 大表情',
            itemCSS: `.comment-container .emoji-large {display: none !important;}`,
        }),
        // 大表情变成小表情
        new CheckboxItem({
            itemID: 'video-page-hide-emoji-large-zoom',
            description: '大表情变成小表情',
            itemCSS: `.comment-container .emoji-large {zoom: .5;}`,
        }),
        // 用户名 全部大会员色
        new CheckboxItem({
            itemID: 'video-page-reply-user-name-color-pink',
            description: '用户名 全部大会员色',
            itemCSS: `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}}`,
        }),
        // 用户名 全部恢复默认色
        new CheckboxItem({
            itemID: 'video-page-reply-user-name-color-default',
            description: '用户名 全部恢复默认色',
            itemCSS: `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}}`,
        }),
        // 笔记图片 查看大图优化, 默认开启
        new CheckboxItem({
            itemID: 'video-page-reply-view-image-optimize',
            description: '笔记图片 查看大图优化',
            defaultStatus: true,
            // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
            itemCSS: `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
                .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
                .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`,
        }),
        // 隐藏 整个评论区 #42
        new CheckboxItem({
            itemID: 'video-page-hide-comment',
            description: '隐藏 整个评论区',
            itemCSS: `#comment, #comment-module {display: none;}`,
        }),
    ]
    videoGroupList.push(new Group('video-comment', '评论区', commentItems))

    // 右下角
    const sidebarItems = [
        // 隐藏 小窗播放器
        new CheckboxItem({
            itemID: 'video-page-hide-sidenav-right-container-live',
            description: '隐藏 小窗播放器',
            itemCSS: `.fixed-sidenav-storage .mini-player-window {display: none !important;}
                /* 适配watchlater, favlist */
                .float-nav-exp .nav-menu .item.mini {display: none !important;}`,
        }),
        // 隐藏 客服, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-sidenav-customer-service',
            description: '隐藏 客服',
            defaultStatus: true,
            itemCSS: `.fixed-sidenav-storage .customer-service {display: none !important;}
                /* 适配watchlater, favlist */
                .float-nav-exp .nav-menu a:has(>.item.help) {display: none !important;}`,
        }),
        // 隐藏 回顶部
        new CheckboxItem({
            itemID: 'video-page-hide-sidenav-back-to-top',
            description: '隐藏 回顶部',
            itemCSS: `.fixed-sidenav-storage .back-to-top {display: none !important;}
                /* 适配watchlater, favlist */
                .float-nav-exp .nav-menu .item.backup {display: none !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-sidebar', '页面右下角 小按钮', sidebarItems))
}

export { videoGroupList }

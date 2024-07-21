import { Group } from '../components/group'
import { CheckboxItem, NumberItem } from '../components/item'
import { debugRules as debug, error } from '../utils/logger'
import { matchAvidBvid, matchBvid, waitForEle } from '../utils/tool'
import { isPageFestival, isPagePlaylist, isPageVideo } from '../utils/pageType'
import { GM_getValue, GM_setValue, unsafeWindow } from '$'
import URLCleanerInstance from '../utils/urlCleaner'
import { Shadow } from '../utils/shadow'

/** 宽屏模式监听 */
let _isWide = unsafeWindow.isWide
// 宽屏模式锁, 宽屏按钮单击后释放
let wideScreenLock = false
// 修改unsafeWindow.isWide时执行的函数列表
const onIsWideChangeFnArr: (() => void)[] = []
if (isPageVideo() || isPagePlaylist()) {
    Object.defineProperty(unsafeWindow, 'isWide', {
        get() {
            return _isWide
        },
        set(value) {
            _isWide = value || wideScreenLock
            if (typeof _isWide === 'boolean') {
                onIsWideChangeFnArr.forEach((func) => func())
            }
        },
        configurable: true,
        enumerable: true,
    })
    // 标记是否为宽屏模式，供播放设定功能的CSS使用
    onIsWideChangeFnArr.push(() => {
        if (unsafeWindow.isWide) {
            document.documentElement?.setAttribute('bili-cleaner-is-wide', '')
        } else {
            document.documentElement?.removeAttribute('bili-cleaner-is-wide')
        }
    })
}

// shadow DOM 评论区
const shadow = new Shadow([
    'bili-comments-header-renderer', // 评论区header(notice,编辑器)
    'bili-comment-textarea', // 主编辑器、底部编辑器输入框
    'bili-comment-renderer', // 一级评论
    'bili-comment-user-info', // 一级二级评论用户信息
    'bili-rich-text', // 一级二级评论内容
    'bili-avatar', // 头像
    'bili-photoswipe', // 全屏图片查看(笔记图片)
    'bili-user-profile', // 用户卡片
    'bili-comment-user-medal', // 昵称后勋章
    'bili-comment-action-buttons-renderer', // 赞踩回复按钮区域
    'bili-comment-reply-renderer', // 单个二级评论
    // 'bili-comments', // 评论区板块
    // 'bili-comments-notice', // 活动通知notice
    // 'bili-comment-box', // 主编辑器、底部编辑器
    // 'bili-comment-thread-renderer', // 评论（含回复）
    // 'bili-comment-replies-renderer', // 多个二级评论
    // 'bili-comment-user-sailing-card', // 一级评论右侧饰品
])

const disableAdjustVolume = () => {}

const videoGroupList: Group[] = []

// 普通播放页，稍后再看播放页，收藏夹播放页
if (isPageVideo() || isPagePlaylist()) {
    // 基本功能
    const basicItems = [
        // BV号转AV号, 在url变化时需重载, 关闭功能需刷新
        new CheckboxItem({
            itemID: 'video-page-bv2av',
            description: 'BV号转AV号',
            enableFunc: async () => {
                const bv2av = (url: string): string => {
                    /**
                     * algo by bilibili-API-collect
                     * @see https://www.zhihu.com/question/381784377/answer/1099438784
                     * @see https://github.com/SocialSisterYi/bilibili-API-collect/issues/740
                     * @see https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/bvid_desc.html
                     * @param bvid 输入BV号
                     * @returns 输出纯数字av号
                     */
                    const XOR_CODE = 23442827791579n
                    const MASK_CODE = 2251799813685247n
                    const BASE = 58n
                    const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf'
                    const dec = (bvid: string): number => {
                        const bvidArr = Array.from<string>(bvid)
                        ;[bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]]
                        ;[bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]]
                        bvidArr.splice(0, 3)
                        const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n)
                        return Number((tmp & MASK_CODE) ^ XOR_CODE)
                    }

                    try {
                        if (url.includes('bilibili.com/video/BV')) {
                            const bvid = matchBvid(url)
                            if (bvid) {
                                // 保留query string中分P参数, anchor中reply定位
                                const urlObj = new URL(url)
                                const params = new URLSearchParams(urlObj.search)
                                let partNum = ''
                                if (params.has('p')) {
                                    partNum += `?p=${params.get('p')}`
                                }
                                const aid = dec(bvid)
                                if (partNum || urlObj.hash) {
                                    return `https://www.bilibili.com/video/av${aid}/${partNum}${urlObj.hash}`
                                }
                                return `https://www.bilibili.com/video/av${aid}`
                            }
                        }
                        return url
                    } catch (err) {
                        return url
                    }
                }
                URLCleanerInstance.cleanFnArr.push(bv2av)
                URLCleanerInstance.clean()
            },
        }),
        // 净化分享, 默认开启, 关闭功能需刷新
        new CheckboxItem({
            itemID: 'video-page-simple-share',
            description: '净化分享功能',
            defaultStatus: true,
            itemCSS: `
                .video-share-popover .video-share-dropdown .dropdown-bottom {display: none !important;}
                .video-share-popover .video-share-dropdown .dropdown-top {padding: 15px !important;}
                .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-right {display: none !important;}
                .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-left {padding-right: 0 !important;}
            `,
            // 净化分享按钮功能
            enableFunc: async () => {
                // 监听shareBtn出现
                let counter = 0
                const id = setInterval(() => {
                    counter++
                    const shareBtn = document.getElementById('share-btn-outer')
                    if (shareBtn) {
                        // 新增click事件
                        // 若replace element, 会在切换视频后无法更新视频分享数量, 故直接新增click事件覆盖剪贴板
                        shareBtn.addEventListener('click', () => {
                            let title = document.querySelector(
                                '.video-info-title .video-title, #viewbox_report > h1, .video-title-href',
                            )?.textContent
                            if (title && !title.match(/^[（【［《「＜｛〔〖〈『].*|.*[）】］》」＞｝〕〗〉』]$/)) {
                                title = `【${title}】`
                            }
                            // 匹配av号, BV号, 分P号
                            const avbv = matchAvidBvid(location.href)
                            let shareText = title
                                ? `${title} \nhttps://www.bilibili.com/video/${avbv}`
                                : `https://www.bilibili.com/video/${avbv}`
                            const urlObj = new URL(location.href)
                            const params = new URLSearchParams(urlObj.search)
                            if (params.has('p')) {
                                shareText += `?p=${params.get('p')}`
                            }
                            navigator.clipboard.writeText(shareText).then().catch()
                        })
                        clearInterval(id)
                    } else if (counter > 50) {
                        clearInterval(id)
                    }
                }, 200)
            },
            enableFuncRunAt: 'document-end',
        }),
        // 顶栏 滚动页面后不再吸附顶部
        new CheckboxItem({
            itemID: 'video-page-hide-fixed-header',
            description: '顶栏 滚动页面后不再吸附顶部',
            itemCSS: `.fixed-header .bili-header__bar {position: relative !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-basic', '播放页 基本功能', basicItems))

    // 播放设定
    const playerInitItems = [
        // 默认宽屏播放
        new CheckboxItem({
            itemID: 'default-widescreen',
            description: '默认宽屏播放 刷新生效',
            itemCSS: `
                /* 修复mini播放模式主播放器宽度支撑问题 */
                html[bili-cleaner-is-wide] #playerWrap:has(.bpx-player-container[data-screen="mini"]) {
                    width: fit-content;
                }
            `,
            enableFunc: async () => {
                wideScreenLock = true
                unsafeWindow.isWide = true
                const listener = () => {
                    window.scrollTo(0, 64)
                    // 监听宽屏按钮出现
                    waitForEle(document.body, '.bpx-player-ctrl-wide', (node: HTMLElement): boolean => {
                        return node.className.includes('bpx-player-ctrl-wide')
                    }).then((wideBtn) => {
                        if (wideBtn) {
                            wideBtn.click()
                            wideScreenLock = false
                        }
                    })
                }
                document.addEventListener('DOMContentLoaded', listener)
            },
            disableFunc: async () => {
                wideScreenLock = false
            },
        }),
        // 网页全屏时 页面可滚动
        new CheckboxItem({
            itemID: 'webscreen-scrollable',
            description: '网页全屏时 页面可滚动 滚轮调音量失效\n（Firefox 不适用）',
            itemCSS: `
                .webscreen-fix {
                    position: unset;
                    top: unset;
                    left: unset;
                    margin: unset;
                    padding: unset;
                    width: unset;
                    height: unset;
                }
                .webscreen-fix #biliMainHeader {
                    display: none;
                }
                .webscreen-fix #mirror-vdcon {
                    box-sizing: content-box;
                    position: relative;
                }
                .webscreen-fix #danmukuBox {
                    margin-top: 0 !important;
                }
                .webscreen-fix :is(.left-container, .playlist-container--left) {
                    position: static !important;
                    padding-top: 100vh;
                    min-width: 56vw !important;
                }
                .webscreen-fix :is(.left-container, .playlist-container--left) .video-info-container {
                    height: fit-content;
                }
                .webscreen-fix :is(.left-container, .playlist-container--left) #bilibili-player.mode-webscreen {
                    position: static;
                    border-radius: unset;
                    z-index: unset;
                    left: unset;
                    top: unset;
                    width: 100%;
                    height: 100%;
                }
                .webscreen-fix :is(.left-container, .playlist-container--left) #playerWrap {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    height: 100vh;
                    width: 100vw;
                    padding-right: 0;
                }
                .webscreen-fix :is(.right-container, .playlist-container--right) {
                    padding-top: 100vh;
                }
                /* 隐藏小窗 */
                .webscreen-fix .float-nav-exp .nav-menu .item.mini,
                .webscreen-fix .fixed-sidenav-storage .mini-player-window {
                    display: none !important;
                }
                /* 滚动条 */
                .webscreen-fix::-webkit-scrollbar {
                    display: none !important;
                }
                /* firefox滚动条 */
                @-moz-document url-prefix() {
                    html:has(.webscreen-fix), body.webscreen-fix {
                        scrollbar-width: none !important;
                    }
                }
            `,
            enableFunc: async () => {
                // 禁用滚动调音量, firefox不生效
                document.removeEventListener('wheel', disableAdjustVolume)
                document.addEventListener('wheel', disableAdjustVolume)

                // 监听网页全屏按钮出现
                waitForEle(document.body, '.bpx-player-ctrl-web', (node: HTMLElement): boolean => {
                    return node.className.includes('bpx-player-ctrl-web')
                }).then((webBtn) => {
                    if (webBtn) {
                        webBtn.addEventListener('click', () => {
                            if (webBtn.classList.contains('bpx-state-entered')) {
                                window.scrollTo(0, 0)
                            }
                        })
                    }
                })
            },
            enableFuncRunAt: 'document-end',
            disableFunc: async () => document.removeEventListener('wheel', disableAdjustVolume),
        }),
        // 全屏时 页面可滚动
        new CheckboxItem({
            itemID: 'fullscreen-scrollable',
            description: '全屏时 页面可滚动 滚轮调音量失效\n（实验功能，Firefox 不适用）',
            itemCSS: `
                .webscreen-fix {
                    position: unset;
                    top: unset;
                    left: unset;
                    margin: unset;
                    padding: unset;
                    width: unset;
                    height: unset;
                }
                .webscreen-fix #biliMainHeader {
                    display: none;
                }
                .webscreen-fix #mirror-vdcon {
                    box-sizing: content-box;
                    position: relative;
                }
                .webscreen-fix #danmukuBox {
                    margin-top: 0 !important;
                }
                .webscreen-fix :is(.left-container, .playlist-container--left) {
                    position: static !important;
                    padding-top: 100vh;
                    min-width: 56vw !important;
                }
                .webscreen-fix :is(.left-container, .playlist-container--left) .video-info-container {
                    height: fit-content;
                }
                .webscreen-fix :is(.left-container, .playlist-container--left) #bilibili-player.mode-webscreen {
                    position: static;
                    border-radius: unset;
                    z-index: unset;
                    left: unset;
                    top: unset;
                    width: 100%;
                    height: 100%;
                }
                .webscreen-fix :is(.left-container, .playlist-container--left) #playerWrap {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    height: 100vh;
                    width: 100vw;
                    padding-right: 0;
                }
                .webscreen-fix :is(.right-container, .playlist-container--right) {
                    padding-top: 100vh;
                }
                /* 隐藏小窗 */
                .webscreen-fix .float-nav-exp .nav-menu .item.mini,
                .webscreen-fix .fixed-sidenav-storage .mini-player-window {
                    display: none !important;
                }
                /* 滚动条 */
                .webscreen-fix::-webkit-scrollbar {
                    display: none !important;
                }
                /* firefox滚动条 */
                @-moz-document url-prefix() {
                    html:has(.webscreen-fix), body.webscreen-fix {
                        scrollbar-width: none !important;
                    }
                }
            `,
            enableFunc: async () => {
                if (!navigator.userAgent.toLocaleLowerCase().includes('chrome')) {
                    return
                }
                // 禁用滚动调音量
                document.removeEventListener('wheel', disableAdjustVolume)
                document.addEventListener('wheel', disableAdjustVolume)

                let cnt = 0
                const id = setInterval(() => {
                    const webBtn = document.body.querySelector(
                        '.bpx-player-ctrl-btn.bpx-player-ctrl-web',
                    ) as HTMLElement
                    const fullBtn = document.body.querySelector(
                        '.bpx-player-ctrl-btn.bpx-player-ctrl-full',
                    ) as HTMLElement
                    if (webBtn && fullBtn) {
                        clearInterval(id)

                        const isFullScreen = (): 'ele' | 'f11' | 'not' => {
                            if (document.fullscreenElement) {
                                // 由元素申请的全屏
                                return 'ele'
                            } else if (window.innerWidth === screen.width && window.innerHeight === screen.height) {
                                // 用户F11的全屏
                                return 'f11'
                            } else {
                                // 非全屏
                                return 'not'
                            }
                        }

                        const isWebScreen = (): boolean => {
                            return webBtn.classList.contains('bpx-state-entered')
                        }

                        // 全屏可滚动 = 网页全屏功能 + html/body元素申请全屏
                        const newFullBtn = fullBtn.cloneNode(true)
                        newFullBtn.addEventListener('click', () => {
                            switch (isFullScreen()) {
                                case 'ele':
                                    if (isWebScreen()) {
                                        // 退出网页全屏，自动退出全屏
                                        webBtn.click()
                                    } else {
                                        document.exitFullscreen().then().catch()
                                    }
                                    break
                                case 'f11':
                                    // f11全屏模式
                                    webBtn.click()
                                    break
                                case 'not':
                                    // 申请可滚动全屏
                                    document.documentElement.requestFullscreen().then().catch()
                                    if (!isWebScreen()) {
                                        webBtn.click()
                                    }
                                    window.scrollTo(0, 0)
                                    break
                            }
                        })
                        fullBtn.parentElement?.replaceChild(newFullBtn, fullBtn)
                    } else {
                        cnt++
                        cnt > 50 && clearInterval(id)
                    }
                }, 200)
            },
            enableFuncRunAt: 'document-end',
            disableFunc: async () => document.removeEventListener('wheel', disableAdjustVolume),
        }),
        // 播放器和视频标题 交换位置
        new CheckboxItem({
            itemID: 'video-page-exchange-player-position',
            description: '播放器和视频信息 交换位置',
            itemCSS: `
                body:not(.webscreen-fix) :is(.left-container, .playlist-container--left) {
                    display: flex !important;
                    flex-direction: column !important;
                    padding-top: 35px !important;
                }
                body:not(.webscreen-fix) :is(.left-container, .playlist-container--left) > * {
                    order: 1;
                }
                body:not(.webscreen-fix) #playerWrap {
                    order: 0 !important;
                    z-index: 1;
                }
                body:not(.webscreen-fix) .video-info-container {
                    height: auto !important;
                    padding-top: 16px !important;
                    /* 高权限消除展开标题的间距 */
                    margin-bottom: 0 !important;
                }

                /* fix #80 宽屏模式下播放器遮盖up主 */
                html[bili-cleaner-is-wide] body:not(.webscreen-fix) .up-panel-container {
                    position: relative !important;
                    /*
                        拟合魔法，勿动
                        videoWidth = innerWidth * 0.962339 - 359.514px
                        videoHeight = max(min(calc(innerWidth * 0.962339 - 359.514px), 2010px), 923px) * 9/16 + 46px
                    */
                    margin-top: calc(max(min(calc(100vw * 0.962339 - 359.514px), 2010px), 923px) * 9 / 16 + 46px + 35px);
                }
                html[bili-cleaner-is-wide] body:not(.webscreen-fix) #danmukuBox {
                    margin-top: 0 !important;
                }
            `,
        }),
        // 普通播放 视频宽度调节
        new NumberItem({
            itemID: 'normalscreen-width',
            description: '普通播放 视频宽度调节（-1禁用）',
            defaultValue: -1,
            minValue: -1,
            maxValue: 100,
            disableValue: -1,
            unit: 'vw',
            itemCSS: `
                /* 魔法, 勿动 */
                :root {
                    --normal-width: min(calc(100vw - 400px), ???vw);
                    --normal-height: calc(min(calc(100vw - 400px), ???vw) * 9 / 16);
                }

                #bilibili-player-placeholder {
                    visibility: hidden !important;
                }

                /*
                    需避免右侧视频预览 inline player 影响
                    data-screen变化慢, 播放模式判断一律用:not(), 使用html元素的bili-cleaner-is-wide加快wide模式判断
                */
                /* 左列basis宽度 */
                html:not([bili-cleaner-is-wide]) :is(.left-container, .playlist-container--left):has(.bpx-player-container:not([data-screen="wide"], [data-screen="web"], [data-screen="full"])) {
                    flex-basis: var(--normal-width);
                }
                /* 播放器长宽限制 */
                html:not([bili-cleaner-is-wide]) :is(.left-container, .playlist-container--left):has(.bpx-player-container:not([data-screen="wide"], [data-screen="web"], [data-screen="full"], [data-screen="mini"])) :is(.bpx-player-video-area, video) {
                    width: 100% !important;
                    height: var(--normal-height) !important;
                    min-height: var(--normal-height) !important;
                    max-height: var(--normal-height) !important;
                }
                /* 播放器外层 */
                html:not([bili-cleaner-is-wide]) :is(.left-container, .playlist-container--left):has(.bpx-player-container:not([data-screen="wide"], [data-screen="web"], [data-screen="full"], [data-screen="mini"])) :is(.bpx-player-primary-area, .bpx-player-container, .bpx-docker-major, #bilibili-player, #playerWrap) {
                    width: var(--normal-width);
                    height: fit-content;
                    max-height: calc(var(--normal-height) + 56px);
                }
                /* 普通mini模式 主播放器支撑 */
                html:not([bili-cleaner-is-wide]) #playerWrap:has(.bpx-player-container[data-screen="mini"]) {
                    background-color: transparent;
                    width: var(--normal-width);
                    height: calc(var(--normal-height) + 46px);
                    min-height: var(--normal-height);
                    max-height: calc(var(--normal-height) + 56px);
                    position: relative;
                }
                html:not([bili-cleaner-is-wide]) #playerWrap:has(.bpx-player-container[data-screen="mini"])::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: calc(100% - 46px);
                    background-color: black;
                }
                /* 宽屏mini模式 主播放器支撑 */
                html[bili-cleaner-is-wide] #playerWrap:has(.bpx-player-container[data-screen="mini"]) {
                    background-color: transparent;
                    width: fit-content;
                    position: relative;
                }
                html[bili-cleaner-is-wide] #playerWrap:has(.bpx-player-container[data-screen="mini"])::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: calc(100% - 46px);
                    background-color: black;
                }
            `,
            itemCSSPlaceholder: '???',
        }),
    ]
    videoGroupList.push(new Group('player-mode', '播放设定', playerInitItems))

    // 视频信息
    const infoItems = [
        // 展开 多行视频标题
        new CheckboxItem({
            itemID: 'video-page-unfold-video-info-title',
            description: '展开 多行视频标题',
            itemCSS: `
                .video-info-container:has(.show-more) {
                    height: fit-content !important;
                    margin-bottom: 12px;
                }
                .video-info-container .video-info-title-inner-overflow .video-title {
                    margin-right: unset !important;
                    text-wrap: wrap !important;
                }
                .video-info-container .video-info-title-inner .video-title .video-title-href {
                    text-wrap: wrap !important;
                }
                .video-info-container .show-more {
                    display: none !important;
                }
            `,
        }),
        // 隐藏 弹幕数
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-danmaku-count',
            description: '隐藏 弹幕数',
            itemCSS: `:is(.video-info-detail, .video-info-meta) .dm {display: none !important;}`,
        }),
        // 隐藏 发布日期
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-pubdate',
            description: '隐藏 发布日期',
            itemCSS: `:is(.video-info-detail, .video-info-meta) .pubdate-ip {display: none !important;}`,
        }),
        // 隐藏 版权声明
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-copyright',
            description: '隐藏 版权声明',
            itemCSS: `:is(.video-info-detail, .video-info-meta) .copyright {display: none !important;}`,
        }),
        // 隐藏 视频荣誉(排行榜/每周必看)
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-honor',
            description: '隐藏 视频荣誉(排行榜/每周必看)',
            itemCSS: `:is(.video-info-detail, .video-info-meta) .honor-rank, .v:is(ideo-info-detail, ideo-info-meta) .honor-weekly {display: none !important;}`,
        }),
        // 隐藏 温馨提示(饮酒/危险/AI生成), 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-video-info-argue',
            description: '隐藏 温馨提示(饮酒/危险/AI生成)',
            defaultStatus: true,
            itemCSS: `:is(.video-info-detail, .video-info-meta) :is(.argue, .video-argue) {display: none !important;}`,
        }),
    ]
    videoGroupList.push(new Group('video-info', '视频信息', infoItems))
}

// 部分适配拜年祭视频页(播放器、弹幕栏规则多数生效)
if (isPageVideo() || isPagePlaylist() || isPageFestival()) {
    // 播放器
    const playerItems = [
        // 隐藏 一键三连
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-guide-all',
            description: '隐藏 一键三连',
            itemCSS: `
                .bili-follow-to-electric,
                .bili-guide,
                .bili-guide-all,
                .bili-guide-animate,
                .bili-guide-cyc,
                .bili-guide-electric,
                .bili-guide-follow,
                .bili-guide-followed,
                .bili-danmaku-x-guide,
                .bili-danmaku-x-guide-all,
                .bili-danmaku-x-guide-follow,
                .bili-danmaku-x-guide-gray {
                    display: none !important;
                }`,
        }),
        // 隐藏 投票
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-vote',
            description: '隐藏 投票',
            itemCSS: `.bili-vote, .bili-danmaku-x-vote {display: none !important;}`,
        }),
        // 隐藏 播放效果调查, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-qoe-feedback',
            description: '隐藏 播放效果调查',
            defaultStatus: true,
            itemCSS: `
                .bili-qoeFeedback,
                .bili-qoeFeedback-score,
                .bili-qoeFeedback-vote {
                    display: none !important;
                }`,
        }),
        // 隐藏 评分
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-score',
            description: '隐藏 评分',
            itemCSS: `
                .bili-score, .bili-danmaku-x-score, .bili-danmaku-x-superRating {
                    display: none !important;
                }`,
        }),
        // 隐藏 评分总结
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-score-sum',
            description: '隐藏 评分总结',
            itemCSS: `.bili-scoreSum, .bili-danmaku-x-scoreSum {display: none !important;}`,
        }),
        // 隐藏 打卡
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-clock',
            description: '隐藏 打卡',
            itemCSS: `.bili-clock, .bili-danmaku-x-clock {display: none !important;}`,
        }),
        // 隐藏 视频预告
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-reserve',
            description: '隐藏 视频预告',
            itemCSS: `.bili-reserve, .bili-danmaku-x-reserve {display: none !important;}`,
        }),
        // 隐藏 视频链接
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-bili-link',
            description: '隐藏 视频链接 (稍后再看)',
            itemCSS: `.bili-link, .bili-danmaku-x-link {display: none !important;}`,
        }),
        // 隐藏 播放器内所有弹窗 (强制)
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-cmd-dm-inside',
            description: '隐藏 播放器内所有弹窗 (强制)',
            itemCSS: `.bpx-player-cmd-dm-inside {display: none !important;}`,
        }),
        // 隐藏 播放器内标题
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-top-left-title',
            description: '隐藏 播放器内标题',
            itemCSS: `.bpx-player-top-title {display: none !important;}
                .bpx-player-top-left-title {display: none !important;}
                /* 播放器上方阴影渐变 */
                .bpx-player-top-mask {display: none !important;}`,
        }),
        // 隐藏 左上角 视频音乐链接
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-top-left-music',
            description: '隐藏 视频音乐链接',
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
            itemCSS: `.bili-dm .bili-high-icon, .bili-danmaku-x-high-icon {display: none !important}`,
        }),
        // 彩色渐变弹幕 变成白色
        new CheckboxItem({
            itemID: 'video-page-bpx-player-bili-dm-vip-white',
            description: '彩色渐变弹幕 变成白色',
            itemCSS: `#bilibili-player .bili-dm>.bili-dm-vip, .bili-danmaku-x-dm-vip, .bili-danmaku-x-colorful {
                    background: unset !important;
                    background-image: unset !important;
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

    // 小窗播放器
    const miniPlayerItems = [
        // 隐藏底边进度
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-mini-mode-process',
            description: '隐藏底边进度',
            defaultStatus: true,
            itemCSS: `.bpx-player-container[data-screen=mini]:not(:hover) .bpx-player-mini-progress {display: none;}`,
        }),
        // 隐藏弹幕
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-mini-mode-danmaku',
            description: '隐藏弹幕',
            itemCSS: `.bpx-player-container[data-screen=mini] .bpx-player-row-dm-wrap {visibility: hidden !important;}`,
        }),
        // 滚轮调节大小
        new CheckboxItem({
            itemID: 'video-page-bpx-player-mini-mode-wheel-adjust',
            description: '滚轮调节大小',
            enableFunc: async () => {
                try {
                    const insertCSS = (zoom: number) => {
                        const cssText = `
                            .bpx-player-container[data-screen=mini] {
                                height: calc(225px * ${zoom}) !important;
                                width: calc(400px * ${zoom}) !important;
                            }
                            .bpx-player-container[data-revision="1"][data-screen=mini],
                            .bpx-player-container[data-revision="2"][data-screen=mini] {
                                height: calc(180px * ${zoom}) !important;
                                width: calc(320px * ${zoom}) !important;
                            }
                            @media screen and (min-width:1681px) {
                                .bpx-player-container[data-revision="1"][data-screen=mini],
                                .bpx-player-container[data-revision="2"][data-screen=mini] {
                                    height: calc(203px * ${zoom}) !important;
                                    width: calc(360px * ${zoom}) !important;
                                }
                            }`
                            .replace(/\n\s*/g, '')
                            .trim()
                        const node = document.querySelector(
                            `html>style[bili-cleaner-css=video-page-bpx-player-mini-mode-wheel-adjust]`,
                        )
                        if (node) {
                            node.innerHTML = cssText
                        } else {
                            const style = document.createElement('style')
                            style.innerHTML = cssText
                            style.setAttribute('bili-cleaner-css', 'video-page-bpx-player-mini-mode-wheel-adjust')
                            document.documentElement.appendChild(style)
                        }
                    }
                    // 载入上次缩放
                    const oldZoom: number | undefined = GM_getValue('BILICLEANER_video-page-bpx-player-mini-mode-zoom')
                    oldZoom && insertCSS(oldZoom)

                    // 等player出现
                    let cnt = 0
                    const interval = setInterval(() => {
                        const player = document.querySelector('.bpx-player-container') as HTMLElement | null
                        if (player) {
                            clearInterval(interval)
                            // 判断鼠标位置，消除大播放器内下拉页面影响小窗大小的bug
                            let flag = false
                            player.addEventListener('mouseenter', () => {
                                if (player.getAttribute('data-screen') === 'mini') {
                                    flag = true
                                }
                            })
                            player.addEventListener('mouseleave', () => {
                                flag = false
                            })
                            let lastZoom = oldZoom || 1
                            // 监听滚轮
                            player.addEventListener('wheel', (e) => {
                                if (flag) {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    const scaleSpeed = 5
                                    let zoom = lastZoom - (Math.sign(e.deltaY) * scaleSpeed) / 100
                                    zoom = zoom < 0.5 ? 0.5 : zoom
                                    zoom = zoom > 3 ? 3 : zoom
                                    if (zoom !== lastZoom) {
                                        lastZoom = zoom
                                        insertCSS(zoom)
                                        GM_setValue('BILICLEANER_video-page-bpx-player-mini-mode-zoom', zoom)
                                    }
                                }
                            })
                        } else {
                            cnt++
                            if (cnt > 20) {
                                clearInterval(interval)
                            }
                        }
                    }, 500)
                } catch (err) {
                    error('adjust mini player size error')
                    error(err)
                }
            },
            enableFuncRunAt: 'document-end',
            disableFunc: async () => {
                document.querySelector(`style[bili-cleaner-css=video-page-bpx-player-mini-mode-wheel-adjust]`)?.remove()
            },
        }),
        // 记录小窗位置
        new CheckboxItem({
            itemID: 'video-page-bpx-player-mini-mode-position-record',
            description: '记录小窗位置',
            enableFunc: async () => {
                let player: HTMLElement

                // 监听mini播放器移动
                const addMiniPlayerMoveListener = () => {
                    if (!player) {
                        return
                    }
                    player.addEventListener('mouseup', () => {
                        if (player.getAttribute('data-screen') !== 'mini') {
                            return
                        }
                        GM_setValue(
                            'BILICLEANER_video-page-bpx-player-mini-mode-position-record-right',
                            parseInt(player.style.right),
                        )
                        GM_setValue(
                            'BILICLEANER_video-page-bpx-player-mini-mode-position-record-bottom',
                            parseInt(player.style.bottom),
                        )
                    })
                }
                // 设置player API内小窗播放器position初始值
                const setMiniPlayerState = () => {
                    const right = GM_getValue('BILICLEANER_video-page-bpx-player-mini-mode-position-record-right')
                    const bottom = GM_getValue('BILICLEANER_video-page-bpx-player-mini-mode-position-record-bottom')
                    if (typeof right === 'number' && typeof bottom === 'number') {
                        if (unsafeWindow.player) {
                            unsafeWindow.player.__core().uiStore.state.miniScreenRight = right
                            unsafeWindow.player.__core().uiStore.state.miniScreenBottom = bottom
                        }
                    }
                }

                waitForEle(document.body, '#bilibili-player .bpx-player-container', (node: HTMLElement) => {
                    return node.className.startsWith('bpx-player-container')
                }).then((ele) => {
                    if (ele) {
                        player = ele
                        try {
                            setMiniPlayerState()
                            addMiniPlayerMoveListener()
                        } catch {
                            // err
                        }
                    }
                })
            },
            enableFuncRunAt: 'document-end',
        }),
    ]
    videoGroupList.push(new Group('video-mini-player', '小窗播放器', miniPlayerItems))

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
        // 隐藏 清晰度
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-ctrl-quality',
            description: '隐藏 清晰度',
            itemCSS: `.bpx-player-ctrl-quality {display: none !important;}`,
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
            description: '非全屏下 关闭弹幕栏',
            itemCSS: `
                /* video page的player height由JS动态设定 */
                .bpx-player-sending-area {display: none !important;}

                /* 活动播放器直接去黑边 */
                .page-main-content:has(.festival-video-player) .video-player-box {height: fit-content !important;}
                .festival-video-player {height: fit-content !important;}
                .festival-video-player #bilibili-player:not(.mode-webscreen) {height: calc(100% - 46px) !important;}
            `,
            // 隐藏弹幕栏时，强行调节播放器高度
            enableFunc: async () => {
                // 念咒
                const genSizeCSS = (): string => {
                    const e = unsafeWindow.isWide
                    const i = unsafeWindow.innerHeight
                    const t = Math.max((document.body && document.body.clientWidth) || unsafeWindow.innerWidth, 1100)
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
                    if (unsafeWindow.isWide) {
                        a -= 125
                        d -= 100
                    }
                    let l
                    if (unsafeWindow.hasBlackSide && !unsafeWindow.isWide) {
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

                if (document.getElementById('setSizeStyle')) {
                    overrideCSS()
                }
                // 监听官方style #setSizeStyle 出现
                const observeStyle = new MutationObserver(() => {
                    if (document.getElementById('setSizeStyle')) {
                        overrideCSS()
                        observeStyle.disconnect()
                    }
                })
                document.head && observeStyle.observe(document.head, { childList: true })
                // 宽屏模式
                onIsWideChangeFnArr.push(overrideCSS)
            },
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
        // 投币时不自动点赞 #46
        new CheckboxItem({
            itemID: 'video-page-coin-disable-auto-like',
            description: '投币时不自动点赞 (关闭需刷新)',
            enableFunc: async () => {
                const disableAutoLike = () => {
                    let counter = 0
                    const timer = setInterval(() => {
                        const checkbox = document.querySelector(
                            'body > .bili-dialog-m .bili-dialog-bomb .like-checkbox input',
                        ) as HTMLInputElement
                        if (checkbox) {
                            checkbox.checked && checkbox.click()
                            clearInterval(timer)
                        } else {
                            counter++
                            if (counter > 100) {
                                clearInterval(timer)
                            }
                        }
                    }, 20)
                }
                const coinBtn = document.querySelector(
                    '#arc_toolbar_report .video-coin.video-toolbar-left-item',
                ) as HTMLElement | null
                if (coinBtn) {
                    coinBtn.addEventListener('click', disableAutoLike)
                } else {
                    document.addEventListener('DOMContentLoaded', () => {
                        const coinBtn = document.querySelector(
                            '#arc_toolbar_report .video-coin.video-toolbar-left-item',
                        ) as HTMLElement | null
                        coinBtn?.addEventListener('click', disableAutoLike)
                    })
                }
            },
        }),
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
    ]
    videoGroupList.push(new Group('video-toolbar', '视频下方 三连/简介/Tag', toolbarItems))

    // up主信息
    const upInfoItems = [
        // 隐藏 发消息, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-up-sendmsg',
            description: '隐藏 发消息',
            defaultStatus: true,
            itemCSS: `.up-detail .send-msg {display: none !important;}`,
        }),
        // 隐藏 UP主简介
        new CheckboxItem({
            itemID: 'video-page-hide-up-description',
            description: '隐藏 UP主简介',
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
                .up-avatar-wrap {width: 48px !important; height:48px !important;}
                .up-avatar-wrap .up-avatar {background-color: transparent !important;}
                .up-avatar-wrap .bili-avatar {width: 48px !important; height:48px !important; transform: unset !important;}`,
        }),
        // 隐藏 UP主头像icon
        new CheckboxItem({
            itemID: 'video-page-hide-up-bili-avatar-icon',
            description: '隐藏 UP主头像icon',
            itemCSS: `.up-info-container .bili-avatar-icon {display: none !important;}
                .up-info-container .bili-avatar-nft-icon {display: none !important;}`,
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
        // 优化 右栏底部吸附 实验功能
        new CheckboxItem({
            itemID: 'video-page-right-container-sticky-optimize',
            description: '优化 右栏底部吸附 (实验功能)\n搭配“全屏时页面可滚动”使用',
            itemCSS: `
                /* 修复右栏底部吸附计算top时位置跳变 */
                .video-container-v1 .right-container {
                    display: flex !important;
                }
                .video-container-v1 .right-container .right-container-inner {
                    position: sticky !important;
                    top: unset !important;
                    align-self: flex-end !important;
                    /* fix #87, #84 */
                    max-width: 100% !important;
                    padding-bottom: 0 !important;
                }
                /* 小窗播放器挡住下方视频 #87 */
                body:has(.mini-player-window.on) .video-container-v1 .right-container .right-container-inner {
                    bottom: 240px !important;
                }
                body:has(.mini-player-window:not(.on)) .video-container-v1 .right-container .right-container-inner {
                    bottom: 10px !important;
                }
            `,
        }),
        // 禁用 滚动页面时右栏底部吸附
        new CheckboxItem({
            itemID: 'video-page-right-container-sticky-disable',
            description: '禁用 右栏底部吸附',
            itemCSS: `.right-container .right-container-inner {position: static !important;}`,
        }),
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
        // 隐藏 接下来播放
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-reco-list-next-play',
            description: '隐藏 接下来播放',
            itemCSS: `#reco_list .next-play {display: none !important;}
                     #reco_list .rec-list {margin-top: 0 !important;}`,
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
                .video-sections-head_first-line .first-line-left {max-width: 100% !important;}
                .video-sections-head_first-line .first-line-title {max-width: unset !important;}
                .video-sections-head_first-line .first-line-right {display: none !important;}`,
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
        // 相关视频 视频信息置底, 默认开启
        new CheckboxItem({
            itemID: 'video-page-right-container-set-info-bottom',
            description: '相关视频 视频信息置底',
            defaultStatus: true,
            itemCSS: `:is(.video-page-card-small, .video-page-operator-card-small) .card-box .info {display: flex !important; flex-direction: column !important;}
                    :is(.video-page-card-small, .video-page-operator-card-small) .card-box .info .upname {margin-top: auto !important;}`,
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
                    visibility: hidden !important;
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
            itemCSS: `
                    #right-bottom-banner {
                        display: none !important;
                    }
                    /* 小窗视频防挡 #87 */
                    body:has(.mini-player-window.on) .video-container-v1 .right-container .right-container-inner {
                        padding-bottom: 240px;
                    }
                    body:has(.mini-player-window:not(.on)) .video-container-v1 .right-container .right-container-inner {
                        padding-bottom: 10px;
                    }
                `,
        }),
        // 隐藏 直播间推荐, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-live',
            description: '隐藏 直播间推荐',
            defaultStatus: true,
            itemCSS: `
                    .right-container .pop-live-small-mode {display: none !important;}
                    /* 小窗视频防挡 #87 */
                    body:has(.mini-player-window.on) .video-container-v1 .right-container .right-container-inner {
                        padding-bottom: 240px;
                    }
                    body:has(.mini-player-window:not(.on)) .video-container-v1 .right-container .right-container-inner {
                        padding-bottom: 10px;
                    }
                `,
        }),
    ]
    videoGroupList.push(new Group('video-right', '右侧 视频栏', rightItems))

    // 评论区
    const commentItems = [
        // 禁用 新版评论区
        new CheckboxItem({
            itemID: 'video-page-disable-next-comment-abtest',
            description: '禁用 新版评论区, 恢复旧版 (临时功能)',
            enableFunc: async () => {
                let origValue = unsafeWindow.__INITIAL_STATE__
                if (origValue?.abtest) {
                    origValue.abtest.comment_next_version = 'DEFAULT'
                }
                Object.defineProperty(unsafeWindow, '__INITIAL_STATE__', {
                    get() {
                        return origValue
                    },
                    set(value) {
                        if (value.abtest) {
                            value.abtest.comment_next_version = 'DEFAULT'
                        }
                        origValue = value
                    },
                })
            },
        }),
        // 隐藏 投票栏 (红方/蓝方)
        // 测试视频：https://www.bilibili.com/video/av1805762267
        new CheckboxItem({
            itemID: 'video-page-hide-top-vote-card',
            description: '隐藏 投票栏 (红方/蓝方)',
            itemCSS: `.top-vote-card {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comments-header-renderer',
                    'video-page-hide-top-vote-card',
                    `#vote {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comments-header-renderer', 'video-page-hide-top-vote-card')
            },
        }),
        // 隐藏 活动/notice, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-notice',
            description: '隐藏 活动/notice',
            defaultStatus: true,
            itemCSS: `.reply-header .reply-notice {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comments-header-renderer',
                    'video-page-hide-reply-notice',
                    `#notice {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comments-header-renderer', 'video-page-hide-reply-notice')
            },
        }),
        // 隐藏 评论编辑器
        new CheckboxItem({
            itemID: 'video-page-hide-main-reply-box',
            description: '隐藏 评论编辑器',
            // 不可使用display: none, 会使底部吸附评论框宽度变化
            itemCSS: `.main-reply-box {height: 0 !important; visibility: hidden !important;}
                .comment-container .reply-list {margin-top: -20px !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comments-header-renderer',
                    'video-page-hide-main-reply-box',
                    `#commentbox bili-comment-box {display: none !important;}
                     #navbar {margin-bottom: 0 !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comments-header-renderer', 'video-page-hide-main-reply-box')
            },
        }),
        // 隐藏 评论编辑器内占位文字, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-box-textarea-placeholder',
            description: '隐藏 评论编辑器内占位文字',
            defaultStatus: true,
            itemCSS: `.main-reply-box .reply-box-textarea::placeholder {color: transparent !important; user-select: none;}
                .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important; user-select: none;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-textarea',
                    'video-page-hide-reply-box-textarea-placeholder',
                    `textarea:not([placeholder^="回复"])::placeholder {color: transparent !important; user-select: none;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-textarea', 'video-page-hide-reply-box-textarea-placeholder')
            },
        }),
        // 隐藏 页面底部 吸附评论框, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-fixed-reply-box',
            description: '隐藏 页面底部 吸附评论框',
            defaultStatus: true,
            itemCSS: `.fixed-reply-box {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comments-header-renderer',
                    'video-page-hide-fixed-reply-box',
                    `.bili-comments-bottom-fixed-wrapper {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comments-header-renderer', 'video-page-hide-fixed-reply-box')
            },
        }),
        // 隐藏 用户卡片
        new CheckboxItem({
            itemID: 'video-page-hide-comment-user-card',
            description: '隐藏 用户卡片\n鼠标放在用户名上时不显示卡片',
            itemCSS: `.user-card {display: none!important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-user-profile',
                    'video-page-hide-comment-user-card',
                    `#wrap {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-user-profile', 'video-page-hide-comment-user-card')
            },
        }),
        // 隐藏 评论右侧装饰
        new CheckboxItem({
            itemID: 'video-page-hide-reply-decorate',
            description: '隐藏 评论右侧装饰',
            itemCSS: `.reply-decorate {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-reply-decorate',
                    `#ornament {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-reply-decorate')
            },
        }),
        // 隐藏 粉丝牌
        new CheckboxItem({
            itemID: 'video-page-hide-fan-badge',
            description: '隐藏 粉丝牌',
            itemCSS: `.fan-badge {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-medal',
                    'video-page-hide-fan-badge',
                    `#fans {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-medal', 'video-page-hide-fan-badge')
            },
        }),
        // 隐藏 老粉、原始粉丝Tag
        // 测试视频：https://www.bilibili.com/video/av479061422
        new CheckboxItem({
            itemID: 'video-page-hide-contractor-box',
            description: '隐藏 老粉、原始粉丝Tag',
            itemCSS: `.contractor-box {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-medal',
                    'video-page-hide-contractor-box',
                    `#contractor {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-medal', 'video-page-hide-contractor-box')
            },
        }),
        // 隐藏 一级评论用户等级
        new CheckboxItem({
            itemID: 'video-page-hide-user-level',
            description: '隐藏 一级评论用户等级',
            itemCSS: `.user-level {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-info',
                    'video-page-hide-user-level',
                    `#user-level {display: none !important;}
                    #user-name {margin-right: 5px;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-info', 'video-page-hide-user-level')
            },
        }),
        // 隐藏 二级评论用户等级
        new CheckboxItem({
            itemID: 'video-page-hide-sub-user-level',
            description: '隐藏 二级评论用户等级',
            itemCSS: `.sub-user-level {display: none !important;}`,
        }),
        // 隐藏 用户头像饰品
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-pendent-dom',
            description: '隐藏 用户头像饰品',
            itemCSS: `.root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            .comment-container .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-avatar',
                    'video-page-hide-bili-avatar-pendent-dom',
                    `.layer.center[style*="66px"] {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-avatar', 'video-page-hide-bili-avatar-pendent-dom')
            },
        }),
        // 隐藏 用户头像徽章
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-nft-icon',
            description: '隐藏 用户头像徽章',
            itemCSS: `.bili-avatar-nft-icon {display: none !important;}
                .comment-container .bili-avatar-icon {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-avatar',
                    'video-page-hide-bili-avatar-nft-icon',
                    `.layer:not(.center) {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-avatar', 'video-page-hide-bili-avatar-nft-icon')
            },
        }),
        // 隐藏 用户投票 (红方/蓝方)
        // 测试视频：https://www.bilibili.com/video/av1805762267
        new CheckboxItem({
            itemID: 'video-page-hide-vote-info',
            description: '隐藏 用户投票 (红方/蓝方)',
            itemCSS: `.vote-info {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-vote-info',
                    `bili-comment-vote-option {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-vote-info')
            },
        }),
        // 隐藏 评论内容下Tag(UP觉得很赞)
        new CheckboxItem({
            itemID: 'video-page-hide-reply-tag-list',
            description: '隐藏 评论内容下Tag(UP觉得很赞)',
            itemCSS: `.reply-tag-list {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-reply-tag-list',
                    `#tags {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-reply-tag-list')
            },
        }),
        // 隐藏 笔记评论前的小Logo, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-note-prefix',
            description: '隐藏 笔记评论前的小Logo',
            defaultStatus: true,
            itemCSS: `.note-prefix {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-note-prefix',
                    `#note {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-note-prefix')
            },
        }),
        // 禁用 评论内容搜索关键词高亮, 默认开启
        // 测试视频：https://www.bilibili.com/video/av1406084552
        new CheckboxItem({
            itemID: 'video-page-hide-jump-link-search-word',
            description: '禁用 评论内容搜索关键词高亮',
            defaultStatus: true,
            itemCSS: `.reply-content .jump-link.search-word {color: inherit !important;}
                .comment-container .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
                .comment-container .reply-content .icon.search-word {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-rich-text',
                    'video-page-hide-jump-link-search-word',
                    `#contents a[href*="search.bilibili.com"] {color: inherit !important;}
                    #contents a[href*="search.bilibili.com"]:hover {color: #008AC5 !important;}
                    #contents a[href*="search.bilibili.com"] img {display: none !important;}
                    `,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-rich-text', 'video-page-hide-jump-link-search-word')
            },
        }),
        // 禁用 评论中的@高亮
        new CheckboxItem({
            itemID: 'video-page-hide-reply-content-user-highlight',
            description: '禁用 评论中的@高亮',
            itemCSS: `.sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                .comment-container .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-rich-text',
                    'video-page-hide-reply-content-user-highlight',
                    `#contents a[href*="space.bilibili.com"] {color: inherit !important;}
                    #contents a[href*="space.bilibili.com"]:hover {color: #008AC5 !important;}
                    `,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-rich-text', 'video-page-hide-reply-content-user-highlight')
            },
        }),
        // 隐藏 召唤AI机器人的评论, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-at-reply-at-bots',
            description: '隐藏 召唤AI机器人的评论 (旧版)',
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
                // 3546639035795567 @AI总结视频
                `.reply-item:has(.jump-link.user:is(
                    [data-user-id="8455326"],
                    [data-user-id="234978716"],
                    [data-user-id="1141159409"],
                    [data-user-id="437175450"],
                    [data-user-id="1692825065"],
                    [data-user-id="690155730"],
                    [data-user-id="689670224"],
                    [data-user-id="3494380876859618"],
                    [data-user-id="1168527940"],
                    [data-user-id="439438614"],
                    [data-user-id="1358327273"],
                    [data-user-id="3546376048741135"],
                    [data-user-id="1835753760"],
                    [data-user-id="9868463"],
                    [data-user-id="358243654"],
                    [data-user-id="393788832"],
                    [data-user-id="91394217"],
                    [data-user-id="473018527"],
                    [data-user-id="3546639035795567"]
                )) {
                    display: none !important;
                }`,
        }),
        // 隐藏 AI机器人发布的评论
        new CheckboxItem({
            itemID: 'video-page-hide-bots-reply',
            description: '隐藏 AI机器人发布的评论 (旧版)',
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
                // 9868463 @AI头脑风暴
                // 358243654 @GPT_5
                // 393788832 @Juice_AI
                // 91394217 @AI全文总结
                // 473018527 @AI视频总结
                // 3546639035795567 @AI总结视频
                // 普通视频页不隐藏 1835753760 @AI识片酱 发布的评论
                `.reply-item:has(.root-reply-container .user-name:is(
                    [data-user-id="8455326"],
                    [data-user-id="234978716"],
                    [data-user-id="1141159409"],
                    [data-user-id="437175450"],
                    [data-user-id="1692825065"],
                    [data-user-id="690155730"],
                    [data-user-id="689670224"],
                    [data-user-id="3494380876859618"],
                    [data-user-id="1168527940"],
                    [data-user-id="439438614"],
                    [data-user-id="1358327273"],
                    [data-user-id="3546376048741135"],
                    [data-user-id="9868463"],
                    [data-user-id="358243654"],
                    [data-user-id="393788832"],
                    [data-user-id="91394217"],
                    [data-user-id="473018527"],
                    [data-user-id="3546639035795567"]
                )) {
                    display: none !important;
                }`,
        }),
        // 隐藏 包含@的 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-at-reply',
            description: '隐藏 包含@的 无人点赞评论 (旧版)',
            itemCSS: `.reply-item:has(.root-reply .jump-link.user):not(:has(.delete-reply, .top-icon, .sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 包含@的 全部评论
        new CheckboxItem({
            itemID: 'video-page-hide-at-reply-all',
            description: '隐藏 包含@的 全部评论 (旧版)',
            itemCSS: `.reply-item:has(.root-reply .jump-link.user):not(:has(.delete-reply, .top-icon, .sub-up-icon)) {display: none !important;}`,
        }),
        // 隐藏 LV1 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv1-reply',
            description: '隐藏 LV1 无人点赞评论 (旧版)',
            itemCSS: `.reply-item:has(.user-level.level-1):not(:has(.delete-reply, .top-icon, .sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 LV2 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv2-reply',
            description: '隐藏 LV2 无人点赞评论 (旧版)',
            itemCSS: `.reply-item:has(.user-level.level-2):not(:has(.delete-reply, .top-icon, .sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 LV3 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv3-reply',
            description: '隐藏 LV3 无人点赞评论 (旧版)',
            itemCSS: `.reply-item:has(.user-level.level-3):not(:has(.delete-reply, .top-icon, .sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 一级评论 踩/回复 只在hover时显示, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-root-reply-dislike-reply-btn',
            description: '一级评论 踩/回复 只在hover时显示',
            defaultStatus: true,
            itemCSS: `
                .reply-item:not(:has(i.disliked)) :is(.reply-btn, .reply-dislike) {
                    opacity: 0;
                }
                @keyframes appear {
                    0% {opacity: 0;}
                    100% {opacity: 1;}
                }
                .reply-item:hover :is(.reply-btn, .reply-dislike) {
                    animation: appear;
                    animation-duration: 0.2s;
                    animation-delay: 0.3s;
                    animation-fill-mode: forwards;
                }`,
            enableFunc: () => {
                /* 借用more button的display样式，改为传透明度值 */
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-root-reply-dislike-reply-btn',
                    `#body {
                        --bili-comment-hover-more-display: 0 !important;
                    }
                    #body:hover {
                        --bili-comment-hover-more-display: 1 !important;
                    }`,
                )
                shadow.register(
                    'bili-comment-action-buttons-renderer',
                    'video-page-hide-root-reply-dislike-reply-btn',
                    `#dislike button, #reply button, #more button {
                        display: block !important;
                        opacity: var(--bili-comment-action-buttons-more-display);
                        transition: opacity 0.2s 0.3s;
                    }`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-root-reply-dislike-reply-btn')
                shadow.unregister(
                    'bili-comment-action-buttons-renderer',
                    'video-page-hide-root-reply-dislike-reply-btn',
                )
            },
        }),
        // 二级评论 踩/回复 只在hover时显示, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-sub-reply-dislike-reply-btn',
            description: '二级评论 踩/回复 只在hover时显示',
            defaultStatus: true,
            itemCSS: `
                .sub-reply-item:not(:has(i.disliked)) :is(.sub-reply-btn, .sub-reply-dislike) {
                    opacity: 0;
                }
                @keyframes appear {
                    0% {opacity: 0;}
                    100% {opacity: 1;}
                }
                .sub-reply-item:hover :is(.sub-reply-btn, .sub-reply-dislike) {
                    animation: appear;
                    animation-duration: 0.2s;
                    animation-delay: 0.3s;
                    animation-fill-mode: forwards;
                }`,
            enableFunc: () => {
                /* 借用more button的display样式，改为传透明度值 */
                shadow.register(
                    'bili-comment-reply-renderer',
                    'video-page-hide-sub-reply-dislike-reply-btn',
                    `
                    #body {
                        --bili-comment-hover-more-display: 0 !important;
                    }
                    #body:hover {
                        --bili-comment-hover-more-display: 1 !important;
                    }`,
                )
                shadow.register(
                    'bili-comment-action-buttons-renderer',
                    'video-page-hide-sub-reply-dislike-reply-btn',
                    `#dislike button, #reply button, #more button {
                        display: block !important;
                        opacity: var(--bili-comment-action-buttons-more-display);
                        transition: opacity 0.2s 0.3s;
                    }`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-reply-renderer', 'video-page-hide-sub-reply-dislike-reply-btn')
                shadow.unregister('bili-comment-action-buttons-renderer', 'video-page-hide-sub-reply-dislike-reply-btn')
            },
        }),
        // 隐藏 大表情
        // 测试视频：https://www.bilibili.com/video/av1406211916
        new CheckboxItem({
            itemID: 'video-page-hide-emoji-large',
            description: '隐藏 大表情',
            itemCSS: `.emoji-large {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-rich-text',
                    'video-page-hide-emoji-large',
                    `#contents img:is(.emoji-large, [style^="width:50px"]) {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-rich-text', 'video-page-hide-emoji-large')
            },
        }),
        // 大表情变成小表情
        // 测试视频：https://www.bilibili.com/video/av1406211916
        new CheckboxItem({
            itemID: 'video-page-hide-emoji-large-zoom',
            description: '大表情变成小表情',
            itemCSS: `.emoji-large {zoom: 0.5;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-rich-text',
                    'video-page-hide-emoji-large-zoom',
                    `#contents img:is(.emoji-large, [style^="width:50px"]) {zoom: 0.5 !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-rich-text', 'video-page-hide-emoji-large-zoom')
            },
        }),
        // 用户名 全部大会员色
        new CheckboxItem({
            itemID: 'video-page-reply-user-name-color-pink',
            description: '用户名 全部大会员色',
            itemCSS: `.reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-info',
                    'video-page-reply-user-name-color-pink',
                    `#user-name {color: #FB7299 !important;}
                    #user-name a {color: #FB7299 !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-info', 'video-page-reply-user-name-color-pink')
            },
        }),
        // 用户名 全部恢复默认色
        new CheckboxItem({
            itemID: 'video-page-reply-user-name-color-default',
            description: '用户名 全部恢复默认色',
            itemCSS: `.reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-info',
                    'video-page-reply-user-name-color-default',
                    `#user-name {color: #61666d !important;}
                    #user-name a {color: #61666d !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-info', 'video-page-reply-user-name-color-default')
            },
        }),
        // 笔记图片 查看大图优化, 默认开启
        // 测试视频：https://www.bilibili.com/video/av34205337
        new CheckboxItem({
            itemID: 'video-page-reply-view-image-optimize',
            description: '笔记图片 查看大图优化',
            defaultStatus: true,
            // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
            itemCSS: `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-photoswipe',
                    'video-page-reply-view-image-optimize',
                    `#wrap:has(#thumb:empty) :is(#prev, #next) {display: none !important;}
                    #prev, #next {zoom: 1.3;}
                    #thumb {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-photoswipe', 'video-page-reply-view-image-optimize')
            },
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
        // 隐藏 小窗播放开关
        new CheckboxItem({
            itemID: 'video-page-hide-sidenav-right-container-live',
            description: '隐藏 小窗播放开关',
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

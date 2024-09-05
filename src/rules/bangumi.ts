import { GM_getValue, GM_setValue, unsafeWindow } from '$'
import { Group } from '../components/group'
import { CheckboxItem, NumberItem } from '../components/item'
import { error } from '../utils/logger'
import { isPageBangumi } from '../utils/pageType'
import { waitForEle } from '../utils/tool'

const bangumiGroupList: Group[] = []

const disableAdjustVolume = () => {}

/**
 * 版权视频播放页规则
 * 尽可能与普通播放页video.ts共用itemID, 实现开关状态同步
 * 与普通播放页不同的项目使用独立ID, 并在功能介绍最后用"★"重点标注
 */
if (isPageBangumi()) {
    // 基本功能
    const basicItems = [
        // 净化分享功能, 默认开启, 关闭功能需刷新
        new CheckboxItem({
            itemID: 'video-page-simple-share',
            description: '净化分享功能',
            defaultStatus: true,
            itemCSS: `
                #share-container-id [class^='Share_boxBottom'] {display: none !important;}
                #share-container-id [class^='Share_boxTop'] {padding: 15px !important;}
                #share-container-id [class^='Share_boxTopRight'] {display: none !important;}
                #share-container-id [class^='Share_boxTopLeft'] {padding: 0 !important;}
            `,
            enableFunc: async () => {
                // 监听shareBtn出现
                let counter = 0
                const id = setInterval(() => {
                    counter++
                    const shareBtn = document.getElementById('share-container-id')
                    if (shareBtn) {
                        clearInterval(id)
                        // 新增click事件覆盖剪贴板
                        shareBtn.addEventListener('click', () => {
                            const mainTitle = document.querySelector("[class^='mediainfo_mediaTitle']")?.textContent
                            const subTitle = document.getElementById('player-title')?.textContent
                            const shareText = `《${mainTitle}》${subTitle} \nhttps://www.bilibili.com${location.pathname}`
                            navigator.clipboard.writeText(shareText).then().catch()
                        })
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
    bangumiGroupList.push(new Group('bangumi-basic', '版权视频播放页 基本功能', basicItems))

    // 播放设定
    const playerInitItems = [
        // 默认宽屏播放
        new CheckboxItem({
            itemID: 'default-widescreen',
            description: '默认宽屏播放 刷新生效',
            enableFunc: () => {
                let origNextData = unsafeWindow.__NEXT_DATA__
                if (origNextData?.props?.pageProps?.dehydratedState?.queries?.[1]?.state?.data?.show) {
                    origNextData.props.pageProps.dehydratedState.queries[1].state.data.show.wide_screen = 1
                }
                Object.defineProperty(unsafeWindow, '__NEXT_DATA__', {
                    get() {
                        return origNextData
                    },
                    set(value) {
                        if (value.props?.pageProps?.dehydratedState?.queries?.[1]?.state?.data?.show) {
                            value.props.pageProps.dehydratedState.queries[1].state.data.show.wide_screen = 1
                        }
                        origNextData = value
                    },
                })
            },
        }),
        // 网页全屏时 页面可滚动
        new CheckboxItem({
            itemID: 'webscreen-scrollable',
            description: '网页全屏时 页面可滚动 滚轮调音量失效\n（Firefox 不适用）',
            itemCSS: `
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) {
                    overflow: auto !important;
                    position: relative !important;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) #bilibili-player-wrap {
                    position: absolute !important;
                    width: 100vw !important;
                    height: 100vh !important;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) .main-container {
                    position: static !important;
                    margin: 0 auto !important;
                    padding-top: calc(100vh + 15px) !important;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) .bpx-player-video-area {
                    flex: unset !important;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen'])::-webkit-scrollbar {
                    display: none !important;
                }
                /* firefox */
                @-moz-document url-prefix() {
                    :is(html, body):has(#bilibili-player-wrap[class*='video_playerFullScreen']) {
                        scrollbar-width: none !important;
                    }
                }
            `,
            enableFunc: async () => {
                // 禁用滚动调音量
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
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) {
                    overflow: auto !important;
                    position: relative !important;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) .home-container {
                    background-color: white;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) #bilibili-player-wrap {
                    position: absolute !important;
                    width: 100vw !important;
                    height: 100vh !important;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) .main-container {
                    position: static !important;
                    margin: 0 auto !important;
                    padding-top: calc(100vh + 15px) !important;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen']) .bpx-player-video-area {
                    flex: unset !important;
                }
                body:has(#bilibili-player-wrap[class*='video_playerFullScreen'])::-webkit-scrollbar {
                    display: none !important;
                }
                /* firefox */
                @-moz-document url-prefix() {
                    :is(html, body):has(#bilibili-player-wrap[class*='video_playerFullScreen']) {
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
        // 普通播放 视频宽度调节
        new NumberItem({
            itemID: 'normalscreen-width',
            description: '普通播放 视频宽度调节（-1禁用）',
            defaultValue: -1,
            minValue: -1,
            maxValue: 100,
            disableValue: -1,
            unit: 'vw',
            // 官方样式写的棒真是太好了
            itemCSS: `.home-container:not(.wide) {--video-width: ???vw;}`,
            itemCSSPlaceholder: '???',
        }),
    ]
    bangumiGroupList.push(new Group('player-mode', '播放设定', playerInitItems))

    // 播放器
    const playerItems = [
        // 隐藏 播放器内标题
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-top-left-title',
            description: '隐藏 播放器内标题',
            itemCSS: `.bpx-player-top-title {display: none !important;}
        /* 播放器上方阴影渐变 */
        .bpx-player-top-mask {display: none !important;}`,
        }),
        // bangumi独有项：隐藏 追番/追剧按钮, 默认开启
        new CheckboxItem({
            itemID: 'bangumi-page-hide-bpx-player-top-follow',
            description: '隐藏 追番/追剧按钮 ★',
            defaultStatus: true,
            itemCSS: `.bpx-player-top-follow {display: none !important;}`,
        }),
        // 隐藏 反馈按钮, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-top-issue',
            description: '隐藏 反馈按钮',
            defaultStatus: true,
            itemCSS: `.bpx-player-top-issue {display: none !important;}`,
        }),
        // 隐藏 视频暂停时大Logo
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-state-wrap',
            description: '隐藏 视频暂停时大Logo',
            itemCSS: `.bpx-player-state-wrap {display: none !important;}`,
        }),
        // bangumi独有项：隐藏 视频内封审核号(非内嵌), 默认开启
        new CheckboxItem({
            itemID: 'bangumi-page-hide-bpx-player-record-item-wrap',
            description: '隐藏 视频内封审核号(非内嵌) ★',
            defaultStatus: true,
            itemCSS: `.bpx-player-record-item-wrap {display: none !important;}`,
        }),
        // 隐藏 弹幕悬停 点赞/复制/举报
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-dialog-wrap',
            description: '隐藏 弹幕悬停 点赞/复制/举报',
            itemCSS: `.bpx-player-dialog-wrap {display: none !important;}`,
        }),
        // 隐藏 高赞弹幕前点赞按钮
        new CheckboxItem({
            itemID: 'video-page-bpx-player-bili-high-icon',
            description: '隐藏 高赞弹幕前点赞按钮',
            itemCSS: `.bili-high-icon, .bili-danmaku-x-high-icon {display: none !important}`,
        }),
        // 彩色渐变弹幕 变成白色
        new CheckboxItem({
            itemID: 'video-page-bpx-player-bili-dm-vip-white',
            description: '彩色渐变弹幕 变成白色',
            itemCSS: `.bili-dm>.bili-dm-vip, .bili-danmaku-x-dm-vip {
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
    ]
    bangumiGroupList.push(new Group('bangumi-player', '播放器 (★为独有项)', playerItems))

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
                const keys = {
                    tx: 'BILICLEANER_video-page-bpx-player-mini-mode-position-record-translate-x',
                    ty: 'BILICLEANER_video-page-bpx-player-mini-mode-position-record-translate-y',
                }

                // 注入样式
                const x = GM_getValue(keys.tx, 0)
                const y = GM_getValue(keys.ty, 0)
                if (x && y) {
                    const s = document.createElement('style')
                    s.innerHTML = `.bpx-player-container[data-screen="mini"] {transform: translateX(${x}px) translateY(${y}px);}`
                    s.setAttribute('bili-cleaner-css', 'video-page-bpx-player-mini-mode-position-record')
                    document.documentElement.appendChild(s)
                }

                waitForEle(document.body, `#bilibili-player [class^="bpx-player-video"]`, (node: HTMLElement) => {
                    return node.className.startsWith('bpx-player-video')
                }).then(() => {
                    const player = document.querySelector('.bpx-player-container') as HTMLElement
                    if (player) {
                        // 监听mini播放器移动
                        player.addEventListener('mouseup', () => {
                            if (player.getAttribute('data-screen') === 'mini') {
                                const rect = player.getBoundingClientRect()
                                const dx = document.documentElement.clientWidth - rect.right
                                const dy = document.documentElement.clientHeight - rect.bottom
                                GM_setValue(keys.tx, 84 - dx)
                                GM_setValue(keys.ty, 48 - dy)
                            }
                        })
                    }
                })
            },
            enableFuncRunAt: 'document-end',
        }),
    ]
    bangumiGroupList.push(new Group('bangumi-mini-player', '小窗播放器', miniPlayerItems))

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
    bangumiGroupList.push(new Group('bangumi-player-control', '播放控制', playerControlItems))

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
        // 非全屏下 关闭弹幕栏
        new CheckboxItem({
            itemID: 'video-page-hide-bpx-player-sending-area',
            description: '非全屏下 关闭弹幕栏',
            itemCSS: `.bpx-player-sending-area {display: none !important;}
                /* 关闭弹幕栏后 播放器去黑边 */
                #bilibili-player-wrap[class^='video_playerNormal'] {height: calc(var(--video-width)*.5625)}
                #bilibili-player-wrap[class^='video_playerWide'] {height: calc(var(--containerWidth)*.5625)}
                `,
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
    bangumiGroupList.push(new Group('bangumi-danmaku', '弹幕栏', danmakuItems))

    // 视频下信息
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
                            '.main-container [class^="dialogcoin_like_checkbox"] input',
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
                const coinBtn = document.querySelector('#ogv_weslie_tool_coin_info') as HTMLElement | null
                if (coinBtn) {
                    coinBtn.addEventListener('click', disableAutoLike)
                } else {
                    document.addEventListener('DOMContentLoaded', () => {
                        const coinBtn = document.querySelector('#ogv_weslie_tool_coin_info') as HTMLElement | null
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
            itemCSS: `#share-container-id [class^='Share_share'] {display: none !important;}`,
        }),
        // bangumi独有项：隐藏 一起看, 默认开启
        new CheckboxItem({
            itemID: 'bangumi-page-hide-watch-together',
            description: '隐藏 一起看 ★',
            defaultStatus: true,
            itemCSS: `.toolbar span:has(>#watch_together_tab) {display: none !important;}`,
        }),
        // bangumi独有项：隐藏 整个工具栏(赞币转)
        new CheckboxItem({
            itemID: 'bangumi-page-hide-toolbar',
            description: '隐藏 整个工具栏(赞币转) ★',
            itemCSS: `.player-left-components .toolbar {display: none !important;}`,
        }),
        // bangumi独有项：隐藏 作品介绍
        new CheckboxItem({
            itemID: 'bangumi-page-hide-media-info',
            description: '隐藏 作品介绍 ★',
            itemCSS: `[class^='mediainfo_mediaInfo'] {display: none !important;}`,
        }),
        // bangumi独有项：精简 作品介绍, 默认开启
        new CheckboxItem({
            itemID: 'bangumi-page-simple-media-info',
            description: '精简 作品介绍 ★',
            defaultStatus: true,
            itemCSS: `[class^='mediainfo_btnHome'], [class^='upinfo_upInfoCard'] {display: none !important;}
                [class^='mediainfo_score'] {font-size: 25px !important;}
                [class^='mediainfo_mediaDesc']:has( + [class^='mediainfo_media_desc_section']) {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin-bottom: 8px !important;
                }
                [class^='mediainfo_media_desc_section'] {height: 60px !important;}`,
        }),
        // bangumi独有项：隐藏 承包榜
        new CheckboxItem({
            itemID: 'bangumi-page-hide-sponsor-module',
            description: '隐藏 承包榜 ★',
            itemCSS: `#sponsor_module {display: none !important;}`,
        }),
    ]
    bangumiGroupList.push(new Group('bangumi-toolbar', '视频下方 工具栏/作品信息', toolbarItems))

    // 右栏
    const rightItems = [
        // bangumi独有项：隐藏 大会员按钮, 默认开启
        new CheckboxItem({
            itemID: 'bangumi-page-hide-right-container-section-height',
            description: '隐藏 大会员按钮 ★',
            defaultStatus: true,
            itemCSS: `.plp-r [class^='vipPaybar_'], .plp-r [class^='paybar_'] {display: none !important;}`,
        }),
        // 隐藏 弹幕列表, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-right-container-danmaku',
            description: '隐藏 弹幕列表',
            defaultStatus: true,
            itemCSS: `#danmukuBox {display: none !important;}`,
        }),
        // bangumi独有项：隐藏 视频列表 会员/限免标记
        new CheckboxItem({
            itemID: 'bangumi-page-hide-eplist-badge',
            description: '隐藏 视频列表 会员/限免标记 ★',
            // 蓝色预告badge不可隐藏
            itemCSS: `[class^='eplist_ep_list_wrapper'] [class^='imageListItem_badge']:not([style*='#00C0FF']) {display: none !important;}
                [class^='eplist_ep_list_wrapper'] [class^='numberListItem_badge']:not([style*='#00C0FF']) {display: none !important;}`,
        }),
        // bangumi独有项：隐藏 相关作品推荐 ★
        new CheckboxItem({
            itemID: 'bangumi-page-hide-recommend',
            description: '隐藏 相关作品推荐 ★',
            itemCSS: `.plp-r [class^='recommend_wrap'] {display: none !important;}`,
        }),
    ]
    bangumiGroupList.push(new Group('bangumi-right', '右栏 作品选集/作品推荐', rightItems))

    // 右下角
    const sidebarItems = [
        // bangumi独有项：隐藏 新版反馈, 默认开启
        new CheckboxItem({
            itemID: 'bangumi-page-hide-sidenav-issue',
            description: '隐藏 新版反馈 ★',
            defaultStatus: true,
            itemCSS: `[class*='navTools_navMenu'] [title='新版反馈'] {display: none !important;}`,
        }),
        // 隐藏 小窗播放开关
        new CheckboxItem({
            itemID: 'video-page-hide-sidenav-mini',
            description: '隐藏 小窗播放开关',
            itemCSS: `[class*='navTools_navMenu'] [title*='迷你播放器'] {display: none !important;}`,
        }),
        // 隐藏 客服, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-sidenav-customer-service',
            description: '隐藏 客服',
            defaultStatus: true,
            itemCSS: `[class*='navTools_navMenu'] [title='帮助反馈'] {display: none !important;}`,
        }),
        // 隐藏 回顶部
        new CheckboxItem({
            itemID: 'video-page-hide-sidenav-back-to-top',
            description: '隐藏 回顶部',
            itemCSS: `[class*='navTools_navMenu'] [title='返回顶部'] {display: none !important;}`,
        }),
    ]
    bangumiGroupList.push(new Group('bangumi-sidebar', '页面右下角 小按钮', sidebarItems))
}

export { bangumiGroupList }

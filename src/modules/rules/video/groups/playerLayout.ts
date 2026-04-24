import { unsafeWindow } from '$'
import { Item } from '@/types/item'
import { playerGoTo, waitForEle } from '@/utils/tool'
import { wideScreenManager } from '@/utils/widePlayer'
import { useEventListener } from '@vueuse/core'

// 禁用滚动调音量
let preventVolumeTune = false
// 网页全屏小窗劫持
let hookArcToolBar = false
let cleanUp = () => {}

// 当前是否是网页全屏模式（包含全屏滚动时的小窗模式）
const isWebScreen = (): boolean => {
    if (unsafeWindow.player?.getManifest()?.screenKind === 2) {
        return true
    }
    return document.body?.classList.contains('webscreen-fix')
}

// 当前是否是mini模式
const isMiniScreen = (): boolean => {
    return unsafeWindow.player?.getManifest()?.screenKind === 3
}

// 网页全屏或全屏时阻止滚动音量调节
for (const eventName of ['mousewheel', 'DOMMouseScroll', 'wheel']) {
    useEventListener(
        window,
        eventName,
        (e: WheelEvent) => {
            if (preventVolumeTune && isWebScreen() && !isMiniScreen()) {
                e.stopImmediatePropagation()
            }
        },
        { capture: true, passive: true },
    )
}

// 全屏可滚动 = 网页全屏功能 + html/body元素申请全屏
const toggleFullScreen = () => {
    const fullScreenStatus = (): 'ele' | 'f11' | 'not' => {
        if (document.fullscreenElement) {
            return 'ele' // 由元素申请的全屏
        }
        if (window.innerWidth === screen.width && window.innerHeight === screen.height) {
            return 'f11' // 用户F11的全屏
        }
        return 'not' // 非全屏
    }

    switch (fullScreenStatus()) {
        case 'ele':
            document.exitFullscreen().catch(() => {})
            if (isWebScreen()) {
                playerGoTo('normal')
            }
            break
        case 'f11':
            playerGoTo('normal')
            break
        case 'not':
            document.documentElement.requestFullscreen().catch(() => {})
            if (!isWebScreen()) {
                playerGoTo('web')
            }
            window.scrollTo(0, 0)
            break
    }
}

// 拦截全屏按钮单击
const handleFullScreenClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
        target.closest('#bilibili-player .bpx-player-ctrl-full') ||
        (target.classList.contains('bpx-player-ctrl-full') && target.classList.contains('#bilibili-player'))
    ) {
        e.stopImmediatePropagation()
        toggleFullScreen()
    }
}

// 拦截双击全屏
const handleFullScreenDblClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
        target.closest('#bilibili-player .bpx-player-video-perch') ||
        (target.classList.contains('bpx-player-video-perch') && target.closest('#bilibili-player'))
    ) {
        e.stopImmediatePropagation()
        document.querySelector<HTMLVideoElement>('#bilibili-player video')?.pause()
        toggleFullScreen()
    }
}

export const videoPlayerLayoutItems: Item[] = [
    {
        type: 'switch',
        id: 'default-widescreen',
        name: '自动宽屏播放',
        enableFn: () => {
            unsafeWindow.isWide = true
            wideScreenManager.lock() // 锁定宽屏模式
            const listener = () => {
                window.scrollTo(0, 64)
                // 监听宽屏按钮出现
                waitForEle(document.body, '.bpx-player-ctrl-wide', (node: HTMLElement): boolean => {
                    return node.className.includes('bpx-player-ctrl-wide')
                }).then((wideBtn) => {
                    if (wideBtn) {
                        wideBtn.click()
                        wideScreenManager.unlock() // 解锁，允许修改宽屏模式
                    }
                })
            }
            document.readyState !== 'loading' ? listener() : document.addEventListener('DOMContentLoaded', listener)
        },
    },
    {
        type: 'switch',
        id: 'default-webscreen',
        name: '自动网页全屏播放',
        description: ['实验功能，不要与自动宽屏同时启用', '偶尔会出现载入时闪屏'],
        enableFn: () => {
            const id = setInterval(() => {
                if (typeof unsafeWindow.player?.requestStatue === 'function') {
                    unsafeWindow.player
                        .requestStatue(2)
                        .then(() => {
                            clearInterval(id)
                            // 播放器占满屏幕时隐藏临时样式
                            const id2 = setInterval(() => {
                                const container = document.querySelector<HTMLElement>(
                                    '#bilibili-player .bpx-player-container',
                                )
                                const video = document.querySelector<HTMLElement>('#bilibili-player video')
                                if (container && video && container.getAttribute('data-screen') === 'web') {
                                    const a = container.offsetHeight / innerHeight
                                    const b = container.offsetWidth / innerWidth
                                    const c = video.offsetHeight / innerHeight
                                    if (a > 0.9 && a < 1.1 && b > 0.9 && b < 1.1 && c > 0.9 && c < 1.1) {
                                        clearInterval(id2)
                                        setTimeout(() => {
                                            document.documentElement.classList.add('webscreen-loaded')
                                        }, 1000)
                                    }
                                }
                            }, 200)
                        })
                        .catch(() => {})
                }
            }, 100)
        },
    },
    {
        type: 'switch',
        id: 'webscreen-scrollable',
        name: '网页全屏时 页面可滚动',
        description: ['启用后滚轮无法调节音量，刷新生效'],
        enableFn: () => {
            preventVolumeTune = true
        },
        disableFn: () => {
            preventVolumeTune = false
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'fullscreen-scrollable',
        name: '网页全屏/真全屏时 页面可滚动',
        description: ['启用后滚轮无法调节音量，刷新生效'],
        enableFn: () => {
            preventVolumeTune = true
            document.addEventListener('click', handleFullScreenClick, true)
            document.addEventListener('dblclick', handleFullScreenDblClick, true)
        },
        disableFn: () => {
            preventVolumeTune = false
            document.removeEventListener('click', handleFullScreenClick, true)
            document.removeEventListener('dblclick', handleFullScreenDblClick, true)
        },
    },
    {
        type: 'switch',
        id: 'screen-scrollable-enable-mini-player',
        name: '网页全屏滚动时 启用小窗播放器',
        description: ['实验功能，不支持真全屏'],
        enableFn: () => {
            // 劫持 getBoundingClientRect
            // 网页全屏滚动时，对小窗触发元素强行返回 top=999999
            hookArcToolBar = true
            const orig = Element.prototype.getBoundingClientRect
            Element.prototype.getBoundingClientRect = function () {
                if (
                    hookArcToolBar &&
                    !document.fullscreenElement &&
                    isWebScreen() &&
                    (this.id === 'arc_toolbar_report' || this.id === 'playlistToolbar')
                ) {
                    const rect = orig.call(this)
                    return { ...rect, top: 999999 }
                }
                return orig.call(this)
            }

            // 网页全屏时接管小窗切换
            cleanUp = useEventListener(window, 'scroll', () => {
                if (!document.fullscreenElement && isWebScreen()) {
                    const currIsMiniScreen = isMiniScreen()
                    // 向下滚动离开第一屏，mini模式
                    if (!currIsMiniScreen && scrollY >= innerHeight * 1.05) {
                        playerGoTo('mini')
                    }
                    // 向上滚动进入第一屏，恢复网页全屏
                    else if (currIsMiniScreen && scrollY < innerHeight * 1.05) {
                        playerGoTo('web')
                    }
                }
            })
        },
        disableFn: () => {
            hookArcToolBar = false
            cleanUp()
        },
    },
    {
        type: 'switch',
        id: 'screen-scrollable-move-header-bottom',
        name: '全屏滚动时 在视频底部显示顶栏',
        description: ['网页全屏/真全屏滚动时生效'],
    },
    {
        type: 'switch',
        id: 'video-page-exchange-player-position',
        name: '播放器和视频信息 交换位置',
    },
    {
        type: 'number',
        id: 'normalscreen-width',
        name: '普通播放宽度调节（-1禁用）',
        minValue: -1,
        maxValue: 100,
        step: 0.1,
        defaultValue: -1,
        disableValue: -1,
        addonText: 'vw',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--normalscreen-width', `${value}vw`)
        },
    },
]

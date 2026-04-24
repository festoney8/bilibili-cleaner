import { unsafeWindow } from '$'
import { Item } from '@/types/item'
import { playerGoTo } from '@/utils/tool'
import { useEventListener } from '@vueuse/core'

// 禁用滚动调音量
let preventVolumeTune = false

// 监听器清理函数
let cleanUp = () => {}

// 当前是否是网页全屏模式（包含全屏滚动时的小窗模式）
const isWebScreen = (): boolean => {
    if (unsafeWindow.player?.getManifest()?.screenKind === 2) {
        return true
    }
    return !!document.querySelector('#bilibili-player-wrap[class^=video_playerFullScreen]')
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

export const bangumiPlayerLayoutItems: Item[] = [
    {
        type: 'switch',
        id: 'default-widescreen',
        name: '自动宽屏播放',
        noStyle: true,
        enableFn: () => {
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
            cleanUp = useEventListener(
                window,
                'scroll',
                (e: Event) => {
                    // bangumi页面网页全屏原生支持小窗
                    // 拦截真全屏模式scroll，避免出现小窗掉出全屏
                    if (document.fullscreenElement) {
                        e.stopImmediatePropagation()
                    }
                },
                { capture: true, passive: true },
            )
        },
        disableFn: () => {
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

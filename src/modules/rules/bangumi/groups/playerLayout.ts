import { unsafeWindow } from '$'
import { Item } from '@/types/item'

let webScroll = false
let fullScroll = false
const fn = (e: Event) => {
    if (document.querySelector('[data-screen="web"]')) {
        e.stopImmediatePropagation()
    }
}
const disableTuneVolume = () => {
    if (!webScroll && !fullScroll) {
        window.addEventListener('mousewheel', fn, { capture: true })
        window.addEventListener('DOMMouseScroll', fn, { capture: true })
    }
}
const enableTuneVolume = () => {
    if (!(webScroll && fullScroll)) {
        window.removeEventListener('mousewheel', fn, { capture: true })
        window.removeEventListener('DOMMouseScroll', fn, { capture: true })
    }
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

    const isWebScreen = (): boolean => {
        return !!document.querySelector("#bilibili-player [data-screen='web']")
    }

    switch (fullScreenStatus()) {
        case 'ele':
            document.exitFullscreen().then().catch()
            if (isWebScreen()) {
                unsafeWindow.player?.requestStatue(0)
            }
            break
        case 'f11':
            unsafeWindow.player?.requestStatue(0)
            break
        case 'not':
            document.documentElement.requestFullscreen().then().catch()
            if (!isWebScreen()) {
                unsafeWindow.player?.requestStatue(2)
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
        name: '默认宽屏播放 刷新生效',
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
        description: ['播放器内滚轮调节音量失效'],
        enableFn: async () => {
            disableTuneVolume()
            webScroll = true
        },
        disableFn: () => {
            enableTuneVolume()
            webScroll = false
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'fullscreen-scrollable',
        name: '全屏时 页面可滚动 (实验功能)',
        description: ['播放器内滚轮调节音量失效'],
        enableFn: async () => {
            disableTuneVolume()
            fullScroll = true
            document.addEventListener('click', handleFullScreenClick, true)
            document.addEventListener('dblclick', handleFullScreenDblClick, true)
        },
        disableFn: () => {
            enableTuneVolume()
            fullScroll = false
            document.removeEventListener('click', handleFullScreenClick, true)
            document.removeEventListener('dblclick', handleFullScreenDblClick, true)
        },
    },
    {
        type: 'switch',
        id: 'screen-scrollable-move-header-bottom',
        name: '全屏滚动时 在视频底部显示顶栏',
        description: ['实验功能，网页/全屏滚动时生效'],
    },
    {
        type: 'number',
        id: 'normalscreen-width',
        name: '普通播放 视频宽度调节（-1禁用）',
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

import { unsafeWindow } from '$'
import { Item } from '@/types/item'
import { waitForEle } from '@/utils/tool'

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
        description: ['播放器内滚轮调节音量失效', '点击全屏按钮生效，双击全屏无效'],
        enableFn: async () => {
            disableTuneVolume()
            fullScroll = true

            let cnt = 0
            const id = setInterval(() => {
                const webBtn = document.body.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web') as HTMLElement
                const fullBtn = document.body.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-full') as HTMLElement
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
        disableFn: () => {
            enableTuneVolume()
            fullScroll = false
        },
        enableFnRunAt: 'document-end',
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

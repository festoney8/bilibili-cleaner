import { unsafeWindow } from '$'
import { Item } from '@/types/item'
import { waitForEle } from '@/utils/tool'
import { wideScreenManager } from '@/utils/widePlayer'

// 禁用滚动调音量
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

export const videoPlayerLayoutItems: Item[] = [
    {
        type: 'switch',
        id: 'default-widescreen',
        name: '默认宽屏播放 刷新生效',
        enableFn: async () => {
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
        description: ['播放器内滚轮调节音量失效'],
        enableFn: async () => {
            disableTuneVolume()
            fullScroll = true

            let cnt = 0
            const id = setInterval(() => {
                const webBtn = document.body.querySelector('#bilibili-player .bpx-player-ctrl-web') as HTMLElement
                const fullBtn = document.body.querySelector('#bilibili-player .bpx-player-ctrl-full') as HTMLElement
                if (webBtn && fullBtn) {
                    clearInterval(id)

                    const isFullScreen = (): 'ele' | 'f11' | 'not' => {
                        if (document.fullscreenElement) {
                            return 'ele' // 由元素申请的全屏
                        } else if (window.innerWidth === screen.width && window.innerHeight === screen.height) {
                            return 'f11' // 用户F11的全屏
                        } else {
                            return 'not' // 非全屏
                        }
                    }

                    const isWebScreen = (): boolean => {
                        return webBtn.classList.contains('bpx-state-entered')
                    }

                    // 全屏可滚动 = 网页全屏功能 + html/body元素申请全屏
                    const newFullBtn = fullBtn.cloneNode(true)
                    const fn = () => {
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
                    }
                    newFullBtn.addEventListener('click', fn)
                    fullBtn.parentElement?.replaceChild(newFullBtn, fullBtn)

                    // 双击全屏
                    let cnt2 = 0
                    const id2 = setInterval(() => {
                        const perchEl = document.querySelector('#bilibili-player .bpx-player-video-perch')
                        if (perchEl) {
                            clearInterval(id2)
                            perchEl.addEventListener(
                                'dblclick',
                                (event) => {
                                    document.querySelector<HTMLVideoElement>('#bilibili-player video')?.pause()
                                    event.stopPropagation()
                                    fn()
                                },
                                true,
                            )
                        }
                        cnt2++ > 40 && clearInterval(id2)
                    }, 250)
                } else {
                    cnt++ > 40 && clearInterval(id)
                }
            }, 250)
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
        type: 'switch',
        id: 'video-page-exchange-player-position',
        name: '播放器和视频信息 交换位置',
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

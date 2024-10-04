import { unsafeWindow } from '$'
import { Item } from '../../../../types/item'
import { waitForEle } from '../../../../utils/tool'
import { wideScreenManager } from '../../../../utils/widePlayer'

const disableAdjustVolume = () => {}

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
        description: ['播放器内滚轮调节音量失效', 'Firefox 不适用'],
        enableFn: async () => {
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
        disableFn: async () => document.removeEventListener('wheel', disableAdjustVolume),
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'fullscreen-scrollable',
        name: '全屏时 页面可滚动 (实验功能)',
        description: ['播放器内滚轮调节音量失效', '点击全屏按钮时生效，双击全屏无效', 'Firefox 不适用'],
        enableFn: async () => {
            if (!navigator.userAgent.toLocaleLowerCase().includes('chrome')) {
                return
            }
            // 禁用滚动调音量
            document.removeEventListener('wheel', disableAdjustVolume)
            document.addEventListener('wheel', disableAdjustVolume)

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
        disableFn: async () => document.removeEventListener('wheel', disableAdjustVolume),
        enableFnRunAt: 'document-end',
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

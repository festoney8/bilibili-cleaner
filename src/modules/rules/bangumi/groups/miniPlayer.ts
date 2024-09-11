import { GM_getValue, GM_setValue } from '$'
import { Item } from '../../../../types/item'
import { error } from '../../../../utils/logger'
import { waitForEle } from '../../../../utils/tool'

export const bangumiMiniPlayerItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-mini-mode-process',
        name: '隐藏底边进度',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-mini-mode-danmaku',
        name: '隐藏弹幕',
    },
    {
        type: 'switch',
        id: 'video-page-bpx-player-mini-mode-wheel-adjust',
        name: '滚轮调节大小',
        enableFn: async () => {
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
                error('adjust mini player size error', err)
            }
        },
        enableFnRunAt: 'document-end',
        disableFn: async () => {
            document.querySelector(`style[bili-cleaner-css=video-page-bpx-player-mini-mode-wheel-adjust]`)?.remove()
        },
    },
    {
        type: 'switch',
        id: 'video-page-bpx-player-mini-mode-position-record',
        name: '记录小窗位置',
        enableFn: async () => {
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
        enableFnRunAt: 'document-end',
    },
]

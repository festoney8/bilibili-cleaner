import { Item } from '@/types/item'
import { error } from '@/utils/logger'
import { waitForEle } from '@/utils/tool'
import { useStorage } from '@vueuse/core'

export const videoMiniPlayerItems: Item[] = [
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
                const zoom = useStorage('bili-cleaner-mini-player-zoom', 1, localStorage)
                document.documentElement.style.setProperty('--mini-player-zoom', zoom.value + '')
                waitForEle(document, '#bilibili-player .bpx-player-container', (node: HTMLElement) => {
                    return node.className.startsWith('bpx-player-container')
                }).then(() => {
                    const player = document.querySelector('#bilibili-player .bpx-player-container') as HTMLElement
                    if (!player) {
                        return
                    }
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
                    // 监听滚轮
                    player.addEventListener('wheel', (e) => {
                        if (flag) {
                            e.stopPropagation()
                            e.preventDefault()
                            const scaleSpeed = 5
                            let newZoom = zoom.value - (Math.sign(e.deltaY) * scaleSpeed) / 100
                            newZoom = newZoom < 0.5 ? 0.5 : newZoom
                            newZoom = newZoom > 3 ? 3 : newZoom
                            if (newZoom !== zoom.value) {
                                zoom.value = newZoom
                                document.documentElement.style.setProperty('--mini-player-zoom', newZoom + '')
                            }
                        }
                    })
                })
            } catch (err) {
                error('adjust mini player size error', err)
            }
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'video-page-bpx-player-mini-mode-position-record',
        name: '记录小窗位置',
        enableFn: async () => {
            const pos = useStorage('bili-cleaner-mini-player-pos', { tx: 0, ty: 0 }, localStorage)
            document.documentElement.style.setProperty('--mini-player-translate-x', pos.value.tx + 'px')
            document.documentElement.style.setProperty('--mini-player-translate-y', pos.value.ty + 'px')

            waitForEle(document, '#bilibili-player .bpx-player-container', (node: HTMLElement) => {
                return node.className.startsWith('bpx-player-container')
            }).then((player) => {
                if (player) {
                    // 监听mini播放器移动
                    player.addEventListener('mouseup', () => {
                        if (player.getAttribute('data-screen') === 'mini') {
                            const rect = player.getBoundingClientRect()
                            pos.value.tx = 84 - (document.documentElement.clientWidth - rect.right)
                            pos.value.ty = 48 - (document.documentElement.clientHeight - rect.bottom)
                        }
                    })
                }
            })
        },
        enableFnRunAt: 'document-end',
    },
]

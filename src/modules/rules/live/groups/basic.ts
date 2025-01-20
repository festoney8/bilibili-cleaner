import { unsafeWindow } from '$'
import { Item } from '@/types/item'
import { waitForBody } from '@/utils/init'
import { error } from '@/utils/logger'

export const liveBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'live-page-sidebar-vm',
        name: '隐藏 页面右侧按钮 实验室/关注',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'live-page-default-skin',
        name: '禁用 播放器皮肤',
    },
    {
        type: 'switch',
        id: 'live-page-remove-wallpaper',
        name: '禁用 直播背景',
    },
    {
        type: 'switch',
        id: 'activity-live-auto-jump',
        name: '活动直播自动跳转普通直播 (实验功能)',
        noStyle: true,
        enableFn: async () => {
            let cnt = 0
            const id = setInterval(() => {
                if (document.querySelector('.rendererRoot, #main.live-activity-full-main, #internationalHeader')) {
                    if (!location.href.includes('/blanc/')) {
                        window.location.href = location.href.replace('live.bilibili.com/', 'live.bilibili.com/blanc/')
                        clearInterval(id)
                    }
                }
                cnt++
                cnt > 50 && clearInterval(id)
            }, 200)
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'live-page-default-webscreen',
        name: '默认网页全屏播放 (实验功能)',
        noStyle: true,
        enableFn: async () => {
            if (!/\/\d+|\/blanc\/\d+/.test(location.pathname)) {
                return
            }
            if (self !== top) {
                return
            }
            waitForBody().then(() => {
                document.body.classList.add('player-full-win')
                document.body.classList.add('over-hidden')
            })
            document.addEventListener('DOMContentLoaded', () => {
                let cnt = 0
                const id = setInterval(() => {
                    const player = unsafeWindow.EmbedPlayer?.instance || unsafeWindow.livePlayer
                    if (player) {
                        requestAnimationFrame(() => {
                            document.body.classList.remove('player-full-win')
                            document.body.classList.remove('over-hidden')
                            if (!document.querySelector('iframe[src*="live.bilibili.com/blanc"]')) {
                                player.setFullscreenStatus(1)
                            }
                        })
                        clearInterval(id)
                    }
                    cnt++
                    if (cnt > 10) {
                        clearInterval(id)
                    }
                }, 1000)
            })
        },
    },
    {
        type: 'switch',
        id: 'auto-best-quality',
        name: '自动切换最高画质 (不稳定功能)',
        noStyle: true,
        enableFn: async () => {
            if (!/\/\d+|\/blanc\/\d+/.test(location.pathname)) {
                return
            }
            if (self !== top) {
                return
            }
            const qualityFn = () => {
                const player = unsafeWindow.EmbedPlayer?.instance || unsafeWindow.livePlayer
                if (player) {
                    try {
                        const info = player?.getPlayerInfo()
                        const arr = player?.getPlayerInfo().qualityCandidates
                        if (info && arr && arr.length) {
                            let maxQn = 0
                            arr.forEach((v) => {
                                if (v.qn && parseInt(v.qn) > maxQn) {
                                    maxQn = parseInt(v.qn)
                                }
                            })
                            if (maxQn && info.quality && maxQn > parseInt(info.quality)) {
                                player.switchQuality(`${maxQn}`)
                            }
                        }
                    } catch (err) {
                        error('auto-best-quality error', err)
                    }
                }
            }
            setTimeout(qualityFn, 2000)
        },
        enableFnRunAt: 'document-end',
    },
]

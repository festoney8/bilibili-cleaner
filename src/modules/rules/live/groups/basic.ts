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
        name: '活动直播自动跳转普通直播',
        noStyle: true,
        enableFn: async () => {
            if (!/\/\d+/.test(location.pathname)) {
                return
            }
            if (self !== top) {
                return
            }
            let cnt = 0
            const id = setInterval(() => {
                if (
                    document.querySelector(
                        '.rendererRoot, #main.live-activity-full-main, #internationalHeader, iframe[src*="live.bilibili.com/blanc/"]',
                    )
                ) {
                    location.href = location.href.replace('live.bilibili.com/', 'live.bilibili.com/blanc/')
                    clearInterval(id)
                }
                ++cnt > 50 && clearInterval(id)
            }, 200)
        },
    },
    {
        type: 'switch',
        id: 'live-page-default-webscreen',
        name: '默认网页全屏播放',
        description: ['实验功能，偶尔会失效'],
        noStyle: true,
        enableFn: async () => {
            if (!/\/\d+|\/blanc\/\d+/.test(location.pathname)) {
                return
            }
            if (self !== top) {
                return
            }
            waitForBody().then(() => {
                requestAnimationFrame(() => {
                    document.body.classList.add('player-full-win')
                    document.body.classList.add('over-hidden')
                })
            })
            document.addEventListener('DOMContentLoaded', () => {
                let cnt = 0
                const id = setInterval(() => {
                    const player = unsafeWindow.livePlayer || unsafeWindow.EmbedPlayer?.instance
                    const status = player?.getPlayerInfo()?.playerStatus
                    if (player && status === 0) {
                        document.body.classList.remove('player-full-win')
                        document.body.classList.remove('over-hidden')
                        if (!document.querySelector('iframe[src*="live.bilibili.com/blanc"]')) {
                            player.setFullscreenStatus(1)
                        }
                        clearInterval(id)
                    }
                    ++cnt > 20 && clearInterval(id)
                }, 500)
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
                const player = unsafeWindow.livePlayer || unsafeWindow.EmbedPlayer?.instance
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

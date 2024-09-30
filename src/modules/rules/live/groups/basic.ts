import { unsafeWindow } from '$'
import { Item } from '../../../../types/item'
import { error } from '../../../../utils/logger'

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
        name: '活动直播页 自动跳转普通直播 (实验功能)',
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
        id: 'auto-best-quality',
        name: '自动切换最高画质 (实验功能)',
        noStyle: true,
        enableFn: async () => {
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
            setTimeout(qualityFn, 4000)
            setTimeout(qualityFn, 6000)
            setTimeout(qualityFn, 8000)
        },
        enableFnRunAt: 'document-end',
    },
]

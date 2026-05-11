import { unsafeWindow } from '$'
import { Item } from '@/types/item'
import { logger } from '@/utils/logger'

const origAppendChild = Element.prototype.appendChild

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
        noStyle: true,
        enableFn: () => {
            const node = document.querySelector('head #skin-css')
            if (node) {
                node.remove()
            }
            Element.prototype.appendChild = function <T extends Node>(node: T): T {
                if (this === document.head && node instanceof HTMLStyleElement && node.id === 'skin-css') {
                    return node // 阻止皮肤样式注入head
                }
                return origAppendChild.call(this, node) as T
            }
        },
        disableFn: () => {
            Element.prototype.appendChild = origAppendChild
        },
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
        id: 'auto-best-quality',
        name: '自动切换最高画质 (实验功能)',
        description: ['自动画质时也会切换，但仍显示[自动]'],
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
                        logger.error('auto-best-quality error', err)
                    }
                }
            }
            setTimeout(qualityFn, 2000)
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'number',
        id: 'live-page-width',
        name: '修改 页面宽度占比 (0禁用)',
        description: ['推荐范围 85~95'],
        minValue: 0,
        maxValue: 100,
        step: 1,
        defaultValue: 0,
        disableValue: 0,
        addonText: 'vw',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--live-page-width', `${value}vw`)
        },
    },
]

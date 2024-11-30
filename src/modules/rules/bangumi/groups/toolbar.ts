import { Item } from '@/types/item'

export const bangumiToolbarItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-coin-disable-auto-like',
        name: '投币时不自动点赞',
        noStyle: true,
        enableFn: async () => {
            const disableAutoLike = () => {
                let counter = 0
                const timer = setInterval(() => {
                    const checkbox = document.querySelector(
                        '.main-container [class^="dialogcoin_like_checkbox"] input',
                    ) as HTMLInputElement
                    if (checkbox) {
                        checkbox.checked && checkbox.click()
                        clearInterval(timer)
                    } else {
                        counter++
                        if (counter > 100) {
                            clearInterval(timer)
                        }
                    }
                }, 20)
            }
            const coinBtn = document.querySelector('#ogv_weslie_tool_coin_info') as HTMLElement | null
            if (coinBtn) {
                coinBtn.addEventListener('click', disableAutoLike)
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    const coinBtn = document.querySelector('#ogv_weslie_tool_coin_info') as HTMLElement | null
                    coinBtn?.addEventListener('click', disableAutoLike)
                })
            }
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-video-share-popover',
        name: '隐藏 分享按钮弹出菜单',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-watch-together',
        name: '隐藏 一起看 ★',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-toolbar',
        name: '隐藏 整个工具栏(赞币转) ★',
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-media-info',
        name: '隐藏 作品介绍 ★',
    },
    {
        type: 'switch',
        id: 'bangumi-page-simple-media-info',
        name: '精简 作品介绍 ★',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-sponsor-module',
        name: '隐藏 承包榜 ★',
    },
]

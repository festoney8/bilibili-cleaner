import { Item } from '../../../../types/item'

export const videoToolbarItems: Item[] = [
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
                        'body > .bili-dialog-m .bili-dialog-bomb .like-checkbox input',
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
            const coinBtn = document.querySelector(
                '#arc_toolbar_report .video-coin.video-toolbar-left-item',
            ) as HTMLElement | null
            if (coinBtn) {
                coinBtn.addEventListener('click', disableAutoLike)
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    const coinBtn = document.querySelector(
                        '#arc_toolbar_report .video-coin.video-toolbar-left-item',
                    ) as HTMLElement | null
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
        id: 'video-page-hide-triple-oldfan-entry',
        name: '隐藏 成为老粉按钮',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-video-ai-assistant',
        name: '隐藏 官方AI总结',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-video-note',
        name: '隐藏 记笔记',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-video-report-menu',
        name: '隐藏 举报/笔记/稍后再看',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-desc',
        name: '隐藏 视频简介',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-tag',
        name: '隐藏 标签列表',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-activity-vote',
        name: '隐藏 活动宣传',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-bannerAd',
        name: '隐藏 广告banner',
        defaultEnable: true,
    },
]

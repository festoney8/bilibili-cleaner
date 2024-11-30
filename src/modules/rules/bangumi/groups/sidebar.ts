import { Item } from '@/types/item'

export const bangumiSidebarItems: Item[] = [
    {
        type: 'switch',
        id: 'bangumi-page-hide-sidenav-issue',
        name: '隐藏 新版反馈 ★',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-sidenav-mini',
        name: '隐藏 小窗播放开关',
    },
    {
        type: 'switch',
        id: 'video-page-hide-sidenav-customer-service',
        name: '隐藏 客服',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-sidenav-back-to-top',
        name: '隐藏 回顶部',
    },
]

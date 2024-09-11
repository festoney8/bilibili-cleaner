import { Item } from '../../../../types/item'

export const videoSidebarItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-hide-sidenav-right-container-live',
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

import { Item } from '@/types/item'

export const channelSidebarItems: Item[] = [
    {
        type: 'switch',
        id: 'channel-hide-feedback',
        name: '隐藏 新版反馈',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'channel-hide-top-btn',
        name: '隐藏 回顶部',
    },
]

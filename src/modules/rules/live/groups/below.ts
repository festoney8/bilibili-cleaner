import { Item } from '@/types/item'

export const liveBelowItems: Item[] = [
    {
        type: 'switch',
        id: 'live-page-flip-view',
        name: '隐藏 活动海报',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'live-page-room-info-ctnr',
        name: '隐藏 直播间推荐/直播间介绍',
    },
    {
        type: 'switch',
        id: 'live-page-room-feed',
        name: '隐藏 主播动态',
    },
    {
        type: 'switch',
        id: 'live-page-announcement-cntr',
        name: '隐藏 主播公告',
    },
    {
        type: 'switch',
        id: 'live-page-sections-vm',
        name: '隐藏 直播下方全部内容',
    },
]

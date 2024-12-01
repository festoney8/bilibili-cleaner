import { Item } from '@/types/item'

export const videoUpInfoItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-hide-up-sendmsg',
        name: '隐藏 发消息',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-up-description',
        name: '隐藏 UP主简介',
    },
    {
        type: 'switch',
        id: 'video-page-hide-up-charge',
        name: '隐藏 充电',
    },
    {
        type: 'switch',
        id: 'video-page-hide-up-bili-avatar-pendent-dom',
        name: '隐藏 UP主头像外饰品',
    },
    {
        type: 'switch',
        id: 'video-page-hide-up-bili-avatar-icon',
        name: '隐藏 UP主头像icon',
    },
    {
        type: 'switch',
        id: 'video-page-hide-up-membersinfo-normal-header',
        name: '隐藏 创作团队header',
        defaultEnable: true,
    },
]

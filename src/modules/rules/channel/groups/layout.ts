import { Item } from '@/types/item'

export const channelLayoutItems: Item[] = [
    {
        type: 'list',
        id: 'channel-layout',
        name: '修改 视频列表列数',
        description: ['未启用时，B 站自动判断列数', '分区页与首页统一视频间距'],
        defaultValue: 'channel-layout-disable',
        disableValue: 'channel-layout-disable',
        options: [
            {
                value: 'channel-layout-disable',
                name: '未启用',
            },
            {
                value: 'channel-layout-3-column',
                name: '3 列布局',
            },
            {
                value: 'channel-layout-4-column',
                name: '4 列布局',
            },
            {
                value: 'channel-layout-5-column',
                name: '5 列布局',
            },
            {
                value: 'channel-layout-6-column',
                name: '6 列布局',
            },
        ],
    },
    {
        type: 'number',
        id: 'channel-layout-padding',
        name: '修改 页面两侧边距 (-1禁用)',
        minValue: -1,
        maxValue: 500,
        step: 1,
        defaultValue: -1,
        disableValue: -1,
        addonText: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--channel-layout-padding', `${value}px`)
        },
    },
]

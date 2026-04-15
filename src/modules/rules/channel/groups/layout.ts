import { Item } from '@/types/item'

export const channelLayoutItems: Item[] = [
    {
        type: 'list',
        id: 'channel-layout',
        name: '修改 视频列表列数',
        description: ['未启用时，B 站自动判断列数', '分区页与首页统一视频间距'],
        defaultValue: '0',
        disableValue: '0',
        options: [
            {
                value: '0',
                name: '未启用',
            },
            {
                value: '2',
                name: '2 列布局',
            },
            {
                value: '3',
                name: '3 列布局',
            },
            {
                value: '4',
                name: '4 列布局',
            },
            {
                value: '5',
                name: '5 列布局',
            },
            {
                value: '6',
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

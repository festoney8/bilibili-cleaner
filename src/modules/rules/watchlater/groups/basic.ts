import { Item } from '@/types/item'

export const watchlaterBasicItems: Item[] = [
    {
        type: 'list',
        id: 'watchlater-layout',
        name: '修改 视频列表列数',
        description: ['未启用时，B 站自动判断列数'],
        defaultValue: 'watchlater-layout-disable',
        disableValue: 'watchlater-layout-disable',
        options: [
            {
                id: 'watchlater-layout-disable',
                name: '未启用',
            },
            {
                id: 'watchlater-layout-4-column',
                name: '4 列布局',
            },
            {
                id: 'watchlater-layout-5-column',
                name: '5 列布局',
            },
        ],
    },
    {
        type: 'switch',
        id: 'watchlater-increase-font-size',
        name: '增大 视频信息字号',
    },
]

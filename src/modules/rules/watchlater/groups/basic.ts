import { Item } from '@/types/item'

export const watchlaterBasicItems: Item[] = [
    {
        type: 'list',
        id: 'watchlater-layout',
        name: '修改 视频列表列数',
        description: ['未启用时，B 站自动判断列数'],
        defaultValue: '0',
        disableValue: '0',
        options: [
            {
                value: '0',
                name: '未启用',
            },
            {
                value: '4',
                name: '4 列布局',
            },
            {
                value: '5',
                name: '5 列布局',
            },
        ],
    },
    {
        type: 'switch',
        id: 'watchlater-increase-font-size',
        name: '增大 视频信息字号',
    },
    {
        type: 'switch',
        id: 'watchlater-hide-feedback',
        name: '隐藏 新版反馈',
        defaultEnable: true,
    },
]

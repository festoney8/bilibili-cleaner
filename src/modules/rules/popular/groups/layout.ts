import { Item } from '@/types/item'

export const popularLayoutItems: Item[] = [
    {
        type: 'list',
        id: 'popular-layout',
        name: '强制修改视频列数',
        defaultValue: '2',
        disableValue: '0',
        description: ['默认隐藏视频简介、标签', '对 全站音乐榜 不生效'],
        options: [
            {
                value: '2',
                name: '未启用',
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
]

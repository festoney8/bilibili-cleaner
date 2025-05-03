import { Item } from '@/types/item'

export const popularLayoutItems: Item[] = [
    {
        type: 'list',
        id: 'popular-layout',
        name: '强制修改视频列数',
        defaultValue: 'popular-layout-2-column',
        disableValue: 'popular-layout-disable',
        description: ['默认隐藏视频简介、标签', '对 全站音乐榜 不生效'],
        options: [
            {
                id: 'popular-layout-2-column',
                name: '未启用',
            },
            {
                id: 'popular-layout-4-column',
                name: '4 列布局',
            },
            {
                id: 'popular-layout-5-column',
                name: '5 列布局',
            },
            {
                id: 'popular-layout-6-column',
                name: '6 列布局',
            },
        ],
    },
]

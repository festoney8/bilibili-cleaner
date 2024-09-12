import { Item } from '../../../../types/item'

export const popularLayoutItems: Item[] = [
    {
        type: 'list',
        id: 'popular-layout',
        name: '页面强制布局',
        defaultValue: 'popular-layout-disable',
        disableValue: 'popular-layout-disable',
        options: [
            {
                id: 'popular-layout-disable',
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

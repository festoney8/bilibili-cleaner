import { Item } from '@/types/item'

export const popularBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'homepage-hide-banner',
        name: '隐藏 横幅banner',
        description: ['同步生效：首页、分区页、热门页'],
    },
    {
        type: 'switch',
        id: 'homepage-hide-sticky-header',
        name: '隐藏 滚动页面时 顶部吸附顶栏',
    },
    {
        type: 'switch',
        id: 'popular-hide-tips',
        name: '隐藏 tips',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'popular-hide-danmaku-count',
        name: '隐藏 弹幕数',
    },
]

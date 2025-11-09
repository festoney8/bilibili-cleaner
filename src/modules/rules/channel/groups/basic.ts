import { Item } from '@/types/item'

export const channelBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'homepage-hide-banner',
        name: '隐藏 横幅banner',
        description: ['同步生效：首页、分区页、热门页'],
    },
    {
        type: 'switch',
        id: 'channel-hide-sticky-header',
        name: '隐藏 滚动页面时 顶部吸附顶栏',
    },
    {
        type: 'switch',
        id: 'channel-hide-subarea',
        name: '隐藏 全站分区栏',
    },
    {
        type: 'switch',
        id: 'channel-hide-carousel',
        name: '隐藏 大图轮播',
    },
    {
        type: 'switch',
        id: 'homepage-revert-channel-dynamic-icon',
        name: '恢复 原始动态按钮',
        description: ['同步生效：首页、分区页'],
    },
]

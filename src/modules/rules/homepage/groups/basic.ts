import { Item } from '@/types/item'

export const homepageBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'homepage-hide-banner',
        name: '隐藏 横幅banner',
        description: ['同步生效：首页、分区页、热门页'],
    },
    {
        type: 'switch',
        id: 'homepage-hide-recommend-swipe',
        name: '隐藏 大图活动轮播',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-hide-subarea',
        name: '隐藏 整个分区栏',
    },
    {
        type: 'switch',
        id: 'homepage-hide-sticky-header',
        name: '隐藏 滚动页面时 顶部吸附顶栏',
    },
    {
        type: 'switch',
        id: 'homepage-hide-sticky-subarea',
        name: '隐藏 滚动页面时 顶部吸附分区栏',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-hide-adblock-tips',
        name: '隐藏 顶部adblock提示',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-revert-channel-dynamic-icon',
        name: '恢复 原始动态按钮',
        description: ['同步生效：首页、分区页'],
    },
]

import { Item } from '../../../../types/item'

export const channelBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'homepage-hide-banner',
        name: '隐藏 横幅banner',
        description: ['同步生效：首页、分区页、热门页'],
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
        id: 'channel-hide-sticky-subchannel',
        name: '隐藏 滚动页面时 顶部吸附分区栏',
    },
    {
        type: 'switch',
        id: 'channel-hide-sticky-header',
        name: '隐藏 滚动页面时 顶部吸附顶栏',
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

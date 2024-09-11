import { Item } from '../../../../types/item'

export const popularBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'homepage-hide-banner',
        name: '隐藏 横幅banner',
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
        id: 'popular-hide-watchlater',
        name: '隐藏 稍后再看按钮',
    },
    {
        type: 'switch',
        id: 'popular-hide-danmaku-count',
        name: '隐藏 弹幕数',
    },
    {
        type: 'switch',
        id: 'font-patch',
        name: '修复字体',
    },
]

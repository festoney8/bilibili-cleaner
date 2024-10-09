import { Item } from '../../../../types/item'

export const dynamicRightItems: Item[] = [
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-banner',
        name: '隐藏 社区中心',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-ads',
        name: '隐藏 广告',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-topic-box',
        name: '隐藏 话题列表',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-aside-right',
        name: '隐藏 整个右栏',
    },
]

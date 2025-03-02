import { Item } from '@/types/item'

export const dynamicCenterTopItems: Item[] = [
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-publishing',
        name: '隐藏 动态发布框',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-up-list',
        name: '隐藏 UP 主列表',
    },
    {
        type: 'switch',
        id: 'dynamic-page-up-list-dual-line-mode',
        name: '双行显示 UP 主列表',
    },
    {
        type: 'switch',
        id: 'dynamic-page-up-list-checked-item-opacity',
        name: '淡化 UP 主列表 已查看项',
    },
    {
        type: 'switch',
        id: 'dynamic-page-up-list-checked-item-hide',
        name: '隐藏 UP 主列表 已查看项',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-list-tabs',
        name: '隐藏 动态分类Tab bar',
    },
]

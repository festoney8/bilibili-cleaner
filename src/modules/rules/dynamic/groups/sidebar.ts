import { Item } from '../../../../types/item'

export const dynamicSidebar: Item[] = [
    {
        type: 'switch',
        id: 'hide-dynamic-page-sidebar-old-version',
        name: '隐藏 回到旧版',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-sidebar-back-to-top',
        name: '隐藏 回顶部',
    },
]

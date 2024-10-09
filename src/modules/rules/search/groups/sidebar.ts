import { Item } from '../../../../types/item'

export const searchSidebarItems: Item[] = [
    {
        type: 'switch',
        id: 'hide-search-page-customer-service',
        name: '隐藏 客服',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'hide-search-page-btn-to-top',
        name: '隐藏 回顶部',
    },
]

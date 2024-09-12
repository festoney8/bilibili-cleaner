import { Group } from '../../../types/group'
import { searchBasicItems } from './groups/basic'
import { searchSidebarItems } from './groups/sidebar'

export const searchGroups: Group[] = [
    {
        name: '搜索页 基本功能',
        items: searchBasicItems,
    },
    {
        name: '页面右下角 小按钮',
        items: searchSidebarItems,
    },
]

import { Group } from '@/types/collection'
import { spaceBasicItems } from './groups/basic'
import { spaceDynamicItems } from './groups/dynamic'
import { spaceSidebarItems } from './groups/sidebar'

export const spaceGroups: Group[] = [
    {
        name: '基本功能',
        items: spaceBasicItems,
    },
    {
        name: '页面侧栏',
        items: spaceSidebarItems,
    },
    {
        name: '动态列表 (与动态页同步)',
        items: spaceDynamicItems,
        fold: true,
    },
]

import { Group } from '../../../types/collection'
import { popularBasicItems } from './groups/basic'
import { popularLayoutItems } from './groups/layout'
import { popularOtherItems } from './groups/other'

export const popularGroups: Group[] = [
    {
        name: '基本功能',
        items: popularBasicItems,
    },
    {
        name: '页面强制布局',
        items: popularLayoutItems,
    },
    {
        name: '其他功能',
        items: popularOtherItems,
        fold: true,
    },
]

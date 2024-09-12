import { Group } from '../../../types/group'
import { popularBasicItems } from './groups/basic'
import { popularLayoutItems } from './groups/layout'
import { popularOtherItems } from './groups/other'

export const popularGroups: Group[] = [
    {
        name: '热门/排行榜页 基本功能',
        items: popularBasicItems,
    },
    {
        name: '页面强制布局 (单选)',
        items: popularLayoutItems,
    },
    {
        name: '其他功能',
        items: popularOtherItems,
    },
]

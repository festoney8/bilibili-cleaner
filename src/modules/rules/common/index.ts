import { Group } from '../../../types/rule'
import { commonBasicItems } from './groups/basic'
import { commonHeaderCenterItems } from './groups/headerCenter'
import { commonHeaderLeftItems } from './groups/headerLeft'
import { commonHeaderRightItems } from './groups/headerRight'
import { commonHeaderWidthItems } from './groups/headerWidth'

export const commonGroups: Group[] = [
    {
        name: '基本功能',
        items: commonBasicItems,
    },
    {
        name: '顶栏 左侧',
        items: commonHeaderLeftItems,
    },
    {
        name: '顶栏 搜索框',
        items: commonHeaderCenterItems,
    },
    {
        name: '顶栏 右侧',
        items: commonHeaderRightItems,
    },
    {
        name: '顶栏 数值设定',
        items: commonHeaderWidthItems,
    },
]

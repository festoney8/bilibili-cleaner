import { Group } from '@/types/collection'
import { commonBasicItems } from './groups/basic'
import { commonHeaderCenterItems } from './groups/headerCenter'
import { commonHeaderLeftItems } from './groups/headerLeft'
import { commonHeaderRightItems } from './groups/headerRight'
import { commonHeaderWidthItems } from './groups/headerWidth'
import { commonThemeItems } from '@/modules/rules/common/groups/theme.ts'

export const commonGroups: Group[] = [
    {
        name: '全站通用 - 基本功能',
        fold: true,
        items: commonBasicItems,
    },
    {
        name: '全站通用 - 夜间模式',
        fold: true,
        items: commonThemeItems,
    },
    {
        name: '全站通用 - 顶栏 左侧',
        fold: true,
        items: commonHeaderLeftItems,
    },
    {
        name: '全站通用 - 顶栏 搜索框',
        fold: true,
        items: commonHeaderCenterItems,
    },
    {
        name: '全站通用 - 顶栏 右侧',
        fold: true,
        items: commonHeaderRightItems,
    },
    {
        name: '全站通用 - 顶栏 数值设定',
        fold: true,
        items: commonHeaderWidthItems,
    },
]

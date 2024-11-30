import { Group } from '@/types/collection'
import { dynamicBasicItems } from './groups/basic'
import { dynamicCenterDynItems } from './groups/centerDyn'
import { dynamicCenterTopItems } from './groups/centerTop'
import { dynamicLayoutItems } from './groups/layout'
import { dynamicLeftItems } from './groups/left'
import { dynamicRightItems } from './groups/right'
import { dynamicSidebar } from './groups/sidebar'

export const dynamicGroups: Group[] = [
    {
        name: '基本功能',
        fold: true,
        items: dynamicBasicItems,
    },
    {
        name: '左栏 个人信息/正在直播',
        fold: true,
        items: dynamicLeftItems,
    },
    {
        name: '右栏 热门话题',
        fold: true,
        items: dynamicRightItems,
    },
    {
        name: '中栏 顶部功能',
        fold: true,
        items: dynamicCenterTopItems,
    },
    {
        name: '中栏 动态列表',
        fold: true,
        items: dynamicCenterDynItems,
    },
    {
        name: '动态宽度调节',
        fold: true,
        items: dynamicLayoutItems,
    },
    {
        name: '页面右下角 小按钮',
        fold: true,
        items: dynamicSidebar,
    },
]

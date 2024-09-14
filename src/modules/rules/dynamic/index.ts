import { Group } from '../../../types/rule'
import { dynamicBasicItems } from './groups/basic'
import { dynamicCenterDynItems } from './groups/centerDyn'
import { dynamicCenterTopItems } from './groups/centerTop'
import { dynamicLeftItems } from './groups/left'
import { dynamicRightItems } from './groups/right'
import { dynamicSidebar } from './groups/sidebar'

export const dynamicGroups: Group[] = [
  {
    name: '动态页 基本功能',
    items: dynamicBasicItems,
  },
  {
    name: '左栏 个人信息/正在直播',
    items: dynamicLeftItems,
  },
  {
    name: '右栏 热门话题',
    items: dynamicRightItems,
  },
  {
    name: '中栏 顶部功能',
    items: dynamicCenterTopItems,
  },
  {
    name: '中栏 动态列表',
    items: dynamicCenterDynItems,
  },
  {
    name: '页面右下角 小按钮',
    items: dynamicSidebar,
  },
]

import { Group } from '../../../types/collection'
import { liveBasicItems } from './groups/basic'
import { liveBelowItems } from './groups/below'
import { liveHeaderCenterItems } from './groups/headerCenter'
import { liveHeaderLeftItems } from './groups/headerLeft'
import { liveHeaderRightItems } from './groups/headerRight'
import { liveInfoItems } from './groups/info'
import { livePlayerItems } from './groups/player'
import { liveRightItems } from './groups/right'

export const liveGroups: Group[] = [
    {
        name: '基本功能',
        items: liveBasicItems,
    },
    {
        name: '直播信息栏',
        items: liveInfoItems,
    },
    {
        name: '播放器',
        items: livePlayerItems,
    },
    {
        name: '右栏 弹幕列表',
        items: liveRightItems,
    },
    {
        name: '下方页面 主播动态/直播公告',
        items: liveBelowItems,
    },
    {
        name: '顶栏 左侧',
        items: liveHeaderLeftItems,
    },
    {
        name: '顶栏 搜索框',
        items: liveHeaderCenterItems,
    },
    {
        name: '顶栏 右侧',
        items: liveHeaderRightItems,
    },
]

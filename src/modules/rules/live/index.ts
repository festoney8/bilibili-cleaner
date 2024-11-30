import { Group } from '@/types/collection'
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
        fold: true,
        items: liveBasicItems,
    },
    {
        name: '直播信息栏',
        fold: true,
        items: liveInfoItems,
    },
    {
        name: '播放器',
        fold: true,
        items: livePlayerItems,
    },
    {
        name: '右栏 弹幕列表',
        fold: true,
        items: liveRightItems,
    },
    {
        name: '下方页面 主播动态/直播公告',
        fold: true,
        items: liveBelowItems,
    },
    {
        name: '顶栏 左侧',
        fold: true,
        items: liveHeaderLeftItems,
    },
    {
        name: '顶栏 搜索框',
        fold: true,
        items: liveHeaderCenterItems,
    },
    {
        name: '顶栏 右侧',
        fold: true,
        items: liveHeaderRightItems,
    },
]

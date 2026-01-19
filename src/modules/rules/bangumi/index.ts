import { Group } from '@/types/collection'
import { bangumiBasicItems } from './groups/basic'
import { bangumiDanmakuItems } from './groups/danmaku'
import { bangumiDanmakuControlItems } from './groups/danmakuControl'
import { bangumiMiniPlayerItems } from './groups/miniPlayer'
import { bangumiPlayerItems } from './groups/player'
import { bangumiPlayerControlItems } from './groups/playerControl'
import { bangumiPlayerLayoutItems } from './groups/playerLayout'
import { bangumiRightItems } from './groups/right'
import { bangumiSidebarItems } from './groups/sidebar'
import { bangumiToolbarItems } from './groups/toolbar'

export const bangumiGroups: Group[] = [
    {
        name: '基本功能',
        fold: true,
        items: bangumiBasicItems,
    },
    {
        name: '布局设定',
        fold: true,
        items: bangumiPlayerLayoutItems,
    },
    {
        name: '播放器（标★是番剧页独有项）',
        fold: true,
        items: bangumiPlayerItems,
    },
    {
        name: '播放控制栏',
        fold: true,
        items: bangumiPlayerControlItems,
    },
    {
        name: '弹幕控制栏',
        fold: true,
        items: bangumiDanmakuControlItems,
    },
    {
        name: '弹幕样式',
        fold: true,
        items: bangumiDanmakuItems,
    },
    {
        name: '工具栏/作品信息',
        fold: true,
        items: bangumiToolbarItems,
    },
    {
        name: '右栏',
        fold: true,
        items: bangumiRightItems,
    },
    {
        name: '小窗播放器',
        fold: true,
        items: bangumiMiniPlayerItems,
    },
    {
        name: '页面右下角 小按钮',
        fold: true,
        items: bangumiSidebarItems,
    },
]

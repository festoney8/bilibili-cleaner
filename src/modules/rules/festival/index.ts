import { Group } from '@/types/collection'
import { festivalDanmakuItems } from './groups/danmaku'
import { festivalDanmakuControlItems } from './groups/danmakuControl'
import { festivalPlayerItems } from './groups/player'
import { festivalPlayerControlItems } from './groups/playerControl'
import { festivalSubtitleItems } from './groups/subtitle'

export const festivalGroups: Group[] = [
    {
        name: '播放器',
        fold: true,
        items: festivalPlayerItems,
    },
    {
        name: '播放控制栏',
        fold: true,
        items: festivalPlayerControlItems,
    },
    {
        name: '弹幕控制栏',
        fold: true,
        items: festivalDanmakuControlItems,
    },
    {
        name: '弹幕样式',
        fold: true,
        items: festivalDanmakuItems,
    },
    {
        name: '字幕样式',
        fold: true,
        items: festivalSubtitleItems,
    },
]

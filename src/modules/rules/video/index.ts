import { Group } from '../../../types/collection'
import { videoBasicItems } from './groups/basic'
import { videoDanmakuItems } from './groups/danmaku'
import { videoInfoItems } from './groups/info'
import { videoMiniPlayerItems } from './groups/miniPlayer'
import { videoPlayerItems } from './groups/player'
import { videoPlayerControlItems } from './groups/playerControl'
import { videoPlayerLayoutItems } from './groups/playerLayout'
import { videoRightItems } from './groups/right'
import { videoSidebarItems } from './groups/sidebar'
import { videoSubtitleItems } from './groups/subtitle'
import { videoToolbarItems } from './groups/toolbar'
import { videoUpInfoItems } from './groups/upInfo'

export const videoGroups: Group[] = [
    {
        name: '基本功能',
        fold: true,
        items: videoBasicItems,
    },
    {
        name: '播放设定',
        fold: true,
        items: videoPlayerLayoutItems,
    },
    {
        name: '视频信息',
        fold: true,
        items: videoInfoItems,
    },
    {
        name: '播放器',
        fold: true,
        items: videoPlayerItems,
    },
    {
        name: '播放控制栏',
        fold: true,
        items: videoPlayerControlItems,
    },
    {
        name: '弹幕栏',
        fold: true,
        items: videoDanmakuItems,
    },
    {
        name: 'CC 字幕',
        fold: true,
        items: videoSubtitleItems,
    },
    {
        name: '视频下方信息',
        fold: true,
        items: videoToolbarItems,
    },
    {
        name: '右侧 UP主信息',
        fold: true,
        items: videoUpInfoItems,
    },
    {
        name: '右侧 视频栏',
        fold: true,
        items: videoRightItems,
    },
    {
        name: '小窗播放器',
        fold: true,
        items: videoMiniPlayerItems,
    },
    {
        name: '页面右下角 小按钮',
        fold: true,
        items: videoSidebarItems,
    },
]

import { Group } from '../../../types/rule'
import { videoBasicItems } from './groups/basic'
import { videoDanmakuItems } from './groups/danmaku'
import { videoInfoItems } from './groups/info'
import { videoMiniPlayerItems } from './groups/miniPlayer'
import { videoPlayerItems } from './groups/player'
import { videoPlayerControlItems } from './groups/playerControl'
import { videoPlayerLayoutItems } from './groups/playerLayout'
import { videoRightItems } from './groups/right'
import { videoSidebarItems } from './groups/sidebar'
import { videoToolbarItems } from './groups/toolbar'
import { videoUpInfoItems } from './groups/upInfo'

export const videoGroups: Group[] = [
  {
    name: '播放页 基本功能',
    items: videoBasicItems,
  },
  {
    name: '播放设定',
    items: videoPlayerLayoutItems,
  },
  {
    name: '视频信息',
    items: videoInfoItems,
  },
  {
    name: '播放器',
    items: videoPlayerItems,
  },
  {
    name: '播放控制',
    items: videoPlayerControlItems,
  },
  {
    name: '弹幕栏',
    items: videoDanmakuItems,
  },
  {
    name: '视频下方 三连/简介/Tag',
    items: videoToolbarItems,
  },
  {
    name: '右侧 UP主信息',
    items: videoUpInfoItems,
  },
  {
    name: '右侧 视频栏',
    items: videoRightItems,
  },
  {
    name: '小窗播放器',
    items: videoMiniPlayerItems,
  },
  {
    name: '页面右下角 小按钮',
    items: videoSidebarItems,
  },
]

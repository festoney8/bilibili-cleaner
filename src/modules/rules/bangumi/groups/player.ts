import { Item } from '../../../../types/item'

export const bangumiPlayerItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-top-left-title',
        name: '隐藏 全屏下 播放器内标题',
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-bpx-player-top-follow',
        name: '隐藏 追番/追剧按钮 ★',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-top-issue',
        name: '隐藏 反馈按钮',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-state-wrap',
        name: '隐藏 视频暂停时大Logo',
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-bpx-player-record-item-wrap',
        name: '隐藏 视频内封审核号(非内嵌) ★',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-dialog-wrap',
        name: '隐藏 弹幕悬停 点赞/复制/举报',
    },
    {
        type: 'switch',
        id: 'video-page-bpx-player-bili-high-icon',
        name: '隐藏 高赞弹幕前点赞按钮',
    },
    {
        type: 'switch',
        id: 'video-page-bpx-player-bili-dm-vip-white',
        name: '彩色渐变弹幕 变成白色',
    },
]

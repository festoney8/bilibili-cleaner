import { Item } from '../../../../types/item'

export const videoPlayerItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-guide-all',
        name: '隐藏 一键三连',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-vote',
        name: '隐藏 投票',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-qoe-feedback',
        name: '隐藏 播放效果调查',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-score',
        name: '隐藏 评分',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-score-sum',
        name: '隐藏 评分总结',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-clock',
        name: '隐藏 打卡',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-cmtime',
        name: '隐藏 心动',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-cmd-shrink',
        name: '隐藏 迷你弹窗',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-reserve',
        name: '隐藏 视频预告',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-bili-link',
        name: '隐藏 视频链接 (稍后再看)',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-cmd-dm-wrap',
        name: '隐藏 播放器内所有弹窗 (强制)',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-top-left-title',
        name: '隐藏 播放器内标题',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-top-left-music',
        name: '隐藏 视频音乐链接',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-top-left-follow',
        name: '隐藏 左上角 关注UP主',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-top-issue',
        name: '隐藏 右上角 反馈按钮',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-state-wrap',
        name: '隐藏 视频暂停时大Logo',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ending-related',
        name: '隐藏 播放结束后视频推荐',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-dialog-wrap',
        name: '隐藏 弹幕悬停点赞/复制/举报',
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
    {
        type: 'switch',
        id: 'video-page-bpx-player-subtitle-font-family',
        name: 'CC字幕 字体优化 (实验性)',
    },
    {
        type: 'switch',
        id: 'video-page-bpx-player-subtitle-text-stroke',
        name: 'CC字幕 字体描边 (实验性)',
    },
]

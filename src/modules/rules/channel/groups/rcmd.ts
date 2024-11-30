import { Item } from '@/types/item'

export const channelRcmdItems: Item[] = [
    {
        type: 'switch',
        id: 'channel-hide-high-energy-topic',
        name: '隐藏 前方高能右侧 话题精选',
    },
    {
        type: 'switch',
        id: 'channel-hide-high-energy',
        name: '隐藏 前方高能栏目',
    },
    {
        type: 'switch',
        id: 'channel-hide-rank-list',
        name: '隐藏 视频栏目右侧 热门列表',
    },
    {
        type: 'switch',
        id: 'channel-hide-ad-banner',
        name: '隐藏 广告banner',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'channel-hide-video-info-date',
        name: '隐藏 发布时间',
    },
    {
        type: 'switch',
        id: 'channel-hide-danmaku-count',
        name: '隐藏 弹幕数',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'channel-hide-bili-watch-later',
        name: '隐藏 稍后再看按钮',
    },
    {
        type: 'switch',
        id: 'channel-feed-card-body-grid-gap',
        name: '优化 近期投稿栏目 视频行距',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'channel-increase-rcmd-list-font-size',
        name: '增大 视频信息字号',
    },
]

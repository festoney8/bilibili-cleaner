import { Item } from '../../../../types/item'

export const videoToolbarItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-coin-disable-auto-like',
        name: '投币时不自动点赞 (关闭需刷新)',
    },
    {
        type: 'switch',
        id: 'video-page-hide-video-share-popover',
        name: '隐藏 分享按钮弹出菜单',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-video-ai-assistant',
        name: '隐藏 官方AI总结',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-video-note',
        name: '隐藏 记笔记',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-video-report-menu',
        name: '隐藏 举报/笔记/稍后再看',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-desc',
        name: '隐藏 视频简介',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-info-tag',
        name: '隐藏 tag列表',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-activity-vote',
        name: '隐藏 活动宣传',
    },
    {
        type: 'switch',
        id: 'video-page-hide-below-bannerAd',
        name: '隐藏 广告banner',
    },
]

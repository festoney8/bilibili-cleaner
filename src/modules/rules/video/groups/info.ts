import { Item } from '../../../../types/item'

export const videoInfoItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-unfold-video-info-title',
        name: '展开 多行视频标题',
    },
    {
        type: 'switch',
        id: 'video-page-hide-video-info-danmaku-count',
        name: '隐藏 弹幕数',
    },
    {
        type: 'switch',
        id: 'video-page-hide-video-info-pubdate',
        name: '隐藏 发布日期',
    },
    {
        type: 'switch',
        id: 'video-page-hide-video-info-copyright',
        name: '隐藏 版权声明',
    },
    {
        type: 'switch',
        id: 'video-page-hide-video-info-honor',
        name: '隐藏 视频荣誉 (排行榜/每周必看)',
    },
    {
        type: 'switch',
        id: 'video-page-hide-video-info-argue',
        name: '隐藏 温馨提示 (饮酒/危险/AI生成)',
        defaultEnable: true,
    },
]

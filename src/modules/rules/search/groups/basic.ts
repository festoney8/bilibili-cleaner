import { Item } from '../../../../types/item'

export const searchBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'hide-search-page-search-sticky-header',
        name: '顶栏 滚动页面后 不再吸附顶部',
    },
    {
        type: 'switch',
        id: 'hide-search-page-ad',
        name: '隐藏 搜索结果中的广告',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'hide-search-page-bangumi-pgc-list',
        name: '隐藏 搜索结果顶部 版权作品',
    },
    {
        type: 'switch',
        id: 'hide-search-page-activity-game-list',
        name: '隐藏 搜索结果顶部 游戏、热搜话题',
    },
    {
        type: 'switch',
        id: 'hide-search-page-danmaku-count',
        name: '隐藏 弹幕数量',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'hide-search-page-date',
        name: '隐藏 视频日期',
    },
    {
        type: 'switch',
        id: 'hide-search-page-bili-watch-later',
        name: '隐藏 稍后再看按钮',
    },
]

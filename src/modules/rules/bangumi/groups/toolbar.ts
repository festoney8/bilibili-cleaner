import { Item } from '../../../../types/item'

export const bangumiToolbarItems: Item[] = [
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
        id: 'bangumi-page-hide-watch-together',
        name: '隐藏 一起看 ★',
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-toolbar',
        name: '隐藏 整个工具栏(赞币转) ★',
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-media-info',
        name: '隐藏 作品介绍 ★',
    },
    {
        type: 'switch',
        id: 'bangumi-page-simple-media-info',
        name: '精简 作品介绍 ★',
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-sponsor-module',
        name: '隐藏 承包榜 ★',
    },
]

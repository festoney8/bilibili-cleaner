import { Item } from '../../../../types/item'

export const bangumiRightItems: Item[] = [
    {
        type: 'switch',
        id: 'bangumi-page-hide-right-container-section-height',
        name: '隐藏 大会员按钮 ★',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-danmaku',
        name: '隐藏 弹幕列表',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-eplist-badge',
        name: '隐藏 视频列表 会员/限免标记 ★',
    },
    {
        type: 'switch',
        id: 'bangumi-page-hide-recommend',
        name: '隐藏 相关作品推荐 ★',
    },
]

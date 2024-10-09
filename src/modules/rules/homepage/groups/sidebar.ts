import { Item } from '../../../../types/item'

export const homepageSidebarItems: Item[] = [
    {
        type: 'switch',
        id: 'homepage-hide-desktop-download-tip',
        name: '隐藏 下载桌面端弹窗',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-hide-trial-feed-wrap',
        name: '隐藏 下滑浏览推荐提示',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-hide-feed-roll-btn',
        name: '隐藏 换一换',
    },
    {
        type: 'switch',
        id: 'homepage-hide-watchlater-pip-button',
        name: '隐藏 稍后再看',
    },
    {
        type: 'switch',
        id: 'homepage-hide-flexible-roll-btn',
        name: '隐藏 刷新',
    },
    {
        type: 'switch',
        id: 'homepage-hide-feedback',
        name: '隐藏 客服和反馈',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-hide-top-btn',
        name: '隐藏 回顶部',
    },
]

import { Item } from '../../../../types/item'

export const bangumiPlayerLayoutItems: Item[] = [
    {
        type: 'switch',
        id: 'default-widescreen',
        name: '默认宽屏播放 刷新生效',
    },
    {
        type: 'switch',
        id: 'webscreen-scrollable',
        name: '网页全屏时 页面可滚动 滚轮调音量失效（Firefox 不适用）',
    },
    {
        type: 'switch',
        id: 'fullscreen-scrollable',
        name: '全屏时 页面可滚动 滚轮调音量失效（实验功能，Firefox 不适用）',
    },
]

import { Item } from '@/types/item'

export const channelNextRcmdItems: Item[] = [
    {
        type: 'switch',
        id: 'channel-hide-danmaku-count',
        name: '隐藏 弹幕数',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'channel-increase-rcmd-list-font-size',
        name: '增大 视频信息字号',
    },
]

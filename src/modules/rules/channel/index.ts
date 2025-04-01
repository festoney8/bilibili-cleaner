import { Group } from '@/types/collection'
import { channelBasicItems } from './groups/basic'
import { channelLayoutItems } from './groups/layout'
import { channelRcmdItems } from './groups/rcmd'

export const channelGroups: Group[] = [
    {
        name: '分区页 基础功能',
        items: channelBasicItems,
    },
    {
        name: '页面布局',
        items: channelLayoutItems,
    },
    {
        name: '视频列表',
        items: channelRcmdItems,
    },
]

import { Group } from '@/types/collection'
import { channelNextBasicItems } from './groups/basic'
import { channelNextRcmdItems } from './groups/rcmd'

export const channelNextGroups: Group[] = [
    {
        name: '分区页 基础功能',
        items: channelNextBasicItems,
    },
    {
        name: '视频列表',
        items: channelNextRcmdItems,
    },
]

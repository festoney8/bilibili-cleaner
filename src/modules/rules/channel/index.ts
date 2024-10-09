import { Group } from '../../../types/collection'
import { channelBasicItems } from './groups/basic'
import { channelRcmdItems } from './groups/rcmd'
import { channelSidebarItems } from './groups/sidebar'

export const channelGroups: Group[] = [
    {
        name: '分区页 基础功能',
        items: channelBasicItems,
    },
    {
        name: '视频列表',
        items: channelRcmdItems,
    },
    {
        name: '页面右下角 小按钮',
        items: channelSidebarItems,
    },
]

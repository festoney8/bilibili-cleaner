import { Group } from '../../../types/collection'
import { homepageBasicItems } from './groups/basic'
import { homepageLayoutItems } from './groups/layout'
import { homepagePluginItems } from './groups/plugin'
import { homepageRcmdItems } from './groups/rcmd'
import { homepageSidebarItems } from './groups/sidebar'

export const homepageGroups: Group[] = [
    {
        name: '基本功能',
        items: homepageBasicItems,
    },
    {
        name: '页面布局',
        items: homepageLayoutItems,
    },
    {
        name: '视频列表',
        items: homepageRcmdItems,
    },
    {
        name: '页面侧栏 小组件',
        items: homepageSidebarItems,
    },
    {
        name: '适配插件 bilibili-app-recommend',
        items: homepagePluginItems,
    },
]

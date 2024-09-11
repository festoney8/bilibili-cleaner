import { Item } from '../../../../types/item'

export const liveBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'live-page-sidebar-vm',
        name: '隐藏 页面右侧按钮 实验室/关注',
    },
    {
        type: 'switch',
        id: 'live-page-default-skin',
        name: '禁用 播放器皮肤',
    },
    {
        type: 'switch',
        id: 'live-page-remove-wallpaper',
        name: '禁用 直播背景',
    },
    {
        type: 'switch',
        id: 'font-patch',
        name: '修复字体',
    },
    {
        type: 'switch',
        id: 'activity-live-auto-jump',
        name: '活动直播页 自动跳转普通直播 (实验功能)',
    },
    {
        type: 'switch',
        id: 'auto-best-quality',
        name: '自动切换最高画质 (实验功能)',
    },
]

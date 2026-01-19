import { Item } from '@/types/item'

export const bangumiDanmakuControlItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-video-info-online',
        name: '隐藏 同时在看人数',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-video-info-dm',
        name: '隐藏 装填弹幕数量',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-dm-switch',
        name: '隐藏 弹幕开关',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-dm-setting',
        name: '隐藏 弹幕显示设置',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-video-btn-dm',
        name: '隐藏 弹幕样式',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-dm-input',
        name: '隐藏 占位文字',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-dm-hint',
        name: '隐藏 弹幕礼仪',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-dm-btn-send',
        name: '隐藏 发送按钮',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-sending-area',
        name: '非全屏时 关闭弹幕栏',
        description: ['字母 D 是弹幕开关快捷键'],
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-video-inputbar',
        name: '全屏时 关闭弹幕输入框',
    },
    {
        type: 'switch',
        id: 'video-page-show-fullscreen-bpx-player-video-info-online',
        name: '全屏时 显示同时在看人数',
    },
]

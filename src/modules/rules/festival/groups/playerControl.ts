import { Item } from '@/types/item'

export const festivalPlayerControlItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-prev',
        name: '隐藏 上一个视频',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-play',
        name: '隐藏 播放/暂停',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-next',
        name: '隐藏 下一个视频',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-viewpoint',
        name: '隐藏 章节列表',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-flac',
        name: '隐藏 Hi-Res无损',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-quality',
        name: '隐藏 清晰度',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-eplist',
        name: '隐藏 选集',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-playbackrate',
        name: '隐藏 倍速',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-subtitle',
        name: '隐藏 字幕',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-volume',
        name: '隐藏 音量',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-setting',
        name: '隐藏 视频设置',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-pip',
        name: '隐藏 画中画',
        description: ['Chrome / Edge 浏览器可用', 'Firefox 可在浏览器设置中关闭'],
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-wide',
        name: '隐藏 宽屏',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-web',
        name: '隐藏 网页全屏',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-ctrl-full',
        name: '隐藏 全屏',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-pbp-pin',
        name: '隐藏 高能进度条 图钉按钮',
    },
    {
        type: 'switch',
        id: 'video-page-hide-bpx-player-shadow-progress-area',
        name: '隐藏 底边mini视频进度',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-show-bpx-player-shadow-progress-area-fullscreen',
        name: '全屏时 显示底边mini视频进度',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-show-bpx-player-pbp',
        name: '控制栏收起时 显示高能进度条',
    },
]

import { Item } from '@/types/item'

export const videoSubtitleItems: Item[] = [
    {
        type: 'string',
        id: 'video-page-subtitle-font-color',
        name: '字幕颜色',
        description: ['遵循 CSS color 语法，留空为禁用'],
        defaultValue: '',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty(
                '--video-page-subtitle-font-color',
                value.trim().replace(/;$/, ''),
            )
        },
    },
    {
        type: 'string',
        id: 'video-page-subtitle-font-family',
        name: '字幕字体',
        description: ['遵循 CSS font-family 语法，留空为禁用', '确保本地已安装该字体，检查家族名是否正确'],
        defaultValue: 'PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty(
                '--video-page-subtitle-font-family',
                value.trim().replace(/;$/, ''),
            )
        },
    },
    {
        type: 'string',
        id: 'video-page-subtitle-font-weight',
        name: '字幕字重',
        description: ['遵循 CSS font-weight 语法，留空为禁用', '确保本地字体支持该字重'],
        defaultValue: '',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty(
                '--video-page-subtitle-font-weight',
                value.trim().replace(/;$/, ''),
            )
        },
    },
    {
        type: 'string',
        id: 'video-page-subtitle-text-stroke-color',
        name: '描边颜色',
        description: ['遵循 CSS color 语法，留空为禁用', '官方字幕设定需选择 "无描边"'],
        defaultValue: '',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty(
                '--video-page-subtitle-text-stroke-color',
                value.trim().replace(/;$/, ''),
            )
        },
    },
    {
        type: 'number',
        id: 'video-page-subtitle-text-stroke-width',
        name: '描边宽度 (0为禁用)',
        minValue: 0,
        maxValue: 10,
        step: 0.01,
        defaultValue: 3.5,
        disableValue: 0,
        addonText: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--video-page-subtitle-text-stroke-width', `${value}px`)
        },
    },
]

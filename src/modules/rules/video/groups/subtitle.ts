import { Item } from '../../../../types/item'

export const videoSubtitleItems: Item[] = [
    {
        type: 'string',
        id: 'video-page-subtitle-font-color',
        name: '字幕颜色',
        description: ['遵循 CSS color 语法，留空为禁用'],
        defaultValue: '',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty('--video-page-subtitle-font-color', value)
        },
    },
    {
        type: 'string',
        id: 'video-page-subtitle-font-family',
        name: '字体设定',
        description: ['遵循 CSS font-family 语法，留空为禁用', '请确保本地已安装字体，检查家族名是否正确'],
        defaultValue: 'PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty('--video-page-subtitle-font-family', value)
        },
    },
    {
        type: 'string',
        id: 'video-page-subtitle-text-stroke-color',
        name: '描边颜色',
        description: ['遵循 CSS color 语法，留空为禁用', '官方字幕设定请选择 "无描边"'],
        defaultValue: '',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty('--video-page-subtitle-text-stroke-color', value)
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

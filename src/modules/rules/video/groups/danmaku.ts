import { Item } from '../../../../types/item'

export const videoDanmakuItems: Item[] = [
    {
        type: 'string',
        id: 'video-page-danmaku-font-family',
        name: '弹幕字体',
        description: ['遵循 CSS font-family 语法，留空为禁用', '确保本地已安装该字体，检查家族名是否正确'],
        defaultValue: 'PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty(
                '--video-page-danmaku-font-family',
                value.trim().replace(/;$/, ''),
            )
        },
    },
    {
        type: 'string',
        id: 'video-page-danmaku-font-weight',
        name: '弹幕字重',
        description: ['遵循 CSS font-weight 语法，留空为禁用', '确保本地字体支持该字重'],
        defaultValue: '',
        disableValue: '',
        fn: (value: string) => {
            document.documentElement.style.setProperty(
                '--video-page-danmaku-font-weight',
                value.trim().replace(/;$/, ''),
            )
        },
    },
]

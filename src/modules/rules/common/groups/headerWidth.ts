import { Item } from '../../../../types/item'

export const commonHeaderWidthItems: Item[] = [
    {
        type: 'number',
        id: 'common-header-bar-padding-left',
        name: '顶栏左侧 与页面左边界距离',
        minValue: -1,
        maxValue: 2000,
        defaultValue: -1,
        disableValue: -1,
        attrName: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--common-header-bar-padding-left', `${value}px`)
        },
    },
    {
        type: 'number',
        id: 'common-header-bar-search-width',
        name: '顶栏中间 搜索框宽度',
        minValue: -1,
        maxValue: 2000,
        defaultValue: -1,
        disableValue: -1,
        attrName: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--common-header-bar-search-width', `${value}px`)
        },
    },
    {
        type: 'number',
        id: 'common-header-bar-padding-right',
        name: '顶栏右侧 与页面右边界距离',
        minValue: -1,
        maxValue: 2000,
        defaultValue: -1,
        disableValue: -1,
        attrName: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--common-header-bar-padding-right', `${value}px`)
        },
    },
]

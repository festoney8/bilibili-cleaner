import { Item } from '../../../../types/item'

export const commonHeaderWidthItems: Item[] = [
    {
        type: 'number',
        id: 'common-header-bar-padding-left',
        name: '左边界距离（-1禁用）',
        minValue: -1,
        maxValue: 2000,
        defaultValue: -1,
        disableValue: -1,
        addonText: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--common-header-bar-padding-left', `${value}px`)
        },
    },
    {
        type: 'number',
        id: 'common-header-bar-search-width',
        name: '搜索框宽度（-1禁用）',
        minValue: -1,
        maxValue: 2000,
        defaultValue: -1,
        disableValue: -1,
        addonText: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--common-header-bar-search-width', `${value}px`)
        },
    },
    {
        type: 'number',
        id: 'common-header-bar-padding-right',
        name: '右边界距离（-1禁用）',
        minValue: -1,
        maxValue: 2000,
        defaultValue: -1,
        disableValue: -1,
        addonText: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--common-header-bar-padding-right', `${value}px`)
        },
    },
]

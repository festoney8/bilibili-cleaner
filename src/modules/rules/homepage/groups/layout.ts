import { Item } from '../../../../types/item'

export const homepageLayoutItems: Item[] = [
    // Todo: radio item

    {
        type: 'number',
        id: 'homepage-layout-padding',
        name: '修改 页面两侧边距 (-1禁用)',
        minValue: -1,
        maxValue: 500,
        defaultValue: -1,
        disableValue: -1,
        addonText: 'px',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--homepage-layout-padding', `${value}px`)
        },
    },
]

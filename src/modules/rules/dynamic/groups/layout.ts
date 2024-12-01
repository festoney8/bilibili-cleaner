import { Item } from '@/types/item'

export const dynamicLayoutItems: Item[] = [
    {
        type: 'number',
        id: 'dynamic-list-width',
        name: '动态列表 中栏宽度 (0禁用)',
        minValue: 0,
        maxValue: 100,
        step: 1,
        defaultValue: 0,
        disableValue: 0,
        addonText: 'vw',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--dynamic-list-width', value + 'vw')
        },
    },
    {
        type: 'number',
        id: 'dynamic-detail-width',
        name: '动态详情 中栏宽度 (0禁用)',
        minValue: 0,
        maxValue: 100,
        step: 1,
        defaultValue: 0,
        disableValue: 0,
        addonText: 'vw',
        fn: (value: number) => {
            document.documentElement.style.setProperty('--dynamic-detail-width', value + 'vw')
        },
    },
]

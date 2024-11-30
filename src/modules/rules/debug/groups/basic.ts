import { Item } from '@/types/item'

export const debugBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'debug-rules',
        name: 'Debug Rules',
    },
    {
        type: 'switch',
        id: 'debug-filters',
        name: 'Debug Filters',
        description: ['严重影响过滤性能'],
    },
]

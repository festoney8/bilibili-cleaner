import { Group } from '../../../types/collection'
import { debugBasicItems } from './groups/basic'

export const debugGroups: Group[] = [
    {
        name: '日志输出',
        fold: true,
        items: debugBasicItems,
    },
]

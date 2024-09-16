import { Group } from '../../../types/collection'
import { spcaeBasicItems } from './groups/basic'
import { spcaeDynamicItems } from './groups/dynamic'

export const spaceGroups: Group[] = [
    {
        name: '基本功能',
        items: spcaeBasicItems,
    },
    {
        name: '动态列表',
        items: spcaeDynamicItems,
    },
]

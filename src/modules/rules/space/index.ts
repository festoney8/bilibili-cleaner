import { Group } from '../../../types/collection'
import { spaceBasicItems } from './groups/basic'
import { spaceDynamicItems } from './groups/dynamic'

export const spaceGroups: Group[] = [
    {
        name: '基本功能',
        items: spaceBasicItems,
    },
    {
        name: '动态列表',
        items: spaceDynamicItems,
    },
]

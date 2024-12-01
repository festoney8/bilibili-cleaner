import { Group } from '@/types/collection'
import { commentBasicItems } from './groups/basic'

export const commentGroups: Group[] = [
    {
        name: '全站通用 - 评论区',
        fold: true,
        items: commentBasicItems,
    },
]

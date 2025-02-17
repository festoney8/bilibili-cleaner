import { Item } from '@/types/item'

export const commonHeaderCenterItems: Item[] = [
    {
        type: 'switch',
        id: 'common-hide-nav-search-rcmd',
        name: '隐藏 推荐搜索',
        enableFn: async () => {
            let cnt = 0
            const id = setInterval(() => {
                const el = document.querySelector('input.nav-search-input') as HTMLInputElement
                if (el && el.title !== '') {
                    el.title = ''
                    el.placeholder = ''
                    clearInterval(id)
                }
                ++cnt > 20 && clearInterval(id)
            }, 500)
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-search-history',
        name: '隐藏 搜索历史',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-search-trending',
        name: '隐藏 bilibili热搜',
    },
    {
        type: 'switch',
        id: 'common-nav-search-middle-justify',
        name: '修复 搜索框居中',
    },
]

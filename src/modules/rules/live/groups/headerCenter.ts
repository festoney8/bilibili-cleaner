import { Item } from '@/types/item'

export const liveHeaderCenterItems: Item[] = [
    {
        type: 'switch',
        id: 'live-page-nav-search-rcmd',
        name: '隐藏 推荐搜索',
        enableFn: async () => {
            let cnt = 0
            const id = setInterval(() => {
                const el = document.querySelector('input.nav-search-content') as HTMLInputElement
                if (el) {
                    clearInterval(id)
                    el.title = ''
                    el.placeholder = ''
                    new MutationObserver(() => {
                        if (el.title) {
                            el.title = ''
                        }
                        if (el.placeholder) {
                            el.placeholder = ''
                        }
                    }).observe(el, {
                        attributeFilter: ['placeholder', 'title'],
                    })
                }
                ++cnt > 20 && clearInterval(id)
            }, 500)
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'live-page-nav-search-history',
        name: '隐藏 搜索历史',
    },
    {
        type: 'switch',
        id: 'live-page-nav-search-trending',
        name: '隐藏 bilibili热搜',
    },
    {
        type: 'switch',
        id: 'live-page-header-search-block',
        name: '隐藏 搜索框',
    },
]

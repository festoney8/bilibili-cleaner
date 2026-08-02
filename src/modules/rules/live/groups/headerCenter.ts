import { Item } from '@/types/item'
import { createNavSearchRcmdHider } from '@/utils/tool'

const liveNavSearchRcmdHider = createNavSearchRcmdHider(
    '#nav-searchform input, input.nav-search-content',
    '#nav-searchform .search-btn, #nav-searchform .nav-search-btn',
)

export const liveHeaderCenterItems: Item[] = [
    {
        type: 'switch',
        id: 'live-page-header-search-btn',
        name: '隐藏 搜索按钮',
    },
    {
        type: 'switch',
        id: 'live-page-nav-search-rcmd',
        name: '隐藏 推荐搜索',
        description: ['同时禁用 hover 提示与空搜索跳转推荐'],
        enableFn: () => {
            liveNavSearchRcmdHider.enable()
        },
        disableFn: () => {
            liveNavSearchRcmdHider.disable()
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

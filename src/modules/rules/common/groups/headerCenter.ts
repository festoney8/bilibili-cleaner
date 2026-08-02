import { Item } from '@/types/item'
import { createNavSearchRcmdHider } from '@/utils/tool'

const commonNavSearchRcmdHider = createNavSearchRcmdHider(
    'input.nav-search-input, #internationalHeader #nav_searchform input',
    '#nav-searchform .nav-search-btn, #nav_searchform .nav-search-btn',
)

export const commonHeaderCenterItems: Item[] = [
    {
        type: 'switch',
        id: 'common-hide-nav-search-btn',
        name: '隐藏 搜索按钮',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-search-rcmd',
        name: '隐藏 推荐搜索',
        description: ['同时禁用 hover 提示与空搜索跳转推荐'],
        enableFn: () => {
            commonNavSearchRcmdHider.enable()
        },
        disableFn: () => {
            commonNavSearchRcmdHider.disable()
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

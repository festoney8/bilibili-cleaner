import { Item } from '@/types/item'
import { isPageLive } from '@/utils/pageType'

let isRcmdHide = false

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
        description: ['禁用后需刷新页面'],
        // https://greasyfork.org/zh-CN/scripts/479861/discussions/285183
        enableFn: async () => {
            if (!isPageLive()) {
                return
            }
            if (isRcmdHide) {
                return
            }
            isRcmdHide = true
            let cnt = 0
            const id = setInterval(() => {
                const inputEl = document.querySelector('.search-bar .nav-search-content') as HTMLInputElement
                const btnEl = document.querySelector('.search-bar .search-btn') as HTMLDivElement
                if (inputEl && btnEl) {
                    clearInterval(id)
                    // 清空数据
                    inputEl.placeholder = ''
                    inputEl.title = ''
                    // 回车事件
                    inputEl.addEventListener(
                        'keydown',
                        (e) => {
                            if (e.key === 'Enter' && !e.isComposing && inputEl.value.trim() === '') {
                                e.preventDefault()
                                e.stopPropagation()
                                e.stopImmediatePropagation()
                            }
                        },
                        true,
                    )
                    // 无输入时单击搜索跳转纯净直播间搜索页
                    btnEl.addEventListener(
                        'click',
                        (e) => {
                            if (inputEl.value.trim() === '') {
                                e.preventDefault()
                                e.stopPropagation()
                                e.stopImmediatePropagation()
                                window.open('https://search.bilibili.com/live', '_blank')
                            }
                        },
                        true,
                    )
                    // monkey patch title
                    // placeholder 用纯 CSS 隐藏，B 站不使用 setAttribute 修改 title
                    const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'title')
                    if (!desc?.get || !desc?.set) {
                        return
                    }
                    Object.defineProperty(inputEl, 'title', {
                        get: () => '',
                        set: () => {},
                        configurable: true,
                    })
                }
                ++cnt > 20 && clearInterval(id)
            }, 500)
        },
        enableFnRunAt: 'document-start',
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

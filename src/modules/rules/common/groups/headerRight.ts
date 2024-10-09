import { Item } from '../../../../types/item'

export const commonHeaderRightItems: Item[] = [
    {
        type: 'switch',
        id: 'common-hide-nav-avatar',
        name: '隐藏 头像',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-vip',
        name: '隐藏 大会员',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'common-hide-nav-message',
        name: '隐藏 消息',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-message-red-num',
        name: '隐藏 消息小红点',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-dynamic',
        name: '隐藏 动态',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-dynamic-red-num',
        name: '隐藏 动态小红点',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-favorite',
        name: '隐藏 收藏',
    },
    {
        type: 'switch',
        id: 'common-nav-favorite-select-watchlater',
        name: '收藏弹出框 自动选中稍后再看',
        noStyle: true,
        enableFn: async () => {
            if (!CSS.supports('selector(:has(*))')) {
                return
            }
            let cnt = 0
            const id = setInterval(() => {
                const ele = document.querySelector(
                    `.right-entry .v-popover-wrap:has(.right-entry__outside[href$="/favlist"]),
                        .nav-user-center .user-con .item:has(.mini-favorite)`,
                )
                if (ele) {
                    clearInterval(id)
                    ele.addEventListener('mouseenter', () => {
                        let innerCnt = 0
                        const watchLaterId = setInterval(() => {
                            const watchlater = document.querySelector(
                                `:is(.favorite-panel-popover, .vp-container .tabs-panel) .tab-item:nth-child(2)`,
                            ) as HTMLElement
                            if (watchlater) {
                                watchlater.click()
                                clearInterval(watchLaterId)
                            } else {
                                innerCnt++
                                innerCnt > 250 && clearInterval(watchLaterId)
                            }
                        }, 20)
                    })
                } else {
                    cnt++
                    cnt > 100 && clearInterval(id)
                }
            }, 200)
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-history',
        name: '隐藏 历史',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-member',
        name: '隐藏 创作中心',
    },
    {
        type: 'switch',
        id: 'common-hide-nav-upload',
        name: '隐藏 投稿',
    },
]

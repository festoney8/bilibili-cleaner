import { Item } from '@/types/item'

export const dynamicCenterDynItems: Item[] = [
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-avatar-pendent',
        name: '隐藏 头像框',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-avatar-icon',
        name: '隐藏 头像徽章',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-ornament',
        name: '隐藏 动态右侧饰品',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-dispute',
        name: '隐藏 警告notice',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-official-topic',
        name: '隐藏 官方话题Tag',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-text-topic',
        name: '禁用 普通话题#Tag#高亮',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-item-interaction',
        name: '隐藏 动态精选互动 XXX赞了/XXX回复',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-card-reserve',
        name: '隐藏 视频预约/直播预约动态',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-card-goods',
        name: '隐藏 带货动态',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-lottery',
        name: '隐藏 抽奖动态 (含转发)',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-forward',
        name: '隐藏 转发的动态',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-vote',
        name: '隐藏 投票动态',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-live',
        name: '隐藏 直播通知动态',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-blocked',
        name: '隐藏 充电动态/问答动态',
    },
    {
        type: 'switch',
        id: 'hide-dynamic-page-bili-dyn-charge-video',
        name: '隐藏 全部充电视频 (含已充电)',
    },
    {
        type: 'switch',
        id: 'dynamic-page-unfold-dynamic',
        name: '自动展开 相同UP主被折叠的动态',
        noStyle: true,
        enableFn: async () => {
            // 大量动态下，单次耗时10ms内
            const unfold = () => {
                const dynFoldNodes = document.querySelectorAll('main .bili-dyn-list__item .bili-dyn-item-fold')
                if (dynFoldNodes.length) {
                    dynFoldNodes.forEach((e) => {
                        e instanceof HTMLDivElement && e.click()
                    })
                }
            }
            setInterval(unfold, 500)
        },
    },
    {
        type: 'switch',
        id: 'dynamic-page-unfold-dynamic-content',
        name: '自动展开 动态文字内容',
        description: ['自动隐藏 展开 按钮', '对专栏文章不生效'],
    },
]

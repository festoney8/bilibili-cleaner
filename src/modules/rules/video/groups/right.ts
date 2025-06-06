import { Item } from '@/types/item'
import { waitForEle } from '@/utils/tool'

export const videoRightItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-right-container-sticky-optimize',
        name: '优化 右栏底部吸附',
    },
    {
        type: 'switch',
        id: 'video-page-right-container-sticky-disable',
        name: '禁用 右栏底部吸附',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-ad',
        name: '隐藏 广告',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-video-page-game-card-small',
        name: '隐藏 游戏推荐',
    },
    {
        type: 'switch',
        id: 'video-page-unfold-right-container-danmaku',
        name: '自动展开 弹幕列表',
        enableFn: () => {
            let cnt = 0
            const id = setInterval(() => {
                const collapseHeader = document.querySelector(
                    '#danmukuBox .bui-collapse-wrap-folded .bui-collapse-header',
                ) as HTMLElement
                if (collapseHeader) {
                    collapseHeader.click()
                    clearInterval(id)
                }
                ++cnt > 20 && clearInterval(id)
            }, 500)
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-danmaku',
        name: '隐藏 弹幕列表',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-reco-list-next-play-next-button',
        name: '隐藏 自动连播开关',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-reco-list-next-play',
        name: '隐藏 接下来播放',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-multi-page-add-counter',
        name: '恢复 分P视频 编号',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-right-container-section-unfold-title',
        name: '展开 视频合集 第二行标题',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-section-height',
        name: '优化 视频合集 列表高度',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-section-next-btn',
        name: '隐藏 视频合集 自动连播开关',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-section-play-num',
        name: '隐藏 视频合集 播放量',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-section-abstract',
        name: '隐藏 视频合集 简介',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-section-subscribe',
        name: '隐藏 视频合集 订阅合集',
    },
    {
        type: 'switch',
        id: 'video-page-right-container-set-info-bottom',
        name: '相关视频 视频信息置底',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-duration',
        name: '隐藏 相关视频 视频时长',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-reco-list-rec-list-info-up',
        name: '隐藏 相关视频 UP主',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-reco-list-rec-list-info-plays',
        name: '隐藏 相关视频 播放和弹幕',
    },
    {
        type: 'switch',
        id: 'video-page-unfold-right-container-reco-list',
        name: '自动展开 相关视频',
        enableFn: () => {
            const fn = () => {
                let cnt = 0
                const id = setInterval(() => {
                    const btn = document.querySelector('.rec-footer') as HTMLElement
                    if (btn) {
                        if (btn.innerText.includes('展开')) {
                            btn.click()
                        }
                        if (btn.innerText.includes('收起')) {
                            clearInterval(id)
                        }
                    }
                    ++cnt > 10 && clearInterval(id)
                }, 1000)
            }
            fn()

            // handle soft navigation
            waitForEle(document, '.recommend-list-v1, .recommend-list-container', (node: HTMLElement): boolean =>
                ['recommend-list-v1', 'recommend-list-container'].includes(node.className),
            ).then((ele) => {
                if (ele) {
                    let lastURL = location.href
                    new MutationObserver(() => {
                        if (lastURL !== location.href) {
                            lastURL = location.href
                            fn()
                        }
                    }).observe(ele, { childList: true, subtree: true })
                }
            })
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-reco-list-rec-footer',
        name: '隐藏 展开/收起 按钮',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-reco-list-rec-list',
        name: '隐藏 全部相关视频',
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-right-bottom-banner',
        name: '隐藏 活动banner',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container-live',
        name: '隐藏 直播间推荐',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'video-page-hide-right-container',
        name: '隐藏 右栏 (宽屏模式不适用)',
    },
]

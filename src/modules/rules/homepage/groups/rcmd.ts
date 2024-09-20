import { Item } from '../../../../types/item'
import fetchHook from '../../../../utils/fetch'

export const homepageRcmdItems: Item[] = [
    {
        type: 'switch',
        id: 'homepage-increase-rcmd-list-font-size',
        name: '增大 视频信息字号',
    },
    {
        type: 'switch',
        id: 'homepage-hide-no-interest',
        name: '隐藏 视频负反馈 恢复标题宽度',
    },
    {
        type: 'switch',
        id: 'homepage-hide-up-info-icon',
        name: '隐藏 视频tag (已关注/1万点赞)',
    },
    {
        type: 'switch',
        id: 'homepage-hide-video-info-date',
        name: '隐藏 发布时间',
    },
    {
        type: 'switch',
        id: 'homepage-hide-danmaku-count',
        name: '隐藏 弹幕数',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-hide-bili-watch-later-tip',
        name: '隐藏 稍后再看提示语',
    },
    {
        type: 'switch',
        id: 'homepage-hide-bili-watch-later',
        name: '隐藏 稍后再看按钮',
    },
    {
        type: 'switch',
        id: 'homepage-hide-inline-player-danmaku',
        name: '隐藏 视频预览中的弹幕',
    },
    {
        type: 'switch',
        id: 'homepage-hide-ad-card',
        name: '隐藏 广告',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-hide-live-card-recommend',
        name: '隐藏 直播间推荐',
    },
    {
        type: 'switch',
        id: 'homepage-simple-sub-area-card-recommend',
        name: '简化 分区视频推荐',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'homepage-hide-sub-area-card-recommend',
        name: '隐藏 分区视频推荐',
    },
    {
        type: 'switch',
        id: 'homepage-hide-skeleton-animation',
        name: '关闭 视频载入 骨架动效',
    },
    {
        type: 'switch',
        id: 'homepage-hide-skeleton',
        name: '隐藏 视频载入 骨架',
    },
    {
        type: 'switch',
        id: 'homepage-increase-rcmd-load-size',
        name: '增大 视频载入 视频数量 (实验功能)',
        enableFn: () => {
            fetchHook.addPreFn((input: RequestInfo | URL, init: RequestInit | undefined): RequestInfo | URL => {
                if (
                    typeof input === 'string' &&
                    input.includes('api.bilibili.com') &&
                    input.includes('feed/rcmd') &&
                    init?.method?.toUpperCase() === 'GET'
                ) {
                    input = input.replace('&ps=12&', '&ps=24&')
                }
                return input
            })
        },
    },
    {
        type: 'switch',
        id: 'homepage-rcmd-video-preload',
        name: '启用 视频列表预加载 (不稳定功能)',
        description: [
            '需开启"隐藏 分区视频推荐"',
            '建议开启"增大视频载入数量"',
            '若影响视频载入或造成卡顿，请关闭本功能',
        ],
        enableFn: async () => {
            let cnt = 0
            const id = setInterval(() => {
                const anchor = document.querySelector('.load-more-anchor') as HTMLElement
                if (anchor) {
                    clearInterval(id)

                    // 向下滚动时，调整anchor位置
                    let lastScrollTop = 0
                    let isPreload = false
                    window.addEventListener('scroll', function () {
                        const scrollTop = window.scrollY || document.documentElement.scrollTop
                        if (scrollTop > lastScrollTop) {
                            const gap = innerHeight - anchor.getBoundingClientRect().top
                            if (gap > -innerHeight * 0.75 && !isPreload) {
                                anchor.classList.add('preload')
                                isPreload = true
                            } else {
                                isPreload && anchor.classList.remove('preload')
                                isPreload = false
                            }
                        } else {
                            isPreload && anchor.classList.remove('preload')
                            isPreload = false
                        }
                        lastScrollTop = scrollTop
                    })
                }
                if (++cnt > 80) {
                    clearInterval(id)
                }
            }, 250)
        },
        enableFnRunAt: 'document-end',
    },
]

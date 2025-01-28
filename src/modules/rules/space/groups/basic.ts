import { Item } from '@/types/item'

export const spaceBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'space-page-redirect-to-video',
        name: '打开用户主页 自动跳转到投稿',
        noStyle: true,
        enableFn: () => {
            if (/\/\d+\/?($|\?)/.test(location.pathname)) {
                const userid = location.pathname.match(/\d+/)?.[0]
                if (userid) {
                    location.href = `https://space.bilibili.com/${userid}/upload/video`
                }
            }
        },
    },
    {
        type: 'switch',
        id: 'hide-space-page-video-card-danmaku-count',
        name: '隐藏 视频信息 弹幕数',
        defaultEnable: true,
    },
    {
        type: 'switch',
        id: 'increase-space-page-video-card-font-size',
        name: '增大 视频信息 字号',
    },
]

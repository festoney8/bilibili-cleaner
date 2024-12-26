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
                    // 新版space会自动重定向到 /upload/video
                    location.href = `https://space.bilibili.com/${userid}/video`
                }
            }
        },
    },
]

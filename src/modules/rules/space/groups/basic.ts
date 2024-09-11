import { Item } from '../../../../types/item'

export const spcaeBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'space-page-redirect-to-video',
        name: '打开用户主页 自动跳转到投稿',
        enableFn: () => {
            if (/\/\d+\/?($|\?)/.test(location.pathname)) {
                const userid = location.pathname.match(/\d+/)?.[0]
                if (userid) {
                    location.href = `https://space.bilibili.com/${userid}/video`
                }
            }
        },
    },
    {
        type: 'switch',
        id: 'font-patch',
        name: '修复字体',
    },
]

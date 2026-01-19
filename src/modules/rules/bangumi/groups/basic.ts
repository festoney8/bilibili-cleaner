import { Item } from '@/types/item'

export const bangumiBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-simple-share',
        name: '净化分享功能',
        defaultEnable: true,
        description: ['点击分享按钮时，复制纯净链接'],
        noStyle: true,
        enableFn: async () => {
            // 监听shareBtn出现
            let counter = 0
            const id = setInterval(() => {
                counter++
                const shareBtn = document.getElementById('share-container-id')
                if (shareBtn) {
                    clearInterval(id)
                    // 新增click事件覆盖剪贴板
                    shareBtn.addEventListener('click', () => {
                        const mainTitle = document.querySelector("[class^='mediainfo_mediaTitle']")?.textContent
                        const subTitle = document.getElementById('player-title')?.textContent
                        const shareText = `《${mainTitle}》${subTitle} \nhttps://www.bilibili.com${location.pathname}`
                        navigator.clipboard.writeText(shareText).catch(() => {})
                    })
                } else if (counter > 50) {
                    clearInterval(id)
                }
            }, 200)
        },
        enableFnRunAt: 'document-end',
    },
    {
        type: 'switch',
        id: 'video-page-hide-fixed-header',
        name: '顶栏 滚动页面后 不再吸附顶部',
    },
]

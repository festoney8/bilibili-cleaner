import { Item } from '../../../../types/item'
import { matchAvidBvid, matchBvid } from '../../../../utils/tool'
import URLCleanerInstance from '../../../../utils/urlCleaner'

export const videoBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-bv2av',
        name: 'BV号转AV号',
        noStyle: true,
        enableFn: async () => {
            /**
             * algo by bilibili-API-collect
             * @see https://www.zhihu.com/question/381784377/answer/1099438784
             * @see https://github.com/SocialSisterYi/bilibili-API-collect/issues/740
             * @see https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/bvid_desc.html
             * @param bvid 输入BV号
             * @returns 输出纯数字av号
             */
            const bv2av = (url: string): string => {
                const XOR_CODE = 23442827791579n
                const MASK_CODE = 2251799813685247n
                const BASE = 58n
                const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf'
                const dec = (bvid: string): number => {
                    const bvidArr = Array.from<string>(bvid)
                    ;[bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]]
                    ;[bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]]
                    bvidArr.splice(0, 3)
                    const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n)
                    return Number((tmp & MASK_CODE) ^ XOR_CODE)
                }

                try {
                    if (url.includes('bilibili.com/video/BV')) {
                        const bvid = matchBvid(url)
                        if (bvid) {
                            // 保留query string中分P参数, anchor中reply定位
                            const urlObj = new URL(url)
                            const params = new URLSearchParams(urlObj.search)
                            let partNum = ''
                            if (params.has('p')) {
                                partNum += `?p=${params.get('p')}`
                            }
                            const aid = dec(bvid)
                            if (partNum || urlObj.hash) {
                                return `https://www.bilibili.com/video/av${aid}/${partNum}${urlObj.hash}`
                            }
                            return `https://www.bilibili.com/video/av${aid}`
                        }
                    }
                    return url
                } catch (err) {
                    return url
                }
            }
            URLCleanerInstance.cleanFnArr.push(bv2av)
            URLCleanerInstance.clean()
        },
    },
    {
        type: 'switch',
        id: 'video-page-simple-share',
        name: '净化分享功能',
        description: ['点击分享按钮时，复制纯净链接'],
        // 净化分享按钮写入剪贴板内容
        enableFn: async () => {
            // 监听shareBtn出现
            let counter = 0
            const id = setInterval(() => {
                counter++
                const shareBtn = document.getElementById('share-btn-outer')
                if (shareBtn) {
                    // 新增click事件
                    // 若replace element, 会在切换视频后无法更新视频分享数量, 故直接新增click事件覆盖剪贴板
                    shareBtn.addEventListener('click', () => {
                        let title = document.querySelector(
                            '.video-info-title .video-title, #viewbox_report > h1, .video-title-href',
                        )?.textContent
                        if (title && !title.match(/^[（【［《「＜｛〔〖〈『].*|.*[）】］》」＞｝〕〗〉』]$/)) {
                            title = `【${title}】`
                        }
                        // 匹配av号, BV号, 分P号
                        const avbv = matchAvidBvid(location.href)
                        let shareText = title
                            ? `${title} \nhttps://www.bilibili.com/video/${avbv}`
                            : `https://www.bilibili.com/video/${avbv}`
                        const urlObj = new URL(location.href)
                        const params = new URLSearchParams(urlObj.search)
                        if (params.has('p')) {
                            shareText += `?p=${params.get('p')}`
                        }
                        navigator.clipboard.writeText(shareText).then().catch()
                    })
                    clearInterval(id)
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
        name: '顶栏 滚动页面后不再吸附顶部',
    },
]

const href = location.href
const host = location.host
const pathname = location.pathname

const currPage = (): string => {
    if (href.startsWith('https://www.bilibili.com') && ['/index.html', '/'].includes(pathname)) {
        return 'homepage'
    }
    if (href.includes('bilibili.com/video/')) {
        return 'video'
    }
    if (href.includes('bilibili.com/v/popular/')) {
        return 'popular'
    }
    if (host === 'search.bilibili.com') {
        return 'search'
    }
    if (
        host === 't.bilibili.com' ||
        href.includes('bilibili.com/opus/') ||
        href.includes('bilibili.com/v/topic/detail')
    ) {
        return 'dynamic'
    }
    if (host === 'live.bilibili.com') {
        return 'live'
    }
    if (href.includes('bilibili.com/bangumi/play/')) {
        return 'bangumi'
    }
    if (href.includes('bilibili.com/list/')) {
        return 'playlist'
    }
    if (host === 'space.bilibili.com') {
        return 'space'
    }
    // 分区子分类
    if (!href.includes('bilibili.com/v/popular/') && href.includes('bilibili.com/v/')) {
        return 'channel'
    }
    // 拜年祭等活动
    if (href.includes('www.bilibili.com/festival/')) {
        return 'festival'
    }
    if (href.includes('bilibili.com/watchlater')) {
        return 'watchlater'
    }
    return ''
}

const ans = currPage()

export const isPageHomepage = () => ans === 'homepage'
export const isPageVideo = () => ans === 'video'
export const isPagePopular = () => ans === 'popular'
export const isPageSearch = () => ans === 'search'
export const isPageDynamic = () => ans === 'dynamic'
export const isPageLive = () => ans === 'live'
export const isPageBangumi = () => ans === 'bangumi'
export const isPagePlaylist = () => ans === 'playlist'
export const isPageFestival = () => ans === 'festival'
export const isPageChannel = () => ans === 'channel'
export const isPageSpace = () => ans === 'space'
export const isPageWatchlater = () => ans === 'watchlater'

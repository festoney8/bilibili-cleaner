const href = location.href
const host = location.host
const pathname = location.pathname

const currPage = (): string => {
    if (href.startsWith('https://www.bilibili.com/') && ['/index.html', '/'].includes(pathname)) {
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
    if (host === 't.bilibili.com' || href.includes('bilibili.com/opus/')) {
        return 'dynamic'
    }
    if (host === 'live.bilibili.com') {
        return 'live'
    }
    if (href.includes('bilibili.com/bangumi/play/')) {
        return 'bangumi'
    }
    if (href.includes('bilibili.com/list/watchlater') || href.includes('bilibili.com/list/ml')) {
        return 'playlist'
    }
    // 匹配拜年祭活动页、拜年祭单品视频
    if (href.match(/bilibili\.com\/festival\/20\d\dbnj/)) {
        return 'bnj'
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
export const isPageBnj = () => ans === 'bnj'

const href = location.href
const host = location.host
const pathname = location.pathname

const currPage = (): string => {
    // 无效url
    if (
        href.includes('www.bilibili.com/correspond/') ||
        href.includes('live.bilibili.com/p/html/') ||
        href.includes('live.bilibili.com/live-room-play-game-together')
    ) {
        return 'invalid'
    }
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
    if (
        host === 't.bilibili.com' ||
        href.includes('bilibili.com/opus/') ||
        href.includes('bilibili.com/v/topic/detail')
    ) {
        return 'dynamic'
    }
    if (host === 'live.bilibili.com') {
        // 匹配blanc页（赛事直播or活动直播用），用于对iframe内直播生效
        if (pathname.match(/^\/(?:blanc\/)?\d+(#\/)?/)) {
            return 'liveRoom'
        }
        // 匹配各种直播页iframe、直播活动, 不做处理
        if (href.match(/live\.bilibili\.com\/(p\/html|activity|blackboard)/)) {
            return ''
        }
        return 'liveHome'
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
    // 频道子分类
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

export const isPageInvalid = () => ans === 'invalid'
export const isPageHomepage = () => ans === 'homepage'
export const isPageVideo = () => ans === 'video'
export const isPagePopular = () => ans === 'popular'
export const isPageSearch = () => ans === 'search'
export const isPageDynamic = () => ans === 'dynamic'
export const isPageLiveHome = () => ans === 'liveHome'
export const isPageLiveRoom = () => ans === 'liveRoom'
export const isPageBangumi = () => ans === 'bangumi'
export const isPagePlaylist = () => ans === 'playlist'
export const isPageFestival = () => ans === 'festival'
export const isPageChannel = () => ans === 'channel'
export const isPageSpace = () => ans === 'space'
export const isPageWatchlater = () => ans === 'watchlater'

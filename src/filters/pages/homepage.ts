import { GM_getValue } from '$'
import { debug, error } from '../../utils/logger'
import { CoreFilter, SelectorFunc } from '../filters/core'
import settings from '../../settings'
import bvidFilterInstance from '../filters/subfilters/bvid'
import durationFilterInstance from '../filters/subfilters/duration'
import keywordFilterInstance from '../filters/subfilters/keyword'
import uploaderFilterInstance from '../filters/subfilters/uploader'

// 构建CoreFilter实例
const coreFilter = new CoreFilter()

// 获取各过滤器当前状态, status与页面相关, value全站通用
const homepageDurationFilterStatusKey = 'homepage-duration-filter-status'
const homepageKeywordFilterStatusKey = 'homepage-keyword-filter-status'
const homepageBvidFilterStatusKey = 'homepage-bvid-filter-status'
const homepageUploaderFilterStatusKey = 'homepage-uploader-filter-status'

const globalDurationFilterValueKey = 'global-duration-filter-value'
const globalKeywordFilterValueKey = 'global-keyword-filter-value'
const globalBvidFilterValueKey = 'global-bvid-filter-value'
const globalUploaderFilterValueKey = 'global-uploader-filter-value'

const homepageDurationFilterStatus: boolean = GM_getValue(`BILICLEANER_${homepageDurationFilterStatusKey}`, false)
const homepageKeywordFilterStatus: boolean = GM_getValue(`BILICLEANER_${homepageKeywordFilterStatusKey}`, false)
const homepageBvidFilterStatus: boolean = GM_getValue(`BILICLEANER_${homepageBvidFilterStatusKey}`, false)
const homepageUploaderFilterStatus: boolean = GM_getValue(`BILICLEANER_${homepageUploaderFilterStatusKey}`, false)

const globalDurationFilterValue: number = GM_getValue(`BILICLEANER_VALUE_${globalDurationFilterValueKey}`, 90)
const globalKeywordFilterValue: string[] = GM_getValue(`BILICLEANER_VALUE_${globalKeywordFilterValueKey}`, [])
const globalBvidFilterValue: string[] = GM_getValue(`BILICLEANER_VALUE_${globalBvidFilterValueKey}`, [])
const globalUploaderFilterValue: string[] = GM_getValue(`BILICLEANER_VALUE_${globalUploaderFilterValueKey}`, [])

// 配置子过滤器参数
durationFilterInstance.setStatus(homepageDurationFilterStatus)
durationFilterInstance.setParams(globalDurationFilterValue)

keywordFilterInstance.setStatus(homepageKeywordFilterStatus)
keywordFilterInstance.setParams(globalKeywordFilterValue)

bvidFilterInstance.setStatus(homepageBvidFilterStatus)
bvidFilterInstance.setParams(globalBvidFilterValue)

uploaderFilterInstance.setStatus(homepageUploaderFilterStatus)
uploaderFilterInstance.setParams(globalUploaderFilterValue)

// 0. 视频列表外层
let videoListContainer: HTMLElement

// 1. 检测/监听 videoListContainer 出现, 出现后监听 videoListContainer 内部变化
const waitForVideoListContainer = () => {
    // 检测/监听视频列表父节点出现
    videoListContainer = document.querySelector('.container.is-version8') as HTMLFormElement
    if (videoListContainer) {
        debug('videoListContainer exist')
        watchVideoListContainer()
    } else {
        const obverser = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if ((node as Element).className === 'container is-version8') {
                            debug('videoListContainer appear')
                            obverser.disconnect()
                            videoListContainer = document.querySelector('.container.is-version8') as HTMLFormElement
                            watchVideoListContainer()
                        }
                    })
                }
            })
        })
        obverser.observe(document, { childList: true, subtree: true })
        debug('videoListContainer obverser start')
    }
}
waitForVideoListContainer()

// 2. 监听 videoListContainer 内部变化, 有变化时检测视频列表
const watchVideoListContainer = () => {
    if (videoListContainer) {
        // 初次全站检测
        checkVideoList(true)
        const videoObverser = new MutationObserver(() => {
            // 视频列表变化后，增量检测
            checkVideoList(false)
        })
        videoObverser.observe(videoListContainer, { childList: true, subtree: true })
        debug('watchVideoListContainer OK')
    }
}

// 3. 检测视频列表
const checkVideoList = (fullSite = false) => {
    const bvidPattrn = /bilibili.com\/video\/(BV[0-9a-zA-Z]+)/g
    try {
        let feedVideos: NodeListOf<HTMLElement>
        let rcmdVideos: NodeListOf<HTMLElement>
        if (!fullSite) {
            // 选取增量视频
            // feed: 10个顶部推荐位, 不含已过滤
            feedVideos = videoListContainer.querySelectorAll<HTMLElement>(
                `:scope > .feed-card:not([${settings.filterSign}])`,
            )
            // rcmd: 瀑布推荐流, 不含feed, 不含已过滤, 不含未载入
            rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(
                `:scope > .bili-video-card.is-rcmd:not([${settings.filterSign}])`,
            )
        } else {
            // 选取全站, 含已过滤的
            feedVideos = videoListContainer.querySelectorAll<HTMLElement>(`:scope > .feed-card`)
            rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(`:scope > .bili-video-card.is-rcmd`)
        }

        // 构建SelectorFunc
        const rcmdSelectorFunc: SelectorFunc = {
            duration: (video: Element): string | null => {
                const duration = video.querySelector('span.bili-video-card__stats__duration')
                if (duration && duration.textContent) {
                    return duration.textContent
                }
                return null
            },
            // title
            title: (video: Element): string | null => {
                const title = video.querySelector('h3.bili-video-card__info--tit a')
                if (title && title.textContent) {
                    return title.textContent
                }
                return null
            },
            bvid: (video: Element): string | null => {
                const href = video.querySelector('h3.bili-video-card__info--tit a')?.getAttribute('href')
                if (href) {
                    const match = bvidPattrn.exec(href)
                    if (match && match.length >= 2) {
                        const bvid = match[1]
                        return bvid
                    }
                }
                return null
            },
            uploader: (video: Element): string | null => {
                const uploader = video.querySelector('span.bili-video-card__info--author')
                if (uploader && uploader.textContent) {
                    return uploader.textContent
                }
                return null
            },
        }
        const feedSelectorFunc = rcmdSelectorFunc
        feedVideos.length && coreFilter.checkAll([...feedVideos], true, feedSelectorFunc)
        debug(`checkVideoList check ${rcmdVideos.length} rcmd videos`)
        rcmdVideos.length && coreFilter.checkAll([...rcmdVideos], true, rcmdSelectorFunc)
        debug(`checkVideoList check ${feedVideos.length} feed videos`)
    } catch (err) {
        error(err)
        error('checkVideoList error')
    }
}

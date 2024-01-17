import { GM_getValue } from '$'
import { Group } from '../core/group'
import { CheckboxItem, NumberItem } from '../core/item'
import { isPageHomepage } from '../utils/page-type'
import { MainFilter, filterConfig } from './filters'
import { debug } from '../utils/logger'
import settings from '../settings'

const durationItems: (CheckboxItem | NumberItem)[] = []
// const titleItems: (CheckboxItem | NumberItem)[] = []
// const uploaderItems: (CheckboxItem | NumberItem)[] = []
const homepageFilterGroupList: Group[] = []

// 开关和数值itemID, 用于获取状态
const homepageFilterDurationItemID = 'homepage-filter-duration'
const homepageFilterDurationValueID = 'homepage-filter-duration-threshold'

if (isPageHomepage()) {
    // 初始化过滤器
    const durationEnable: boolean = GM_getValue(`BILICLEANER_${homepageFilterDurationItemID}`, false)
    const durationThreshold: number = GM_getValue(
        `BILICLEANER_VALUE_${homepageFilterDurationValueID}`,
        settings.durationThreshold,
    )
    const config: filterConfig = {
        enable: {
            duration: durationEnable,
            title: false,
            uploader: false,
        },
        selectors: {
            duration: '.bili-video-card__stats__duration',
        },
        subConfig: {
            duration: {
                threshold: durationThreshold,
            },
        },
        needRecoverDisplay: true,
    }
    const mainFilter = new MainFilter(config)

    // 视频列表(父节点)
    let container: HTMLElement

    /**
     * 调用过滤器, 检测视频列表内的视频, 单次检测duration在10ms内
     * @param includeVisited 是否包含已过滤的视频, 为true则进行全站过滤
     */
    const checkVideoList = (includeVisited = false) => {
        debug('before check')
        let feedVideos: NodeListOf<HTMLElement>
        let rcmdVideos: NodeListOf<HTMLElement>
        if (!includeVisited) {
            // feed: 10个顶部推荐位, 不含已过滤视频
            feedVideos = container.querySelectorAll<HTMLElement>(`:scope > .feed-card:not([${settings.filterSign}])`)
            // rcmd: 瀑布推荐流, 不含feed, 不含已过滤视频, 不含未载入视频
            rcmdVideos = container.querySelectorAll<HTMLElement>(
                `:scope > .bili-video-card.is-rcmd:not([${settings.filterSign}])`,
            )
        } else {
            // feed: 含已过滤视频
            feedVideos = container.querySelectorAll<HTMLElement>(`:scope > .feed-card`)
            // rcmd: 含已过滤视频
            rcmdVideos = container.querySelectorAll<HTMLElement>(`:scope > .bili-video-card.is-rcmd`)
        }
        mainFilter.checkAll([...rcmdVideos])
        mainFilter.checkAll([...feedVideos])
        debug(`after check, ${feedVideos.length} new feed, ${rcmdVideos.length} new rcmd`)
    }
    // 监听视频列表(container)出现，出现后监听视频数量变化
    const watchVideoList = () => {
        if (container) {
            checkVideoList()
            debug('homepage start obverse video list')
            const videoObverser = new MutationObserver(() => {
                checkVideoList()
            })
            videoObverser.observe(container, { childList: true })
        }
    }
    // item功能函数, 视频过滤主流程
    // 监听并过滤视频列表
    const videoListWatcher = () => {
        // 监听流程
        container = document.querySelector('.container.is-version8') as HTMLFormElement
        if (container) {
            watchVideoList()
        } else {
            debug('video container obverser start')
            const containerObverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as Element).className === 'container is-version8') {
                                // 出现container后观测视频列表变化
                                debug('video container appear')
                                containerObverser.disconnect()
                                container = document.querySelector('.container.is-version8') as HTMLFormElement
                                watchVideoList()
                            }
                        })
                    }
                })
            })
            containerObverser.observe(document, { childList: true, subtree: true })
        }
    }

    // 回调, 实时修改过滤器的阈值, 触发一次全站过滤(包含已过滤项)
    const durationCallback = (currValue: number) => {
        debug('durationCallback')
        if (mainFilter.durationFilter) {
            mainFilter.durationFilter.threshold = currValue
            checkVideoList(true)
        }
    }

    // 首页 时长过滤part
    {
        // 启用 视频时长过滤
        durationItems.push(
            new CheckboxItem(
                homepageFilterDurationItemID,
                '启用 视频时长过滤 (关闭需刷新)',
                false,
                videoListWatcher,
                false,
                null,
            ),
        )
        durationItems.push(
            new NumberItem(
                homepageFilterDurationValueID,
                '设定最低时长 (300秒以内)',
                60,
                0,
                300,
                '秒',
                durationCallback,
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-filter-duration-group', '首页 视频时长过滤', durationItems))
}

export { homepageFilterGroupList }

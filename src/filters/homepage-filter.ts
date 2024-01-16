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

    // 监听并过滤视频列表
    const videoListWatcher = () => {
        // 调用过滤器, 检测视频列表内的视频, 单次检测duration在10ms内
        const checkVideoList = (container: HTMLElement) => {
            debug('before check')
            // feed: 10个顶部推荐位, 不含已过滤视频
            const feedVideos = container.querySelectorAll<HTMLElement>(
                `:scope > .feed-card:not([${settings.filterSign}])`,
            )
            // rcmd: 瀑布推荐流, 不含feed, 不含已过滤视频, 不含未载入视频
            const rcmdVideos = container.querySelectorAll<HTMLElement>(
                `:scope > .bili-video-card.is-rcmd:not([${settings.filterSign}])`,
            )
            mainFilter.checkAll([...rcmdVideos])
            mainFilter.checkAll([...feedVideos])
            debug(`after check, ${feedVideos.length} new feed, ${rcmdVideos.length} new rcmd`)
        }
        // 监听视频列表(container)出现，出现后监听视频数量变化
        const watchVideoList = (container: HTMLElement) => {
            if (container) {
                checkVideoList(container)
                debug('homepage start obverse video list')
                const videoObverser = new MutationObserver(() => {
                    checkVideoList(container)
                })
                videoObverser.observe(container, { childList: true })
            }
        }

        // 监听流程
        const container = document.querySelector('.container.is-version8') as HTMLFormElement
        if (container) {
            watchVideoList(container)
        } else {
            // 观测container
            debug('video container obverser start')
            const containerObverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as Element).className === 'container is-version8') {
                                // 出现container后观测视频列表变化
                                debug('video container appear')
                                containerObverser.disconnect()
                                const container = document.querySelector('.container.is-version8') as HTMLFormElement
                                watchVideoList(container)
                            }
                        })
                    }
                })
            })
            containerObverser.observe(document, { childList: true, subtree: true })
        }
    }

    // // 回调, 实时修改过滤器的阈值, 触发一次过滤
    // const durationCallback = (currValue: number) => {
    //     if (mainFilter.durationFilter) {
    //         mainFilter.durationFilter.threshold = currValue
    //     }
    // }

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
        durationItems.push(new NumberItem(homepageFilterDurationValueID, '设定最低时长 (300秒以内)', 60, 0, 300, '秒'))
    }
    homepageFilterGroupList.push(new Group('homepage-filter-duration-group', '首页 视频时长过滤', durationItems))
}

export { homepageFilterGroupList }

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

const homepageFilterDurationItemID = 'homepage-filter-duration'
const homepageFilterDurationValueID = 'homepage-filter-duration-threshold'

if (isPageHomepage()) {
    // 初始化过滤器
    const durationThreshold: number = GM_getValue(
        `BILICLEANER_VALUE_homepage-filter-duration-threshold`,
        settings.durationThreshold,
    )
    const config: filterConfig = {
        enable: {
            duration: true,
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
        // 监听视频列表(container)出现，出现后监听视频数量变化
        const watchVideoList = (container: HTMLElement) => {
            if (container) {
                const checkContainer = (container: HTMLElement) => {
                    // feed: 10个顶部推荐位
                    const feedVideos = container.querySelectorAll<HTMLElement>(':scope > .feed-card')
                    // rcmd: 瀑布推荐流, 不含feed, 不含未载入视频
                    // 对过滤后的项添加attribute, 避免再次选中
                    const rcmdVideos = container.querySelectorAll<HTMLElement>(
                        `:scope > .bili-video-card.is-rcmd:not(${settings.filterSign})`,
                    )
                    debug(`detect ${feedVideos.length} new feed videos`)
                    debug(`detect ${rcmdVideos.length} new rcmd videos`)
                    mainFilter.checkAll([...feedVideos])
                    mainFilter.checkAll([...rcmdVideos])
                }
                checkContainer(container)
                debug('homepage start obverse video list')
                const videoObverser = new MutationObserver(() => {
                    checkContainer(container)
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
        durationItems.push(new NumberItem(homepageFilterDurationValueID, '设定最低时长 (刷新生效)', 60, 0, 300, '秒'))
    }
    homepageFilterGroupList.push(new Group('homepage-filter-duration-group', '首页 视频时长过滤', durationItems))
}

export { homepageFilterGroupList }

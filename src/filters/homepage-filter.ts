import { GM_getValue } from '$'
import { Group } from '../components/group'
import { CheckboxItem, NumberItem } from '../components/item'
import { isPageHomepage } from '../utils/page-type'
import { debug, error } from '../utils/logger'
import { DurationFilterConfig, MainFilter } from './filters'
import settings from '../settings'

// 开关itemID、数值itemID, 获取过滤器状态和参数
const homepageDurationFilterItemID = 'homepage-duration-filter'
const homepageDurationFilterValueID = 'homepage-duration-filter-threshold'
// const homepageTitleFilterItemID = 'homepage-title-filter'
// const homepageTitleFilterValueID = 'homepage-title-filter-keywords'
// const homepageUploaderFilterItemID = 'homepage-uploader-filter'
// const homepageUploaderFilterValueID = 'homepage-uploader-filter-blacklist'

// 主过滤器配置
const mainFilterInstanse = new MainFilter()
// 设定默认selector
mainFilterInstanse.setupSelectors({
    duration: 'span.bili-video-card__stats__duration',
    title: 'h3.bili-video-card__info--tit',
    uploader: 'span.bili-video-card__info--author',
})
// 配置durationFilter
let durationEnable: boolean
let durationFilterConfig: DurationFilterConfig
const setupDurationFilter = () => {
    durationEnable = GM_getValue(`BILICLEANER_${homepageDurationFilterItemID}`, false)
    const durationThreshold: number = GM_getValue(
        `BILICLEANER_VALUE_${homepageDurationFilterValueID}`,
        settings.durationThreshold,
    )
    durationFilterConfig = {
        threshold: durationThreshold,
    }
    mainFilterInstanse.setupDurationFilter(durationEnable, durationFilterConfig)
    debug('setupDurationFilter')
}
// // 配置titleFilter
// let titleEnable: boolean
// let titleFilterConfig: TitleFilterConfig
// const setupTitleFilter = () => {
//     debug('setupTitleFilter')
//     // const titleEnable: boolean = GM_getValue(`BILICLEANER_${homepageTitleFilterItemID}`, false)
//     // const titleThreshold: number = GM_getValue(
//     //     `BILICLEANER_VALUE_${homepageTitleFilterValueID}`,
//     //     settings.titleThreshold,
//     // )
//     // const titleFilterConfig: TitleFilterConfig = {}
//     // mainFilterInstanse.setupTitleFilter(titleEnable, titleFilterConfig)
// }
// // 配置uploaderFilter
// let uploaderEnable: boolean
// let uploaderFilterConfig: UploaderFilterConfig
// const setupUploaderFilter = () => {
//     debug('setupUploaderFilter')
//     // const uploaderEnable: boolean = GM_getValue(`BILICLEANER_${homepageUploaderFilterItemID}`, false)
//     // const uploaderThreshold: number = GM_getValue(
//     //     `BILICLEANER_VALUE_${homepageUploaderFilterValueID}`,
//     //     settings.uploaderThreshold,
//     // )
//     // const uploaderFilterConfig: UploaderFilterConfig = {
//     // }
//     // mainFilterInstanse.setupDurationFilter(uploaderEnable, uploaderFilterConfig)
// }

//////////////////////////////////////////////////////////////////////////////////

// 功能组
const durationItems: (CheckboxItem | NumberItem)[] = []
// const titleItems: (CheckboxItem | NumberItem)[] = []
// const uploaderItems: (CheckboxItem | NumberItem)[] = []
const homepageFilterGroupList: Group[] = []
if (isPageHomepage()) {
    // 视频列表(父节点)
    let videoListContainer: HTMLElement

    // 1. 视频过滤主流程, 监听视频列表容器出现
    let isMainFilterFuncRunning = false
    const mainFilterFunc = () => {
        if (isMainFilterFuncRunning) {
            return
        }
        isMainFilterFuncRunning = true
        // 检测/监听视频列表父节点出现
        videoListContainer = document.querySelector('.container.is-version8') as HTMLFormElement
        if (videoListContainer) {
            debug('homepage videoList exist')
            watchVideoListContainer()
        } else {
            debug('homepage videoList obverser start')
            const videoListObverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as Element).className === 'container is-version8') {
                                // 出现后观测视频列表变化
                                debug('homepage videoList appear')
                                videoListObverser.disconnect()
                                videoListContainer = document.querySelector('.container.is-version8') as HTMLFormElement
                                watchVideoListContainer()
                            }
                        })
                    }
                })
            })
            videoListObverser.observe(document, { childList: true, subtree: true })
        }
    }
    // 2. 监听视频数量变化
    const watchVideoListContainer = () => {
        if (videoListContainer) {
            checkVideoList(true) // 初次全站过滤
            const videoObverser = new MutationObserver(() => {
                checkVideoList()
            })
            videoObverser.observe(videoListContainer, { childList: true })
            debug('watchVideoListContainer OK')
        }
    }
    /**
     * 3. 检查视频列表
     * 调用过滤器检测列表内的视频, 单次检测在10ms内
     * @param includeVisited 是否包含已过滤的视频, 为true则重新进行全站过滤
     */
    const checkVideoList = (includeVisited = false) => {
        try {
            let feedVideos: NodeListOf<HTMLElement>
            let rcmdVideos: NodeListOf<HTMLElement>
            if (!includeVisited) {
                // feed: 10个顶部推荐位, 不含已过滤视频
                feedVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `:scope > .feed-card:not([${settings.filterSign}])`,
                )
                // rcmd: 瀑布推荐流, 不含feed, 不含已过滤视频, 不含未载入视频
                rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `:scope > .bili-video-card.is-rcmd:not([${settings.filterSign}])`,
                )
            } else {
                // 选取全站视频, 含已过滤的
                feedVideos = videoListContainer.querySelectorAll<HTMLElement>(`:scope > .feed-card`)
                rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(`:scope > .bili-video-card.is-rcmd`)
            }
            rcmdVideos.length && mainFilterInstanse.checkAll([...rcmdVideos])
            feedVideos.length && mainFilterInstanse.checkAll([...feedVideos])
            debug(`checkVideoList check ${rcmdVideos.length} rcmd, ${feedVideos.length} feed videos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 功能函数, 开关开启时触发, 页面载入时触发, 全站过滤
    const durationFilterFunc = () => {
        setupDurationFilter()
        if (isMainFilterFuncRunning) {
            checkVideoList(true)
        } else {
            mainFilterFunc()
        }
    }
    // const titleFilterFunc = () => {
    //     setupTitleFilter()
    //     mainFilterFunc()
    // }
    // const uploaderFilterFunc = () => {
    //     setupUploaderFilter()
    //     mainFilterFunc()
    // }

    // 开关关闭回调, 修改阈值为0, 触发一次全站恢复
    const durationDisableCallback = () => {
        debug('durationDisableCallback start')
        durationFilterConfig.threshold = 0
        mainFilterInstanse.setupDurationFilter(true, durationFilterConfig)
        checkVideoList(true)
        mainFilterInstanse.setupDurationFilter(false, durationFilterConfig)
        debug('durationDisableCallback OK')
    }
    // 数值变化回调, 实时修改阈值, 触发一次全站过滤 (包含已过滤项)
    const durationChangeCallback = (currValue: number) => {
        debug('durationChangeCallback start')
        durationFilterConfig.threshold = currValue
        mainFilterInstanse.setupDurationFilter(durationEnable, durationFilterConfig)
        if (durationEnable) {
            checkVideoList(true)
        }
        debug('durationChangeCallback OK')
    }
    // // 回调, 添加title关键词触发
    // const titleCallback = (currValue: number) => {
    //     debug('titleCallback')
    //     // mainFilterInstanse.setupDurationFilter(titleEnable, titleFilterConfig)
    //     // checkVideoList(true)
    // }
    // // 回调, 新增屏蔽UP主触发
    // const uploaderCallback = (currValue: number) => {
    //     debug('uploaderCallback')
    //     // mainFilterInstanse.setupDurationFilter(uploaderEnable, uploaderFilterConfig)
    //     // checkVideoList(true)
    // }

    // 首页 时长过滤part
    {
        // 启用 视频时长过滤
        durationItems.push(
            new CheckboxItem(
                homepageDurationFilterItemID,
                '启用 视频时长过滤',
                false,
                durationFilterFunc,
                false,
                null,
                durationDisableCallback,
            ),
        )
        durationItems.push(
            new NumberItem(
                homepageDurationFilterValueID,
                '设定最低时长 (0~300s)',
                60,
                0,
                300,
                '秒',
                durationChangeCallback,
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-duration-filter-group', '首页 视频时长过滤', durationItems))
}

export { homepageFilterGroupList }

import { GM_getValue } from '$'
import { Group } from '../components/group'
import { CheckboxItem, NumberItem } from '../components/item'
import { isPageVideo } from '../utils/page-type'
import { debug, error } from '../utils/logger'
import { DurationFilterConfig, MainFilter } from './filters'
import settings from '../settings'

// 开关itemID、数值itemID, 获取过滤器状态和参数
const videoDurationFilterItemID = 'video-duration-filter'
const videoDurationFilterValueID = 'video-duration-filter-threshold'
// const videoTitleFilterItemID = 'video-title-filter'
// const videoTitleFilterValueID = 'video-title-filter-keywords'
// const videoUploaderFilterItemID = 'video-uploader-filter'
// const videoUploaderFilterValueID = 'video-uploader-filter-blacklist'

// 主过滤器配置
const mainFilterInstanse = new MainFilter()
// 设定selector
mainFilterInstanse.setupSelectors({
    duration: '.pic-box span.duration',
    title: '.card-box .info > a > p',
    uploader: '.card-box .info .upname > a > span',
})
// 配置durationFilter
let durationEnable: boolean
let durationFilterConfig: DurationFilterConfig
const setupDurationFilter = () => {
    durationEnable = GM_getValue(`BILICLEANER_${videoDurationFilterItemID}`, false)
    const durationThreshold: number = GM_getValue(
        `BILICLEANER_VALUE_${videoDurationFilterValueID}`,
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
//     // const titleEnable: boolean = GM_getValue(`BILICLEANER_${videoTitleFilterItemID}`, false)
//     // const titleThreshold: number = GM_getValue(
//     //     `BILICLEANER_VALUE_${videoTitleFilterValueID}`,
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
//     // const uploaderEnable: boolean = GM_getValue(`BILICLEANER_${videoUploaderFilterItemID}`, false)
//     // const uploaderThreshold: number = GM_getValue(
//     //     `BILICLEANER_VALUE_${videoUploaderFilterValueID}`,
//     //     settings.uploaderThreshold,
//     // )
//     // const uploaderFilterConfig: UploaderFilterConfig = {
//     // }
//     // mainFilterInstanse.setupDurationFilter(uploaderEnable, uploaderFilterConfig)
// }

////////////////////////////////////////////////////////////////////////////////////////////////////

// 功能组
const durationItems: (CheckboxItem | NumberItem)[] = []
// const titleItems: (CheckboxItem | NumberItem)[] = []
// const uploaderItems: (CheckboxItem | NumberItem)[] = []
const videoFilterGroupList: Group[] = []

if (isPageVideo()) {
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
        videoListContainer = document.querySelector('#reco_list .rec-list') as HTMLFormElement
        if (videoListContainer) {
            debug('videoList exist')
            watchVideoListContainer()
        } else {
            debug('videoList obverser start')
            const videoListObverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as Element).className === 'rec-list') {
                                // 出现后观测视频列表变化(切换视频时, 右栏列表变化)
                                debug('video videoList appear')
                                videoListObverser.disconnect()
                                videoListContainer = document.querySelector('#reco_list .rec-list') as HTMLFormElement
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
            checkVideoList() // 初次过滤
            const videoObverser = new MutationObserver(() => {
                checkVideoList()
            })
            // 初次过滤会漏掉, 故始终使用全局过滤, 监听subtree
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debug('video obverse video list start')
        }
    }
    /**
     * 3. 检查视频列表
     * 调用过滤器检测列表内的视频, 单次检测在10ms内
     * @param includeVisited 是否包含已过滤的视频, 为true则重新进行全站过滤
     */
    const checkVideoList = () => {
        debug(`checkVideoList start`)
        try {
            // 选取右栏全部视频
            const rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(`:scope > .video-page-card-small`)
            rcmdVideos.length && mainFilterInstanse.checkAll([...rcmdVideos], false)
            debug(`checkVideoList check ${rcmdVideos.length} videos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // 功能函数, 开关开启时触发, 页面载入时触发
    const durationFilterFunc = () => {
        setupDurationFilter()
        if (isMainFilterFuncRunning) {
            checkVideoList()
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

    // 按钮关闭回调, 修改阈值为0, 触发一次全站过滤, 还原全部隐藏项
    const durationDisableCallback = () => {
        debug('durationDisableCallback start')
        durationFilterConfig.threshold = 0
        mainFilterInstanse.setupDurationFilter(true, durationFilterConfig)
        checkVideoList()
        mainFilterInstanse.setupDurationFilter(false, durationFilterConfig)
    }
    // 数值变化回调, 实时修改阈值, 触发一次全站过滤
    const durationChangeCallback = (currValue: number) => {
        debug('durationChangeCallback start')
        durationFilterConfig.threshold = currValue
        mainFilterInstanse.setupDurationFilter(durationEnable, durationFilterConfig)
        if (durationEnable) {
            checkVideoList()
        }
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
                videoDurationFilterItemID,
                '启用 视频时长过滤',
                false,
                durationFilterFunc,
                false,
                null,
                durationDisableCallback,
            ),
        )
        // 设定最低时长
        durationItems.push(
            new NumberItem(
                videoDurationFilterValueID,
                '设定最低时长 (0~300s)',
                60,
                0,
                300,
                '秒',
                durationChangeCallback,
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-duration-filter-group', '播放页 右侧推荐 时长过滤', durationItems))
}

export { videoFilterGroupList }

// import { GM_getValue } from '$'
// import { Group } from '../core/group'
// import { CheckboxItem, NumberItem } from '../core/item'
// import { isPageHomepage } from '../utils/page-type'
// import { debug, error } from '../utils/logger'
// import { DurationFilterConfig, MainFilter } from './filters'
// import settings from '../settings'

// // 开关itemID、数值itemID, 获取过滤器状态和参数
// const popularDurationFilterItemID = 'popular-duration-filter'
// const popularDurationFilterValueID = 'popular-duration-filter-threshold'
// // const popularTitleFilterItemID = 'popular-title-filter'
// // const popularTitleFilterValueID = 'popular-title-filter-keywords'
// // const popularUploaderFilterItemID = 'popular-uploader-filter'
// // const popularUploaderFilterValueID = 'popular-uploader-filter-blacklist'

// // 主过滤器配置
// const mainFilterInstanse = new MainFilter()
// // 设定selector
// mainFilterInstanse.setupSelectors({
//     duration: 'span.bili-video-card__stats__duration',
//     title: 'h3.bili-video-card__info--tit',
//     uploader: 'span.bili-video-card__info--author',
// })
// // 配置durationFilter
// let durationEnable: boolean
// let durationFilterConfig: DurationFilterConfig
// const setupDurationFilter = () => {
//     durationEnable = GM_getValue(`BILICLEANER_${popularDurationFilterItemID}`, false)
//     const durationThreshold: number = GM_getValue(
//         `BILICLEANER_VALUE_${popularDurationFilterValueID}`,
//         settings.durationThreshold,
//     )
//     durationFilterConfig = {
//         threshold: durationThreshold,
//     }
//     mainFilterInstanse.setupDurationFilter(durationEnable, durationFilterConfig)
//     debug('setupDurationFilter')
// }
// // // 配置titleFilter
// // let titleEnable: boolean
// // let titleFilterConfig: TitleFilterConfig
// // const setupTitleFilter = () => {
// //     debug('setupTitleFilter')
// //     // const titleEnable: boolean = GM_getValue(`BILICLEANER_${popularTitleFilterItemID}`, false)
// //     // const titleThreshold: number = GM_getValue(
// //     //     `BILICLEANER_VALUE_${popularTitleFilterValueID}`,
// //     //     settings.titleThreshold,
// //     // )
// //     // const titleFilterConfig: TitleFilterConfig = {}
// //     // mainFilterInstanse.setupTitleFilter(titleEnable, titleFilterConfig)
// // }
// // // 配置uploaderFilter
// // let uploaderEnable: boolean
// // let uploaderFilterConfig: UploaderFilterConfig
// // const setupUploaderFilter = () => {
// //     debug('setupUploaderFilter')
// //     // const uploaderEnable: boolean = GM_getValue(`BILICLEANER_${popularUploaderFilterItemID}`, false)
// //     // const uploaderThreshold: number = GM_getValue(
// //     //     `BILICLEANER_VALUE_${popularUploaderFilterValueID}`,
// //     //     settings.uploaderThreshold,
// //     // )
// //     // const uploaderFilterConfig: UploaderFilterConfig = {
// //     // }
// //     // mainFilterInstanse.setupDurationFilter(uploaderEnable, uploaderFilterConfig)
// // }

// //////////////////////////////////////////////////////////////////////////////////

// // 功能组
// const durationItems: (CheckboxItem | NumberItem)[] = []
// // const titleItems: (CheckboxItem | NumberItem)[] = []
// // const uploaderItems: (CheckboxItem | NumberItem)[] = []
// const popularFilterGroupList: Group[] = []
// if (isPageHomepage()) {
//     // 视频列表
//     let videoListContainer: HTMLElement

//     // 1. 视频过滤主流程, 监听视频列表容器出现
//     let isMainFilterFuncRunning = false
//     const mainFilterFunc = () => {
//         if (isMainFilterFuncRunning) {
//             return
//         }
//         isMainFilterFuncRunning = true
//         // 检测/监听视频列表上层节点出现
//         videoListContainer = document.querySelector(
//             '#app .popular-video-container, #app .rank-container',
//         ) as HTMLFormElement
//         if (videoListContainer) {
//             debug('popular videoList exist')
//             watchVideoListContainer()
//         } else {
//             debug('popular videoList obverser start')
//             const videoListObverser = new MutationObserver((mutationList) => {
//                 mutationList.forEach((mutation) => {
//                     if (mutation.addedNodes) {
//                         mutation.addedNodes.forEach((node) => {
//                             if (
//                                 (node as Element).className === 'popular-video-container' ||
//                                 (node as Element).className === 'rank-container'
//                             ) {
//                                 // 出现后观测视频列表变化
//                                 debug('popular videoList appear')
//                                 videoListObverser.disconnect()
//                                 videoListContainer = document.querySelector(
//                                     '#app .popular-video-container, #app .rank-container',
//                                 ) as HTMLFormElement
//                                 watchVideoListContainer()
//                             }
//                         })
//                     }
//                 })
//             })
//             videoListObverser.observe(document, { childList: true, subtree: true })
//         }
//     }
//     // 2. 监听视频数量变化
//     const watchVideoListContainer = () => {
//         if (videoListContainer) {
//             checkVideoList(true) // 初次全站过滤
//             const videoObverser = new MutationObserver(() => {
//                 checkVideoList()
//             })
//             // 涉及切换tab操作, 监听subtree
//             videoObverser.observe(videoListContainer, { childList: true, subtree: true })
//             debug('watchVideoListContainer OK')
//         }
//     }
//     /**
//      * 3. 检查视频列表
//      * 调用过滤器检测列表内的视频, 单次检测在10ms内
//      * @param includeVisited 是否包含已过滤的视频, 为true则重新进行全站过滤
//      */
//     const checkVideoList = (includeVisited = false) => {
//         try {
//             // video-card, 支持匹配 热门视频/每周必看/入站必刷
//             let cardVideos: NodeListOf<HTMLElement>
//             // rank-item, 匹配 排行榜
//             let rankVideos: NodeListOf<HTMLElement>
//             if (!includeVisited) {
//                 cardVideos = videoListContainer.querySelectorAll<HTMLElement>(
//                     `.card-list .video-card:not([${settings.filterSign}]),
//                     .video-list .video-card:not([${settings.filterSign}])`,
//                 )
//                 rankVideos = videoListContainer.querySelectorAll<HTMLElement>(
//                     `.rank-list .rank-item:not([${settings.filterSign}])`,
//                 )
//             } else {
//                 cardVideos = videoListContainer.querySelectorAll<HTMLElement>(
//                     `.card-list .video-card,
//                     .video-list .video-card`,
//                 )
//                 rankVideos = videoListContainer.querySelectorAll<HTMLElement>(`.rank-list .rank-item`)
//             }
//             cardVideos.length && mainFilterInstanse.checkAll([...cardVideos])
//             rankVideos.length && mainFilterInstanse.checkAll([...rankVideos])
//             debug(`checkVideoList check ${cardVideos.length} card videos, ${rankVideos.length} rank videos`)
//         } catch (err) {
//             error(err)
//             error('checkVideoList error')
//         }
//     }
//     ////////////////////////////////////////////////////////////////////////////
//     // 功能函数, 开关开启时触发, 页面载入时触发, 全站过滤
//     const durationFilterFunc = () => {
//         setupDurationFilter()
//         if (isMainFilterFuncRunning) {
//             checkVideoList(true)
//         } else {
//             mainFilterFunc()
//         }
//     }
//     // const titleFilterFunc = () => {
//     //     setupTitleFilter()
//     //     mainFilterFunc()
//     // }
//     // const uploaderFilterFunc = () => {
//     //     setupUploaderFilter()
//     //     mainFilterFunc()
//     // }

//     // 开关关闭回调, 修改阈值为0, 触发一次全站恢复
//     const durationDisableCallback = () => {
//         debug('durationDisableCallback start')
//         durationFilterConfig.threshold = 0
//         mainFilterInstanse.setupDurationFilter(true, durationFilterConfig)
//         checkVideoList(true)
//         mainFilterInstanse.setupDurationFilter(false, durationFilterConfig)
//         debug('durationDisableCallback OK')
//     }
//     // 数值变化回调, 实时修改阈值, 触发一次全站过滤 (包含已过滤项)
//     const durationChangeCallback = (currValue: number) => {
//         debug('durationChangeCallback start')
//         durationFilterConfig.threshold = currValue
//         mainFilterInstanse.setupDurationFilter(durationEnable, durationFilterConfig)
//         if (durationEnable) {
//             checkVideoList(true)
//         }
//         debug('durationChangeCallback OK')
//     }
//     // // 回调, 添加title关键词触发
//     // const titleCallback = (currValue: number) => {
//     //     debug('titleCallback')
//     //     // mainFilterInstanse.setupDurationFilter(titleEnable, titleFilterConfig)
//     //     // checkVideoList(true)
//     // }
//     // // 回调, 新增屏蔽UP主触发
//     // const uploaderCallback = (currValue: number) => {
//     //     debug('uploaderCallback')
//     //     // mainFilterInstanse.setupDurationFilter(uploaderEnable, uploaderFilterConfig)
//     //     // checkVideoList(true)
//     // }

//     // 首页 时长过滤part
//     {
//         // 启用 视频时长过滤
//         durationItems.push(
//             new CheckboxItem(
//                 popularDurationFilterItemID,
//                 '启用 视频时长过滤',
//                 false,
//                 durationFilterFunc,
//                 false,
//                 null,
//                 durationDisableCallback,
//             ),
//         )
//         durationItems.push(
//             new NumberItem(
//                 popularDurationFilterValueID,
//                 '设定最低时长 (0~300s)',
//                 60,
//                 0,
//                 300,
//                 '秒',
//                 durationChangeCallback,
//             ),
//         )
//     }
//     popularFilterGroupList.push(new Group('popular-duration-filter-group', '首页 视频时长过滤', durationItems))
// }

// export { popularFilterGroupList }

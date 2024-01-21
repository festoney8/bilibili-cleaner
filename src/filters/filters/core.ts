import settings from '../../settings'
import { debugFilter, error } from '../../utils/logger'
import bvidFilterInstance from './subfilters/bvid'
import durationFilterInstance from './subfilters/duration'
import titleKeywordFilterInstance from './subfilters/titleKeyword'
import titleKeywordWhitelistFilterInstance from './subfilters/titleKeywordWhitelist'
import uploaderFilterInstance from './subfilters/uploader'
import uploaderWhitelistFilterInstance from './subfilters/uploaderWhitelist'

export interface ISubFilter {
    isEnable: boolean
    setStatus(status: boolean): void
    setParams(value: string[] | number): void
    addParam?(value: string): void
    check(value: string): Promise<string>
}

export type SelectorFunc = {
    duration?: (video: HTMLElement) => string | null
    titleKeyword?: (video: HTMLElement) => string | null
    bvid?: (video: HTMLElement) => string | null
    uploader?: (video: HTMLElement) => string | null
}

class CoreFilter {
    constructor() {}

    /** 隐藏视频, display none important */
    private hideVideo(video: HTMLElement) {
        video.style.setProperty('display', 'none', 'important')
    }

    /** 恢复视频, 用于筛选条件变化时重置 */
    private showVideo(video: HTMLElement) {
        debugFilter('SHOW')
        if (video.style.display.includes('none')) {
            video.style.removeProperty('display')
        }
    }

    /**
     * 检测视频列表中每个视频是否合法, 并隐藏不合法的视频
     * 对选取出的 标题/UP主/时长/BVID 进行并发检测
     * @param videos 视频列表
     * @param sign attribute标记
     * @param selectorFunc 使用selector选取元素的函数
     */
    checkAll(videos: HTMLElement[], sign = true, selectorFunc: SelectorFunc) {
        try {
            const checkDuration = durationFilterInstance.isEnable && selectorFunc.duration !== undefined
            const checkTitleKeyword = titleKeywordFilterInstance.isEnable && selectorFunc.titleKeyword !== undefined
            const checkUploader = uploaderFilterInstance.isEnable && selectorFunc.uploader !== undefined
            const checkBvid = bvidFilterInstance.isEnable && selectorFunc.bvid !== undefined
            const checkUploaderWhitelist =
                uploaderWhitelistFilterInstance.isEnable && selectorFunc.uploader !== undefined
            const checkTitleKeywordWhitelist =
                titleKeywordWhitelistFilterInstance.isEnable && selectorFunc.uploader !== undefined

            if (!checkDuration && !checkTitleKeyword && !checkUploader && !checkBvid) {
                // 黑名单全部关闭时 恢复全部视频
                videos.forEach((video) => this.showVideo(video))
                return
            }

            videos.forEach((video) => {
                debugFilter('=======================================================')
                debugFilter('视频参数：')
                debugFilter(
                    selectorFunc.duration!(video),
                    '|',
                    selectorFunc.bvid!(video),
                    '|',
                    selectorFunc.uploader!(video),
                )
                debugFilter(selectorFunc.titleKeyword!(video))

                const arr: any[] = []
                // 构建黑白名单任务, 调用各个子过滤器的check()方法检测
                const blackTasks: Promise<string>[] = []
                const whiteTasks: Promise<string>[] = []
                if (checkDuration) {
                    const duration = selectorFunc.duration!(video)
                    if (duration) {
                        blackTasks.push(durationFilterInstance.check(duration))
                        arr.push(duration)
                    }
                }
                if (checkBvid) {
                    const bvid = selectorFunc.bvid!(video)
                    if (bvid) {
                        blackTasks.push(bvidFilterInstance.check(bvid))
                        arr.push(bvid)
                    }
                }
                if (checkUploader) {
                    const uploader = selectorFunc.uploader!(video)
                    if (uploader) {
                        blackTasks.push(uploaderFilterInstance.check(uploader))
                        arr.push(uploader)
                    }
                }
                if (checkTitleKeyword) {
                    const titleKeyword = selectorFunc.titleKeyword!(video)
                    if (titleKeyword) {
                        blackTasks.push(titleKeywordFilterInstance.check(titleKeyword))
                        arr.push(titleKeyword)
                    }
                }
                if (checkUploaderWhitelist) {
                    const uploader = selectorFunc.uploader!(video)
                    if (uploader) {
                        whiteTasks.push(uploaderWhitelistFilterInstance.check(uploader))
                    }
                }
                if (checkTitleKeywordWhitelist) {
                    const titleKeyword = selectorFunc.titleKeyword!(video)
                    if (titleKeyword) {
                        whiteTasks.push(titleKeywordWhitelistFilterInstance.check(titleKeyword))
                    }
                }

                // // 执行检测
                // if (whiteTasks.length) {
                //     Promise.race(whiteTasks)
                //         .then((result) => {
                //             debugFilter(result)
                //             // 命中白名单
                //             this.showVideo(video)
                //             if (blackTasks.length) {
                //                 Promise.all(blackTasks).then().catch()
                //             }
                //         })
                //         .catch((result) => {
                //             debugFilter(result)
                //             // 未命中白名单, 进行黑名单检测
                //             if (blackTasks.length) {
                //                 Promise.all(blackTasks)
                //                     .then((result) => {
                //                         debugFilter(result)
                //                         this.showVideo(video)
                //                     })
                //                     .catch((result) => {
                //                         // 命中黑名单
                //                         debugFilter(result)
                //                         this.hideVideo(video)
                //                     })
                //             }
                //         })
                // } else {
                //     if (blackTasks.length) {
                //         Promise.all(blackTasks)
                //             .then((result) => {
                //                 debugFilter(result)
                //                 this.showVideo(video)
                //             })
                //             .catch((result) => {
                //                 // 命中黑名单
                //                 debugFilter(result)
                //                 this.hideVideo(video)
                //             })
                //     }
                // }

                // 此时黑名单非空
                Promise.all(blackTasks)
                    .then((_result) => {
                        // 未命中黑名单
                        this.showVideo(video)
                        Promise.all(whiteTasks)
                            .then((_result) => {})
                            .catch((_result) => {})
                    })
                    .catch((result) => {
                        // 命中黑名单
                        debugFilter(result)
                        if (whiteTasks) {
                            // 白名单检测
                            Promise.all(whiteTasks)
                                .then((result) => {
                                    // 命中黑名单，未命中白名单
                                    debugFilter(result)
                                    this.hideVideo(video)
                                })
                                .catch((result) => {
                                    // 命中白名单
                                    debugFilter(result)
                                    this.showVideo(video)
                                })
                        } else {
                            this.hideVideo(video)
                        }
                    })

                // 标记已过滤视频
                sign && video.setAttribute(settings.filterSign, '')
            })
        } catch (err) {
            error(err)
            error('coreFilter checkAll error')
        }
    }
}

// CoreFilter全局单例
const coreFilterInstance = new CoreFilter()
export default coreFilterInstance

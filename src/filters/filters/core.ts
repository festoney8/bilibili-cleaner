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
    check(value: string): Promise<void>
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
        debugFilter('coreFilter checkAll start')
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
                const arr: any[] = []
                // 构建黑白名单任务, 调用各个子过滤器的check()方法检测
                const blackTasks: Promise<void>[] = []
                const whiteTasks: Promise<void>[] = []
                if (checkDuration) {
                    const duration = selectorFunc.duration!(video)
                    if (duration) {
                        debugFilter('add task, duration', duration)
                        blackTasks.push(durationFilterInstance.check(duration))
                        arr.push(duration)
                    }
                }
                if (checkBvid) {
                    const bvid = selectorFunc.bvid!(video)
                    if (bvid) {
                        debugFilter('add task, bvid', bvid)
                        blackTasks.push(bvidFilterInstance.check(bvid))
                        arr.push(bvid)
                    }
                }
                if (checkUploader) {
                    const uploader = selectorFunc.uploader!(video)
                    if (uploader) {
                        debugFilter('add task, uploader', uploader)
                        blackTasks.push(uploaderFilterInstance.check(uploader))
                        arr.push(uploader)
                    }
                }
                if (checkTitleKeyword) {
                    const titleKeyword = selectorFunc.titleKeyword!(video)
                    if (titleKeyword) {
                        debugFilter('add task, titleKeyword', titleKeyword)
                        blackTasks.push(titleKeywordFilterInstance.check(titleKeyword))
                        arr.push(titleKeyword)
                    }
                }
                if (checkUploaderWhitelist) {
                    const uploader = selectorFunc.uploader!(video)
                    if (uploader) {
                        debugFilter('add task, uploader', uploader)
                        whiteTasks.push(uploaderWhitelistFilterInstance.check(uploader))
                    }
                }
                if (checkTitleKeywordWhitelist) {
                    const titleKeyword = selectorFunc.titleKeyword!(video)
                    if (titleKeyword) {
                        debugFilter('add white task, titleKeyword', titleKeyword)
                        whiteTasks.push(titleKeywordWhitelistFilterInstance.check(titleKeyword))
                    }
                }

                // 执行检测
                if (whiteTasks.length) {
                    Promise.race(whiteTasks)
                        .then(() => {
                            // 命中白名单
                            this.showVideo(video)
                            if (blackTasks.length) {
                                Promise.all(blackTasks).then().catch()
                            }
                        })
                        .catch(() => {
                            // 未命中白名单, 进行黑名单检测
                            if (blackTasks.length) {
                                Promise.all(blackTasks)
                                    .then(() => {
                                        this.showVideo(video)
                                    })
                                    .catch(() => {
                                        // 命中黑名单
                                        this.hideVideo(video)
                                    })
                            }
                        })
                } else {
                    if (blackTasks.length) {
                        Promise.all(blackTasks)
                            .then(() => {
                                this.showVideo(video)
                            })
                            .catch(() => {
                                // 命中黑名单
                                this.hideVideo(video)
                            })
                    }
                }

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

import settings from '../../../settings'
import { debugVideoFilter as debug, error, log } from '../../../utils/logger'
import { hideVideo, isVideoHide, showVideo } from '../../../utils/tool'
import bvidFilterInstance from './subfilters/bvid'
import durationFilterInstance from './subfilters/duration'
import titleKeywordFilterInstance from './subfilters/titleKeyword'
import titleKeywordWhitelistFilterInstance from './subfilters/titleKeywordWhitelist'
import uploaderFilterInstance from './subfilters/uploader'
import uploaderWhitelistFilterInstance from './subfilters/uploaderWhitelist'

// 子过滤器实现ISubFilter，包括白名单
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

interface VideoInfo {
    duration?: string | undefined
    title?: string | undefined
    uploader?: string | undefined
    bvid?: string | undefined
}

class CoreFilter {
    /**
     * 检测视频列表中每个视频是否合法, 并隐藏不合法的视频
     * 对选取出的 标题/UP主/时长/BVID 进行并发检测
     * @param videos 视频列表
     * @param sign attribute标记
     * @param selectorFunc 使用selector选取元素的函数
     */
    checkAll(videos: HTMLElement[], sign = true, selectorFunc: SelectorFunc) {
        debug(`checkAll start`)
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
                videos.forEach((video) => showVideo(video))
                return
            }

            videos.forEach((video) => {
                const info: VideoInfo = {}

                // 构建黑白名单任务, 调用各个子过滤器的check()方法检测
                const blackTasks: Promise<string>[] = []
                const whiteTasks: Promise<string>[] = []
                if (checkDuration) {
                    const duration = selectorFunc.duration!(video)
                    if (duration) {
                        blackTasks.push(durationFilterInstance.check(duration))
                        info.duration = duration
                    }
                }
                if (checkBvid) {
                    const bvid = selectorFunc.bvid!(video)
                    if (bvid) {
                        blackTasks.push(bvidFilterInstance.check(bvid))
                        info.bvid = bvid
                    }
                }
                if (checkUploader) {
                    const uploader = selectorFunc.uploader!(video)?.trim()
                    if (uploader) {
                        blackTasks.push(uploaderFilterInstance.check(uploader))
                        info.uploader = uploader
                    }
                }
                if (checkTitleKeyword) {
                    const title = selectorFunc.titleKeyword!(video)?.trim()
                    if (title) {
                        blackTasks.push(titleKeywordFilterInstance.check(title))
                        info.title = title
                    }
                }
                if (checkUploaderWhitelist) {
                    const uploader = selectorFunc.uploader!(video)?.trim()
                    if (uploader) {
                        whiteTasks.push(uploaderWhitelistFilterInstance.check(uploader))
                        info.uploader = uploader
                    }
                }
                if (checkTitleKeywordWhitelist) {
                    const title = selectorFunc.titleKeyword!(video)?.trim()
                    if (title) {
                        whiteTasks.push(titleKeywordWhitelistFilterInstance.check(title))
                        info.title = title
                    }
                }

                // 执行检测
                Promise.all(blackTasks)
                    .then((_result) => {
                        // 未命中黑名单
                        // debug(_result)
                        showVideo(video)
                        Promise.all(whiteTasks)
                            .then((_result) => {})
                            .catch((_result) => {})
                    })
                    .catch((_result) => {
                        // 命中黑名单
                        // debug(_result)
                        if (whiteTasks) {
                            Promise.all(whiteTasks)
                                .then((_result) => {
                                    // 命中黑名单，未命中白名单
                                    // debug(_result)
                                    if (!isVideoHide(video)) {
                                        log(
                                            `hide video\nbvid: ${info.bvid}\ntime: ${info.duration}\nup: ${info.uploader}\ntitle: ${info.title}`,
                                        )
                                    }
                                    hideVideo(video)
                                })
                                .catch((_result) => {
                                    // 命中白名单
                                    // debug(_result)
                                    showVideo(video)
                                })
                        } else {
                            if (!isVideoHide(video)) {
                                log(
                                    `hide video\nbvid: ${info.bvid}\ntime: ${info.duration}\nup: ${info.uploader}\ntitle: ${info.title}`,
                                )
                            }
                            hideVideo(video)
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

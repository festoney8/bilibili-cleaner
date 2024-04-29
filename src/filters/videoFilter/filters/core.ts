import settings from '../../../settings'
import { debugVideoFilter as debug, error, log } from '../../../utils/logger'
import { hideEle, isEleHide, showEle } from '../../../utils/tool'
import bvidFilterInstance from './subfilters/bvid'
import durationFilterInstance from './subfilters/duration'
import titleKeywordFilterInstance from './subfilters/titleKeyword'
import titleKeywordWhitelistFilterInstance from './subfilters/titleKeywordWhitelist'
import uploaderFilterInstance from './subfilters/uploader'
import uploaderKeywordFilterInstance from './subfilters/uploaderKeyword'
import uploaderWhitelistFilterInstance from './subfilters/uploaderWhitelist'

// 子过滤器实现IVideoSubFilter，包括白名单
export interface IVideoSubFilter {
    isEnable: boolean
    setStatus(status: boolean): void
    setParams(value: string[] | number): void
    addParam?(value: string): void
    check(value: string | boolean | number): Promise<string>
}

export type VideoSelectorFunc = {
    duration?: (video: HTMLElement) => string | null
    titleKeyword?: (video: HTMLElement) => string | null
    bvid?: (video: HTMLElement) => string | null
    uploader?: (video: HTMLElement) => string | null
    coinLikeRatio?: (video: HTMLElement) => number | null
    isVertical?: (video: HTMLElement) => boolean | null
}

interface VideoInfo {
    duration?: string | undefined
    title?: string | undefined
    uploader?: string | undefined
    bvid?: string | undefined
    coinLikeRatio?: number | undefined
    isVertical?: boolean | undefined
}

class CoreVideoFilter {
    /**
     * 检测视频列表中每个视频是否合法, 并隐藏不合法的视频
     * 对选取出的 标题/UP主/时长/BVID 进行并发检测
     * @param videos 视频列表
     * @param sign attribute标记
     * @param selectorFunc 使用selector选取元素的函数
     */
    checkAll(videos: HTMLElement[], sign = true, selectorFunc: VideoSelectorFunc) {
        debug(`checkAll start`)
        try {
            const checkDuration = durationFilterInstance.isEnable && selectorFunc.duration !== undefined
            const checkTitleKeyword = titleKeywordFilterInstance.isEnable && selectorFunc.titleKeyword !== undefined
            const checkUploader = uploaderFilterInstance.isEnable && selectorFunc.uploader !== undefined
            const checkUploaderKeyword = uploaderKeywordFilterInstance.isEnable && selectorFunc.uploader !== undefined
            const checkBvid = bvidFilterInstance.isEnable && selectorFunc.bvid !== undefined
            const checkUploaderWhitelist =
                uploaderWhitelistFilterInstance.isEnable && selectorFunc.uploader !== undefined
            const checkTitleKeywordWhitelist =
                titleKeywordWhitelistFilterInstance.isEnable && selectorFunc.titleKeyword !== undefined

            if (!checkDuration && !checkTitleKeyword && !checkUploader && !checkBvid) {
                // 黑名单全部关闭时 恢复全部视频
                videos.forEach((video) => showEle(video))
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
                if (checkUploaderKeyword) {
                    const uploader = selectorFunc.uploader!(video)?.trim()
                    if (uploader) {
                        blackTasks.push(uploaderKeywordFilterInstance.check(uploader))
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
                        showEle(video)
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
                                    if (!isEleHide(video)) {
                                        log(
                                            `hide video\nbvid: ${info.bvid}\ntime: ${info.duration}\nup: ${info.uploader}\ntitle: ${info.title}`,
                                        )
                                    }
                                    hideEle(video)
                                })
                                .catch((_result) => {
                                    // 命中白名单
                                    // debug(_result)
                                    showEle(video)
                                })
                        } else {
                            if (!isEleHide(video)) {
                                log(
                                    `hide video\nbvid: ${info.bvid}\ntime: ${info.duration}\nup: ${info.uploader}\ntitle: ${info.title}`,
                                )
                            }
                            hideEle(video)
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

// CoreVideoFilter全局单例
const coreVideoFilterInstance = new CoreVideoFilter()
export default coreVideoFilterInstance

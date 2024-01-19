import settings from '../../settings'
import bvidFilterInstance from './subfilters/bvid'
import durationFilterInstance from './subfilters/duration'
import keywordFilterInstance from './subfilters/keyword'
import uploaderFilterInstance from './subfilters/uploader'

export type SelectorFunc = {
    duration?: (video: HTMLElement) => string | null
    title?: (video: HTMLElement) => string | null
    bvid?: (video: HTMLElement) => string | null
    uploader?: (video: HTMLElement) => string | null
}

export class CoreFilter {
    // public, 允许外界实时启用禁用子过滤器
    public enableDuration = true
    public enableKeyword = true
    public enableBvid = true
    public enableUploader = true
    public enableWhitelist = false

    constructor() {}

    /** 隐藏视频, display:none */
    private hideVideo(video: HTMLElement) {
        video.style.display = 'none'
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
        const checkDuration = this.enableDuration && selectorFunc.duration
        const checkKeyword = this.enableKeyword && selectorFunc.title
        const checkUploader = this.enableUploader && selectorFunc.uploader
        const checkBvid = this.enableBvid && selectorFunc.bvid

        if (!checkDuration && !checkKeyword && !checkUploader && !checkBvid) {
            return
        }
        videos.forEach((video) => {
            // 构建任务列表, 调用各个子过滤器的check()方法检测
            const tasks: Promise<void>[] = []
            if (checkDuration) {
                const duration = selectorFunc.duration!(video)
                if (duration) {
                    tasks.push(durationFilterInstance.check(duration))
                }
            }
            if (checkKeyword) {
                const title = selectorFunc.title!(video)
                if (title) {
                    tasks.push(keywordFilterInstance.check(title))
                }
            }
            if (checkBvid) {
                const title = selectorFunc.bvid!(video)
                if (title) {
                    tasks.push(bvidFilterInstance.check(title))
                }
            }
            if (checkUploader) {
                const title = selectorFunc.uploader!(video)
                if (title) {
                    tasks.push(uploaderFilterInstance.check(title))
                }
            }
            Promise.all(tasks)
                .then(() => {
                    this.showVideo(video)
                })
                .catch(() => {
                    this.hideVideo(video)
                })
                .finally(() => {
                    // 标记已过滤视频
                    if (sign) {
                        video.setAttribute(settings.filterSign, '')
                    }
                })
        })
    }
}

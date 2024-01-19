import settings from '../../settings'
import { debug } from '../../utils/logger'
import bvidFilterInstance from './subfilters/bvid'
import durationFilterInstance from './subfilters/duration'
import titleKeywordAgencyInstance from './subfilters/titleKeyword'
import uploaderFilterInstance from './subfilters/uploader'

export type SelectorFunc = {
    duration?: (video: HTMLElement) => string | null
    titleKeyword?: (video: HTMLElement) => string | null
    bvid?: (video: HTMLElement) => string | null
    uploader?: (video: HTMLElement) => string | null
}

class CoreFilter {
    // public, 允许外界实时启用禁用子过滤器
    public enableDuration = true
    public enableTitleKeyword = true
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
        const checkTitleKeyword = this.enableTitleKeyword && selectorFunc.titleKeyword
        const checkUploader = this.enableUploader && selectorFunc.uploader
        const checkBvid = this.enableBvid && selectorFunc.bvid

        if (!checkDuration && !checkTitleKeyword && !checkUploader && !checkBvid) {
            return
        }
        videos.forEach((video) => {
            // 构建任务列表, 调用各个子过滤器的check()方法检测
            debug('add task ---------------------------------------------------')
            const tasks: Promise<void>[] = []
            if (checkDuration) {
                const duration = selectorFunc.duration!(video)
                if (duration) {
                    debug('add task, duration', duration)
                    tasks.push(durationFilterInstance.check(duration))
                }
            }
            if (checkTitleKeyword) {
                const titleKeyword = selectorFunc.titleKeyword!(video)
                if (titleKeyword) {
                    debug('add task, titleKeyword', titleKeyword)
                    tasks.push(titleKeywordAgencyInstance.check(titleKeyword))
                }
            }
            if (checkBvid) {
                const bvid = selectorFunc.bvid!(video)
                if (bvid) {
                    debug('add task, bvid', bvid)
                    tasks.push(bvidFilterInstance.check(bvid))
                }
            }
            if (checkUploader) {
                const uploader = selectorFunc.uploader!(video)
                if (uploader) {
                    debug('add task, uploader', uploader)
                    tasks.push(uploaderFilterInstance.check(uploader))
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

// CoreFilter全局单例
const coreFilterInstance = new CoreFilter()
export default coreFilterInstance

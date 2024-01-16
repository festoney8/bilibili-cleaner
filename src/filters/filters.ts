import settings from '../settings'
import { debug, error } from '../utils/logger'

interface IFilter {
    check(info: string): Promise<void>
}

// 子分类filter设定
export type durationFilterConfig = {
    threshold: number
}
export type titleFilterConfig = {
    blacklist: string[]
}
export type uploaderFilterConfig = {
    blacklist: string[]
}
// mainFilter设定
export type filterConfig = {
    // 是否启用子过滤器
    enable: {
        duration: boolean
        title: boolean
        uploader: boolean
    }
    // 时长、标题、发布人的selector
    selectors: {
        duration?: undefined | string
        title?: undefined | string
        uploader?: undefined | string
    }
    // 子过滤器配置
    subConfig: {
        duration?: undefined | durationFilterConfig
        title?: undefined | titleFilterConfig
        uploader?: undefined | uploaderFilterConfig
    }
    // 是否需要将display none恢复
    needRecoverDisplay: boolean
}

// 子过滤器: 时长过滤
class DurationFilter implements IFilter {
    private readonly pattern = /^(\d+:)?\d\d:\d\d$/g
    // 开放threshold, 允许外界实时修改
    public threshold: number = 0

    // Todo: UP主白名单，标题关键词白名单
    constructor(private params: durationFilterConfig) {
        this.threshold = this.params.threshold
    }

    private isLegal(duration: string): boolean {
        const hhmmss = duration.split(':')
        if (hhmmss.length == 2) {
            return parseInt(hhmmss[0]) * 60 + parseInt(hhmmss[1]) >= this.threshold
        } else if (hhmmss.length > 2) {
            return true
        }
        return true
    }

    check(duration: string): Promise<void> {
        duration = duration.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (duration && duration.match(this.pattern)) {
                    if (this.isLegal(duration)) {
                        resolve()
                    } else {
                        debug('reject duration', duration, this.threshold)
                        reject()
                    }
                } else {
                    resolve()
                }
            } catch (err) {
                error(err)
                resolve()
            }
        })
    }
}

// 子过滤器: 标题关键词过滤
class TitleFilter implements IFilter {
    // private filteredTitleSet = new Set()
    constructor(private params: titleFilterConfig) {
        debug(this.params)
    }

    check(title: string): Promise<void> {
        debug(title)
        return new Promise<void>((resolve, _reject) => {
            resolve()
        })
    }
}

// 子过滤器: UP主过滤
class UploaderFilter implements IFilter {
    // private filteredTitleSet = new Set()
    constructor(private params: uploaderFilterConfig) {
        debug(this.params)
    }

    check(uploader: string): Promise<void> {
        debug(uploader)
        return new Promise<void>((resolve, _reject) => {
            resolve()
        })
    }
}

// // 子过滤器: 视频ID过滤
// class vidFilter implements IFilter {
//     // private filteredTitleSet = new Set()
//     constructor(private params: uploaderFilterConfig) {
//         debug(this.params)
//     }

//     check(uploader: string): Promise<void> {
//         debug(uploader)
//         return new Promise<void>((resolve, _reject) => {
//             resolve()
//         })
//     }
// }

/**
 * 测速表明：
 * 使用querySelector寻找元素远快于使用regex匹配innerHTML, 且快于从textContent中匹配regex
 */
export class MainFilter {
    // 过滤器实例, 开放外界访问, 可实时修改参数
    public durationFilter: DurationFilter | undefined = undefined
    public titleFilter: TitleFilter | undefined = undefined
    public uploaderFilter: UploaderFilter | undefined = undefined
    // 是否启用
    private enableDuration = false
    private enableTitle = false
    private enableUploader = false
    // 选择器
    private durationSelector: undefined | string = undefined
    private titleSelector: undefined | string = undefined
    private uploaderSelector: undefined | string = undefined
    // 是否恢复display
    private needDisplayRecover = false

    /**
     * 构建主过滤器
     * @param config mainFilter config
     */
    constructor(private config: filterConfig) {
        this.needDisplayRecover = this.config.needRecoverDisplay

        this.enableDuration = this.config.enable.duration
        this.enableTitle = this.config.enable.title
        this.enableUploader = this.config.enable.uploader

        this.durationSelector = this.config.selectors.duration
        this.titleSelector = this.config.selectors.title
        this.uploaderSelector = this.config.selectors.uploader

        if (this.enableDuration && this.config.subConfig.duration) {
            this.durationFilter = new DurationFilter(this.config.subConfig.duration)
        }
        if (this.enableTitle && this.config.subConfig.title) {
            this.titleFilter = new TitleFilter(this.config.subConfig.title)
        }
        if (this.enableUploader && this.config.subConfig.uploader) {
            this.uploaderFilter = new UploaderFilter(this.config.subConfig.uploader)
        }
    }

    /**
     * 对视频列表进行筛选
     * 支持首页、播放页右栏、热门视频/每周必看/排行榜
     * @param videos 由调用函数传入的视频列表，包含一组视频HTML节点，每个节点内应包含 标题、时长、UP主、视频链接等
     */
    checkAll(videos: HTMLElement[]) {
        if (this.enableDuration && this.enableTitle && this.enableUploader) {
            return
        }
        const checkDuration = this.enableDuration && this.durationFilter && this.durationSelector
        const checkTitle = this.enableTitle && this.titleFilter && this.titleSelector
        const checkUploader = this.enableUploader && this.uploaderFilter && this.uploaderSelector
        videos.forEach((video) => {
            // 构建任务，对标题、时长、UP主进行并行检查
            const tasks: Promise<void>[] = []
            if (checkDuration) {
                const duration = video.querySelector(this.durationSelector!)?.textContent?.trim()
                if (duration) {
                    tasks.push(this.durationFilter!.check(duration))
                }
            }
            if (checkTitle) {
                const title = video.querySelector(this.titleSelector!)?.textContent?.trim()
                if (title) {
                    tasks.push(this.titleFilter!.check(title))
                }
            }
            if (checkUploader) {
                const uploader = video.querySelector(this.uploaderSelector!)?.textContent?.trim()
                if (uploader) {
                    tasks.push(this.uploaderFilter!.check(uploader))
                }
            }
            // 隐藏视频, display:none或remove
            Promise.all(tasks)
                .then(() => {
                    // 首页feed会复用元素, 按需复原
                    if (this.needDisplayRecover && video.style.display.includes('none')) {
                        video.style.removeProperty('display')
                    }
                })
                .catch(() => {
                    // video.style.display = 'none'
                    video.style.visibility = 'hidden'
                    if (!video.hasAttribute(settings.filterSign)) {
                        video.setAttribute(settings.filterSign, '')
                    }
                })
        })
    }
}

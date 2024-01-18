import settings from '../settings'
import { debug, error } from '../utils/logger'

interface IFilter {
    check(info: string): Promise<void>
}

// 子分类filter设定
export type DurationFilterConfig = {
    threshold: number
}
export type TitleFilterConfig = {
    keywordBlacklistSet: Set<string>
}
export type UploaderFilterConfig = {
    uploaderBlacklistSet: Set<string>
}
// 时长、标题、UP主 selector
export type Selectors = {
    duration?: undefined | string
    title?: undefined | string
    uploader?: undefined | string
}

// 子过滤器: 时长过滤
class DurationFilter implements IFilter {
    private readonly pattern = /^(\d+:)?\d\d:\d\d$/g
    private threshold: number = 0

    // Todo: UP主白名单，标题关键词白名单
    constructor(private config: DurationFilterConfig) {
        this.threshold = this.config.threshold
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

    updateConfig(config: DurationFilterConfig) {
        this.threshold = config.threshold
    }

    check(duration: string): Promise<void> {
        duration = duration.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (duration && duration.match(this.pattern)) {
                    if (this.isLegal(duration)) {
                        // debug(`resolve, duration ${duration}, threshold ${this.threshold}`)
                        resolve()
                    } else {
                        // debug(`reject, duration ${duration}, threshold ${this.threshold}`)
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
    constructor(private config: TitleFilterConfig) {
        debug(this.config)
    }
    updateConfig(config: TitleFilterConfig) {
        debug(config)
    }

    check(title: string): Promise<void> {
        debug(title)
        return new Promise<void>((resolve, _reject) => {
            resolve()
        })
    }
}

// 子过滤器: UP主过滤 (使用UP主昵称)
class UploaderFilter implements IFilter {
    private uploaderBlacklistSet = new Set<string>()
    constructor(private config: UploaderFilterConfig) {
        this.uploaderBlacklistSet = config.uploaderBlacklistSet
    }
    updateConfig(config: UploaderFilterConfig) {
        this.uploaderBlacklistSet = config.uploaderBlacklistSet
    }
    check(uploader: string): Promise<void> {
        debug(uploader)
        return new Promise<void>((resolve, reject) => {
            if (this.uploaderBlacklistSet.has(uploader.trim())) {
                debug(`reject uploader ${uploader}`)
                reject()
            } else {
                debug(`resolve uploader ${uploader}`)
                resolve()
            }
        })
    }
}

// // 子过滤器: 视频bvid过滤
// class vidFilter implements IFilter {
//     // private filteredTitleSet = new Set()
//     constructor(private config: uploaderFilterConfig) {
//         debug(this.config)
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
 * 使用querySelector寻找元素 远快于使用regex匹配innerHTML
 * 且快于从textContent中匹配regex
 * 故使用selector提取出时长、标题、UP主、链接信息，用各自的filter进行过滤
 */
export class MainFilter {
    // 子过滤器实例
    private durationFilterInstance: DurationFilter | undefined = undefined
    private titleFilterInstance: TitleFilter | undefined = undefined
    private uploaderFilterInstance: UploaderFilter | undefined = undefined
    // 是否启用
    private durationEnable = false
    private titleEnable = false
    private uploaderEnable = false
    // 选择器
    private durationSelector: undefined | string = undefined
    private titleSelector: undefined | string = undefined
    private uploaderSelector: undefined | string = undefined

    /**
     * 构建主过滤器, 各个子过滤器的值由启用过滤器的itemFunc设定
     */
    constructor() {}

    /**
     * 设定selector
     * @param selectors
     */
    setupSelectors(selectors: Selectors) {
        // 设定默认selector
        this.durationSelector = selectors.duration ? selectors.duration : undefined
        this.titleSelector = selectors.title ? selectors.title : undefined
        this.uploaderSelector = selectors.uploader ? selectors.uploader : undefined
    }
    /**
     * 设定或更新时长过滤器
     * @param durationEnable 启用时长过滤
     * @param durationFilterConfig 子过滤器配置
     */
    setupDurationFilter(durationEnable: boolean, durationFilterConfig: DurationFilterConfig) {
        this.durationEnable = durationEnable
        if (!this.durationFilterInstance) {
            this.durationFilterInstance = new DurationFilter(durationFilterConfig)
        } else {
            this.durationFilterInstance.updateConfig(durationFilterConfig)
        }
    }
    /**
     * 设定或更新标题过滤器
     * @param titleEnable 启用标题过滤
     * @param titleFilterConfig 子过滤器配置
     */
    setupTitleFilter(titleEnable: boolean, titleFilterConfig: TitleFilterConfig) {
        this.titleEnable = titleEnable
        if (!this.titleFilterInstance) {
            this.titleFilterInstance = new TitleFilter(titleFilterConfig)
        } else {
            this.titleFilterInstance.updateConfig(titleFilterConfig)
        }
    }
    /**
     * 设定或更新UP主过滤器
     * @param uploaderEnable 启用UP主过滤
     * @param uploaderFilterConfig 子过滤器配置
     */
    setupUploaderFilter(uploaderEnable: boolean, uploaderFilterConfig: UploaderFilterConfig) {
        this.uploaderEnable = uploaderEnable
        if (!this.uploaderFilterInstance) {
            this.uploaderFilterInstance = new UploaderFilter(uploaderFilterConfig)
        } else {
            this.uploaderFilterInstance.updateConfig(uploaderFilterConfig)
        }
    }

    /** 隐藏视频 */
    hideVideo(video: HTMLElement) {
        video.style.display = 'none'
    }
    /** 恢复视频, 用于筛选条件变化时重置 */
    showVideo(video: HTMLElement) {
        if (video.style.display.includes('none')) {
            video.style.removeProperty('display')
        }
    }

    /**
     * 对视频列表进行筛选
     * 支持首页、播放页右栏、热门视频/每周必看/排行榜
     * @param videos 由调用函数传入的视频列表，包含一组视频HTML节点，每个节点内应包含 标题、时长、UP主、视频链接等
     * @param sign 是否标记已过滤项
     * @param selectors 可选, 用于覆盖默认selector, 用于例外情况
     */
    checkAll(videos: HTMLElement[], sign = true, selectors?: Selectors) {
        if (!selectors) {
            // 使用默认selector
            const checkDuration = this.durationEnable && this.durationFilterInstance && this.durationSelector
            const checkTitle = this.titleEnable && this.titleFilterInstance && this.titleSelector
            const checkUploader = this.uploaderEnable && this.uploaderFilterInstance && this.uploaderSelector
            if (!checkDuration && !checkTitle && !checkUploader) {
                return
            }
            videos.forEach((video) => {
                // 构建任务，对标题、时长、UP主进行并行检查
                const tasks: Promise<void>[] = []
                if (checkDuration) {
                    const duration = video.querySelector(this.durationSelector!)?.textContent?.trim()
                    if (duration) {
                        tasks.push(this.durationFilterInstance!.check(duration))
                    }
                }
                if (checkTitle) {
                    const title = video.querySelector(this.titleSelector!)?.textContent?.trim()
                    if (title) {
                        tasks.push(this.titleFilterInstance!.check(title))
                    }
                }
                if (checkUploader) {
                    const uploader = video.querySelector(this.uploaderSelector!)?.textContent?.trim()
                    if (uploader) {
                        tasks.push(this.uploaderFilterInstance!.check(uploader))
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
                        // 标记已过滤的视频
                        if (sign) {
                            video.setAttribute(settings.filterSign, '')
                        }
                    })
            })
        } else {
            // 使用临时selector
            const checkDuration = this.durationEnable && this.durationFilterInstance && selectors.duration
            const checkTitle = this.titleEnable && this.titleFilterInstance && selectors.title
            const checkUploader = this.uploaderEnable && this.uploaderFilterInstance && selectors.uploader
            if (!checkDuration && !checkTitle && !checkUploader) {
                return
            }
            videos.forEach((video) => {
                // 构建任务，对标题、时长、UP主进行并行检查
                const tasks: Promise<void>[] = []
                if (checkDuration) {
                    const duration = video.querySelector(selectors.duration!)?.textContent?.trim()
                    if (duration) {
                        tasks.push(this.durationFilterInstance!.check(duration))
                    }
                }
                if (checkTitle) {
                    const title = video.querySelector(selectors.title!)?.textContent?.trim()
                    if (title) {
                        tasks.push(this.titleFilterInstance!.check(title))
                    }
                }
                if (checkUploader) {
                    const uploader = video.querySelector(selectors.uploader!)?.textContent?.trim()
                    if (uploader) {
                        tasks.push(this.uploaderFilterInstance!.check(uploader))
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
                        if (sign) {
                            video.setAttribute(settings.filterSign, '')
                        }
                    })
            })
        }
    }
}

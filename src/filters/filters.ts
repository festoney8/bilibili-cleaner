import { error } from '../utils/logger'

interface IFilter {
    check(info: string): Promise<void>
}

class DurationFilter implements IFilter {
    private readonly pattern = /^(\d+:)?\d\d:\d\d$/g
    constructor(
        private threshold: number,
        // Todo: UP主白名单，标题关键词白名单
    ) {}

    private isLegal(duration: string): boolean {
        const hhmmss = duration.split(':')
        if (hhmmss.length > 2) {
            return true
        } else if (hhmmss.length == 2) {
            return parseInt(hhmmss[0]) * 60 + parseInt(hhmmss[1]) >= this.threshold
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

class TitleFilter implements IFilter {
    // private filteredTitleSet = new Set()
    constructor(private blacklist: string[] = []) {}

    check(title: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve()
        })
    }
}

class UploaderFilter implements IFilter {
    // private filteredTitleSet = new Set()
    constructor(private blacklist: string[] = []) {}

    check(uploader: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve()
        })
    }
}

class MainFilter {
    private durationFilter: DurationFilter | undefined = undefined
    private titleFilter: TitleFilter | undefined = undefined
    private uploaderFilter: UploaderFilter | undefined = undefined

    constructor(
        private options = { enableDuration: false, enableTitle: false, enableUploader: false },
        private selectors = { duration: '', title: '', uploader: '' },
        private durationParams = { threshold: 0 },
        private titleParams = { blacklist: [] },
        private uploaderParams = { blacklist: [] },
        private needRecover = false,
    ) {
        if (options.enableDuration) {
            this.durationFilter = new DurationFilter(durationParams.threshold)
        }
        if (options.enableTitle) {
            this.titleFilter = new TitleFilter(titleParams.blacklist)
        }
        if (options.enableUploader) {
            this.uploaderFilter = new UploaderFilter(uploaderParams.blacklist)
        }
    }

    checkAll(videos: HTMLElement[]) {
        if (this.durationFilter && this.titleFilter && this.uploaderFilter) {
            return
        }
        videos.forEach((video) => {
            const tasks: Promise<void>[] = []
            // 对标题、时长、UP主进行并行检查
            if (this.options.enableDuration && this.durationFilter) {
                const duration = video.querySelector(this.selectors.duration)?.textContent?.trim()
                if (duration) {
                    tasks.push(this.durationFilter.check(duration))
                }
            }
            if (this.options.enableTitle && this.titleFilter) {
                const title = video.querySelector(this.selectors.title)?.textContent?.trim()
                if (title) {
                    tasks.push(this.titleFilter.check(title))
                }
            }
            if (this.options.enableUploader && this.uploaderFilter) {
                const uploader = video.querySelector(this.selectors.uploader)?.textContent?.trim()
                if (uploader) {
                    tasks.push(this.uploaderFilter.check(uploader))
                }
            }
            // 对掉的视频隐藏, display:none或remove
            Promise.all(tasks)
                .then(() => {
                    // 首页feed会复用元素, 按需复原
                    if (this.needRecover && video.style.display.includes('none')) {
                        video.style.removeProperty('display')
                    }
                })
                .catch(() => {
                    video.style.display = 'none'
                })
        })
    }
}

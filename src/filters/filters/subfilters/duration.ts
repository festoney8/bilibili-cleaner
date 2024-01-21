import { debugFilter, error } from '../../../utils/logger'
import { ISubFilter } from '../core'

class DurationFilter implements ISubFilter {
    // 匹配时长的正则
    private readonly pattern = /^(\d+:)?\d\d:\d\d$/g
    // 时长阈值, 单位秒
    private threshold = 0
    isEnable = false

    setStatus(status: boolean) {
        debugFilter(`DurationFilter setStatus ${status}`)
        this.isEnable = status
    }

    setParams(threshold: number) {
        debugFilter(`DurationFilter setParams ${threshold}`)
        this.threshold = threshold
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
                if (!this.isEnable || this.threshold === 0) {
                    // debugFilter(`resolve, duration filter is disable, or threshold is 0`)
                    resolve()
                    return
                } else if (duration && duration.match(this.pattern)) {
                    if (this.isLegal(duration)) {
                        // debugFilter(`resolve, duration ${duration}, threshold ${this.threshold}`)
                        resolve()
                    } else {
                        debugFilter(`reject, duration ${duration}, threshold ${this.threshold}`)
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

// 单例
const durationFilterInstance = new DurationFilter()
export default durationFilterInstance

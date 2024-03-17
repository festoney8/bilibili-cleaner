import { error } from '../../../../utils/logger'
import { ISubFilter } from '../core'

class DurationFilter implements ISubFilter {
    // 匹配时长的正则
    private readonly pattern = /^(\d+:)?\d\d:\d\d$/g
    // 时长阈值, 单位秒
    private threshold = 0
    isEnable = false

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(threshold: number) {
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

    check(duration: string): Promise<string> {
        duration = duration.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || this.threshold === 0) {
                    resolve(`Duration resolve, disable or 0`)
                    return
                } else if (duration && duration.match(this.pattern)) {
                    if (this.isLegal(duration)) {
                        resolve(`Duration resolve, duration OK`)
                    } else {
                        reject(`Duration reject, ${duration} < ${this.threshold}s`)
                    }
                } else {
                    resolve(`Duration resolve`)
                }
            } catch (err) {
                error(err)
                resolve(`Duration resolve, error`)
            }
        })
    }
}

// 单例
const durationFilterInstance = new DurationFilter()
export default durationFilterInstance

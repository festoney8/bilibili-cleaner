import { IVideoSubFilter } from '../core'

class DurationFilter implements IVideoSubFilter {
    // 时长阈值, 单位秒
    private threshold = 0
    isEnable = false

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(threshold: number) {
        this.threshold = threshold
    }

    // duration转换为秒数, 支持 HH:MM:SS, MM:SS, 纯数字
    durationToSec = (duration: string): number => {
        duration = duration.trim()
        if (duration.match(/^(?:\d+:)?\d+:\d+$/)) {
            const parts = duration.split(':').map((part) => parseInt(part))
            if (parts.length === 3) {
                return parts[0] * 3600 + parts[1] * 60 + parts[2]
            }
            if (parts.length === 2) {
                return parts[0] * 60 + parts[1]
            }
        } else if (duration.match(/^\d+$/)) {
            return parseInt(duration)
        }
        return -1
    }

    check(duration: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.isEnable || this.threshold === 0) {
                resolve(`Duration resolve, disable or 0`)
            } else {
                const seconds = this.durationToSec(duration)
                if (seconds > 0 && seconds > this.threshold) {
                    resolve(`Duration OK`)
                } else {
                    reject(`Duration too short`)
                }
            }
        })
    }
}

// 单例
const durationFilterInstance = new DurationFilter()
export default durationFilterInstance

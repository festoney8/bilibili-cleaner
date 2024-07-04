import { IDynSubFilter } from '../core'

class DynDurationFilter implements IDynSubFilter {
    // 时长阈值, 单位秒
    private threshold = 0
    isEnable = false

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(threshold: number) {
        this.threshold = threshold
    }

    // dynDuration转换为秒数, 支持 HH:MM:SS, MM:SS, 纯数字
    dynDurationToSec = (dynDuration: string): number => {
        dynDuration = dynDuration.trim()
        if (dynDuration.match(/^(?:\d+:)?\d+:\d+$/)) {
            const parts = dynDuration.split(':').map((part) => parseInt(part))
            if (parts.length === 3) {
                return parts[0] * 3600 + parts[1] * 60 + parts[2]
            }
            if (parts.length === 2) {
                return parts[0] * 60 + parts[1]
            }
        } else if (dynDuration.match(/^\d+$/)) {
            return parseInt(dynDuration)
        }
        return -1
    }

    check(dynDuration: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.isEnable || this.threshold === 0) {
                resolve(`DynDuration resolve, disable or 0`)
            } else {
                const seconds = this.dynDurationToSec(dynDuration)
                if (seconds > 0 && seconds > this.threshold) {
                    resolve(`DynDuration OK`)
                } else {
                    reject(`DynDuration too short`)
                }
            }
        })
    }
}

// 单例
const dynDurationFilterInstance = new DynDurationFilter()
export default dynDurationFilterInstance

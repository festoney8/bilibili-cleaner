import { ICommentSubFilter } from '../core'

class LevelFilter implements ICommentSubFilter {
    private threshold = 0
    isEnable = false

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(threshold: number) {
        this.threshold = threshold
    }

    check(level: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.isEnable || this.threshold === 0) {
                resolve(`Level resolve, disable or 0`)
            } else {
                if (level >= this.threshold) {
                    resolve(`Level OK`)
                } else {
                    reject(`Level reject`)
                }
            }
        })
    }
}

// 单例
const levelFilterInstance = new LevelFilter()
export default levelFilterInstance

import { IVideoSubFilter } from '../core'

class QualityFilter implements IVideoSubFilter {
    // 质量过滤阈值
    private threshold = 0
    isEnable = false

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(threshold: number) {
        this.threshold = threshold
    }

    // 根据coinLikeRatio计算视频质量, 参数源于爬虫数据拟合
    calcQuality = (ratio: number): number => {
        const A = -1.201e1
        const B = 6.861e-1
        const C = 7.369e-2
        const D = 1.192e2
        const ans = (A - D) / (1 + Math.pow(ratio / C, B)) + D
        return ans > 0 ? ans : 0
    }

    check(ratio: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.isEnable || this.threshold === 0) {
                resolve(`Quality resolve, disable or 0`)
            } else {
                const score = this.calcQuality(ratio)
                if (score > 0 && score > this.threshold) {
                    resolve(`Quality OK`)
                } else {
                    reject(`Quality too bad`)
                }
            }
        })
    }
}

// 单例
const qualityFilterInstance = new QualityFilter()
export default qualityFilterInstance

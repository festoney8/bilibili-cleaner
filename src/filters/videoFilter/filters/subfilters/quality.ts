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

    /*
        根据coinLikeRatio计算视频质量
        对爬虫数据中投币点赞比在热门视频中所在排名进行拟合（百分制，4PL Formula）
        保持Quality在5%~80%时的高拟合度

        热门（质量要求适中）：f(x) = (-9.881-168.6)/(1+(x/0.3829)^0.6463)+168.6
        排行榜（较低）：h(x) = (-14.82-115.9)/(1+(x/0.05327)^0.6639)+115.9
        每周必看（严格）：p(x) = (1.534-173.4)/(1+(x/0.7463)^1.401)+173.4
    */
    calcQuality = (ratio: number): number => {
        const A = -9.881
        const B = 6.463e-1
        const C = 3.829e-1
        const D = 1.686e2
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

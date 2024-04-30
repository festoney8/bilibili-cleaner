import { IVideoSubFilter } from '../core'

class DimensionFilter implements IVideoSubFilter {
    isEnable = false

    setStatus(status: boolean) {
        this.isEnable = status
    }

    check(dimension: boolean): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.isEnable) {
                resolve(`Dimension filter disable`)
            } else {
                if (dimension) {
                    resolve(`Dimension is horizontal`)
                } else {
                    reject(`Dimension is vertical`)
                }
            }
        })
    }
}

// 单例
const dimensionFilterInstance = new DimensionFilter()
export default dimensionFilterInstance

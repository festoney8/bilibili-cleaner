import { error } from '../../../../utils/logger'
import { IVideoSubFilter } from '../core'

class BvidFilter implements IVideoSubFilter {
    isEnable = false
    private bvidSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.bvidSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(bvid: string) {
        this.bvidSet.add(bvid.trim())
    }

    check(bvid: string): Promise<string> {
        bvid = bvid.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || bvid.length === 0 || this.bvidSet.size === 0) {
                    resolve('Bvid resolve, disable or empty')
                } else if (this.bvidSet.has(bvid)) {
                    reject(`Bvid reject, ${bvid} in blacklist`)
                } else {
                    resolve('Bvid resolve')
                }
            } catch (err) {
                error(err)
                resolve(`Bvid resolve, error`)
            }
        })
    }
}

// 单例
const bvidFilterInstance = new BvidFilter()
export default bvidFilterInstance

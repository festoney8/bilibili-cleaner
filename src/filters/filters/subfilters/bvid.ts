import { debugFilter, error } from '../../../utils/logger'
import { ISubFilter } from '../core'

class BvidFilter implements ISubFilter {
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

    check(bvid: string): Promise<void> {
        bvid = bvid.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || bvid.length === 0 || this.bvidSet.size === 0) {
                    // debugFilter('resolve, BvidFilter disable or isempty, or bvid invalid')
                    resolve()
                } else if (this.bvidSet.has(bvid)) {
                    debugFilter(`reject, bvid ${bvid} in blacklist`)
                    reject()
                } else {
                    // debugFilter(`resolve, ${bvid} not in blacklist`)
                    resolve()
                }
            } catch (err) {
                error(err)
                error(`resolve, BvidFilter error, bvid`, bvid)
                resolve()
            }
        })
    }
}

// 单例
const bvidFilterInstance = new BvidFilter()
export default bvidFilterInstance

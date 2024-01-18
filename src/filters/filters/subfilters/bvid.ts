import { debug, error } from '../../../utils/logger'

class BvidFilter {
    private isEnable = false
    private bvidSet = new Set<string>()

    constructor() {}

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(bvidList: string[]) {
        this.bvidSet = new Set(bvidList)
    }

    addParam(bvid: string) {
        this.bvidSet.add(bvid.trim())
    }

    check(bvid: string): Promise<void> {
        bvid = bvid.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || bvid.length === 0 || this.bvidSet.size === 0) {
                    debug('resolve, BvidFilter disable, or bvid invalid, or bvid list is empty')
                    resolve()
                }
                if (this.bvidSet.has(bvid)) {
                    debug(`reject, bvid ${bvid} in bvid list`)
                    reject()
                }
                debug(`resolve, bvid ${bvid} not in bvid list`)
                resolve()
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

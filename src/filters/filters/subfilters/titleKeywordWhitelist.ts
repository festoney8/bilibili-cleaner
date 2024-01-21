import { debug, error } from '../../../utils/logger'
import { ISubFilter } from '../core'

class TitleKeywordWhitelistFilter implements ISubFilter {
    isEnable = false
    private titleKeywordSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(titleKeywordList: string[]) {
        this.titleKeywordSet = new Set(titleKeywordList)
    }

    check(titleKeyword: string): Promise<void> {
        titleKeyword = titleKeyword.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || titleKeyword.length === 0 || this.titleKeywordSet.size === 0) {
                    debug('reject, TitleKeywordWhitelistFilter disable, or title invalid, or whitelist empty')
                    reject()
                } else if (this.titleKeywordSet.has(titleKeyword)) {
                    debug(`resolve, title ${titleKeyword} match titleKeyword whitelist`)
                    resolve()
                } else {
                    debug(`reject, title ${titleKeyword} not match titleKeyword whitelist`)
                    reject()
                }
            } catch (err) {
                error(err)
                error(`resolve, TitleKeywordWhitelistFilter error, title`, titleKeyword)
                reject()
            }
        })
    }
}

// 单例
const titleKeywordWhitelistFilterInstance = new TitleKeywordWhitelistFilter()
export default titleKeywordWhitelistFilterInstance

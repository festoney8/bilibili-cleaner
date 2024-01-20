import { error } from '../../../utils/logger'
import { ISubFilter } from '../core'

// Todo: 支持正则
class TitleKeywordFilter implements ISubFilter {
    isEnable = false
    private titleKeywordSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(titleKeywordList: string[]) {
        this.titleKeywordSet = new Set(titleKeywordList)
    }

    addParam(titleKeyword: string) {
        if (titleKeyword.trim()) {
            this.titleKeywordSet.add(titleKeyword.trim())
        }
    }

    check(title: string): Promise<void> {
        title = title.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.titleKeywordSet.size === 0) {
                    // debug('resolve, TitleKeywordFilter disable, or title invalid, or titleKeyword blacklist empty')
                    resolve()
                } else if (this.titleKeywordSet.has(title)) {
                    // 快速判断
                    // debug(`reject, title ${title} in titleKeyword blacklist`)
                    reject()
                }
                let flag = false
                this.titleKeywordSet.forEach((word) => {
                    if (word && title.includes(word)) {
                        // debug(`reject, title ${title} in titleKeyword blacklist`)
                        flag = true
                        reject()
                    }
                })
                if (!flag) {
                    // debug(`resolve, title ${title} not in titleKeyword blacklist`)
                    resolve()
                }
            } catch (err) {
                error(err)
                error(`resolve, TitleKeywordFilter error, title`, title)
                resolve()
            }
        })
    }
}

// 单例
const titleKeywordFilterInstance = new TitleKeywordFilter()
export default titleKeywordFilterInstance

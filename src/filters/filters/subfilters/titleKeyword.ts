import { debug, error } from '../../../utils/logger'

// Todo: 支持正则
class TitleKeywordFilter {
    private isEnable = false
    private titleKeywordSet = new Set<string>()

    constructor() {}

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
                    debug('resolve, TitleKeywordFilter disable, or title invalid, or wordlist empty')
                    resolve()
                } else if (this.titleKeywordSet.has(title)) {
                    // 快速判断
                    debug(`reject, title ${title} in titleKeyword list`)
                    reject()
                }
                let flag = false
                this.titleKeywordSet.forEach((word) => {
                    if (word && title.includes(word)) {
                        debug(`reject, title ${title} in titleKeyword list`)
                        flag = true
                        reject()
                    }
                })
                if (!flag) {
                    debug(`resolve, title ${title} not in titleKeyword list`)
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

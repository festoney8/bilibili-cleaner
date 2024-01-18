import { debug, error } from '../../../utils/logger'

// Todo: 支持正则
class KeywordFilter {
    private isEnable = false
    private keywordSet = new Set<string>()

    constructor() {}

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(keywordList: string[]) {
        this.keywordSet = new Set(keywordList)
    }

    addParam(keyword: string) {
        if (keyword.trim()) {
            this.keywordSet.add(keyword.trim())
        }
    }

    check(title: string): Promise<void> {
        title = title.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.keywordSet.size === 0) {
                    debug('resolve, KeywordFilter disable, or title invalid, or wordlist empty')
                    resolve()
                }
                // 快速判断
                if (this.keywordSet.has(title)) {
                    debug(`reject, title ${title} in keyword list`)
                    reject()
                }
                this.keywordSet.forEach((word) => {
                    if (word && title.includes(word)) {
                        debug(`reject, title ${title} in keyword list`)
                        reject()
                    }
                })
                debug(`resolve, title ${title} not in keyword list`)
                resolve()
            } catch (err) {
                error(err)
                error(`resolve, KeywordFilter error, title`, title)
                resolve()
            }
        })
    }
}

// 单例
const keywordFilterInstance = new KeywordFilter()
export default keywordFilterInstance

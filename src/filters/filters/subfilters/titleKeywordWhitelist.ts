import { debugFilter, error } from '../../../utils/logger'
import { ISubFilter } from '../core'

class TitleKeywordWhitelistFilter implements ISubFilter {
    isEnable = false
    private titleKeywordSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.titleKeywordSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    check(title: string): Promise<void> {
        debugFilter(`TitleKeywordWhitelist`, Array.from(this.titleKeywordSet).join('|'))
        title = title.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.titleKeywordSet.size === 0) {
                    // debugFilter('reject, TitleKeyword Whitelist disable or empty, or title invalid')
                    reject()
                }
                let flag = false
                this.titleKeywordSet.forEach((word) => {
                    if (word && title.includes(word)) {
                        // 命中白名单
                        debugFilter(`resolve, title ${title} match keyword whitelist`)
                        flag = true
                        resolve()
                    }
                })
                if (!flag) {
                    // debugFilter(`reject, title ${title} not match keyword whitelist`)
                    reject()
                }
            } catch (err) {
                error(err)
                error(`reject, TitleKeywordWhitelistFilter ERROR, title`, title)
                reject()
            }
        })
    }
}

// 单例
const titleKeywordWhitelistFilterInstance = new TitleKeywordWhitelistFilter()
export default titleKeywordWhitelistFilterInstance

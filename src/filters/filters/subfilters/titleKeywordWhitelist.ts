import { debugFilter, error } from '../../../utils/logger'
import { ISubFilter } from '../core'

class TitleKeywordWhitelistFilter implements ISubFilter {
    isEnable = false
    private titleKeywordSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        debugFilter(`TitleKeywordWhitelist`, Array.from(this.titleKeywordSet).join('|'))
        this.titleKeywordSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    check(title: string): Promise<string> {
        title = title.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.titleKeywordSet.size === 0) {
                    resolve(`Title Whitelist resolve, disable or empty`)
                }
                let flag = false
                this.titleKeywordSet.forEach((word) => {
                    if (word && title.includes(word)) {
                        // 命中白名单
                        flag = true
                        reject(`Title Whitelist reject, ${title} match keyword ${word}`)
                    }
                })
                if (!flag) {
                    resolve(`Title Whitelist resolve, title not match whitelist`)
                }
            } catch (err) {
                error(err)
                resolve(`Title Whitelist resolve, error`)
            }
        })
    }
}

// 单例
const titleKeywordWhitelistFilterInstance = new TitleKeywordWhitelistFilter()
export default titleKeywordWhitelistFilterInstance

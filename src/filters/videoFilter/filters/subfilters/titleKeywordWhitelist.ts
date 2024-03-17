import { error } from '../../../../utils/logger'
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

    check(title: string): Promise<string> {
        // 忽略大小写
        title = title.trim().toLowerCase()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.titleKeywordSet.size === 0) {
                    resolve(`Title Whitelist resolve, disable or empty`)
                }
                let flag = false
                this.titleKeywordSet.forEach((word) => {
                    if (word.startsWith('/') && word.endsWith('/')) {
                        // 关键词为正则表达式（反斜杠使用单斜杠），大小写不敏感，支持unicodeSets
                        const pattern = new RegExp(word.slice(1, -1), 'iv')
                        if (title.match(pattern)) {
                            // 命中白名单正则
                            flag = true
                            reject(`Title Whitelist reject, ${title} match keyword ${word}`)
                        }
                    } else {
                        if (word && title.toLowerCase().includes(word.toLowerCase())) {
                            // 命中白名单
                            flag = true
                            reject(`Title Whitelist reject, ${title} match keyword ${word}`)
                        }
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

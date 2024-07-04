import { error } from '../../../../utils/logger'
import { IDynSubFilter } from '../core'

class DynTitleFilter implements IDynSubFilter {
    isEnable = false
    private dynTitleSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.dynTitleSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(value: string) {
        if (value.trim()) {
            this.dynTitleSet.add(value.trim())
        }
    }

    check(title: string): Promise<string> {
        // 忽略大小写
        title = title.trim().toLowerCase()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.dynTitleSet.size === 0) {
                    resolve(`DynTitle resolve, disable or empty`)
                }
                let flag = false
                this.dynTitleSet.forEach((word) => {
                    if (word.startsWith('/') && word.endsWith('/')) {
                        // 关键词为正则表达式（反斜杠使用单斜杠），大小写不敏感，支持unicodeSets
                        const pattern = new RegExp(word.slice(1, -1), 'iv')
                        if (title.match(pattern)) {
                            // 命中黑名单正则
                            flag = true
                            reject(`DynTitle reject, ${title} match ${word} in blacklist`)
                        }
                    } else {
                        if (word && title.includes(word.toLowerCase())) {
                            flag = true
                            reject(`DynTitle reject, ${title} match ${word} in blacklist`)
                        }
                    }
                })
                if (!flag) {
                    resolve(`DynTitle resolve, title not match blacklist`)
                }
            } catch (err) {
                error(err)
                resolve(`DynTitle resolve, error`)
            }
        })
    }
}

// 单例
const dynTitleFilterInstance = new DynTitleFilter()
export default dynTitleFilterInstance

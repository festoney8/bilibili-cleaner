import { error } from '../../../../utils/logger'
import { ICommentSubFilter } from '../core'

class ContentFilter implements ICommentSubFilter {
    isEnable = false
    private commentKeywordSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.commentKeywordSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(value: string) {
        if (value.trim()) {
            this.commentKeywordSet.add(value.trim())
        }
    }

    check(title: string): Promise<string> {
        // 忽略大小写
        title = title.trim().toLowerCase()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.commentKeywordSet.size === 0) {
                    resolve(`Content resolve, disable or empty`)
                }
                let flag = false
                this.commentKeywordSet.forEach((word) => {
                    if (word.startsWith('/') && word.endsWith('/')) {
                        // 关键词为正则表达式（反斜杠使用单斜杠），大小写不敏感，支持unicodeSets
                        const pattern = new RegExp(word.slice(1, -1), 'iv')
                        if (title.match(pattern)) {
                            flag = true
                            reject(`Content reject, ${title} match ${word} in blacklist`)
                        }
                    } else {
                        if (word && title.includes(word.toLowerCase())) {
                            flag = true
                            reject(`Content reject, ${title} match ${word} in blacklist`)
                        }
                    }
                })
                if (!flag) {
                    resolve(`Content resolve, title not match blacklist`)
                }
            } catch (err) {
                error(err)
                resolve(`Content resolve, error`)
            }
        })
    }
}

// 单例
const contentFilterInstance = new ContentFilter()
export default contentFilterInstance

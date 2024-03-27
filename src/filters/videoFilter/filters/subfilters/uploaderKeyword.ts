import { error } from '../../../../utils/logger'
import { IVideoSubFilter } from '../core'

class UploaderKeywordFilter implements IVideoSubFilter {
    isEnable = false
    private uploaderKeywordSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.uploaderKeywordSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(value: string) {
        if (value.trim()) {
            this.uploaderKeywordSet.add(value.trim())
        }
    }

    check(uploader: string): Promise<string> {
        // 忽略大小写
        uploader = uploader.trim().toLowerCase()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || uploader.length === 0 || this.uploaderKeywordSet.size === 0) {
                    resolve(`UploaderKeyword resolve, disable or empty`)
                }
                let flag = false
                this.uploaderKeywordSet.forEach((word) => {
                    if (word.startsWith('/') && word.endsWith('/')) {
                        // 关键词为正则表达式（反斜杠使用单斜杠），大小写不敏感
                        const pattern = new RegExp(word.slice(1, -1), 'iv')
                        if (uploader.match(pattern)) {
                            // 命中黑名单正则
                            flag = true
                            reject(`UploaderKeyword reject, ${uploader} match ${word} in blacklist`)
                        }
                    } else {
                        if (word && uploader.includes(word.toLowerCase())) {
                            flag = true
                            reject(`UploaderKeyword reject, ${uploader} match ${word} in blacklist`)
                        }
                    }
                })
                if (!flag) {
                    resolve(`UploaderKeyword resolve, uploader not match blacklist`)
                }
            } catch (err) {
                error(err)
                resolve(`UploaderKeyword resolve, error`)
            }
        })
    }
}

// 单例
const uploaderKeywordFilterInstance = new UploaderKeywordFilter()
export default uploaderKeywordFilterInstance

import { error } from '../../../utils/logger'
import { ISubFilter } from '../core'

// Todo: 支持正则
class TitleKeywordFilter implements ISubFilter {
    isEnable = false
    private titleKeywordSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.titleKeywordSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(value: string) {
        if (value.trim()) {
            this.titleKeywordSet.add(value.trim())
        }
    }

    check(title: string): Promise<string> {
        title = title.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.titleKeywordSet.size === 0) {
                    resolve(`TitleKeyword resolve, disable or empty`)
                }
                let flag = false
                this.titleKeywordSet.forEach((word) => {
                    if (word && title.includes(word)) {
                        flag = true
                        reject(`TitleKeyword reject, ${title} match ${word} in blacklist`)
                    }
                })
                if (!flag) {
                    resolve(`TitleKeyword resolve, title not match blacklist`)
                }
            } catch (err) {
                error(err)
                resolve(`TitleKeyword resolve, error`)
            }
        })
    }
}

// 单例
const titleKeywordFilterInstance = new TitleKeywordFilter()
export default titleKeywordFilterInstance

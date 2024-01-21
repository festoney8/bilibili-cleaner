import { debugFilter, error } from '../../../utils/logger'
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

    check(title: string): Promise<void> {
        title = title.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || title.length === 0 || this.titleKeywordSet.size === 0) {
                    // debugFilter('resolve, TitleKeywordFilter disable or empty, or title invalid')
                    resolve()
                }
                let flag = false
                this.titleKeywordSet.forEach((word) => {
                    if (word && title.includes(word)) {
                        debugFilter(`reject, title ${title} match keyword blacklist`)
                        flag = true
                        reject()
                    }
                })
                if (!flag) {
                    // debugFilter(`resolve, title ${title} not match keyword blacklist`)
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

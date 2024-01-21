import { debugFilter, error } from '../../../utils/logger'
import { ISubFilter } from '../core'

class UploaderFilter implements ISubFilter {
    isEnable = false
    private uploaderSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.uploaderSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(value: string) {
        if (value.trim()) {
            this.uploaderSet.add(value.trim())
        }
    }

    check(uploader: string): Promise<void> {
        uploader = uploader.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || uploader.length === 0 || this.uploaderSet.size === 0) {
                    // debugFilter('resolve, UploaderFilter disable or empty, or uploader invalid')
                    resolve()
                } else if (this.uploaderSet.has(uploader)) {
                    debugFilter(`reject, uploader ${uploader} in blacklist`)
                    reject()
                } else {
                    // debugFilter(`resolve, uploader ${uploader} not in blacklist`)
                    resolve()
                }
            } catch (err) {
                error(err)
                error(`resolve, UploaderFilter error, uploader`, uploader)
                resolve()
            }
        })
    }
}

// 单例
const uploaderFilterInstance = new UploaderFilter()
export default uploaderFilterInstance

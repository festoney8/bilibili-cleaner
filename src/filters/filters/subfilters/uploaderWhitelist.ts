import { debugFilter, error } from '../../../utils/logger'
import { ISubFilter } from '../core'

class UploaderWhitelistFilter implements ISubFilter {
    isEnable = false
    private uploaderSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.uploaderSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    check(uploader: string): Promise<void> {
        debugFilter(`UploaderWhitelist`, Array.from(this.uploaderSet).join('|'))
        uploader = uploader.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || uploader.length === 0 || this.uploaderSet.size === 0) {
                    // debugFilter('reject, UploaderWhitelist disable or empty, or uploader invalid')
                    reject()
                } else if (this.uploaderSet.has(uploader)) {
                    debugFilter(`resolve, uploader ${uploader} in whitelist`)
                    resolve()
                } else {
                    // debugFilter(`reject, uploader ${uploader} not in whitelist`)
                    reject()
                }
            } catch (err) {
                error(err)
                error(`reject, UploaderWhitelistFilter error, uploader`, uploader)
                reject()
            }
        })
    }
}

// 单例
const uploaderWhitelistFilterInstance = new UploaderWhitelistFilter()
export default uploaderWhitelistFilterInstance

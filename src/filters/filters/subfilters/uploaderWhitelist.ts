import { debug, error } from '../../../utils/logger'
import { ISubFilter } from '../core'

class UploaderWhitelistFilter implements ISubFilter {
    isEnable = false
    private uploaderSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(uploaderList: string[]) {
        this.uploaderSet = new Set(uploaderList)
    }

    check(uploader: string): Promise<void> {
        uploader = uploader.trim()
        return new Promise<void>((resolve, reject) => {
            try {
                if (!this.isEnable || uploader.length === 0 || this.uploaderSet.size === 0) {
                    debug('reject, UploaderWhitelistFilter disable, or uploader invalid, or uploader whitelist empty')
                    reject()
                } else if (this.uploaderSet.has(uploader)) {
                    debug(`resolve, uploader ${uploader} in uploader whitelist`)
                    resolve()
                } else {
                    debug(`reject, uploader ${uploader} not in uploader whitelist`)
                    reject()
                }
            } catch (err) {
                error(err)
                error(`resolve, UploaderWhitelistFilter error, uploader`, uploader)
                reject()
            }
        })
    }
}

// 单例
const uploaderWhitelistFilterInstance = new UploaderWhitelistFilter()
export default uploaderWhitelistFilterInstance

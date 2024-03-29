import { error } from '../../../../utils/logger'
import { IVideoSubFilter } from '../core'

class UploaderWhitelistFilter implements IVideoSubFilter {
    isEnable = false
    private uploaderSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        // debug(`UploaderWhitelist`, Array.from(this.uploaderSet).join('|'))
        this.uploaderSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(value: string) {
        // debug(`UploaderWhitelist`, Array.from(this.uploaderSet).join('|'))
        if (value.trim()) {
            this.uploaderSet.add(value.trim())
        }
    }

    check(uploader: string): Promise<string> {
        uploader = uploader.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || uploader.length === 0 || this.uploaderSet.size === 0) {
                    resolve(`Uploader White resolve, disable or empty`)
                } else if (this.uploaderSet.has(uploader)) {
                    reject(`Uploader White reject, ${uploader} in whitelist`)
                } else {
                    resolve(`Uploader White resolve, uploader not in whitelist`)
                }
            } catch (err) {
                error(err)
                resolve(`Uploader White resolve, error`)
            }
        })
    }
}

// 单例
const uploaderWhitelistFilterInstance = new UploaderWhitelistFilter()
export default uploaderWhitelistFilterInstance

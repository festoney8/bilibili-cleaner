import { error } from '../../../../utils/logger'
import { IVideoSubFilter } from '../core'

class UploaderFilter implements IVideoSubFilter {
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

    check(uploader: string): Promise<string> {
        uploader = uploader.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || uploader.length === 0 || this.uploaderSet.size === 0) {
                    resolve(`Uploader resolve, disable or empty`)
                } else if (this.uploaderSet.has(uploader)) {
                    reject(`Uploader reject, uploader ${uploader} in blacklist`)
                } else {
                    resolve(`Uploader resolve, uploader not in blacklist`)
                }
            } catch (err) {
                error(err)
                resolve(`Uploader resolve, error`)
            }
        })
    }
}

// 单例
const uploaderFilterInstance = new UploaderFilter()
export default uploaderFilterInstance

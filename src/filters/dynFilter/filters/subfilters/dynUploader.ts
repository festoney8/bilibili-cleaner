import { error } from '../../../../utils/logger'
import { IDynSubFilter } from '../core'

class DynUploaderFilter implements IDynSubFilter {
    isEnable = false
    private dynUploaderSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.dynUploaderSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(dynUploader: string) {
        this.dynUploaderSet.add(dynUploader.trim())
    }

    check(dynUploader: string): Promise<string> {
        dynUploader = dynUploader.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || dynUploader.length === 0 || this.dynUploaderSet.size === 0) {
                    resolve('dynUploader resolve, disable or empty')
                } else if (this.dynUploaderSet.has(dynUploader)) {
                    reject(`dynUploader reject, ${dynUploader} in blacklist`)
                } else {
                    resolve('dynUploader resolve')
                }
            } catch (err) {
                error(err)
                resolve(`dynUploader resolve, error`)
            }
        })
    }
}

// 单例
const dynUploaderFilterInstance = new DynUploaderFilter()
export default dynUploaderFilterInstance

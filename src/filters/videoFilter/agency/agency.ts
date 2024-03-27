import bvidFilterInstance from '../filters/subfilters/bvid'
import durationFilterInstance from '../filters/subfilters/duration'
import titleKeywordFilterInstance from '../filters/subfilters/titleKeyword'
import titleKeywordWhitelistFilterInstance from '../filters/subfilters/titleKeywordWhitelist'
import uploaderFilterInstance from '../filters/subfilters/uploader'
import uploaderKeywordFilterInstance from '../filters/subfilters/uploaderKeyword'
import uploaderWhitelistFilterInstance from '../filters/subfilters/uploaderWhitelist'

// 代理, 接收页面操作通知, 更新子过滤器的参数
class VideoFilterAgency {
    notifyDuration(event: string, value?: number) {
        switch (event) {
            case 'disable':
                durationFilterInstance.setStatus(false)
                break
            case 'enable':
                durationFilterInstance.setStatus(true)
                break
            case 'change':
                if (typeof value === 'number') {
                    durationFilterInstance.setParams(value)
                }
                break
        }
    }
    notifyUploader(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                uploaderFilterInstance.setStatus(false)
                break
            case 'enable':
                uploaderFilterInstance.setStatus(true)
                break
            case 'add':
                if (typeof value === 'string') {
                    if (value.trim()) {
                        uploaderFilterInstance.addParam(value.trim())
                    }
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    uploaderFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
    notifyBvid(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                bvidFilterInstance.setStatus(false)
                break
            case 'enable':
                bvidFilterInstance.setStatus(true)
                break
            case 'add':
                if (typeof value === 'string') {
                    if (value.trim()) {
                        bvidFilterInstance.addParam(value.trim())
                    }
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    bvidFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
    notifyTitleKeyword(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                titleKeywordFilterInstance.setStatus(false)
                break
            case 'enable':
                titleKeywordFilterInstance.setStatus(true)
                break
            case 'add':
                if (typeof value === 'string' && value.trim()) {
                    titleKeywordFilterInstance.addParam(value.trim())
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    titleKeywordFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
    notifyUploaderKeyword(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                uploaderKeywordFilterInstance.setStatus(false)
                break
            case 'enable':
                uploaderKeywordFilterInstance.setStatus(true)
                break
            case 'add':
                if (typeof value === 'string' && value.trim()) {
                    uploaderKeywordFilterInstance.addParam(value.trim())
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    uploaderKeywordFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
    notifyUploaderWhitelist(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                uploaderWhitelistFilterInstance.setStatus(false)
                break
            case 'enable':
                uploaderWhitelistFilterInstance.setStatus(true)
                break
            case 'add':
                if (typeof value === 'string' && value.trim()) {
                    uploaderWhitelistFilterInstance.addParam(value.trim())
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    uploaderWhitelistFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
    notifyTitleKeywordWhitelist(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                titleKeywordWhitelistFilterInstance.setStatus(false)
                break
            case 'enable':
                titleKeywordWhitelistFilterInstance.setStatus(true)
                break
            case 'edit':
                if (Array.isArray(value)) {
                    titleKeywordWhitelistFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
}

// 单例
const videoFilterAgencyInstance = new VideoFilterAgency()
export default videoFilterAgencyInstance

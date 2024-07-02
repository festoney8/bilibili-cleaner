import dynUploaderFilterInstance from '../filters/subfilters/dynUploader'

// 代理, 接收页面操作通知, 更新子过滤器的参数
class DynUploaderFilterAgency {
    notifyDynUploader(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                dynUploaderFilterInstance.setStatus(false)
                break
            case 'enable':
                dynUploaderFilterInstance.setStatus(true)
                break
            case 'add':
                if (typeof value === 'string') {
                    if (value.trim()) {
                        dynUploaderFilterInstance.addParam(value.trim())
                    }
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    dynUploaderFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
}

// 单例
const dynUploaderFilterAgencyInstance = new DynUploaderFilterAgency()
export default dynUploaderFilterAgencyInstance

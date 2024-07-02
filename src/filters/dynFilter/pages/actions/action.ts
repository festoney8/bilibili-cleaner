import { GM_getValue } from '$'
import { WordList } from '../../../../components/wordlist'
import dynUploaderFilterAgencyInstance from '../../agency/agency'
import dynUploaderFilterInstance from '../../filters/subfilters/dynUploader'

interface DynFilterAction {
    statusKey: string
    valueKey: string
    status: boolean
    value: number | string | string[]
    // 检测动态列表的函数
    checkDynList(fullSite: boolean): void
    blacklist?: WordList
    whitelist?: WordList

    enable(): void
    disable(): void
    change?(value: number): void
    add?(value: string): void
    edit?(value: string[]): void
}

/**
 * 将类的成员函数作为参数传递时，【必须】使用箭头函数包裹，避免出现this上下文丢失问题
 */

export class DynUploaderAction implements DynFilterAction {
    statusKey: string
    valueKey: string
    checkDynList: (fullSite: boolean) => void
    status: boolean
    value: string[]
    blacklist: WordList

    /**
     * 动态区用户过滤操作
     * @param statusKey 是否启用的GM key
     * @param valueKey 存储数据的GM key
     * @param checkDynList 检测动态列表函数
     */
    constructor(statusKey: string, valueKey: string, checkDynList: (fullSite: boolean) => void) {
        this.statusKey = statusKey
        this.valueKey = valueKey
        this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
        this.value = GM_getValue(`BILICLEANER_${this.valueKey}`, [])
        this.checkDynList = checkDynList

        // 配置子过滤器
        dynUploaderFilterInstance.setStatus(this.status)
        dynUploaderFilterInstance.setParams(this.value)

        this.blacklist = new WordList(
            this.valueKey,
            '隐藏动态 用户名列表',
            '每行一个用户名，保存时自动去重',
            (values: string[]) => {
                this.edit(values)
            },
        )
    }

    enable() {
        dynUploaderFilterAgencyInstance.notifyDynUploader('enable')
        this.checkDynList(true)
        this.status = true
    }
    disable() {
        dynUploaderFilterAgencyInstance.notifyDynUploader('disable')
        this.checkDynList(true)
        this.status = false
    }
    add(value: string) {
        this.blacklist.addValue(value)
        dynUploaderFilterAgencyInstance.notifyDynUploader('add', value)
        this.checkDynList(true)
    }
    edit(values: string[]) {
        dynUploaderFilterAgencyInstance.notifyDynUploader('edit', values)
        this.checkDynList(true)
    }
}

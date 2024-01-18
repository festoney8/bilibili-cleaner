import { GM_getValue, GM_setValue } from '$'
import { debug, error } from '../utils/logger'

interface IList {
    setValues(): void
    getValues(): void
    addValue?(value: string): void
    saveList(lst: string[]): boolean
    fetchList(): string[]
}

// Todo: 支持正则
class Blacklist implements IList {
    // set用于快速判重
    private dataSet = new Set<string>()
    private dataArr: string[] | undefined

    constructor(private blacklistID: string) {}

    setValues() {
        GM_setValue(`BILICLEANER_VALUE_${this.blacklistID}`, this.dataArr)
    }
    getValues() {
        this.dataArr = GM_getValue(`BILICLEANER_VALUE_${this.blacklistID}`)
        if (this.dataArr === undefined) {
            this.dataArr = []
            this.setValues()
        }
        this.dataSet = new Set(this.dataArr)
    }
    /** 新增一条内容到列表 */
    addValue(value: string): boolean {
        this.getValues()
        if (!this.dataSet.has(value)) {
            this.dataArr?.push(value)
            this.dataSet.add(value)
            debug(`blacklist ${this.blacklistID} addValue ${value} OK`)
            return true
        }
        debug(`blacklist ${this.blacklistID} addValue ${value} failed, exist`)
        return false
    }
    /** 保存用户编辑后的列表内容 */
    saveList(valueList: string[]): boolean {
        this.getValues()
        const backup: string[] = this.dataArr ? [...this.dataArr] : []

        try {
            debug(`blacklist ${this.blacklistID} saveList get ${valueList.length} value to save`)
            this.getValues()
            this.dataSet = new Set(valueList)
            this.dataArr = []
            valueList.forEach((v) => {
                if (!this.dataSet.has(v)) {
                    this.dataArr?.push(v)
                }
            })
            this.setValues()
            debug(`blacklist ${this.blacklistID} saveList save ${valueList.length} lines, OK`)
            return true
        } catch (err) {
            error(err)
            error(`blacklist ${this.blacklistID} saveList ERROR`)
            this.dataArr = backup
            this.setValues()
            return false
        }
    }
    /** 获取列表内容, 用于编辑 */
    fetchList(): string[] {
        return this.dataArr ? this.dataArr : []
    }
}

// Todo: 支持正则
class Whitelist implements IList {
    private dataSet = new Set<string>()
    private dataArr: string[] | undefined

    constructor(private whitelistID: string) {}

    setValues() {
        GM_setValue(`BILICLEANER_VALUE_${this.whitelistID}`, this.dataArr)
    }
    getValues() {
        this.dataArr = GM_getValue(`BILICLEANER_VALUE_${this.whitelistID}`)
        if (this.dataArr === undefined) {
            this.dataArr = []
            this.setValues()
        }
        this.dataSet = new Set(this.dataArr)
    }
    /** 保存用户编辑后的列表内容 */
    saveList(valueList: string[]): boolean {
        try {
            debug(`whitelist ${this.whitelistID} saveList get ${valueList.length} value to save`)
            this.getValues()
            this.dataSet = new Set(valueList)
            this.dataArr = []
            valueList.forEach((v) => {
                if (!this.dataSet.has(v)) {
                    this.dataArr?.push(v)
                }
            })
            this.setValues()
            debug(`whitelist ${this.whitelistID} saveList save ${valueList.length} lines, OK`)
            return true
        } catch (err) {
            error(err)
            error(`whitelist ${this.whitelistID} saveList ERROR`)
            return false
        }
    }
    /** 获取列表内容, 用于编辑 */
    fetchList(): string[] {
        return this.dataArr ? this.dataArr : []
    }
}

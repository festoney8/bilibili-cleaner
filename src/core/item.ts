import { GM_getValue, GM_listValues, GM_setValue } from '$'
import { debug, error, trace } from '../utils/logging'

class Item {
    uncheckedHTML = `<input class="bili-cleaner-item-switch" type="checkbox">`
    checkedHTML = `<input class="bili-cleaner-item-switch" type="checkbox" checked>`
    // item当前状态
    private isEnable: boolean
    // item对应的HTML input node
    private itemEle: HTMLInputElement | undefined

    /**
     * @param itemID item的唯一ID, 与GM database中的Key对应, 使用相同ID可共享item状态
     * @param description item的功能介绍, 显示在panel内
     * @param defaultStatus item默认开启状态, 第一次安装时使用, 对于所有用户均开启的项目默认给true
     * @param itemFunc 功能函数
     * @param isItemFuncReload 功能函数是否在URL变动时重新运行
     * @param itemCSS item的CSS
     */
    constructor(
        private itemID: string,
        private description: string,
        private defaultStatus: boolean,
        private itemFunc: () => void | null,
        private isItemFuncReload: boolean,
        private itemCSS: string,
    ) {
        this.isEnable = false
        this.itemEle = undefined
    }
    /**
     * 设定并记录item开关状态
     * @param value checkbox开关状态
     */
    setStatus(value: boolean) {
        GM_setValue(`BILICLEANER_${this.itemID}`, value)
        this.isEnable = value
    }
    /**
     * 获取item开关状态, 若第一次安装时不存在该key, 使用默认值
     */
    getStatus() {
        this.isEnable = GM_getValue(`BILICLEANER_${this.itemID}`)
        if (!this.isEnable) {
            // 初次安装时, 采用item默认设定
            const keys = GM_listValues()
            if (!keys.includes(`BILICLEANER_${this.itemID}`)) {
                this.isEnable = this.defaultStatus
                this.setStatus(this.isEnable)
                debug(`item ${this.itemID} status not exist, use default: ${this.defaultStatus}`)
            }
        }
    }
    /**
     * 在相应group内添加item
     * @param groupID item所属groupID, 由Group调用insertItem时传入
     */
    insertItem(groupID: string) {
        try {
            this.getStatus()
            const e = document.createElement('label')
            e.id = this.itemID
            if (this.isEnable) {
                e.innerHTML = this.checkedHTML + this.description
            } else {
                e.innerHTML = this.uncheckedHTML + this.description
            }
            const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`) as HTMLFormElement
            if (itemGroupList) {
                itemGroupList.appendChild(e)
                debug(`insertItem ${this.itemID} OK`)
            }
        } catch (err) {
            error(`insertItem ${this.itemID} err`)
            error(err)
            trace()
        }
    }
    /**
     * 启用CSS片段, 向document.head插入style
     */
    insertItemCSS() {
        if (!this.itemCSS) {
            return
        }
        try {
            // check if CSS exist
            if (document.querySelector(`head style[bili-cleaner-css=${this.itemID}]`)) {
                debug(`insertCSS ${this.itemID} CSS exist, ignore`)
                return
            }
            const style = document.createElement('style')
            // 若使用innerText, 多行CSS插入head后会产生<br>标签
            style.innerHTML = this.itemCSS
            // 指定CSS片段ID，用于实时启用停用
            style.setAttribute('bili-cleaner-css', this.itemID)

            // chrome系浏览器上可能出现style插入成功, 但DOMContentLoaded后规则丢失, 通过后续监听load事件打补丁解决
            document.head.appendChild(style)
            debug(`insertCSS ${this.itemID} OK`)
        } catch (err) {
            error(`insertCSS ${this.itemID} failed`)
            error(err)
            trace()
        }
    }
    /**
     * 停用CSS片段, 从document.head移除style
     */
    removeItemCSS() {
        if (this.itemCSS) {
            const style = document.querySelector(`head style[bili-cleaner-css=${this.itemID}]`) as HTMLStyleElement
            if (style) {
                style.parentNode?.removeChild(style)
                debug(`removeCSS ${this.itemID} OK`)
            }
        }
    }
    /**
     * 监听item chekbox开关
     */
    watchItem() {
        try {
            this.itemEle = document.getElementById(this.itemID) as HTMLInputElement
            this.itemEle.addEventListener('change', (event: Event) => {
                // this指向class, 使用event.target访问checkbox
                if ((<HTMLInputElement>event.target).checked) {
                    this.setStatus(true)
                    this.insertItemCSS()
                } else {
                    this.setStatus(false)
                    this.removeItemCSS()
                }
            })
            debug(`watchItem ${this.itemID} OK`)
        } catch (err) {
            error(`watchItem ${this.itemID} err`)
            error(err)
            trace()
        }
    }
    /**
     * 执行item功能, 在页面head添加CSS并执行func
     */
    enableItem() {
        this.getStatus()
        if (this.isEnable) {
            try {
                this.insertItemCSS()
                if (this.itemFunc instanceof Function) {
                    this.itemFunc()
                    debug(`enableItem ${this.itemID} OK`)
                }
            } catch (err) {
                error(`enableItem ${this.itemID} Error`)
                error(err)
                trace()
            }
        }
    }
    /**
     * 重载item, 用于非页面刷新但URL变动情况, 此时已注入CSS只重新运行func, 如: 非刷新式切换视频
     */
    reloadItem() {
        // this.getStatus()
        if (this.isItemFuncReload && this.isEnable && this.itemFunc instanceof Function) {
            try {
                this.itemFunc()
                debug(`reloadItem ${this.itemID} OK`)
            } catch (err) {
                error(`reloadItem ${this.itemID} Error`)
                error(err)
                trace()
            }
        }
    }
}

import { GM_getValue, GM_setValue } from '$'
import { debug, error } from '../utils/logger'

/** Iitem是插件的每项功能设定, 在每个panel group内显示为一行功能 */
interface IItem {
    readonly uncheckedHTML?: myHTML
    readonly checkedHTML?: myHTML
    insertItem(groupID: string): void
}

export class NormalItem implements IItem {
    uncheckedHTML = `<input class="bili-cleaner-item-switch" type="checkbox">`
    checkedHTML = `<input class="bili-cleaner-item-switch" type="checkbox" checked>`
    private isEnable: boolean | undefined
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
        private itemFunc: (() => void) | undefined,
        private isItemFuncReload: boolean,
        private itemCSS: myCSS | null,
    ) {
        this.isEnable = undefined
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
    /** 获取item开关状态, 若第一次安装时不存在该key, 使用默认值 */
    getStatus() {
        this.isEnable = GM_getValue(`BILICLEANER_${this.itemID}`)
        if (this.defaultStatus && this.isEnable === undefined) {
            this.isEnable = this.defaultStatus
            this.setStatus(this.isEnable)
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
                e.innerHTML = `${this.checkedHTML}<span>${this.description}</span>`
            } else {
                e.innerHTML = `${this.uncheckedHTML}<span>${this.description}</span>`
            }
            const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`) as HTMLFormElement
            if (itemGroupList) {
                itemGroupList.appendChild(e)
                debug(`insertItem ${this.itemID} OK`)
            }
        } catch (err) {
            error(`insertItem ${this.itemID} err`)
            error(err)
        }
    }
    /** 启用CSS片段, 向<html>插入style */
    insertItemCSS() {
        if (!this.itemCSS) {
            return
        }
        try {
            if (document.querySelector(`html>style[bili-cleaner-css=${this.itemID}]`)) {
                debug(`insertItemCSS ${this.itemID} CSS exist, ignore`)
                return
            }
            const style = document.createElement('style')
            // 简单压缩, 若使用innerText, 多行CSS插入后会产生<br>标签
            style.innerHTML = this.itemCSS.replace(/\n\s*/g, '').trim()
            // 指定CSS片段ID，用于实时启用停用
            style.setAttribute('bili-cleaner-css', this.itemID)
            // 放弃在head内插入style
            // 改为在html内插入style标签(与head/body同级), 避免版权视频播放页head内规则丢失bug
            document.documentElement.appendChild(style)
            debug(`insertItemCSS ${this.itemID} OK`)
        } catch (err) {
            error(`insertItemCSS ${this.itemID} failed`)
            error(err)
        }
    }
    /** 停用CSS片段, 从<html>移除style */
    removeItemCSS() {
        if (this.itemCSS) {
            const style = document.querySelector(`html>style[bili-cleaner-css=${this.itemID}]`) as HTMLStyleElement
            if (style) {
                style.parentNode?.removeChild(style)
                debug(`removeItemCSS ${this.itemID} OK`)
            }
        }
    }
    /** 监听item chekbox开关 */
    watchItem() {
        try {
            this.itemEle = document.getElementById(this.itemID) as HTMLInputElement
            this.itemEle.addEventListener('change', (event: Event) => {
                // this指向class, 使用event.target访问checkbox
                if ((<HTMLInputElement>event.target).checked) {
                    this.setStatus(true)
                    this.insertItemCSS()
                    if (this.itemFunc !== undefined) {
                        this.itemFunc()
                    }
                } else {
                    this.setStatus(false)
                    this.removeItemCSS()
                }
            })
            debug(`watchItem ${this.itemID} OK`)
        } catch (err) {
            error(`watchItem ${this.itemID} err`)
            error(err)
        }
    }
    /**
     * 执行item功能, 添加CSS, 执行func
     * @param enableFunc 是否执行func, 默认true
     */
    enableItem(enableFunc = true) {
        this.getStatus()
        if (this.isEnable) {
            try {
                this.insertItemCSS()
                if (enableFunc && this.itemFunc instanceof Function) {
                    this.itemFunc()
                    debug(`enableItem ${this.itemID} OK`)
                }
            } catch (err) {
                error(`enableItem ${this.itemID} Error`)
                error(err)
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
            }
        }
    }
}

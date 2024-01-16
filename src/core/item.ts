import { GM_getValue, GM_setValue } from '$'
import { debug, error } from '../utils/logger'

/** IItem是插件的每项功能设定, 在每个group内显示为一行组件 */
interface IItem {
    readonly nodeHTML: myHTML
    insertItem(groupID: string): void
    insertItemCSS?(): void
    removeItemCSS?(): void
    watchItem?(): void
    enableItem?(): void
    reloadItem?(): void
}

/** 普通开关 */
export class CheckboxItem implements IItem {
    nodeHTML = `<input class="bili-cleaner-item-checkbox" type="checkbox">`
    private isEnable: boolean | undefined
    // item对应的HTML input node
    private itemEle: HTMLInputElement | undefined

    /**
     * @param itemID item的唯一ID, 与GM database中的Key对应, 使用相同ID可共享item状态
     * @param description item的功能介绍, 显示在panel内, \n可用来换行
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
            e.innerHTML = `${this.nodeHTML}<span>${this.description.replaceAll('\n', '<br>')}</span>`
            if (this.isEnable) {
                e.querySelector('input')!.checked = true
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
            this.itemEle = document.querySelector(`#${this.itemID} input`) as HTMLInputElement
            this.itemEle.addEventListener('change', (event: Event) => {
                // this指向class, 使用event.target访问input
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
                }
                debug(`enableItem ${this.itemID} OK`)
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

/** 互斥开关 */
export class RadioItem implements IItem {
    nodeHTML = `<input class="bili-cleaner-item-checkbox" type="radio">`
    private isEnable: boolean | undefined
    private itemEle: HTMLInputElement | undefined

    /**
     * @param itemID item的唯一ID, 与GM database中的Key对应, 使用相同ID可共享item状态
     * @param description item的功能介绍, 显示在panel内, \n可用来换行
     * @param radioName radio input的name, 用于一组互斥选项
     * @param radioItemIDList 当前item所在互斥组的ID列表, 用于修改其他item状态
     * @param defaultStatus item默认开启状态, 第一次安装时使用, 对于所有用户均开启的项目默认给true
     * @param itemFunc 功能函数
     * @param isItemFuncReload 功能函数是否在URL变动时重新运行
     * @param itemCSS item的CSS
     */
    constructor(
        private itemID: string,
        private description: string,
        private radioName: string,
        private radioItemIDList: string[],
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
     * @param targetID 设定对象itemID, 默认null 给this对象设定
     * @param value 开关状态
     */
    setStatus(value: boolean, targetID: string | null = null) {
        if (!targetID) {
            GM_setValue(`BILICLEANER_${this.itemID}`, value)
            this.isEnable = value
        } else {
            GM_setValue(`BILICLEANER_${targetID}`, value)
        }
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
            e.innerHTML = `${this.nodeHTML}<span>${this.description.replaceAll('\n', '<br>')}</span>`
            if (this.isEnable) {
                e.querySelector('input')!.checked = true
            }
            // 设定radio input所属互斥组
            e.querySelector('input')!.name = this.radioName
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
    /** 监听item option开关 */
    watchItem() {
        try {
            this.itemEle = document.querySelector(`#${this.itemID} input`) as HTMLInputElement
            this.itemEle.addEventListener('change', (event: Event) => {
                if ((<HTMLInputElement>event.target).checked) {
                    debug(`radioItem ${this.itemID} checked`)
                    this.setStatus(true)
                    this.insertItemCSS()
                    if (this.itemFunc !== undefined) {
                        this.itemFunc()
                    }
                    // 相同name的其他option自动置为uncheck, 但这一行为无法被监听, 需传入itemID逐一修改
                    this.radioItemIDList.forEach((targetID) => {
                        if (targetID !== this.itemID) {
                            // 移除CSS, 修改互斥item状态
                            const style = document.querySelector(
                                `html>style[bili-cleaner-css=${targetID}]`,
                            ) as HTMLStyleElement
                            if (style) {
                                style.parentNode?.removeChild(style)
                                debug(`removeItemCSS ${targetID} OK`)
                            }
                            this.setStatus(false, targetID)
                            debug(`disable same name radioItem ${targetID}, OK`)
                        }
                    })
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
                }
                debug(`enableItem ${this.itemID} OK`)
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
        // 存在其他item修改当前item状态的情况
        this.getStatus()
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

/** 数值设定 */
export class NumberItem implements IItem {
    nodeHTML = `<input class="bili-cleaner-item-number" type="number">`
    private itemValue: number | undefined

    constructor(
        private itemID: string,
        private description: string,
        private defaultValue: number,
        private minValue: number,
        private maxValue: number,
        private stepValue: number,
        private unit: string,
    ) {
        this.getValue()
    }

    /** 获取数值, 初次安装使用默认值 */
    getValue() {
        GM_getValue(`BILICLEANER_VALUE_${this.itemID}`)
        if (this.itemValue === undefined) {
            this.itemValue = this.defaultValue
            this.setValue(this.itemValue)
        }
    }
    /** 设定并记录数值 */
    setValue(value: number) {
        this.itemValue = value
        GM_setValue(`BILICLEANER_VALUE_${this.itemID}`, value)
    }

    /**
     * 在相应group内添加item
     * @param groupID item所属groupID, 由Group调用insertItem时传入
     */
    insertItem(groupID: string) {
        try {
            this.getValue()
            const node = document.createElement('label')
            node.id = this.itemID
            node.innerHTML = `${this.nodeHTML} ${this.unit}<span>${this.description.replaceAll('\n', '<br>')}</span>`
            const inputNode = node.querySelector('input') as HTMLInputElement
            inputNode.setAttribute('value', this.defaultValue.toString())
            inputNode.setAttribute('min', this.minValue.toString())
            inputNode.setAttribute('max', this.maxValue.toString())
            inputNode.setAttribute('step', this.stepValue.toString())
            const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`) as HTMLFormElement
            if (itemGroupList) {
                itemGroupList.appendChild(node)
                debug(`insertItem ${this.itemID} OK`)
            }
        } catch (err) {
            error(`insertItem ${this.itemID} err`)
            error(err)
        }
    }
    /** 监听数值变化并保持, 重置不合理的值 */
    watchItem() {
        try {
            const itemEle = document.querySelector(`#${this.itemID} input`) as HTMLInputElement
            let currValue
            itemEle.addEventListener('input', () => {
                currValue = parseInt(itemEle.value)
                debug(currValue)
                if (isNaN(currValue)) {
                    itemEle.value = this.defaultValue.toString()
                } else {
                    if (currValue > this.maxValue) {
                        itemEle.value = this.maxValue.toString()
                    } else if (currValue < this.minValue) {
                        itemEle.value = this.minValue.toString()
                    }
                }
                this.setValue(parseInt(itemEle.value))
                debug('currValue', itemEle.value)
            })
            debug(`watchItem ${this.itemID} OK`)
        } catch (err) {
            error(`watchItem ${this.itemID} err`)
            error(err)
        }
    }
}

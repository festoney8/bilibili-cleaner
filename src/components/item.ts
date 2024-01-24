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

/**
 * itemID item的唯一ID, 与GM database中的Key对应, 使用相同ID可共享item状态
 * description item的功能介绍, 显示在panel内, \n可用来换行
 * defaultStatus item默认开启状态, 第一次安装时使用, 对于所有用户均开启的项目默认给true
 * itemFunc 功能函数
 * isItemFuncReload 功能函数是否在URL变动时重新运行
 * itemCSS item的CSS
 * callback 回调函数, 用于在关掉开关时触发外部事务
 */
interface ICheckboxItemOption {
    itemID: string
    description: string
    defaultStatus?: boolean
    itemFunc?: () => void
    isItemFuncReload?: boolean
    itemCSS?: myCSS
    callback?: () => void
}

/** 普通开关 */
export class CheckboxItem implements IItem {
    nodeHTML = `<input class="bili-cleaner-item-checkbox" type="checkbox">`
    private isEnable: boolean | undefined
    // item对应的HTML input node
    private itemEle: HTMLInputElement | undefined

    constructor(private option: ICheckboxItemOption) {
        this.isEnable = undefined
        this.itemEle = undefined
    }
    /**
     * 设定并记录item开关状态
     * @param value checkbox开关状态
     */
    setStatus(value: boolean) {
        GM_setValue(`BILICLEANER_${this.option.itemID}`, value)
        this.isEnable = value
    }
    /** 获取item开关状态, 若第一次安装时不存在该key, 使用默认值 */
    getStatus() {
        this.isEnable = GM_getValue(`BILICLEANER_${this.option.itemID}`)
        if (this.option.defaultStatus && this.isEnable === undefined) {
            this.isEnable = this.option.defaultStatus
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
            e.id = this.option.itemID
            e.innerHTML = `${this.nodeHTML}<span>${this.option.description.replaceAll('\n', '<br>')}</span>`
            if (this.isEnable) {
                e.querySelector('input')!.checked = true
            }
            const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`) as HTMLFormElement
            if (itemGroupList) {
                itemGroupList.appendChild(e)
                debug(`insertItem ${this.option.itemID} OK`)
            }
        } catch (err) {
            error(`insertItem ${this.option.itemID} err`)
            error(err)
        }
    }
    /** 启用CSS片段, 向<html>插入style */
    insertItemCSS() {
        if (!this.option.itemCSS) {
            return
        }
        try {
            if (document.querySelector(`html>style[bili-cleaner-css=${this.option.itemID}]`)) {
                debug(`insertItemCSS ${this.option.itemID} CSS exist, ignore`)
                return
            }
            const style = document.createElement('style')
            // 简单压缩, 若使用innerText, 多行CSS插入后会产生<br>标签
            style.innerHTML = this.option.itemCSS.replace(/\n\s*/g, '').trim()
            // 指定CSS片段ID，用于实时启用停用
            style.setAttribute('bili-cleaner-css', this.option.itemID)
            // 放弃在head内插入style
            // 改为在html内插入style标签(与head/body同级), 避免版权视频播放页head内规则丢失bug
            document.documentElement.appendChild(style)
            debug(`insertItemCSS ${this.option.itemID} OK`)
        } catch (err) {
            error(`insertItemCSS ${this.option.itemID} failed`)
            error(err)
        }
    }
    /** 停用CSS片段, 从<html>移除style */
    removeItemCSS() {
        if (this.option.itemCSS) {
            const style = document.querySelector(
                `html>style[bili-cleaner-css=${this.option.itemID}]`,
            ) as HTMLStyleElement
            if (style) {
                style.parentNode?.removeChild(style)
                debug(`removeItemCSS ${this.option.itemID} OK`)
            }
        }
    }
    /** 监听item chekbox开关 */
    watchItem() {
        try {
            this.itemEle = document.querySelector(`#${this.option.itemID} input`) as HTMLInputElement
            this.itemEle.addEventListener('change', (event: Event) => {
                // this指向class, 使用event.target访问input
                if ((<HTMLInputElement>event.target).checked) {
                    this.setStatus(true)
                    this.insertItemCSS()
                    if (this.option.itemFunc !== undefined) {
                        this.option.itemFunc()
                    }
                } else {
                    this.setStatus(false)
                    this.removeItemCSS()
                    // 回调
                    if (typeof this.option.callback === 'function') {
                        this.option.callback()
                    }
                }
            })
            debug(`watchItem ${this.option.itemID} OK`)
        } catch (err) {
            error(`watchItem ${this.option.itemID} err`)
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
                if (enableFunc && this.option.itemFunc instanceof Function) {
                    this.option.itemFunc()
                }
                debug(`enableItem ${this.option.itemID} OK`)
            } catch (err) {
                error(`enableItem ${this.option.itemID} Error`)
                error(err)
            }
        }
    }
    /**
     * 重载item, 用于非页面刷新但URL变动情况, 此时已注入CSS只重新运行func, 如: 非刷新式切换视频
     */
    reloadItem() {
        // this.getStatus()
        if (this.option.isItemFuncReload && this.isEnable && this.option.itemFunc instanceof Function) {
            try {
                this.option.itemFunc()
                debug(`reloadItem ${this.option.itemID} OK`)
            } catch (err) {
                error(`reloadItem ${this.option.itemID} Error`)
                error(err)
            }
        }
    }
}

/**
 * itemID item的唯一ID, 与GM database中的Key对应, 使用相同ID可共享item状态
 * description item的功能介绍, 显示在panel内, \n可用来换行
 * radioName radio input的name, 用于一组互斥选项
 * radioItemIDList 当前item所在互斥组的ID列表, 用于修改其他item状态
 * defaultStatus item默认开启状态, 第一次安装时使用, 对于所有用户均开启的项目默认给true
 * itemFunc 功能函数
 * isItemFuncReload 功能函数是否在URL变动时重新运行
 * itemCSS item的CSS
 */
interface IRadioItemOption {
    itemID: string
    description: string
    radioName: string
    radioItemIDList: string[]
    defaultStatus?: boolean
    itemFunc?: () => void
    isItemFuncReload?: boolean
    itemCSS?: myCSS
}

/** 互斥开关 */
export class RadioItem implements IItem {
    nodeHTML = `<input class="bili-cleaner-item-checkbox" type="radio">`
    private isEnable: boolean | undefined
    private itemEle: HTMLInputElement | undefined

    constructor(private option: IRadioItemOption) {
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
            GM_setValue(`BILICLEANER_${this.option.itemID}`, value)
            this.isEnable = value
        } else {
            GM_setValue(`BILICLEANER_${targetID}`, value)
        }
    }
    /** 获取item开关状态, 若第一次安装时不存在该key, 使用默认值 */
    getStatus() {
        this.isEnable = GM_getValue(`BILICLEANER_${this.option.itemID}`)
        if (this.option.defaultStatus && this.isEnable === undefined) {
            this.isEnable = this.option.defaultStatus
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
            e.id = this.option.itemID
            e.innerHTML = `${this.nodeHTML}<span>${this.option.description.replaceAll('\n', '<br>')}</span>`
            if (this.isEnable) {
                e.querySelector('input')!.checked = true
            }
            // 设定radio input所属互斥组
            e.querySelector('input')!.name = this.option.radioName
            const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`) as HTMLFormElement
            if (itemGroupList) {
                itemGroupList.appendChild(e)
                debug(`insertItem ${this.option.itemID} OK`)
            }
        } catch (err) {
            error(`insertItem ${this.option.itemID} err`)
            error(err)
        }
    }
    /** 启用CSS片段, 向<html>插入style */
    insertItemCSS() {
        if (!this.option.itemCSS) {
            return
        }
        try {
            if (document.querySelector(`html>style[bili-cleaner-css=${this.option.itemID}]`)) {
                debug(`insertItemCSS ${this.option.itemID} CSS exist, ignore`)
                return
            }
            const style = document.createElement('style')
            // 简单压缩, 若使用innerText, 多行CSS插入后会产生<br>标签
            style.innerHTML = this.option.itemCSS.replace(/\n\s*/g, '').trim()
            // 指定CSS片段ID，用于实时启用停用
            style.setAttribute('bili-cleaner-css', this.option.itemID)
            // 放弃在head内插入style
            // 改为在html内插入style标签(与head/body同级), 避免版权视频播放页head内规则丢失bug
            document.documentElement.appendChild(style)
            debug(`insertItemCSS ${this.option.itemID} OK`)
        } catch (err) {
            error(`insertItemCSS ${this.option.itemID} failed`)
            error(err)
        }
    }
    /** 停用CSS片段, 从<html>移除style */
    removeItemCSS() {
        if (this.option.itemCSS) {
            const style = document.querySelector(
                `html>style[bili-cleaner-css=${this.option.itemID}]`,
            ) as HTMLStyleElement
            if (style) {
                style.parentNode?.removeChild(style)
                debug(`removeItemCSS ${this.option.itemID} OK`)
            }
        }
    }
    /** 监听item option开关 */
    watchItem() {
        try {
            this.itemEle = document.querySelector(`#${this.option.itemID} input`) as HTMLInputElement
            this.itemEle.addEventListener('change', (event: Event) => {
                if ((<HTMLInputElement>event.target).checked) {
                    debug(`radioItem ${this.option.itemID} checked`)
                    this.setStatus(true)
                    this.insertItemCSS()
                    if (this.option.itemFunc !== undefined) {
                        this.option.itemFunc()
                    }
                    // 相同name的其他option自动置为uncheck, 但这一行为无法被监听, 需传入itemID逐一修改
                    this.option.radioItemIDList.forEach((targetID) => {
                        if (targetID !== this.option.itemID) {
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
            debug(`watchItem ${this.option.itemID} OK`)
        } catch (err) {
            error(`watchItem ${this.option.itemID} err`)
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
                if (enableFunc && this.option.itemFunc instanceof Function) {
                    this.option.itemFunc()
                }
                debug(`enableItem ${this.option.itemID} OK`)
            } catch (err) {
                error(`enableItem ${this.option.itemID} Error`)
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
        if (this.option.isItemFuncReload && this.isEnable && this.option.itemFunc instanceof Function) {
            try {
                this.option.itemFunc()
                debug(`reloadItem ${this.option.itemID} OK`)
            } catch (err) {
                error(`reloadItem ${this.option.itemID} Error`)
                error(err)
            }
        }
    }
}

/**
 * itemID item的唯一ID, 用于在GM database中记录数值
 * description 数值功能介绍
 * defaultValue 默认值
 * minValue 最小值
 * maxValue 最大值
 * unit 数值单位
 * callback 回调函数, 在数值修改时回调, 可用于效果实时生效
 */
interface INumberItemOption {
    itemID: string
    description: string
    defaultValue: number
    minValue: number
    maxValue: number
    unit: string
    callback?: (value: number) => void
}

/** 数值设定 */
export class NumberItem implements IItem {
    nodeHTML = `<input class="bili-cleaner-item-number" type="number">`
    private itemValue: number | undefined

    constructor(private option: INumberItemOption) {}

    /** 获取数值, 初次安装使用默认值 */
    getValue() {
        this.itemValue = GM_getValue(`BILICLEANER_${this.option.itemID}`)
        if (this.itemValue === undefined) {
            this.itemValue = this.option.defaultValue
            this.setValue(this.itemValue)
        }
    }
    /** 设定并记录数值 */
    setValue(value: number) {
        this.itemValue = value
        GM_setValue(`BILICLEANER_${this.option.itemID}`, this.itemValue)
    }

    /**
     * 在相应group内添加item
     * @param groupID item所属groupID, 由Group调用insertItem时传入
     */
    insertItem(groupID: string) {
        try {
            this.getValue()
            const node = document.createElement('label')
            node.id = this.option.itemID
            node.innerHTML = `${this.option.description.replaceAll('\n', '<br>')}<span>${this.nodeHTML}</span>${
                this.option.unit
            }`
            const inputNode = node.querySelector('input') as HTMLInputElement
            inputNode.setAttribute('value', this.itemValue!.toString())
            inputNode.setAttribute('min', this.option.minValue.toString())
            inputNode.setAttribute('max', this.option.maxValue.toString())
            const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`) as HTMLFormElement
            if (itemGroupList) {
                itemGroupList.appendChild(node)
                debug(`insertItem ${this.option.itemID} OK`)
            }
        } catch (err) {
            error(`insertItem ${this.option.itemID} err`)
            error(err)
        }
    }
    /** 监听数值变化并保持, 重置不合理的值 */
    watchItem() {
        try {
            const itemEle = document.querySelector(`#${this.option.itemID} input`) as HTMLInputElement
            let currValue
            itemEle.addEventListener('input', () => {
                currValue = parseInt(itemEle.value)
                if (isNaN(currValue)) {
                    itemEle.value = this.option.minValue.toString()
                } else {
                    if (currValue > this.option.maxValue) {
                        itemEle.value = this.option.maxValue.toString()
                    } else if (currValue < this.option.minValue) {
                        itemEle.value = this.option.minValue.toString()
                    }
                }
                this.setValue(parseInt(itemEle.value))
                itemEle.value = parseInt(itemEle.value).toString()
                debug(`${this.option.itemID} currValue ${itemEle.value}`)
                // 调用回调函数
                if (this.option.callback && typeof this.option.callback === 'function') {
                    this.option.callback(parseInt(itemEle.value))
                }
            })
            debug(`watchItem ${this.option.itemID} OK`)
        } catch (err) {
            error(`watchItem ${this.option.itemID} err`)
            error(err)
        }
    }
}

/**
 * itemID item的唯一ID
 * description 按钮功能介绍
 * name 按钮名称
 * itemFunc 功能函数
 */
interface IButtonItemOption {
    itemID: string
    description: string
    name: string
    itemFunc: () => void
}

/** 普通按钮 */
export class ButtonItem implements IItem {
    nodeHTML = `<button class="bili-cleaner-item-button" role="button"></button>`

    constructor(private option: IButtonItemOption) {}

    /**
     * 在相应group内添加item
     * @param groupID item所属groupID, 由Group调用insertItem时传入
     */
    insertItem(groupID: string) {
        try {
            const node = document.createElement('label')
            node.id = this.option.itemID
            node.innerHTML = `${this.nodeHTML}${this.option.description.replaceAll('\n', '<br>')}`
            node.querySelector('button')!.innerHTML = this.option.name
            const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`) as HTMLFormElement
            if (itemGroupList) {
                itemGroupList.appendChild(node)
                debug(`insertItem ${this.option.itemID} OK`)
            }
        } catch (err) {
            error(`insertItem ${this.option.itemID} err`)
            error(err)
        }
    }
    /** 监听按钮按下 */
    watchItem() {
        try {
            const itemEle = document.querySelector(`#${this.option.itemID} button`) as HTMLButtonElement
            itemEle.addEventListener('click', () => {
                debug(`button ${this.option.itemID} click`)
                this.option.itemFunc()
            })
            debug(`watchItem ${this.option.itemID} OK`)
        } catch (err) {
            error(`watchItem ${this.option.itemID} err`)
            error(err)
        }
    }
}

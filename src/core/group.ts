import { debug, error } from '../utils/logger'
import { NormalItem, SeparatorItem } from './item'

interface IGroup {
    readonly groupHTML: myHTML
    isEmpty(): boolean
    insertGroup(): void
    insertGroupItems(): void
    enableGroup(): void
    reloadGroup(): void
    disableGroup(): void
}

export class Group implements IGroup {
    groupHTML = `
    <div class="bili-cleaner-group">
        <div class="bili-cleaner-group-title">
        </div>
        <hr>
        <div class="bili-cleaner-item-list">
        </div>
    </div>`

    /**
     * Group是每个页面的规则集合
     * @param groupID group的唯一ID
     * @param title group标题, 显示在group顶部
     * @param items group内功能列表
     */
    constructor(
        private groupID: string,
        private title: string,
        private items: (NormalItem | SeparatorItem)[],
    ) {
        this.groupID = 'bili-cleaner-group-' + groupID
    }

    /**
     * @returns group内规则是否为空
     */
    isEmpty(): boolean {
        return this.items.length === 0
    }
    /** 在panel内添加一个group */
    insertGroup() {
        const e = document.createElement('div')
        e.innerHTML = this.groupHTML.trim()
        e.querySelector('.bili-cleaner-group')!.id = this.groupID
        e.querySelector('.bili-cleaner-group-title')!.textContent = this.title

        const groupList = document.getElementById('bili-cleaner-group-list') as HTMLFormElement
        groupList.appendChild(e)
    }
    /** 插入group内item列表, 并逐一监听 */
    insertGroupItems() {
        try {
            this.items.forEach((e) => {
                e.insertItem(this.groupID)
                if (e instanceof NormalItem) {
                    e.watchItem()
                }
            })
            debug(`insertGroupItems ${this.groupID} OK`)
        } catch (err) {
            error(`insertGroupItems ${this.groupID} err`)
            error(err)
        }
    }
    /**
     * 启用group，启用group内items
     * @param enableFunc 是否启用item功能, 默认true
     */
    enableGroup(enableFunc = true) {
        try {
            this.items.forEach((e) => {
                if (e instanceof NormalItem) {
                    e.enableItem(enableFunc)
                }
            })
            debug(`enableGroup ${this.groupID} OK`)
        } catch (err) {
            error(`enableGroup ${this.groupID} err`)
            error(err)
        }
    }
    /** 在URL变动时, 重载group内需要重载的项目 */
    reloadGroup() {
        try {
            this.items.forEach((e) => {
                if (e instanceof NormalItem) {
                    e.reloadItem()
                }
            })
            debug(`reloadGroup ${this.groupID} OK`)
        } catch (err) {
            error(`reloadGroup ${this.groupID} err`)
            error(err)
        }
    }
    /** 禁用Group, 临时使用, 移除全部CSS, 监听函数保持不变 */
    disableGroup() {
        try {
            this.items.forEach((e) => {
                if (e instanceof NormalItem) {
                    e.removeItemCSS()
                }
            })
            debug(`disableGroup ${this.groupID} OK`)
        } catch (err) {
            error(`disableGroup ${this.groupID} err`)
            error(err)
        }
    }
}

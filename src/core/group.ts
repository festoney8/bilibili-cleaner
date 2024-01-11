import { debug, error } from '../utils/logger'
import { CheckboxItem, RadioItem } from './item'

interface IGroup {
    readonly groupHTML: myHTML
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
     * Group是每个页面的规则组，每个页面有多个组
     * @param groupID group的唯一ID
     * @param title group标题, 显示在group顶部, 可使用换行符'\n', 可使用HTML
     * @param items group内功能列表
     */
    constructor(
        private groupID: string,
        private title: string,
        private items: (CheckboxItem | RadioItem)[],
    ) {
        this.groupID = 'bili-cleaner-group-' + groupID
    }

    /** 在panel内添加一个group */
    insertGroup() {
        const e = document.createElement('div')
        e.innerHTML = this.groupHTML.trim()
        e.querySelector('.bili-cleaner-group')!.id = this.groupID
        e.querySelector('.bili-cleaner-group-title')!.innerHTML = this.title.replaceAll('\n', '<br>')

        const groupList = document.getElementById('bili-cleaner-group-list') as HTMLFormElement
        groupList.appendChild(e)
    }
    /** 插入group内item列表, 并逐一监听 */
    insertGroupItems() {
        try {
            this.items.forEach((e) => {
                e.insertItem(this.groupID)
                if (typeof e.watchItem === 'function') {
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
                if (typeof e.enableItem === 'function') {
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
                if (typeof e.reloadItem === 'function') {
                    e.reloadItem()
                }
            })
            // debug(`reloadGroup ${this.groupID} OK`)
        } catch (err) {
            error(`reloadGroup ${this.groupID} err`)
            error(err)
        }
    }
    /** 禁用Group, 临时使用, 移除全部CSS, 监听函数保持不变 */
    disableGroup() {
        try {
            this.items.forEach((e) => {
                if (typeof e.removeItemCSS === 'function') {
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

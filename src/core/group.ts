import { debug, error, trace } from '../utils/logger'
import { NormalItem, SeparatorItem } from './item'

interface IGroup {
    readonly groupHTML: myHTML
    insertGroup(): void
    insertGroupItems(): void
    enableGroup(): void
    reloadGroup(): void
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

    // 在panel内添加一个group
    insertGroup() {
        const e = document.createElement('div')
        e.innerHTML = this.groupHTML
        e.querySelector('.bili-cleaner-group')!.id = this.groupID
        e.querySelector('.bili-cleaner-group-title')!.textContent = this.title

        const groupList = document.getElementById('bili-cleaner-group-list') as HTMLFormElement
        groupList.appendChild(e)
    }
    // 添加group内item并监听状态
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
            trace()
        }
    }
    // 启用group，启用group内items
    enableGroup() {
        try {
            this.items.forEach((e) => {
                if (e instanceof NormalItem) {
                    e.enableItem()
                }
            })
            debug(`enableGroup ${this.groupID} OK`)
        } catch (err) {
            error(`enableGroup ${this.groupID} err`)
            error(err)
            trace()
        }
    }

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
            trace()
        }
    }
}

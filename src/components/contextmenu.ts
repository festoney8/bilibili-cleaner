import { debugComponents as debug, error } from '../utils/logger'
import contextMenuStyle from './contextmenu.scss?inline'

type Menu = {
    name: string
    onclick: () => void
}
export class ContextMenu {
    private nodeHTML = `
        <div id="bili-cleaner-context-menu-container">
            <ul>
            </ul>
        </div>`
    private menus: Menu[] = []
    private node: HTMLDivElement | undefined
    private isShowing = false

    constructor() {}

    /** 向document.head中添加CSS */
    insertContextMenuCSS() {
        try {
            if (document.head.querySelector('#bili-cleaner-context-menu-css')) {
                return
            }
            const style = document.createElement('style')
            style.innerHTML = contextMenuStyle
            style.setAttribute('id', 'bili-cleaner-context-menu-css')
            document.head.appendChild(style)
            debug('insertContextMenuCSS OK')
        } catch (err) {
            error(`insertContextMenuCSS failed`)
            error(err)
        }
    }

    /**
     * 注册右键菜单
     * @param name 功能名
     * @param onclick 点击执行的回调函数
     */
    registerMenu(name: string, onclick: () => void) {
        if (this.isShowing) {
            this.menus = []
            this.isShowing = false
        }
        this.menus.push({
            name: name,
            onclick: onclick,
        })
    }
    /**
     * 显示右键菜单
     * @param x 坐标X
     * @param y 坐标Y
     */
    show(x: number, y: number) {
        // 新建节点
        if (!this.node) {
            this.insertContextMenuCSS()
            const wrap = document.createElement('div')
            wrap.innerHTML = this.nodeHTML
            this.node = wrap.querySelector('#bili-cleaner-context-menu-container') as HTMLDivElement
            document.body?.appendChild(this.node)
        }
        // 新建列表
        const menuList = this.node.querySelector('ul')! as HTMLUListElement
        menuList.innerHTML = ''
        this.menus.forEach((menu) => {
            const li = document.createElement('li')
            li.className = 'bili-cleaner-context-menu'
            li.innerHTML = `${menu.name}`
            li.onclick = menu.onclick
            menuList.appendChild(li)
        })
        this.node.style.left = `${x + 3}px`
        this.node.style.top = `${y + 3}px`
        this.node.style.display = 'block'

        this.isShowing = true

        // 监听关闭操作
        const hideMenu = () => {
            this.hide()
        }
        document.addEventListener('click', () => {
            hideMenu()
            document.removeEventListener('click', hideMenu)
        })
    }
    /** 隐藏右键菜单 */
    hide() {
        if (this.node) {
            this.node.style.display = 'none'
            this.node.querySelector('ul')!.innerHTML = ''
            this.menus = []
        }
        this.isShowing = false
    }
}

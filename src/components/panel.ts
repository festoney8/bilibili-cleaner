import { debugComponents as debug, error } from '../utils/logger'
import panelStyle from './panel.scss?inline'

export class Panel {
    panelHTML = `
    <div id="bili-cleaner">
        <div id="bili-cleaner-bar">
            <div id="bili-cleaner-title">
                <span>bilibili 页面净化大师</span>
            </div>
            <div id="bili-cleaner-close">
                <svg class="icon" viewBox="0 0 1026 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M996.742543 154.815357L639.810328 511.747572l356.932215 356.932215a90.158906 90.158906 0 0 1-127.490994 127.490994L512.319334 639.195998l-356.932215 356.889647A90.158906 90.158906 0 1 1 27.896126 868.637219L384.82834 511.747572 27.896126 154.815357A90.158906 90.158906 0 1 1 155.387119 27.324364L512.319334 384.256578 869.251549 27.324364a90.158906 90.158906 0 1 1 127.490994 127.490993z" fill="#ffffff"></path></svg>
            </div>
        </div>
        <div id="bili-cleaner-group-list">
        </div>
    </div>`

    // mode用于记录panel中功能类型, 如 屏蔽元素/视频过滤器
    mode: string | undefined = undefined

    isShowing = false

    /** 向document.head中添加panel CSS */
    insertPanelCSS() {
        try {
            if (document.head.querySelector('#bili-cleaner-panel-css')) {
                return
            }
            const style = document.createElement('style')
            style.innerHTML = panelStyle
            style.setAttribute('id', 'bili-cleaner-panel-css')
            document.head.appendChild(style)
            debug('insertPanelCSS OK')
        } catch (err) {
            error(`insertPanelCSS failed`)
            error(err)
        }
    }
    /** 向document.body后添加panel html代码 */
    insertPanelHTML() {
        try {
            if (document.getElementById('bili-cleaner')) {
                return
            }
            let node = document.createElement('div')
            node.innerHTML = this.panelHTML
            node = node.querySelector('#bili-cleaner')!
            document.body.appendChild(node)
            debug('insertPanelHTML OK')
        } catch (err) {
            error(`insertPanelHTML failed`)
            error(err)
        }
    }
    /** 右上角关闭按钮 */
    watchCloseBtn() {
        try {
            const closeBtn = document.getElementById('bili-cleaner-close') as HTMLElement
            closeBtn.addEventListener('click', () => {
                this.hide()
            })
            debug('watchCloseBtn OK')
        } catch (err) {
            error(`watchCloseBtn failed`)
            error(err)
        }
    }
    /** 可拖拽panel bar, 拖拽panel顶部的bar可移动panel, 其他区域不可拖拽 */
    draggableBar() {
        try {
            const panel = document.getElementById('bili-cleaner') as HTMLElement
            const bar = document.getElementById('bili-cleaner-bar') as HTMLElement
            let isDragging = false
            let initX: number, initY: number, initLeft: number, initTop: number

            bar.addEventListener('mousedown', (e) => {
                isDragging = true
                initX = e.clientX
                initY = e.clientY
                const c = window.getComputedStyle(panel)
                initLeft = parseInt(c.getPropertyValue('left'), 10)
                initTop = parseInt(c.getPropertyValue('top'), 10)
            })
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const diffX = e.clientX - initX
                    const diffY = e.clientY - initY
                    panel.style.left = `${initLeft + diffX}px`
                    panel.style.top = `${initTop + diffY}px`
                    // 限制bar不超出视口
                    const rect = bar.getBoundingClientRect()
                    if (rect.left < 0) {
                        panel.style.left = `${initLeft + diffX - rect.left}px`
                    }
                    if (rect.top < 0) {
                        panel.style.top = `${initTop + diffY - rect.top}px`
                    }
                    if (rect.right > window.innerWidth) {
                        panel.style.left = `${initLeft + diffX - (rect.right - window.innerWidth)}px`
                    }
                    if (rect.bottom > window.innerHeight) {
                        panel.style.top = `${initTop + diffY - (rect.bottom - window.innerHeight)}px`
                    }
                }
            })
            document.addEventListener('mouseup', () => {
                isDragging = false
            })
            debug('draggableBar OK')
        } catch (err) {
            error(`draggableBar failed`)
            error(err)
        }
    }

    /** 创建Panel */
    create() {
        this.insertPanelCSS()
        this.insertPanelHTML()
        this.watchCloseBtn()
        this.draggableBar()
    }
    /** 隐藏panel */
    hide() {
        const panel = document.getElementById('bili-cleaner') as HTMLElement
        if (panel) {
            // 使用 display:none 代替 remove(), 同一页面内再次打开panel记录上次位置
            panel.style.display = 'none'
        }
        this.isShowing = false
    }
    /** 显示panel */
    show() {
        const panel = document.getElementById('bili-cleaner') as HTMLElement
        if (panel) {
            panel.style.removeProperty('display')
        }
        this.isShowing = true
    }
    /** 清空panel内groups, 用于替换功能group */
    clearGroups() {
        const groupList = document.getElementById('bili-cleaner-group-list') as HTMLElement
        if (groupList) {
            groupList.innerHTML = ''
        }
        debug('panel clearGroups OK')
    }
}

import { debug, error, trace } from '../utils/logging'

export class Panel {
    panelCSS = `
    /* panel部分 */
    #bili-cleaner {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 32vw;
        height: 90vh;
        border-radius: 10px;
        background: rgba(250, 250, 250, 1);
        box-shadow: 0 2px 5px rgba(251, 114, 153, 1);
        overflow: auto;
        z-index: 2147483647;
    }
    #bili-cleaner-bar {
        width: 32vw;
        height: 6vh;
        background: rgba(251, 114, 153, 1);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        cursor: move;
        user-select: none;
    }
    #bili-cleaner-title {
        width: 32vw;
        height: 6vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: bold;
        font-size: 22px;
    }
    #bili-cleaner-title span {
        text-align: center;
    }
    #bili-cleaner-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 6vh;
        height: 6vh;
        border-radius: 6vh;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: auto;
    }
    #bili-cleaner-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    #bili-cleaner-close svg {
        text-align: center;
    }
    #bili-cleaner-group-list {
        height: 84vh;
        overflow: auto;
    }
    #bili-cleaner-group-list::-webkit-scrollbar {
        display: none;
    }
    #bili-cleaner-group-list {
        scrollbar-width: none !important;
    }
    /* panel内的group */
    .bili-cleaner-group {
        margin: 10px;
        background: white;
        border-radius: 5px;
        padding: 5px 15px;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
        user-select: none;
    }
    .bili-cleaner-group hr {
        border: 1px solid #eeeeee;
        margin-top: 5px;
        margin-bottom: 5px;
    }
    .bili-cleaner-group-title {
        font-size: 20px;
        font-weight: bold;
        padding: 2px;
        color: black;
    }
    .bili-cleaner-item-list {
        padding: 2px;
    }
    /* 每行Item选项的样式, 按钮和文字 */
    .bili-cleaner-item-list label {
        display: block;
        vertical-align: middle;
        margin: 8px 0;
        font-size: 16px;
        color: black;
    }
    .bili-cleaner-item-switch {
        vertical-align: middle;
        width: 50px;
        height: 27px;
        margin: 0 1em 0 0;
        position: relative;
        border: 1px solid #dfdfdf;
        background-color: #fdfdfd;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-radius: 50px;
        appearance: none;
        -webkit-appearance: none;
        user-select: none;
    }
    .bili-cleaner-item-switch:before {
        content: '';
        width: 25px;
        height: 25px;
        position: absolute;
        top: 0px;
        left: 0;
        border-radius: 50px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
    .bili-cleaner-item-switch:checked {
        border-color: rgba(251, 114, 153, 1);
        box-shadow: rgba(251, 114, 153, 1) 0 0 0 16px inset;
        background-color: rgba(251, 114, 153, 1);
    }
    .bili-cleaner-item-switch:checked:before {
        left: 25px;
    }`
    panelHTML = `
    <div id="bili-cleaner">
        <div id="bili-cleaner-bar">
            <div id="bili-cleaner-title">
                <span>bilibili 页面净化大师</span>
            </div>
            <div id="bili-cleaner-close">
                <svg t="1699601981125" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5964" width="20" height="20"><path d="M996.742543 154.815357L639.810328 511.747572l356.932215 356.932215a90.158906 90.158906 0 0 1-127.490994 127.490994L512.319334 639.195998l-356.932215 356.889647A90.158906 90.158906 0 1 1 27.896126 868.637219L384.82834 511.747572 27.896126 154.815357A90.158906 90.158906 0 1 1 155.387119 27.324364L512.319334 384.256578 869.251549 27.324364a90.158906 90.158906 0 1 1 127.490994 127.490993z" fill="#ffffff" p-id="5965"></path></svg>
            </div>
        </div>
        <div id="bili-cleaner-group-list">
        </div>
    </div>`

    constructor() {}

    /**
     * 向document.head中添加panel CSS
     */
    insertPanelCSS() {
        try {
            if (document.head.querySelector('#bili-cleaner-panel-css')) {
                return
            }
            const style = document.createElement('style')
            style.innerHTML = this.panelCSS
            style.setAttribute('id', 'bili-cleaner-panel-css')
            document.head.appendChild(style)
            debug('insertPanelCSS OK')
        } catch (err) {
            error(`insertPanelCSS failed`)
            error(err)
            trace()
        }
    }
    /**
     * 向document.body后添加panel html代码
     */
    insertPanelHTML() {
        try {
            if (document.getElementById('bili-cleaner')) {
                return
            }
            const html = document.createElement('div')
            html.setAttribute('id', 'bili-cleaner')
            html.innerHTML = this.panelHTML
            document.body.appendChild(html)
            debug('insertPanelHTML OK')
        } catch (err) {
            error(`insertPanelHTML failed`)
            error(err)
            trace()
        }
    }
    /**
     * 右上角关闭按钮
     */
    watchCloseBtn() {
        try {
            const panel = document.getElementById('bili-cleaner') as HTMLFormElement
            const closeBtn = document.getElementById('bili-cleaner-close') as HTMLFormElement
            closeBtn.addEventListener('click', () => {
                panel.remove()
            })
            debug('watchCloseBtn OK')
        } catch (err) {
            error(`watchCloseBtn failed`)
            error(err)
            trace()
        }
    }
    /**
     * 可拖拽panel bar, 拖拽panel顶部的bar可移动panel, 其他区域不可拖拽
     */
    draggableBar() {
        try {
            const panel = document.getElementById('bili-cleaner') as HTMLFormElement
            const bar = document.getElementById('bili-cleaner-bar') as HTMLFormElement
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
                }
            })
            document.addEventListener('mouseup', () => {
                isDragging = false
            })
            debug('draggableBar OK')
        } catch (err) {
            error(`draggableBar failed`)
            error(err)
            trace()
        }
    }
    /**
     * 创建Panel流程
     */
    createPanel() {
        this.insertPanelCSS()
        this.insertPanelHTML()
        this.watchCloseBtn()
        this.draggableBar()
    }
}

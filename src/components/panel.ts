import { debugComponents as debug, error } from '../utils/logger'

class Panel {
    panelCSS = `
    #bili-cleaner{position:fixed;left:50%;top:50%;transform:translate(-50%, -50%);width:max(32vw,300px);height:90vh;border-radius:10px;background:#f4f5f7;box-shadow:0 0 8px rgba(0,0,0,.25);overflow:auto;z-index:2147483640;overscroll-behavior:contain}#bili-cleaner #bili-cleaner-bar{width:max(32vw,300px);height:6vh;background:#00aeec;border-top-left-radius:10px;border-top-right-radius:10px;cursor:move;-webkit-user-select:none;-moz-user-select:none;user-select:none}#bili-cleaner #bili-cleaner-bar #bili-cleaner-title{width:max(32vw,300px);height:6vh;display:flex;justify-content:center;align-items:center;color:#fff;font-weight:bold;font-size:22px}#bili-cleaner #bili-cleaner-bar #bili-cleaner-title span{text-align:center}#bili-cleaner #bili-cleaner-bar #bili-cleaner-close{position:absolute;top:0;right:0;width:6vh;height:6vh;border-radius:6vh;display:flex;justify-content:center;align-items:center;cursor:auto}#bili-cleaner #bili-cleaner-bar #bili-cleaner-close:hover{background:rgba(255,255,255,.2)}#bili-cleaner #bili-cleaner-bar #bili-cleaner-close svg{text-align:center}#bili-cleaner #bili-cleaner-group-list{height:84vh;overflow:auto;scrollbar-width:none !important;overscroll-behavior:contain}#bili-cleaner #bili-cleaner-group-list::-webkit-scrollbar{display:none}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group{margin:14px;background:#fff;border-radius:6px;padding:8px 16px;border:1px solid #ddd;-webkit-user-select:none;-moz-user-select:none;user-select:none}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group hr{border:1px solid #eee;margin:5px 0 10px 0}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-group-title{font-size:20px;font-weight:bold;padding:2px;color:#000;letter-spacing:1px}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-list label{display:flex;align-items:center;margin:6px 0 6px 10px;font-size:16px;color:#000}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-list hr{border:1px solid #eee;margin:15px 20px}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-checkbox{width:50px;min-width:50px;height:27px;margin:0 1em 0 0;position:relative;border:1px solid #dfdfdf;background-color:#fdfdfd;box-shadow:#dfdfdf 0 0 0 0 inset;border-radius:50px;-moz-appearance:none;appearance:none;-webkit-appearance:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-checkbox:before{content:"";width:25px;height:25px;position:absolute;top:0px;left:0;border-radius:50px;background-color:#fff;box-shadow:0 1px 3px rgba(0,0,0,.5)}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-checkbox:checked{border-color:#00aeec;box-shadow:#00aeec 0 0 0 16px inset;background-color:#00aeec}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-checkbox:checked:before{left:25px}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-number{width:50px;min-width:50px;height:27px;margin:0 .5em 0 .5em;position:relative;border:1px solid #dfdfdf;background-color:#fdfdfd;box-shadow:#dfdfdf 0 0 0 0 inset;border-radius:5px;-moz-appearance:none;appearance:none;-webkit-appearance:none;text-align:center;color:blue;font-size:16px;-moz-appearance:textfield}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-number::-webkit-inner-spin-button,#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-number::-webkit-inner-spin-button{-webkit-appearance:none}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-button{width:50px;background-color:#fff;border:1px solid #666;border-radius:6px;box-sizing:border-box;cursor:pointer;display:inline-block;font-size:16px;margin:0 1em 0 0;outline:none;padding:5px 0;position:relative;text-align:center;text-decoration:none;touch-action:manipulation;transition:box-shadow .2s,transform .1s;-moz-user-select:none;user-select:none;-webkit-user-select:none}#bili-cleaner #bili-cleaner-group-list .bili-cleaner-group .bili-cleaner-item-button:active{background-color:#f7f7f7;border-color:#000;transform:scale(0.96)}#bili-cleaner-wordlist{background:#fff;border-radius:5px;box-shadow:0 0 8px rgba(0,0,0,.25);overflow:hidden;position:fixed;left:50%;top:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;z-index:2147483641;overscroll-behavior:contain}#bili-cleaner-wordlist .wordlist-header{background-color:#00aeec;color:#fff;font-size:22px;font-weight:bold;margin:0;height:100%;width:100%;line-height:36px;text-align:center;-webkit-user-select:none;-moz-user-select:none;user-select:none}#bili-cleaner-wordlist .wordlist-description{font-size:16px;margin:6px auto;line-height:18px;text-align:center}#bili-cleaner-wordlist textarea.wordlist-body{width:400px;height:500px;margin:0 12px;border:2px solid #ccc;overflow-y:scroll;font-size:16px;line-height:22px;padding:5px 10px;flex-grow:1;resize:none;overscroll-behavior:contain}#bili-cleaner-wordlist textarea.wordlist-body:focus{outline:none !important}#bili-cleaner-wordlist .wordlist-footer{height:50px;display:flex;justify-content:space-evenly;padding:0 10px;align-items:center}#bili-cleaner-wordlist .wordlist-footer button{width:100px;height:30px;border-radius:5px;border:1px solid #666;font-size:18px}#bili-cleaner-wordlist .wordlist-footer button:hover{background-color:#666;color:#fff}
    `
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

    // mode用于记录panel中功能类型, 如 屏蔽元素/视频过滤器
    mode: string | undefined = undefined

    constructor() {}

    /** 向document.head中添加panel CSS */
    insertPanelCSS() {
        try {
            if (document.head.querySelector('#bili-cleaner-panel-css')) {
                return
            }
            const style = document.createElement('style')
            style.innerHTML = this.panelCSS.replace(/\n\s*/g, '').trim()
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
            const html = document.createElement('div')
            html.innerHTML = this.panelHTML
            document.body.appendChild(html)
            debug('insertPanelHTML OK')
        } catch (err) {
            error(`insertPanelHTML failed`)
            error(err)
        }
    }
    /** 右上角关闭按钮 */
    watchCloseBtn() {
        try {
            const closeBtn = document.getElementById('bili-cleaner-close') as HTMLFormElement
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
        const panel = document.getElementById('bili-cleaner') as HTMLFormElement
        if (panel) {
            // 使用 display:none 代替 remove(), 同一页面内再次打开panel记录上次位置
            panel.style.display = 'none'
        }
    }
    /** 显示panel */
    show() {
        const panel = document.getElementById('bili-cleaner') as HTMLFormElement
        if (panel) {
            panel.style.removeProperty('display')
        }
    }
    /** 清空panel内groups, 用于替换功能group */
    clearGroups() {
        const groupList = document.getElementById('bili-cleaner-group-list') as HTMLFormElement
        if (groupList) {
            groupList.innerHTML = ''
        }
        debug('panel clearGroups OK')
    }
}

// panel全局单例
const panelInstance = new Panel()
export default panelInstance

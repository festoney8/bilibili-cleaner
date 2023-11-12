// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  净化B站页面内的各种元素，高度定制化
// @author       festoney8
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict'

    class Group {
        // Group名称，描述，启用Group的域名模式，item数组
        constructor(groupID, description, mode, items) {
            this.groupID = groupID
            this.description = description
            this.mode = mode
            this.items = items
        }
        // 在panel内添加一个group
        insertGroup() {
            const e = document.createElement('div')
            e.innerHTML = `
            <div class="bili-cleaner-group">
                <div class="bili-cleaner-group-title">
                </div>
                <hr>
                <div class="bili-cleaner-itemlist">
                </div>
            </div>`
            e.querySelector('.bili-cleaner-group').id = this.groupID
            e.querySelector('.bili-cleaner-group-title').textContent = this.description

            const groupList = document.getElementById('bili-cleaner-group-list')
            groupList.appendChild(e)
        }
        // 添加group内item并监听状态
        insertItems() {
            this.items.forEach(e => {
                e.insertItem()
                e.watchItem()
            })
        }
        // 启用group内items
        enableItems() {
            this.items.forEach(e => {
                e.enableItem()
            })
        }

        // 根据mode判断是否启用group
        enableGroup() {
            const host = location.host
            const url = location.href
            const pathname = location.pathname
            console.log("enableGroup", host, url, pathname)
            console.log(this)
            if (this.mode === "common") {
                this.enableItems()
            } else if (host == 't.bilibili.com' && this.mode == 'trends') {
                this.enableItems()
            } else if (host == 'search.bilibili.com' && this.mode == 'search') {
                this.enableItems()
            } else if (url.startsWith('https://www.bilibili.com/video/') && this.mode == 'video') {
                this.enableItems()
            } else if (url.startsWith('https://www.bilibili.com/') && pathname == '/' && this.mode == 'homepage') {
                this.enableItems()
            } else if (host == 'live.bilibili.com' && this.mode == 'live') {
                this.enableItems()
            }
        }
    }

    class Item {
        uncheckedHTML = `<input class="bili-cleaner-item-switch" type="checkbox">`
        checkedHTML = `<input class="bili-cleaner-item-switch" type="checkbox" checked>`

        // item名称，所属group，功能描述，功能function，功能CSS
        constructor(itemID, groupID, description, itemFunc, itemCSS) {
            this.itemID = itemID
            this.description = description
            this.groupID = groupID
            this.itemFunc = itemFunc
            this.itemCSS = itemCSS
            this.isEnable = null
            this.HTMLElement = null
        }
        getStatus() {
            this.isEnable = GM_getValue(this.itemID)
        }
        setStatus(value) {
            this.isEnable = GM_setValue(this.itemID, value)
        }
        // 在panel的对应group内添加item项目
        insertItem() {
            this.getStatus()
            const e = document.createElement('label')
            e.id = this.itemID
            if (this.isEnable) {
                e.innerHTML = this.checkedHTML + '\t' + this.description
            } else {
                e.innerHTML = this.uncheckedHTML + '\t' + this.description
            }
            const itemGroup = document.querySelector(`#${this.groupID} .bili-cleaner-itemlist`)
            itemGroup.appendChild(e)
        }
        // 监听item check状态
        watchItem() {
            this.HTMLElement = document.getElementById(this.itemID)
            this.HTMLElement.addEventListener('change', (event) => {
                // this指向class, this.checked无效, 使用event.target访问checkbox
                if (event.target.checked) {
                    console.log(this.itemID, 'checked')
                    this.setStatus(true)
                    this.insertItemCSS()
                } else {
                    console.log(this.itemID, 'not checked')
                    this.setStatus(false)
                    this.removeItemCSS()
                }
            })
        }
        // 启用CSS片段
        insertItemCSS() {
            if (this.itemCSS) {
                const style = document.createElement('style')
                style.innerText = this.itemCSS
                // 指定CSS片段ID，用于实时启用停用
                style.setAttribute('bili-cleaner-css-itemID', this.itemID)
                console.log('insertItemCSS')
                console.log(style)
                document.head.appendChild(style)
            }
        }
        // 停用CSS片段
        removeItemCSS() {
            if (this.itemCSS) {
                const style = document.querySelector(`style[bili-cleaner-css-itemID=${this.itemID}]`)
                console.log('removeItemCSS')
                console.log(style)
                if (style) {
                    style.parentNode.removeChild(style)
                }
            }
        }
        // 执行功能（由group调用）
        enableItem() {
            console.log("enableItem")
            console.log(this)
            this.getStatus()
            if (this.isEnable) {
                this.insertItemCSS()
                if (this.itemFunc instanceof Function) {
                    this.itemFunc()
                }
            }
        }
    }

    function addGlobalCSS() {
        const panelCSS = `
        /* panel部分 */
        #bili-cleaner {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 30vw;
            height: 90vh;
            border-radius: 10px;
            overflow: hidden;
            background: rgba(250, 250, 250, 1);
            border: 2px solid rgba(251, 114, 153, 1);
            z-index: 2147483647;
        }
        
        #bili-cleaner-bar {
            width: 30vw;
            height: 6vh;
            background: rgba(251, 114, 153, 1);
            position: relative;
            cursor: move;
            user-select: none;
        }
        
        #bili-cleaner-title {
            width: 30vw;
            height: 6vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
            font-size: 1.5em;
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
        
        /* panel内的group */
        .bili-cleaner-group {
            margin: 10px;
            background: white;
            border-radius: 10px;
            padding: 5px 10px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }
        .bili-cleaner-group hr {
            border: 1px solid #f3f3f3;
        }

        .bili-cleaner-group-title {
            font-size: 1.2em;
            font-weight: bold;
            padding: 2px;
        }
        
        .bili-cleaner-item-list {
            padding: 2px;
        }

        .bili-cleaner-item-list label {
            display: block;
            vertical-align: middle;
        }
        
        /* 每行选项的样式, 按钮和文字 */
        .bili-cleaner-item-switch {
            vertical-align: middle;
            width: 50px;
            height: 27px;
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
        GM_addStyle(panelCSS)
    }

    function createPanel() {
        const panelHTML = `
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
        const p = document.createElement('div')
        p.innerHTML = panelHTML
        document.body.appendChild(p)

        // panel关闭按钮
        function closePanel() {
            const closeBtn = document.getElementById("bili-cleaner-close")
            closeBtn.addEventListener('click', function () {
                p.remove()
            })
        }
        closePanel()

        // 可拖拽panel bar
        const panel = document.getElementById('bili-cleaner')
        const bar = document.getElementById('bili-cleaner-bar')
        let isDragging = false
        let initX, initY, initLeft, initTop

        function onMouseDown(e) {
            isDragging = true
            initX = e.clientX
            initY = e.clientY
            const c = window.getComputedStyle(panel)
            initLeft = parseInt(c.getPropertyValue('left'), 10)
            initTop = parseInt(c.getPropertyValue('top'), 10)
        }
        function onMouseMove(e) {
            if (isDragging) {
                const diffX = e.clientX - initX
                const diffY = e.clientY - initY
                panel.style.left = `${initLeft + diffX}px`
                panel.style.top = `${initTop + diffY}px`
            }
        }
        function onMouseUp() {
            isDragging = false
        }
        bar.addEventListener("mousedown", onMouseDown)
        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    const GROUPS = []

    const homepageItems = []
    const commonItems = []
    const videoItems = []
    const searchItems = []
    const trendsItems = []
    const liveItems = []

    homepageItems.push(
        new Item('hideHomepageSubarea', 'homepage', '隐藏分区', null,
            `.bili-header__channel {
                display: none !important;
            }`)
    )
    commonItems.push(

    )
    GROUPS.push(new Group('common', '通用', 'common', commonItems))
    GROUPS.push(new Group('homepage', '首页', 'homepage', homepageItems))
    GROUPS.push(new Group('common', '播放页', 'common', videoItems))
    GROUPS.push(new Group('common', '搜索页', 'common', searchItems))
    GROUPS.push(new Group('common', '动态页', 'common', trendsItems))
    GROUPS.push(new Group('common', '直播页', 'common', liveItems))

    GROUPS.forEach(e => { e.enableGroup() })

    addGlobalCSS()
    createPanel()
    GROUPS.forEach(e => {
        e.insertGroup()
        e.insertItems()
    })
})();

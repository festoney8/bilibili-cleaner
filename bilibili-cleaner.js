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
        // Group id，描述，启用Group的域名模式，item数组
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
                <div class="bili-cleaner-item-list">
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

        // item id，所属group，功能描述，功能function，功能CSS
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
        // 在相应group内添加item
        insertItem() {
            this.getStatus()
            const e = document.createElement('label')
            e.id = this.itemID
            if (this.isEnable) {
                e.innerHTML = this.checkedHTML + '　' + this.description
            } else {
                e.innerHTML = this.uncheckedHTML + '　' + this.description
            }
            const itemGroup = document.querySelector(`#${this.groupID} .bili-cleaner-item-list`)
            if (itemGroup) {
                itemGroup.appendChild(e)
            }
        }
        // 监听item check状态
        watchItem() {
            this.HTMLElement = document.getElementById(this.itemID)
            this.HTMLElement.addEventListener('change', (event) => {
                // this指向class, this.checked无效, 使用event.target访问checkbox
                if (event.target.checked) {
                    this.setStatus(true)
                    this.insertItemCSS()
                } else {
                    this.setStatus(false)
                    this.removeItemCSS()
                }
            })
        }
        // 启用CSS片段
        insertItemCSS() {
            if (this.itemCSS) {
                // check if CSS exist
                const isExist = document.querySelector(`style[bili-cleaner-css-item=${this.itemID}]`)
                if (isExist) {
                    return
                }

                const style = document.createElement('style')
                style.innerText = this.itemCSS
                // 指定CSS片段ID，用于实时启用停用
                style.setAttribute('bili-cleaner-css-item', this.itemID)
                console.log('insertItemCSS')
                document.head.appendChild(style)
            }
        }
        // 停用CSS片段
        removeItemCSS() {
            if (this.itemCSS) {
                const style = document.querySelector(`style[bili-cleaner-css-item=${this.itemID}]`)
                console.log('removeItemCSS')
                if (style) {
                    style.parentNode.removeChild(style)
                }
            }
        }
        // 执行功能（由group调用）
        enableItem() {
            console.log("enableItem")
            this.getStatus()
            if (this.isEnable) {
                this.insertItemCSS()
                if (this.itemFunc instanceof Function) {
                    console.log(this.isEnable, this.itemFunc)
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

        #bili-cleaner-group-list {
            height: 84vh;
            overflow: auto;
        }

        #bili-cleaner-group-list::-webkit-scrollbar {
            display: none;
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
            border: 1px solid #f3f3f3;
        }

        .bili-cleaner-group-title {
            font-size: 1.25em;
            font-weight: bold;
            padding: 2px;
        }
        
        .bili-cleaner-item-list {
            padding: 2px;
        }

        /* 每行选项的样式, 按钮和文字 */
        .bili-cleaner-item-list label {
            display: block;
            vertical-align: middle;
            margin: 8px 0;
            font-size: 1.2em;
        }
        
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
    // 首页
    const homepageItems = []
    // 通用
    const commonItems = []
    // 播放页
    const videoItems = []
    // 搜索页
    const searchItems = []
    // 动态页
    const trendsItems = []
    // 直播页
    const liveItems = []

    homepageItems.push(
        new Item(
            'hideSubarea',
            'bili-cleaner-homepage',
            '隐藏整个分区栏',
            null,
            `
            .bili-header__channel .channel-icons {
                display: none !important;
            }
            .bili-header__channel .right-channel-container {
                display: none !important;
            }
            .bili-header__channel {
                height: 20px !important;
            }
            `
        )
    )

    homepageItems.push(
        new Item(
            'hideRecommendSwipe',
            'bili-cleaner-homepage',
            '隐藏大图活动轮播',
            null,
            `
            .recommended-swipe {
                display: none;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(n + 8) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 9) {
                display: inherit !important;
            }
            .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 12) {
                display: inherit !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(n + 6) {
                margin-top: 0 !important;
            }
            `
        )
    )

    homepageItems.push(
        new Item(
            'hideStickySubarea',
            'bili-cleaner-homepage',
            '隐藏滚动页面时顶部sticky分区栏',
            null,
            `
            .header-channel {
                display: none;
            }
            `
        )
    )

    homepageItems.push(
        new Item(
            'hideUPInfoIcon',
            'bili-cleaner-homepage',
            '隐藏推荐视频 "已关注" "10万点赞" 小图标',
            null,
            `
            .bili-video-card .bili-video-card__info--icon-text {
                display: none;
            }
            `
        )
    )
    homepageItems.push(
        new Item(
            'hideDanmakuCount',
            'bili-cleaner-homepage',
            '隐藏视频弹幕数显示',
            null,
            `
            .bili-video-card__stats--item:nth-child(2) {
                visibility: hidden;
            }
            `
        )
    )
    homepageItems.push(
        new Item(
            'hideVideoInfoDate',
            'bili-cleaner-homepage',
            '隐藏视频发布日期',
            null,
            `
            .bili-video-card__info--date {
                display: none;
            }
            `
        )
    )
    homepageItems.push(
        new Item(
            'hideAd',
            'bili-cleaner-homepage',
            '隐藏推荐视频中的广告',
            null,
            `
            .feed-card:has(.bili-video-card__info--ad) {
                display: none;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(n + 8) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 9) {
                display: inherit !important;
            }
            .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 12) {
                display: inherit !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(n + 6) {
                margin-top: 0 !important;
            }
            `
        )
    )
    // BV号转AV号
    function bv2av() {
        // algo by mcfx, https://www.zhihu.com/question/381784377/answer/1099438784
        function dec(x) {
            let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            let tr = {};
            for (let i = 0; i < 58; i++) {
                tr[table[i]] = i;
            }
            let s = [11, 10, 3, 8, 4, 6];
            let xor = 177451812;
            let add = 8728348608;
            let r = 0;
            for (let i = 0; i < 6; i++) {
                r += tr[x[s[i]]] * 58 ** i;
            }
            return (r - add) ^ xor;
        }

        if (location.href.includes('bilibili.com/video/BV')) {
            let regex = /bilibili.com\/video\/(BV[0-9a-zA-Z]+)/;
            let match = regex.exec(location.href);
            if (match) {
                let aid = dec(match[1]);
                let newURL = `https://www.bilibili.com/video/av${aid}`;
                if (location.hash.slice(1, 6) === 'reply') {
                    newURL += location.hash;
                }
                history.replaceState(null, null, newURL);
            }
        }
    }

    videoItems.push(
        new Item(
            'videoPageBv2av',
            'bili-cleaner-video',
            'BV号转AV号(需刷新)',
            bv2av,
            null
        )
    )

    // 移除URL中的跟踪参数
    function removeQueryParams() {
        let keysToRemove = ['from_source', 'spm_id_from', 'search_source', 'vd_source', 'unique_k', 'is_story_h5', 'from_spmid',
            'share_plat', 'share_medium', 'share_from', 'share_source', 'share_tag', 'up_id', 'timestamp', 'mid',
            'live_from', 'launch_id', 'session_id'];

        let url = location.href;
        let urlObj = new URL(url);
        let params = new URLSearchParams(urlObj.search);

        keysToRemove.forEach(function (key) {
            params.delete(key);
        });

        urlObj.search = params.toString();
        let newUrl = urlObj.toString();
        if (newUrl !== url) {
            history.replaceState(null, null, newUrl);
        }
    }
    commonItems.push(
        new Item(
            'urlCleaner',
            'bili-cleaner-common',
            'URL参数净化(需刷新)',
            removeQueryParams,
            null
        )
    )


    GROUPS.push(new Group('bili-cleaner-common', '通用', 'common', commonItems))
    GROUPS.push(new Group('bili-cleaner-homepage', '首页', 'homepage', homepageItems))
    GROUPS.push(new Group('bili-cleaner-video', '播放页', 'video', videoItems))
    GROUPS.push(new Group('bili-cleaner-search', '搜索页', 'search', searchItems))
    GROUPS.push(new Group('bili-cleaner-trends', '动态页', 'trends', trendsItems))
    GROUPS.push(new Group('bili-cleaner-live', '直播页', 'live', liveItems))

    GROUPS.forEach(e => { e.enableGroup() })

    addGlobalCSS()
    createPanel()
    GROUPS.forEach(e => {
        e.insertGroup()
        e.insertItems()
    })
    ////////////////////////////////////////////////////////////////////////////////////
    function openSettings() {
        addGlobalCSS()
        createPanel()
        GROUPS.forEach(e => {
            e.insertGroup()
            e.insertItems()
        })
    }
    GM_registerMenuCommand("设置", openSettings);

})();

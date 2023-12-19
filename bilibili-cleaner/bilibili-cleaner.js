// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  净化 B站/哔哩哔哩 页面内的各种元素，去广告，提供300+项自定义功能，深度定制自己的B站页面
// @author       festoney8
// @license      MIT
// @match        *://*.bilibili.com/*
// @exclude      *://message.bilibili.com/pages/nav/header_sync
// @exclude      *://data.bilibili.com/*
// @exclude      *://*.chat.bilibili.com/*
// @exclude      *://cm.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @exclude      *://api.bilibili.com/*
// @exclude      *://api.*.bilibili.com/*
// @icon         *://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict'

    // 计时日志，debug用
    const debugMode = false
    let lastTime = performance.now()
    let startTime = lastTime
    let currTime = lastTime
    function log(...args) {
        if (!debugMode) { return }
        currTime = performance.now()
        console.log(`[bili-cleaner] ${(currTime - lastTime).toFixed(1)} / ${(currTime - startTime).toFixed(1)} ms | ${args.join(' ')}`)
        lastTime = currTime
    }
    function error(...args) {
        if (!debugMode) { return }
        currTime = performance.now()
        console.error(`[bili-cleaner] ${(currTime - lastTime).toFixed(1)} / ${(currTime - startTime).toFixed(1)} ms | ${args.join(' ')}`)
        lastTime = currTime
    }
    function trace() {
        if (!debugMode) { return }
        console.trace('[bili-cleaner]')
    }

    //===================================================================================
    class Group {
        // Group id，描述，item数组
        constructor(groupID, description, items) {
            this.groupID = 'bili-cleaner-group-' + groupID
            this.description = description
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
        // 启用group，启用group内items
        // mustContainsFunc 控制 enableItem 是否跳过纯CSS条目
        enableGroup(mustContainsFunc = false) {
            try {
                this.items.forEach(e => {
                    e.enableItem(mustContainsFunc)
                })
            } catch (err) {
                error(`enableGroup ${this.groupID} err`)
                error(err)
                trace()
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
            this.groupID = 'bili-cleaner-group-' + groupID
            this.itemFunc = itemFunc
            this.itemCSS = itemCSS
            this.isEnable = null
            this.HTMLElement = null
        }
        getStatus() {
            this.isEnable = GM_getValue(`BILICLEANER_${this.itemID}`)
        }
        setStatus(value) {
            this.isEnable = GM_setValue(`BILICLEANER_${this.itemID}`, value)
        }
        // 在相应group内添加item
        insertItem() {
            try {
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
            } catch (err) {
                error(`insertItem ${this.itemID} err`)
                error(err)
                trace()
            }
        }
        // 监听item check状态
        watchItem() {
            try {
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
            } catch (err) {
                error(`watchItem ${this.itemID} err`)
                error(err)
                trace()
            }
        }
        // 启用CSS片段
        insertItemCSS() {
            if (this.itemCSS) {
                // check if CSS exist
                const isExist = document.querySelector(`head style[bili-cleaner-css=${this.itemID}]`)
                if (isExist) {
                    return
                }

                const style = document.createElement('style')
                // 不设置innerText, 否则多行CSS插入head后会产生<br>标签
                style.innerHTML = this.itemCSS
                // 指定CSS片段ID，用于实时启用停用
                style.setAttribute('bili-cleaner-css', this.itemID)
                document.head.appendChild(style)

                log(`insertCSS ${this.itemID} OK`)
            }
        }
        // 停用CSS片段
        removeItemCSS() {
            if (this.itemCSS) {
                const style = document.querySelector(`head style[bili-cleaner-css=${this.itemID}]`)
                if (style) {
                    style.parentNode.removeChild(style)
                    log(`removeCSS ${this.itemID} OK`)
                }
            }
        }
        // 执行功能（由group调用）
        // mustContainsFunc用于非刷新但URL变动情况, 此时已注入CSS, 只重新运行func
        enableItem(mustContainsFunc = false) {
            this.getStatus()
            if (this.isEnable) {
                if (mustContainsFunc && !this.itemFunc) {
                    return
                }
                try {
                    this.insertItemCSS()
                    if (this.itemFunc instanceof Function) {
                        this.itemFunc()
                    }
                } catch (err) {
                    error(`enableItem ${this.itemID} Error`)
                    error(err)
                    trace()
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
        /* 每行选项的样式, 按钮和文字 */
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
            margin: 0;
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
        const closeBtn = document.getElementById("bili-cleaner-close")
        closeBtn.addEventListener('click', () => {
            p.remove()
        })

        // 可拖拽panel bar
        const panel = document.getElementById('bili-cleaner')
        const bar = document.getElementById('bili-cleaner-bar')
        let isDragging = false
        let initX, initY, initLeft, initTop

        bar.addEventListener("mousedown", (e) => {
            isDragging = true
            initX = e.clientX
            initY = e.clientY
            const c = window.getComputedStyle(panel)
            initLeft = parseInt(c.getPropertyValue('left'), 10)
            initTop = parseInt(c.getPropertyValue('top'), 10)
        })
        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const diffX = e.clientX - initX
                const diffY = e.clientY - initY
                panel.style.left = `${initLeft + diffX}px`
                panel.style.top = `${initTop + diffY}px`
            }
        })
        document.addEventListener("mouseup", () => {
            isDragging = false
        })
    }

    // BV号转AV号
    function bv2av() {
        // algo by mcfx, https://www.zhihu.com/question/381784377/answer/1099438784
        function dec(x) {
            let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
            let tr = {}
            for (let i = 0; i < 58; i++) {
                tr[table[i]] = i
            }
            let s = [11, 10, 3, 8, 4, 6]
            let xor = 177451812
            let add = 8728348608
            let r = 0
            for (let i = 0; i < 6; i++) {
                r += tr[x[s[i]]] * 58 ** i
            }
            return (r - add) ^ xor
        }

        if (location.href.includes('bilibili.com/video/BV')) {
            const regex = /bilibili.com\/video\/(BV[0-9a-zA-Z]+)/
            const match = regex.exec(location.href)
            if (match) {
                // query string中分P参数, anchor中reply定位
                let partNum = ''
                const params = new URLSearchParams(location.search)
                if (params.has('p')) {
                    partNum += `?p=${params.get('p')}`
                }
                const aid = dec(match[1])
                const newURL = `https://www.bilibili.com/video/av${aid}${partNum}${location.hash}`
                history.replaceState(null, null, newURL)
                log('bv2av complete')
            }
        }
    }

    // 重写分享按钮功能
    let isSimpleShareBtn = false
    function simpleShare() {
        if (isSimpleShareBtn) {
            return
        }
        // 监听shareBtn出现
        let shareBtn
        let counter = 0
        const checkElement = setInterval(() => {
            counter++
            shareBtn = document.getElementById('share-btn-outer')
            if (shareBtn) {
                isSimpleShareBtn = true
                clearInterval(checkElement)
                // 新增click事件
                // 若replace element, 会在切换视频后无法更新视频分享数量, 故直接新增click事件覆盖剪贴板
                shareBtn.addEventListener('click', () => {
                    const title = document.querySelector("#viewbox_report > h1")?.textContent
                    let pName = location.pathname
                    if (pName.endsWith('/')) {
                        pName = pName.slice(0, -1)
                    }
                    let urlObj = new URL(location.href)
                    let params = new URLSearchParams(urlObj.search)
                    let shareText = `${title} \nhttps://www.bilibili.com${pName}`
                    if (params.has('p')) {
                        shareText += `?p=${params.get('p')}`
                    }
                    navigator.clipboard.writeText(shareText)
                })
                log('simpleShare complete')
            } else if (counter > 50) {
                clearInterval(checkElement)
                log('simpleShare timeout')
            }
        }, 200)
    }

    // 重写版权视频页分享按钮功能
    let isBangumiSimpleShareBtn = false
    function bangumiSimpleShare() {
        if (isBangumiSimpleShareBtn) {
            return
        }
        // 监听shareBtn出现
        let shareBtn
        let counter = 0
        const checkElement = setInterval(() => {
            counter++
            shareBtn = document.getElementById('share-container-id')
            if (shareBtn) {
                isBangumiSimpleShareBtn = true
                clearInterval(checkElement)
                // 新增click事件
                shareBtn.addEventListener('click', () => {
                    const mainTitle = document.querySelector("[class^='mediainfo_mediaTitle']")?.textContent
                    const subTitle = document.getElementById('player-title')?.textContent
                    let shareText = `《${mainTitle}》${subTitle} \nhttps://www.bilibili.com${location.pathname}`
                    navigator.clipboard.writeText(shareText)
                })
                log('bangumiSimpleShare complete')
            } else if (counter > 50) {
                clearInterval(checkElement)
                log('bangumiSimpleShare timeout')
            }
        }, 200)
    }

    // URL净化，移除query string中的跟踪参数/无用参数
    function cleanURL() {
        let keysToRemove = new Set(['from_source', 'spm_id_from', 'search_source', 'vd_source', 'unique_k', 'is_story_h5', 'from_spmid',
            'share_plat', 'share_medium', 'share_from', 'share_source', 'share_tag', 'up_id', 'timestamp', 'mid',
            'live_from', 'launch_id', 'session_id', 'share_session_id', 'broadcast_type', 'is_room_feed',
            'spmid', 'plat_id', 'goto', 'report_flow_data', 'trackid', 'live_form', 'track_id', 'from', 'visit_id'])

        let url = location.href
        let urlObj = new URL(url)
        let params = new URLSearchParams(urlObj.search)

        let temp = []
        for (let k of params.keys()) {
            if (keysToRemove.has(k)) {
                temp.push(k)
            }
        }
        for (let k of temp) {
            params.delete(k)
        }
        if (params.has('p') && params.get('p') == '1') {
            params.delete('p')
        }

        urlObj.search = params.toString()
        let newURL = urlObj.toString()
        if (newURL.endsWith('/')) {
            newURL = newURL.slice(0, -1)
        }
        if (newURL !== url) {
            history.replaceState(null, null, newURL)
        }
        log('cleanURL complete')
    }

    //===================================================================================
    log('main process start')

    const GROUPS = []
    // 首页
    const homepageItems = []
    // 通用
    const commonItems = []
    // 普通播放页
    const videoItems = []
    // 版权视频播放页
    const bangumiItems = []
    // 搜索页
    const searchItems = []
    // 动态页
    const dynamicItems = []
    // 直播页
    const liveItems = []

    const host = location.host
    const url = location.href
    const pathname = location.pathname

    if (url.startsWith('https://www.bilibili.com/') && ['/index.html', '/'].includes(pathname)) {
        // 页面直角化
        homepageItems.push(new Item(
            'homepage-border-radius', 'homepage', '页面直角化 去除圆角', null,
            `
            #nav-searchform,
            .nav-search-content,
            .history-item,
            .header-upload-entry,
            .bili-header .search-panel,
            .bili-header__channel .channel-link,
            .channel-entry-more__link,
            .header-channel-fixed-right-item,
            .recommended-swipe-body,
            .bili-video-card .bili-video-card__cover,
            .bili-video-card .bili-video-card__image,
            .bili-video-card .bili-video-card__info--icon-text,
            .bili-live-card,
            .floor-card,
            .floor-card .badge,
            .single-card.floor-card .floor-card-inner,
            .single-card.floor-card .cover-container,
            .primary-btn,
            .flexible-roll-btn,
            .palette-button-wrap .flexible-roll-btn-inner,
            .palette-button-wrap .storage-box,
            .palette-button-wrap,
            .v-popover-content
             {
                border-radius: 3px !important;
            }
            .bili-video-card__stats {
                border-bottom-left-radius: 3px !important;
                border-bottom-right-radius: 3px !important;
            }
            .floor-card .layer {
                display: none !important;
            }
            .single-card.floor-card {
                border: none !important;
            }
            `
        ))
        // 首页CSS
        homepageItems.push(new Item(
            'homepage-hide-banner', 'homepage', '隐藏 横幅banner', null,
            `
            .header-banner__inner, .bili-header__banner {
                display: none !important;
            }
            .bili-header .bili-header__bar:not(.slide-down) {
                position: relative !important;
                box-shadow: 0 2px 4px #00000014;
            }
            .bili-header__channel {
                margin-top: 5px !important;
            }
            /* icon和文字颜色 */
            .bili-header .right-entry__outside .right-entry-icon {
                color: #18191c !important;
            }
            .bili-header .left-entry .entry-title, .bili-header .left-entry .download-entry, .bili-header .left-entry .default-entry, .bili-header .left-entry .loc-entry {
                color: #18191c !important;
            }
            .bili-header .left-entry .entry-title .zhuzhan-icon {
                color: #00aeec !important;
            }
            .bili-header .right-entry__outside .right-entry-text {
                color: #61666d !important;
            }`
        ))
        homepageItems.push(new Item(
            'homepage-hide-recommend-swipe', 'homepage', '隐藏 大图活动轮播', null,
            `
            .recommended-swipe {
                display: none !important;
            }
            /* 布局调整 */
            .recommended-container_floor-aside .container>*:nth-of-type(5) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(6) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(7) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(n + 8) {
                margin-top: 0 !important;
            }
            /* 完全展示10个推荐项 */
            .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 9) {
                display: inherit !important;
            }
            .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 12) {
                display: inherit !important;
            }
            .recommended-container_floor-aside .container .floor-single-card:first-of-type {
                margin-top: 0 !important;
            }
            `
        ))
        homepageItems.push(new Item(
            'homepage-hide-subarea', 'homepage', '隐藏 整个分区栏', null,
            `
            .bili-header__channel .channel-icons {
                display: none !important;
            }
            .bili-header__channel .right-channel-container {
                display: none !important;
            }
            /* adapt bilibili-app-recommend */
            .bili-header__channel {
                height: 0 !important;
            }
            main.bili-feed4-layout:not(:has(.bilibili-app-recommend-root)) {
                margin-top: 20px !important;
            }
            `
        ))
        homepageItems.push(new Item(
            'homepage-hide-sticky-header', 'homepage', '隐藏 滚动页面时 顶部吸附顶栏', null,
            `
            .bili-header .left-entry__title svg {
                display: none !important;
            }
            /* 高优先覆盖!important */
            #i_cecream .bili-feed4 .bili-header .slide-down {
                box-shadow: unset !important;
            }
            #nav-searchform.is-actived:before,
            #nav-searchform.is-exper:before,
            #nav-searchform.is-exper:hover:before,
            #nav-searchform.is-focus:before,
            .bili-header .slide-down {
                background: unset !important;
            }
            .bili-header .slide-down {
                position: absolute !important;
                top: 0;
                animation: unset !important;
                box-shadow: unset !important;
            }
            .bili-header .slide-down .left-entry {
                margin-right: 30px !important;
            }
            .bili-header .slide-down .left-entry .default-entry,
            .bili-header .slide-down .left-entry .download-entry,
            .bili-header .slide-down .left-entry .entry-title,
            .bili-header .slide-down .left-entry .entry-title .zhuzhan-icon,
            .bili-header .slide-down .left-entry .loc-entry,
            .bili-header .slide-down .left-entry .loc-mc-box__text,
            .bili-header .slide-down .left-entry .mini-header__title,
            .bili-header .slide-down .right-entry .right-entry__outside .right-entry-icon,
            .bili-header .slide-down .right-entry .right-entry__outside .right-entry-text {
                color: #fff !important;
            }
            .bili-header .slide-down .download-entry,
            .bili-header .slide-down .loc-entry {
                display: unset !important;
            }
            .bili-header .slide-down .center-search-container,
            .bili-header .slide-down .center-search-container .center-search__bar {
                margin: 0 auto !important;
            }
            #nav-searchform {
                background: #f1f2f3 !important;
            }
            #nav-searchform:hover {
                background-color: var(--bg1) !important;
                opacity: 1
            }
            #nav-searchform.is-focus {
                border: 1px solid var(--line_regular) !important;
                border-bottom: none !important;
                background: var(--bg1) !important;
            }
            #nav-searchform.is-actived.is-exper4-actived,
            #nav-searchform.is-focus.is-exper4-actived {
                border-bottom: unset !important;
            }
            /* 只隐藏吸附header时的吸附分区栏 */
            #i_cecream .header-channel {
                top: 0 !important;
            }
            /* adapt bilibili-app-recommend */
            .bilibili-app-recommend-root .area-header {top: 0 !important;}
            `
        ))
        homepageItems.push(new Item(
            'homepage-hide-sticky-subarea', 'homepage', '隐藏 滚动页面时 顶部吸附分区栏', null,
            `#i_cecream .header-channel {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-up-info-icon', 'homepage', '隐藏 视频tag (已关注/1万点赞)', null,
            `
            /* CSS伪造Logo */
            .bili-video-card .bili-video-card__info--icon-text {
                width: 17px;
                height: 17px;
                color: transparent !important;
                background-color: unset !important;
                border-radius: unset !important;
                margin: 0 2px 0 0 !important;
                font-size: unset !important;
                line-height: unset !important;
                padding: unset !important;
                user-select: none !important;
            }
            .bili-video-card .bili-video-card__info--icon-text::before {
                content: "";
                display: inline-block;
                width: 100%;
                height: 100%;
                background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="bili-video-card__info--owner__up"><!--[--><path d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z" fill="rgb(148, 153, 160)"></path><path d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z" fill="rgb(148, 153, 160)"></path><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="rgb(148, 153, 160)"></path><!--]--></svg>');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
            `
        ))
        homepageItems.push(new Item(
            'homepage-hide-danmaku-count', 'homepage', '隐藏 弹幕数', null,
            `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__stats--item:nth-child(2) {visibility: hidden;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-video-info-date', 'homepage', '隐藏 发布时间', null,
            `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__info--date {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-bili-watch-later', 'homepage', '隐藏 稍后再看按钮', null,
            `.bili-watch-later {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-ad-card', 'homepage', '隐藏 推荐视频中的广告', null,
            `
            .feed-card:has(.bili-video-card__info--ad, [href*="cm.bilibili.com"]) {
                display: none !important;
            }
            .bili-video-card.is-rcmd:has(.bili-video-card__info--ad, [href*="cm.bilibili.com"]) {
                display: none !important;
            }

            /* 布局调整 */
            .recommended-container_floor-aside .container>*:nth-of-type(5) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(6) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(7) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(n + 8) {
                margin-top: 0 !important;
            }
            /* 完全展示10个推荐项 */
            .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 9) {
                display: inherit !important;
            }
            .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
                margin-top: 0 !important;
            }
            .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 12) {
                display: inherit !important;
            }
            .recommended-container_floor-aside .container .floor-single-card:first-of-type {
                margin-top: 0 !important;
            }
            `
        ))
        homepageItems.push(new Item(
            'homepage-hide-live-card-recommend', 'homepage', '隐藏 直播间推荐', null,
            `.bili-live-card.is-rcmd {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-sub-area-card-recommend', 'homepage', '隐藏 分区视频推荐', null,
            `.floor-single-card {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-flexible-roll-btn', 'homepage', '隐藏 右下角-刷新', null,
            `.palette-button-wrap .flexible-roll-btn {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-feedback', 'homepage', '隐藏 右下角-客服和反馈', null,
            `.palette-button-wrap .storage-box {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-top-btn', 'homepage', '隐藏 右下角-回顶部', null,
            `.palette-button-wrap .top-btn-wrap {display: none !important;}`
        ))

        // 适配bilibili-app-recommend插件
        homepageItems.push(new Item(
            'homepage-hide-up-info-icon-bilibili-app-recommend', 'homepage', '隐藏 视频tag (bilibili-app-recommend)', null,
            `
            /* adapt bilibili-app-recommend */
            .bilibili-app-recommend-root .bili-video-card:not(:has(.ant-avatar)) .bili-video-card__info--owner>span[class^="_recommend-reason"] {
                width: 17px;
                height: 17px;
                color: transparent !important;
                background-color: unset !important;
                border-radius: unset !important;
                margin: 0 2px 0 0 !important;
                font-size: unset !important;
                line-height: unset !important;
                padding: unset !important;
                user-select: none !important;
            }
            .bilibili-app-recommend-root .bili-video-card:not(:has(.ant-avatar)) .bili-video-card__info--owner>span[class^="_recommend-reason"]::before {
                content: "";
                display: inline-block;
                width: 100%;
                height: 100%;
                background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="bili-video-card__info--owner__up"><!--[--><path d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z" fill="rgb(148, 153, 160)"></path><path d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z" fill="rgb(148, 153, 160)"></path><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="rgb(148, 153, 160)"></path><!--]--></svg>');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
            .bilibili-app-recommend-root .bili-video-card:has(.ant-avatar) [class^="_recommend-reason"] {
                display: none !important;
            }
            `
        ))
        homepageItems.push(new Item(
            'homepage-hide-danmaku-count-bilibili-app-recommend', 'homepage', '隐藏 弹幕数 (bilibili-app-recommend)', null,
            `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-video-danmaku"]) {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-agree-count-bilibili-app-recommend', 'homepage', '隐藏 点赞数 (bilibili-app-recommend)', null,
            `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-agree"]) {display: none !important;}`
        ))
    }
    else if (url.startsWith('https://www.bilibili.com/video/')) {
        // BV号转AV号
        videoItems.push(new Item(
            'video-page-bv2av', 'video', 'BV号转AV号 (需刷新)', bv2av, null
        ))
        // 净化分享
        videoItems.push(new Item(
            'video-page-simple-share', 'video', '净化分享功能 (需刷新)', simpleShare,
            `.video-share-popover .video-share-dropdown .dropdown-bottom {display: none !important;}
            .video-share-popover .video-share-dropdown .dropdown-top {padding: 15px !important;}
            .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-right {display: none !important;}
            .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-left {padding-right: 0 !important;}`
        ))
        // 去除圆角
        videoItems.push(new Item(
            'video-page-border-radius', 'video', '页面直角化 去除圆角', null,
            `
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover,
            .pic-box,
            .card-box .pic-box .pic,
            .bui-collapse-header,
            .base-video-sections-v1,
            .bili-header .search-panel,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,
            .video-tag-container .tag-panel .tag-link,
            .video-tag-container .tag-panel .show-more-btn,
            .vcd .cover img,
            .vcd *,
            .upinfo-btn-panel *,
            .fixed-sidenav-storage div,
            .reply-box-textarea,
            .reply-box-send,
            .reply-box-send:after {
                border-radius: 3px !important;
            }
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap {
                border-radius: 0 3px 3px 0 !important;
            }
            .bpx-player-dm-btn-send .bui-button {
                border-radius: 3px 0 0 3px !important;
            }
            `
        ))
        // header
        videoItems.push(new Item(
            'video-page-hide-fixed-header', 'video', '顶栏 滚动页面后不再吸附顶部', null,
            `.fixed-header .bili-header__bar {position: relative !important;}`
        ))
        // 视频信息
        videoItems.push(new Item(
            'video-page-hide-video-info-danmaku-count', 'video', '隐藏 视频信息-弹幕数', null,
            `.video-info-detail .dm {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-video-info-pubdate', 'video', '隐藏 视频信息-发布日期', null,
            `.video-info-detail .pubdate-ip {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-video-info-copyright', 'video', '隐藏 视频信息-版权声明', null,
            `.video-info-detail .copyright {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-video-info-honor', 'video', '隐藏 视频信息-视频荣誉(排行榜/每周必看)', null,
            `.video-info-detail .honor-rank, .video-info-detail .honor-weekly {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-video-info-argue', 'video', '隐藏 视频信息-温馨提示(饮酒/危险/AI生成)', null,
            `.video-info-detail .argue, .video-info-detail .video-argue {display: none !important;}`
        ))
        // 播放器相关
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-guide-all', 'video', '隐藏 播放器-视频内 一键三连窗口', null,
            `.bpx-player-video-area .bili-guide, .bpx-player-video-area .bili-guide-all {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-vote', 'video', '隐藏 播放器-视频内 投票', null,
            `.bpx-player-video-area .bili-vote, .bpx-player-video-area .bili-cmd-shrink {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-score', 'video', '隐藏 播放器-视频内 评分', null,
            `.bpx-player-video-area .bili-score {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-reserve', 'video', '隐藏 播放器-视频内 视频预告', null,
            `.bpx-player-video-area .bili-reserve {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-link', 'video', '隐藏 播放器-视频内 视频链接', null,
            `.bpx-player-video-area .bili-link {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-top-issue', 'video', '隐藏 播放器-右上角 反馈按钮', null,
            `.bpx-player-top-issue {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-top-left-title', 'video', '隐藏 播放器-左上角 播放器内标题', null,
            `.bpx-player-top-left-title {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-top-left-music', 'video', '隐藏 播放器-左上角 视频音乐链接', null,
            `.bpx-player-top-left-music {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-top-left-follow', 'video', '隐藏 播放器-左上角 关注UP主', null,
            `.bpx-player-top-left-follow {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-state-wrap', 'video', '隐藏 播放器-视频暂停时大Logo', null,
            `.bpx-player-state-wrap {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dialog-wrap', 'video', '隐藏 播放器-弹幕悬停点赞/复制/举报', null,
            `.bpx-player-dialog-wrap {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-prev', 'video', '隐藏 播放控制-上一个视频', null,
            `.bpx-player-ctrl-prev {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-play', 'video', '隐藏 播放控制-播放/暂停', null,
            `.bpx-player-ctrl-play {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-next', 'video', '隐藏 播放控制-下一个视频', null,
            `.bpx-player-ctrl-next {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-viewpoint', 'video', '隐藏 播放控制-章节列表', null,
            `.bpx-player-ctrl-viewpoint {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-pip', 'video', '隐藏 播放控制-画中画', null,
            `.bpx-player-ctrl-pip {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-eplist', 'video', '隐藏 播放控制-选集', null,
            `.bpx-player-ctrl-eplist {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-wide', 'video', '隐藏 播放控制-宽屏', null,
            `.bpx-player-ctrl-wide {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-volume', 'video', '隐藏 播放控制-音量', null,
            `.bpx-player-ctrl-volume {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-subtitle', 'video', '隐藏 播放控制-字幕', null,
            `.bpx-player-ctrl-subtitle {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-playbackrate', 'video', '隐藏 播放控制-倍速', null,
            `.bpx-player-ctrl-playbackrate {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-setting', 'video', '隐藏 播放控制-视频设置', null,
            `.bpx-player-ctrl-setting {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-shadow-progress-area', 'video', '隐藏 播放控制-底边mini视频进度', null,
            `.bpx-player-shadow-progress-area {display: none !important;}`
        ))
        // 弹幕栏
        videoItems.push(new Item(
            'video-page-hide-bpx-player-video-info-online', 'video', '隐藏 弹幕栏-同时在看人数', null,
            `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-video-info-dm', 'video', '隐藏 弹幕栏-载入弹幕数量', null,
            `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-switch', 'video', '隐藏 弹幕栏-弹幕启用', null,
            `.bpx-player-dm-switch {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-setting', 'video', '隐藏 弹幕栏-弹幕显示设置', null,
            `.bpx-player-dm-setting {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-video-btn-dm', 'video', '隐藏 弹幕栏-弹幕样式', null,
            `.bpx-player-video-btn-dm {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-input', 'video', '隐藏 弹幕栏-占位文字', null,
            `.bpx-player-dm-input::placeholder {color: transparent !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-hint', 'video', '隐藏 弹幕栏-弹幕礼仪', null,
            `.bpx-player-dm-hint {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-btn-send', 'video', '隐藏 弹幕栏-发送按钮', null,
            `.bpx-player-dm-btn-send {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-postpanel', 'video', '隐藏 弹幕栏-智能弹幕/广告弹幕', null,
            `.bpx-player-postpanel-sug,
            .bpx-player-postpanel-carousel,
            .bpx-player-postpanel-popup {
                color: transparent !important;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-sending-area', 'video', '隐藏 弹幕栏-关闭整个弹幕栏', null,
            `.bpx-player-sending-area {display: none !important;}`
        ))
        // 视频下信息
        videoItems.push(new Item(
            'video-page-hide-video-share-popover', 'video', '隐藏 视频下方-分享按钮弹出菜单', null,
            `.video-share-popover {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-video-ai-assistant', 'video', '隐藏 视频下方-官方AI总结', null,
            `.video-toolbar-right .video-ai-assistant {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-video-note', 'video', '隐藏 视频下方-记笔记', null,
            `.video-toolbar-right .video-note {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-video-report-menu', 'video', '隐藏 视频下方-举报/笔记/稍后再看', null,
            `.video-toolbar-right .video-tool-more {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-desc', 'video', '隐藏 视频下方-视频简介', null,
            `#v_desc {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-tag', 'video', '隐藏 视频下方-tag列表', null,
            `#v_tag {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-activity-vote', 'video', '隐藏 视频下方-活动宣传', null,
            `#activity_vote {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-bannerAd', 'video', '隐藏 视频下方-广告banner', null,
            `#bannerAd {display: none !important;}`
        ))
        // 评论区相关
        videoItems.push(new Item(
            'video-page-hide-reply-notice', 'video', '隐藏 评论区-活动/notice', null,
            `#comment .reply-header .reply-notice {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-main-reply-box', 'video', '隐藏 评论区-整个评论框', null,
            // 不可使用display: none, 会使底部吸附评论框宽度变化
            `#comment .main-reply-box {height: 0 !important; visibility: hidden !important;}
            #comment .reply-list {margin-top: -20px !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-fixed-reply-box', 'video', '隐藏 评论区-页面底部 吸附评论框', null,
            `#comment .fixed-reply-box {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-reply-box-textarea-placeholder', 'video', '隐藏 评论区-评论编辑器内占位文字', null,
            `.main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
            .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-reply-decorate', 'video', '隐藏 评论区-评论内容右侧装饰', null,
            `#comment .reply-decorate {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-fan-badge', 'video', '隐藏 评论区-ID后粉丝牌', null,
            `#comment .fan-badge {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-user-level', 'video', '隐藏 评论区-一级评论用户等级', null,
            `#comment .user-level {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-sub-user-level', 'video', '隐藏 评论区-二级评论用户等级', null,
            `#comment .sub-user-level {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bili-avatar-pendent-dom', 'video', '隐藏 评论区-用户头像外圈饰品', null,
            `#comment .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            #comment .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bili-avatar-nft-icon', 'video', '隐藏 评论区-用户头像右下小icon', null,
            `#comment .bili-avatar-nft-icon {display: none !important;}
            #comment .bili-avatar-icon {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-reply-tag-list', 'video', '隐藏 评论区-评论内容下tag(UP觉得很赞)', null,
            `#comment .reply-tag-list {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-note-prefix', 'video', '隐藏 评论区-笔记评论前的小Logo', null,
            `#comment .note-prefix {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-jump-link-search-word', 'video', '隐藏 评论区-评论内容搜索关键词高亮', null,
            `#comment .reply-content .jump-link.search-word {color: inherit !important;}
            #comment .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
            #comment .reply-content .icon.search-word {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-reply-content-user-highlight', 'video', '隐藏 评论区-二级评论中的@高亮', null,
            `#comment .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
            #comment .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-at-reply-at-bots', 'video', '隐藏 评论区-召唤AI机器人的评论', null,
            // 8455326 @机器工具人
            // 234978716 @有趣的程序员
            // 1141159409 @AI视频小助理
            // 437175450 @AI视频小助理总结一下 (误伤)
            // 1692825065 @AI笔记侠
            // 690155730 @AI视频助手
            // 689670224 @哔哩哔理点赞姬
            // 3494380876859618 @课代表猫
            // 1168527940 @AI课代表呀
            // 439438614 @木几萌Moe
            // 1358327273 @星崽丨StarZai
            // 3546376048741135 @AI沈阳美食家
            // 1835753760 @AI识片酱
            `.reply-item:has(.jump-link.user[data-user-id="8455326"]),
            .reply-item:has(.jump-link.user[data-user-id="234978716"]),
            .reply-item:has(.jump-link.user[data-user-id="1141159409"]),
            .reply-item:has(.jump-link.user[data-user-id="437175450"]),
            .reply-item:has(.jump-link.user[data-user-id="1692825065"]),
            .reply-item:has(.jump-link.user[data-user-id="690155730"]),
            .reply-item:has(.jump-link.user[data-user-id="689670224"]),
            .reply-item:has(.jump-link.user[data-user-id="3494380876859618"]),
            .reply-item:has(.jump-link.user[data-user-id="1168527940"]),
            .reply-item:has(.jump-link.user[data-user-id="439438614"]),
            .reply-item:has(.jump-link.user[data-user-id="1358327273"]),
            .reply-item:has(.jump-link.user[data-user-id="3546376048741135"]),
            .reply-item:has(.jump-link.user[data-user-id="1835753760"]) {
                display: none !important;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-zero-like-at-reply', 'video', '隐藏 评论区-包含@的 无人点赞评论', null,
            `#comment .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-at-reply-all', 'video', '隐藏 评论区-包含@的 全部评论', null,
            `#comment .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-zero-like-lv1-reply', 'video', '隐藏 评论区-LV1 无人点赞评论', null,
            `#comment .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-zero-like-lv2-reply', 'video', '隐藏 评论区-LV2 无人点赞评论', null,
            `#comment .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-zero-like-lv3-reply', 'video', '隐藏 评论区-LV3 无人点赞评论', null,
            `#comment .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-root-reply-dislike-reply-btn', 'video', '隐藏 一级评论 踩/回复/举报 hover时显示', null,
            `#comment .reply-info:not(:has(i.disliked)) .reply-btn,
            #comment .reply-info:not(:has(i.disliked)) .reply-dislike {
                visibility: hidden;
            }
            #comment .reply-item:hover .reply-btn,
            #comment .reply-item:hover .reply-dislike {
                visibility: visible !important;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-sub-reply-dislike-reply-btn', 'video', '隐藏 二级评论 踩/回复/举报 hover时显示', null,
            `#comment .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
            #comment .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                visibility: hidden;
            }
            #comment .sub-reply-item:hover .sub-reply-btn,
            #comment .sub-reply-item:hover .sub-reply-dislike {
                visibility: visible !important;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-emoji-large', 'video', '隐藏 评论区-大表情', null,
            `#comment .emoji-large {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-emoji-large-zoom', 'video', '评论区-大表情变成小表情', null,
            `#comment .emoji-large {zoom: .5;}`
        ))
        videoItems.push(new Item(
            'video-page-reply-user-name-color-pink', 'video', '评论区-用户名 全部大会员色', null,
            `#comment .reply-item .user-name, #comment .reply-item .sub-user-name {color: #FB7299 !important;}}`
        ))
        videoItems.push(new Item(
            'video-page-reply-user-name-color-default', 'video', '评论区-用户名 全部恢复默认色', null,
            `#comment .reply-item .user-name, #comment .reply-item .sub-user-name {color: #61666d !important;}}`
        ))
        // up主信息
        videoItems.push(new Item(
            'video-page-hide-up-sendmsg', 'video', '隐藏 右栏-给UP发消息', null,
            `.up-detail .send-msg {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-up-description', 'video', '隐藏 右栏-UP简介', null,
            `.up-detail .up-description {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-up-charge', 'video', '隐藏 右栏-充电', null,
            `.upinfo-btn-panel .new-charge-btn, .upinfo-btn-panel .old-charge-btn {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-up-bili-avatar-pendent-dom', 'video', '隐藏 右栏-UP主头像外饰品', null,
            `.up-info-container .bili-avatar-pendent-dom {display: none !important;}
            .up-avatar-wrap .up-avatar {background-color: transparent !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-up-membersinfo-normal-header', 'video', '隐藏 右栏-创作团队header', null,
            `.membersinfo-normal .header {display: none !important;}`
        ))
        // 视频右侧
        videoItems.push(new Item(
            'video-page-hide-right-container-ad', 'video', '隐藏 右栏-广告', null,
            `#slide_ad {display: none !important;}
            .ad-report.video-card-ad-small {display: none !important;}
            .video-page-special-card-small {display: none !important;}
            #reco_list {margin-top: 0 !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-video-page-game-card-small', 'video', '隐藏 右栏-游戏推荐', null,
            `#reco_list .video-page-game-card-small {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-danmaku', 'video', '隐藏 右栏-弹幕列表', null,
            `
            /* 不可使用 display:none 否则播放器宽屏模式下danmukuBox的margin-top失效，导致视频覆盖右侧列表 */
            #danmukuBox {
                visibility: hidden !important;
                height: 0 !important;
                margin-bottom: 0 !important;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-height', 'video', '右栏 视频合集 增加列表高度', null,
            `.base-video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important};
            .video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important};`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-next-btn', 'video', '隐藏 右栏-视频合集 自动连播', null,
            `.base-video-sections-v1 .next-button {display: none !important;}
            .video-sections-head_first-line .next-button {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-play-num', 'video', '隐藏 右栏-视频合集 播放量', null,
            `.base-video-sections-v1 .play-num {display: none !important;}
            .video-sections-head_second-line .play-num {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-abstract', 'video', '隐藏 右栏-视频合集 简介', null,
            `.base-video-sections-v1 .abstract {display: none !important;}
            .base-video-sections-v1 .second-line_left img {display: none !important;}
            .video-sections-head_second-line .abstract {display: none !important;}
            .video-sections-head_second-line .second-line_left img {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-subscribe', 'video', '隐藏 右栏-视频合集 订阅合集', null,
            `.base-video-sections-v1 .second-line_right {display: none !important;}
            .video-sections-head_second-line .second-line_right {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-multi-page-next-btn', 'video', '隐藏 右栏-视频选集(分P) 自动连播', null,
            `#multi_page .next-button {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-next-play-next-button', 'video', '隐藏 右栏-自动连播按钮', null,
            `#reco_list .next-play .next-button {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-rec-list', 'video', '隐藏 右栏-全部相关视频', null,
            `#reco_list .rec-list {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-watch-later-video', 'video', '隐藏 右栏-相关视频 稍后再看按钮', null,
            `#reco_list .watch-later-video {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-rec-list-info-up', 'video', '隐藏 右栏-相关视频 UP主', null,
            `#reco_list .rec-list .info .upname {
                display: none !important;
            }
            #reco_list .rec-list .info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-rec-list-info-plays', 'video', '隐藏 右栏-相关视频 播放和弹幕', null,
            `#reco_list .rec-list .info .playinfo {
                display: none !important;
            }
            #reco_list .rec-list .info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-duration', 'video', '隐藏 右栏-视频时长', null,
            `#reco_list .duration {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-right-bottom-banner', 'video', '隐藏 右栏-活动banner', null,
            `#right-bottom-banner {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-live', 'video', '隐藏 右栏-直播间推荐', null,
            `.right-container .pop-live-small-mode {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-sidenav-right-container-live', 'video', '隐藏 右下角-小窗播放器', null,
            `.fixed-sidenav-storage .mini-player-window {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-sidenav-customer-service', 'video', '隐藏 右下角-客服', null,
            `.fixed-sidenav-storage .customer-service {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-sidenav-back-to-top', 'video', '隐藏 右下角-回顶部', null,
            `.fixed-sidenav-storage .back-to-top {display: none !important;}`
        ))
    }
    // 版权视频播放页
    // 尽可能与普通播放页共用itemID, 实现开关状态同步
    // 与普通播放页不同的项目使用独立ID
    else if (url.startsWith('https://www.bilibili.com/bangumi/play/')) {
        // 净化分享
        bangumiItems.push(new Item(
            'video-page-simple-share', 'bangumi', '净化分享功能 (需刷新)', bangumiSimpleShare,
            `#share-container-id [class^='Share_boxBottom'] {display: none !important;}
            #share-container-id [class^='Share_boxTop'] {padding: 15px !important;}
            #share-container-id [class^='Share_boxTopRight'] {display: none !important;}
            #share-container-id [class^='Share_boxTopLeft'] {padding: 0 !important;}`
        ))
        // header吸附
        bangumiItems.push(new Item(
            'video-page-hide-fixed-header', 'bangumi', '顶栏 滚动页面后不再吸附顶部', null,
            `.fixed-header .bili-header__bar {position: relative !important;}`
        ))
        // 播放器相关
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-top-left-title', 'bangumi', '隐藏 播放器-播放器内视频标题', null,
            `.bpx-player-top-title {display: none !important;}`
        ))
        // bangumi独有项：追番/追剧按钮
        bangumiItems.push(new Item(
            'bangumi-page-hide-bpx-player-top-follow', 'bangumi', '隐藏 播放器-追番/追剧按钮', null,
            `.bpx-player-top-follow {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-top-issue', 'bangumi', '隐藏 播放器-反馈按钮', null,
            `.bpx-player-top-issue {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-state-wrap', 'bangumi', '隐藏 播放器-视频暂停时大Logo', null,
            `.bpx-player-state-wrap {display: none !important;}`
        ))
        // bangumi独有项：视频内封审核号
        bangumiItems.push(new Item(
            'bangumi-page-hide-bpx-player-record-item-wrap', 'bangumi', '隐藏 播放器-视频内封审核号(非内嵌)', null,
            `.bpx-player-record-item-wrap {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-dialog-wrap', 'bangumi', '隐藏 播放器-弹幕悬停点赞/复制/举报', null,
            `.bpx-player-dialog-wrap {display: none !important;}`
        ))
        // 播放控制
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-prev', 'bangumi', '隐藏 播放控制-上一个视频', null,
            `.bpx-player-ctrl-prev {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-play', 'bangumi', '隐藏 播放控制-播放/暂停', null,
            `.bpx-player-ctrl-play {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-next', 'bangumi', '隐藏 播放控制-下一个视频', null,
            `.bpx-player-ctrl-next {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-pip', 'bangumi', '隐藏 播放控制-画中画', null,
            `.bpx-player-ctrl-pip {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-eplist', 'bangumi', '隐藏 播放控制-选集', null,
            `.bpx-player-ctrl-eplist {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-wide', 'bangumi', '隐藏 播放控制-宽屏', null,
            `.bpx-player-ctrl-wide {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-volume', 'bangumi', '隐藏 播放控制-音量', null,
            `.bpx-player-ctrl-volume {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-subtitle', 'bangumi', '隐藏 播放控制-字幕', null,
            `.bpx-player-ctrl-subtitle {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-playbackrate', 'bangumi', '隐藏 播放控制-倍速', null,
            `.bpx-player-ctrl-playbackrate {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-setting', 'bangumi', '隐藏 播放控制-视频设置', null,
            `.bpx-player-ctrl-setting {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-shadow-progress-area', 'bangumi', '隐藏 播放控制-底边mini视频进度', null,
            `.bpx-player-shadow-progress-area {display: none !important;}`
        ))
        // 弹幕栏
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-video-info-online', 'bangumi', '隐藏 弹幕栏-同时在看人数', null,
            `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-video-info-dm', 'bangumi', '隐藏 弹幕栏-载入弹幕数量', null,
            `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-dm-switch', 'bangumi', '隐藏 弹幕栏-弹幕启用', null,
            `.bpx-player-dm-switch {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-dm-setting', 'bangumi', '隐藏 弹幕栏-弹幕显示设置', null,
            `.bpx-player-dm-setting {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-video-btn-dm', 'bangumi', '隐藏 弹幕栏-弹幕样式', null,
            `.bpx-player-video-btn-dm {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-dm-input', 'bangumi', '隐藏 弹幕栏-占位文字', null,
            `.bpx-player-dm-input::placeholder {color: transparent !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-dm-hint', 'bangumi', '隐藏 弹幕栏-弹幕礼仪', null,
            `.bpx-player-dm-hint {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-dm-btn-send', 'bangumi', '隐藏 弹幕栏-发送按钮', null,
            `.bpx-player-dm-btn-send {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bpx-player-sending-area', 'bangumi', '隐藏 弹幕栏-关闭整个弹幕栏', null,
            `.bpx-player-sending-area {display: none !important;}`
        ))
        // 视频下信息
        bangumiItems.push(new Item(
            'video-page-hide-video-share-popover', 'bangumi', '隐藏 视频下方-分享按钮弹出菜单', null,
            `#share-container-id [class^='Share_share'] {display: none !important;}`
        ))
        // bangumi独有项：用手机观看
        bangumiItems.push(new Item(
            'bangumi-page-hide-watch-on-phone', 'bangumi', '隐藏 视频下方-用手机观看', null,
            `.toolbar span:has(>[class^='Phone_mobile']) {display: none !important;}`
        ))
        // bangumi独有项：一起看
        bangumiItems.push(new Item(
            'bangumi-page-hide-watch-together', 'bangumi', '隐藏 视频下方-一起看', null,
            `.toolbar span:has(>#watch_together_tab) {display: none !important;}`
        ))
        // bangumi独有项：关闭整个工具栏
        bangumiItems.push(new Item(
            'bangumi-page-hide-toolbar', 'bangumi', '隐藏 视频下方-整个工具栏(赞/币/转/一起看)', null,
            `.player-left-components .toolbar {display: none !important;}`
        ))
        // bangumi独有项：作品介绍
        bangumiItems.push(new Item(
            'bangumi-page-hide-media-info', 'bangumi', '隐藏 视频下方-作品介绍', null,
            `[class^='mediainfo_mediaInfo'] {display: none !important;}`
        ))
        // bangumi独有项：精简作品介绍
        bangumiItems.push(new Item(
            'bangumi-page-simple-media-info', 'bangumi', '视频下方-作品介绍 精简', null,
            `[class^='mediainfo_btnHome'], [class^='upinfo_upInfoCard'] {display: none !important;}
            [class^='mediainfo_score'] {font-size: 25px !important;}
            [class^='mediainfo_mediaDesc']:has( + [class^='mediainfo_media_desc_section']) {
                visibility: hidden !important;
                height: 0 !important;
                margin-bottom: 8px !important;
            }
            [class^='mediainfo_media_desc_section'] {height: 60px !important;}`
        ))
        // bangumi独有项：承包榜
        bangumiItems.push(new Item(
            'bangumi-page-hide-sponsor-module', 'bangumi', '隐藏 视频下方-承包榜', null,
            `#sponsor_module {display: none !important;}`
        ))
        // 右栏
        // bangumi独有项：大会员栏
        bangumiItems.push(new Item(
            'bangumi-page-hide-right-container-section-height', 'bangumi', '隐藏 右栏-大会员按钮', null,
            `[class^='vipPaybar_'] {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-right-container-danmaku', 'bangumi', '隐藏 右栏-弹幕列表', null,
            `#danmukuBox {display: none !important;}`
        ))
        // bangumi独有项：会员标记
        bangumiItems.push(new Item(
            'bangumi-page-hide-eplist-badge', 'bangumi', '隐藏 右栏-视频列表 会员标记', null,
            `[class^='eplist_ep_list_wrapper'] [class^='imageListItem_badge'] {display: none !important;}
            [class^='eplist_ep_list_wrapper'] [class^='numberListItem_badge'] {display: none !important;}`
        ))
        // bangumi独有项：相关版权作品推荐
        bangumiItems.push(new Item(
            'bangumi-page-hide-recommend', 'bangumi', '隐藏 右栏-全部相关推荐', null,
            `.plp-r [class^='recommend_wrap'] {display: none !important;}`
        ))
        // 评论区相关
        bangumiItems.push(new Item(
            'video-page-hide-reply-notice', 'bangumi', '隐藏 评论区-活动/notice', null,
            `#comment-module .reply-header .reply-notice {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-main-reply-box', 'bangumi', '隐藏 评论区-整个评论框', null,
            `#comment-module .main-reply-box {height: 0 !important; visibility: hidden !important;}
            #comment-module .reply-list {margin-top: -20px !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-fixed-reply-box', 'bangumi', '隐藏 评论区-页面底部 吸附评论框', null,
            `#comment-module .fixed-reply-box {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-reply-box-textarea-placeholder', 'bangumi', '隐藏 评论区-评论编辑器内占位文字', null,
            `#comment-module .main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
            #comment-module .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-reply-decorate', 'bangumi', '隐藏 评论区-评论内容右侧装饰', null,
            `#comment-module .reply-decorate {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-fan-badge', 'bangumi', '隐藏 评论区-ID后粉丝牌', null,
            `#comment-module .fan-badge {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-user-level', 'bangumi', '隐藏 评论区-一级评论用户等级', null,
            `#comment-module .user-level {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-sub-user-level', 'bangumi', '隐藏 评论区-二级评论用户等级', null,
            `#comment-module .sub-user-level {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bili-avatar-pendent-dom', 'bangumi', '隐藏 评论区-用户头像外圈饰品', null,
            `#comment-module .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            #comment-module .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-bili-avatar-nft-icon', 'bangumi', '隐藏 评论区-用户头像右下小icon', null,
            `#comment-module .bili-avatar-nft-icon {display: none !important;}
            #comment-module .bili-avatar-icon {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-reply-tag-list', 'bangumi', '隐藏 评论区-评论内容下tag(热评)', null,
            `#comment-module .reply-tag-list {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-note-prefix', 'bangumi', '隐藏 评论区-笔记评论前的小Logo', null,
            `#comment-module .note-prefix {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-jump-link-search-word', 'bangumi', '隐藏 评论区-评论内容搜索关键词高亮', null,
            `#comment-module .reply-content .jump-link.search-word {color: inherit !important;}
            #comment-module .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
            #comment-module .reply-content .icon.search-word {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-reply-content-user-highlight', 'bangumi', '隐藏 评论区-二级评论中的@高亮', null,
            `#comment-module .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
            #comment-module .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-at-reply-at-bots', 'bangumi', '隐藏 评论区-召唤AI机器人的评论', null,
            // 8455326 @机器工具人
            // 234978716 @有趣的程序员
            // 1141159409 @AI视频小助理
            // 437175450 @AI视频小助理总结一下 (误伤)
            // 1692825065 @AI笔记侠
            // 690155730 @AI视频助手
            // 689670224 @哔哩哔理点赞姬
            // 3494380876859618 @课代表猫
            // 1168527940 @AI课代表呀
            // 439438614 @木几萌Moe
            // 1358327273 @星崽丨StarZai
            // 3546376048741135 @AI沈阳美食家
            // 1835753760 @AI识片酱
            `.reply-item:has(.jump-link.user[data-user-id="8455326"]),
            .reply-item:has(.jump-link.user[data-user-id="234978716"]),
            .reply-item:has(.jump-link.user[data-user-id="1141159409"]),
            .reply-item:has(.jump-link.user[data-user-id="437175450"]),
            .reply-item:has(.jump-link.user[data-user-id="1692825065"]),
            .reply-item:has(.jump-link.user[data-user-id="690155730"]),
            .reply-item:has(.jump-link.user[data-user-id="689670224"]),
            .reply-item:has(.jump-link.user[data-user-id="3494380876859618"]),
            .reply-item:has(.jump-link.user[data-user-id="1168527940"]),
            .reply-item:has(.jump-link.user[data-user-id="439438614"]),
            .reply-item:has(.jump-link.user[data-user-id="1358327273"]),
            .reply-item:has(.jump-link.user[data-user-id="3546376048741135"]),
            .reply-item:has(.jump-link.user[data-user-id="1835753760"]) {
                display: none !important;
            }`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-zero-like-at-reply', 'bangumi', '隐藏 评论区-包含@的 无人点赞评论', null,
            `#comment-module .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-at-reply-all', 'bangumi', '隐藏 评论区-包含@的 全部评论', null,
            `#comment-module .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-zero-like-lv1-reply', 'bangumi', '隐藏 评论区-LV1 无人点赞评论', null,
            `#comment-module .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-zero-like-lv2-reply', 'bangumi', '隐藏 评论区-LV2 无人点赞评论', null,
            `#comment-module .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-zero-like-lv3-reply', 'bangumi', '隐藏 评论区-LV3 无人点赞评论', null,
            `#comment-module .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-root-reply-dislike-reply-btn', 'bangumi', '隐藏 一级评论 踩/回复/举报 hover时显示', null,
            `#comment-module .reply-info:not(:has(i.disliked)) .reply-btn,
            #comment-module .reply-info:not(:has(i.disliked)) .reply-dislike {
                visibility: hidden;
            }
            #comment-module .reply-item:hover .reply-info .reply-btn,
            #comment-module .reply-item:hover .reply-info .reply-dislike {
                visibility: visible !important;
            }`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-sub-reply-dislike-reply-btn', 'bangumi', '隐藏 二级评论 踩/回复/举报 hover时显示', null,
            `#comment-module .sub-reply-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
            #comment-module .sub-reply-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                visibility: hidden;
            }
            #comment-module .sub-reply-container .sub-reply-item:hover .sub-reply-btn,
            #comment-module .sub-reply-container .sub-reply-item:hover .sub-reply-dislike {
                visibility: visible !important;
            }`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-emoji-large', 'bangumi', '隐藏 评论区-大表情', null,
            `#comment-module .emoji-large {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-emoji-large-zoom', 'bangumi', '评论区-大表情变成小表情', null,
            `#comment-module .emoji-large {zoom: .5;}`
        ))
        bangumiItems.push(new Item(
            'video-page-reply-user-name-color-pink', 'bangumi', '评论区-用户名 全部大会员色', null,
            `#comment-module .reply-item .user-name, #comment-module .reply-item .sub-user-name {color: #FB7299 !important;}}`
        ))
        bangumiItems.push(new Item(
            'video-page-reply-user-name-color-default', 'bangumi', '评论区-用户名 全部恢复默认色', null,
            `#comment-module .reply-item .user-name, #comment-module .reply-item .sub-user-name {color: #61666d !important;}}`
        ))
        // 右下角
        // bangumi独有项：新版反馈
        bangumiItems.push(new Item(
            'bangumi-page-hide-sidenav-issue', 'bangumi', '隐藏 右下角-新版反馈', null,
            `[class*='navTools_navMenu'] [title='新版反馈'] {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-sidenav-mini', 'bangumi', '隐藏 右下角-小窗播放器', null,
            `[class*='navTools_navMenu'] [title*='迷你播放器'] {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-sidenav-customer-service', 'bangumi', '隐藏 右下角-客服', null,
            `[class*='navTools_navMenu'] [title='帮助反馈'] {display: none !important;}`
        ))
        bangumiItems.push(new Item(
            'video-page-hide-sidenav-back-to-top', 'bangumi', '隐藏 右下角-回顶部', null,
            `[class*='navTools_navMenu'] [title='返回顶部'] {display: none !important;}`
        ))
    }
    else if (host == 'search.bilibili.com') {
        searchItems.push(new Item(
            'search-page-border-radius', 'search', '页面直角化 去除圆角', null,
            `
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover-wrap,
            .v-popover,
            .search-sticky-header *,
            .vui_button,
            .header-upload-entry,
            .search-input-wrap *,
            .search-input-container .search-input-wrap,
            .bili-video-card__cover {
                border-radius: 3px !important;
            }
            `
        ))
        searchItems.push(new Item(
            'hide-search-page-ad', 'search', '隐藏 搜索结果中的广告', null,
            `.video-list.row>div:has([href*="cm.bilibili.com"]) {display: none !important;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-danmaku-count', 'search', '隐藏 弹幕数量', null,
            `.bili-video-card .bili-video-card__stats--left .bili-video-card__stats--item:nth-child(2) {display: none !important;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-date', 'search', '隐藏 视频日期', null,
            `.bili-video-card .bili-video-card__info--date {display: none !important;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-bili-watch-later', 'search', '隐藏 稍后再看按钮', null,
            `.bili-video-card .bili-watch-later {display: none !important;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-search-sticky-header', 'search', '隐藏 顶部sticky搜索框', null,
            `.search-sticky-header {display: none !important;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-customer-service', 'search', '隐藏 右下角 客服', null,
            `.side-buttons div:has(>a[href*="customer-service"]) {display: none !important;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-btn-to-top', 'search', '隐藏 右下角 回顶部', null,
            `.side-buttons .btn-to-top-wrap {display: none !important;}`
        ))
    }
    else if (host == 't.bilibili.com') {
        // 去圆角
        dynamicItems.push(new Item(
            'dynamic-page-border-radius', 'dynamic', '页面直角化 去除圆角', null,
            `
            #nav-searchform,
            .nav-search-content,
            .header-upload-entry,
            .v-popover-content,
            .van-popover,
            .v-popover-wrap,
            .v-popover,
            .topic-panel,
            .bili-dyn-up-list,
            .bili-dyn-sidebar *,
            .bili-dyn-up-list__window,
            .bili-dyn-live-users,
            .bili-dyn-topic-box,
            .bili-dyn-list-notification,
            .bili-dyn-item,
            .bili-dyn-banner,
            .bili-dyn-banner__img,
            .bili-dyn-my-info,
            .bili-dyn-card-video,
            .bili-album__preview__picture__gif,
            .bili-album__preview__picture__img {
                border-radius: 3px !important;
            }
            .bili-dyn-card-video__cover__mask,
            .bili-dyn-card-video__cover {
                border-radius: 3px 0 0 3px !important;
            }
            .bili-dyn-card-video__body {
                border-radius: 0 3px 3px 0 !important;
            }
            `
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-fixed-header', 'dynamic', '顶栏 不再吸附顶部', null,
            `.fixed-header .bili-header__bar {position: relative !important;}
            .bili-dyn-live-users {top: 15px !important; transform: unset !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-my-info', 'dynamic', '隐藏 左栏 个人信息框', null,
            `.bili-dyn-my-info {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-live-users__item__living', 'dynamic', '隐藏 左栏 直播中Logo', null,
            `.bili-dyn-live-users__item__living {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-publishing', 'dynamic', '隐藏 中栏 动态发布框', null,
            `.bili-dyn-publishing {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-list-tabs', 'dynamic', '隐藏 中栏 动态分类Tab', null,
            `.bili-dyn-list-tabs {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-ornament', 'dynamic', '隐藏 中栏 动态右侧饰品', null,
            `.bili-dyn-ornament {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-banner', 'dynamic', '隐藏 右栏 社区中心', null,
            `.bili-dyn-banner {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-topic-box', 'dynamic', '隐藏 右栏 话题列表', null,
            `.bili-dyn-topic-box, .topic-panel {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-aside-right', 'dynamic', '隐藏 整个右栏', null,
            `aside.right {display: none !important;}`
        ))
        // 动态评论区
        dynamicItems.push(new Item(
            'hide-dynamic-page-main-reply-box', 'dynamic', '隐藏 评论区-整个评论框', null,
            `.comment-container .main-reply-box, .fixed-reply-box {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-reply-box-textarea-placeholder', 'dynamic', '隐藏 评论区-评论编辑器内占位文字', null,
            `.comment-container .reply-box-textarea::placeholder {color: transparent !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-reply-decorate', 'dynamic', '隐藏 评论区-评论右侧装饰', null,
            `.comment-container .reply-decorate {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-fan-badge', 'dynamic', '隐藏 评论区-ID后粉丝牌', null,
            `.comment-container .fan-badge {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-user-level', 'dynamic', '隐藏 评论区-一级评论用户等级', null,
            `.comment-container .user-level {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-sub-user-level', 'dynamic', '隐藏 评论区-二级评论用户等级', null,
            `.comment-container .sub-user-level {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-avatar-pendent-dom', 'dynamic', '隐藏 评论区-用户头像外圈饰品', null,
            `.comment-container .bili-avatar-pendent-dom {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-reply-notice', 'dynamic', '隐藏 评论区-活动/notice', null,
            `.comment-container .reply-header .reply-notice {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-note-prefix', 'dynamic', '隐藏 评论区-笔记评论前的小Logo', null,
            `.comment-container .note-prefix {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-jump-link-search-word', 'dynamic', '隐藏 评论区-评论内容搜索关键词高亮', null,
            `.comment-container .reply-content .jump-link.search-word {color: inherit !important;}
            .comment-container .reply-content .icon.search-word {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-root-reply-dislike-reply-btn', 'dynamic', '隐藏 一级评论 踩/回复/举报 hover时显示', null,
            `.comment-container .root-reply .reply-btn,
            .comment-container .root-reply .reply-dislike {
                visibility: hidden;
            }
            .comment-container .reply-item:hover .root-reply .reply-btn,
            .comment-container .reply-item:hover .root-reply .reply-dislike {
                visibility: visible;
            }`
        ))
        dynamicItems.push(new Item(
            'hide-sub-reply-dislike-reply-btn', 'dynamic', '隐藏 二级评论 踩/回复/举报 hover时显示', null,
            `.comment-container .sub-reply-container .sub-reply-item .sub-reply-btn,
            .comment-container .sub-reply-container .sub-reply-item .sub-reply-dislike {
                visibility: hidden;
            }
            .comment-container .sub-reply-container .sub-reply-item:hover .sub-reply-btn,
            .comment-container .sub-reply-container .sub-reply-item:hover .sub-reply-dislike {
                visibility: visible;
            }`
        ))
        dynamicItems.push(new Item(
            'video-page-reply-user-name-color-pink', 'dynamic', '隐藏 评论区-用户名全部大会员色', null,
            `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}}`
        ))
        dynamicItems.push(new Item(
            'video-page-reply-user-name-color-default', 'dynamic', '隐藏 评论区-用户名全部恢复默认色', null,
            `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}}`
        ))
    }
    else if (host == 'live.bilibili.com') {
        // 去除圆角
        liveItems.push(new Item(
            'live-page-border-radius', 'live', '页面直角化 去除圆角', null,
            `
            #nav-searchform,
            .nav-search-content,
            .header-upload-entry,
            .v-popover-content,
            .van-popover,
            .v-popover-wrap,
            .v-popover,
            .aside-area,
            .lower-row .right-ctnr *,
            .panel-main-ctnr,
            .startlive-btn,
            .flip-view,
            .content-wrapper,
            .chat-input-ctnr,
            .announcement-cntr,
            .bl-button--primary {
                border-radius: 3px !important;
            }
            .head-info-section {
                border-radius: 3px 3px 0 0 !important;
            }
            .gift-control-section {
                border-radius: 0 0 3px 3px !important;
            }
            .follow-ctnr .right-part {
                border-radius: 0 3px 3px 0 !important;
            }
            .chat-control-panel {
                border-radius: 0 0 3px 3px !important;
            }
            .follow-ctnr .left-part,
            #rank-list-ctnr-box.bgStyle {
                border-radius: 3px 0 0 3px !important;
            }
            `
        ))
        // 播放器上方信息栏
        liveItems.push(new Item(
            'live-page-head-info-vm', 'live', '隐藏 信息栏-关闭整个信息栏', null,
            `#head-info-vm {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-follow-ctnr', 'live', '隐藏 信息栏-粉丝团', null,
            `#head-info-vm .upper-row .follow-ctnr {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-visited', 'live', '隐藏 信息栏-xx人看过', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.watched-icon) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-popular', 'live', '隐藏 信息栏-人气', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-popular) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-like', 'live', '隐藏 信息栏-点赞', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.like-icon) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-report', 'live', '隐藏 信息栏-举报', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-report) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-share', 'live', '隐藏 信息栏-分享', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-share) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-lower-row-hot-rank', 'live', '隐藏 信息栏-人气榜', null,
            `#head-info-vm .lower-row .right-ctnr .popular-and-hot-rank {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-lower-row-gift-planet-entry', 'live', '隐藏 信息栏-礼物', null,
            `#head-info-vm .lower-row .right-ctnr .gift-planet-entry {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-lower-row-activity-gather-entry', 'live', '隐藏 信息栏-活动', null,
            `#head-info-vm .lower-row .right-ctnr .activity-gather-entry {display: none !important;}`
        ))
        // 播放器
        liveItems.push(new Item(
            'live-page-head-web-player-icon-feedback', 'live', '隐藏 播放器-右上角反馈', null,
            `#live-player .web-player-icon-feedback {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-web-player-shop-popover-vm', 'live', '隐藏 播放器-购物小橙车提示', null,
            `#shop-popover-vm {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-web-player-awesome-pk-vm', 'live', '隐藏 播放器-直播PK特效', null,
            `#pk-vm, #awesome-pk-vm {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-web-player-announcement-wrapper', 'live', '隐藏 播放器-滚动礼物通告', null,
            `#live-player .announcement-wrapper {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-head-web-player-game-id', 'live', '隐藏 播放器-幻星互动游戏', null,
            `#game-id {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-combo-danmaku', 'live', '隐藏 播放器-复读计数弹幕', null,
            `.danmaku-item-container > div.combo {display: none !important;}`
        ))
        // 视频下方
        liveItems.push(new Item(
            'live-page-gift-control-vm', 'live', '隐藏 视频下方-礼物栏', null,
            `#gift-control-vm, #gift-control-vm-new {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-flip-view', 'live', '隐藏 视频下方-活动海报', null,
            `.flip-view {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-room-info-ctnr', 'live', '隐藏 视频下方-直播间介绍', null,
            `.room-info-ctnr {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-room-feed', 'live', '隐藏 视频下方-UP主动态', null,
            `.room-feed {display: none !important;}`
        ))
        // 视频右侧
        liveItems.push(new Item(
            'live-page-sidebar-vm', 'live', '隐藏 右侧-实验室/关注', null,
            `#sidebar-vm {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-announcement-cntr', 'live', '隐藏 右侧-主播公告', null,
            `#sections-vm .announcement-cntr {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-rank-list-vm', 'live', '隐藏 右侧-高能榜/大航海 (需刷新)', null,
            `#rank-list-vm {display: none !important;}
            #aside-area-vm {overflow: hidden;}
            .chat-history-panel {height: calc(100% - 145px) !important; padding-top: 8px;}`
        ))
        liveItems.push(new Item(
            'live-page-convention-msg', 'live', '隐藏 右侧-弹幕栏 系统提示', null,
            `.convention-msg.border-box {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-rank-icon', 'live', '隐藏 右侧-弹幕栏 用户排名', null,
            `.chat-item .rank-icon {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-title-label', 'live', '隐藏 右侧-弹幕栏 头衔装扮', null,
            `.chat-item .title-label {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-wealth-medal-ctnr', 'live', '隐藏 右侧-弹幕栏 用户等级', null,
            `.chat-item .wealth-medal-ctnr {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-group-medal-ctnr', 'live', '隐藏 右侧-弹幕栏 团体勋章', null,
            `.chat-item .group-medal-ctnr {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-fans-medal-item-ctnr', 'live', '隐藏 右侧-弹幕栏 粉丝牌', null,
            `.chat-item .fans-medal-item-ctnr {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-chat-item-background-color', 'live', '隐藏 右侧-弹幕栏 弹幕的高亮底色', null,
            `.chat-item {background-color: unset !important; border-image-source: unset !important;}`
        ))
        liveItems.push(new Item(
            'live-page-gift-item', 'live', '隐藏 右侧-弹幕栏 礼物弹幕', null,
            `.chat-item.gift-item, .chat-item.common-danmuku-msg {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-brush-prompt', 'live', '隐藏 右侧-弹幕栏 底部滚动提示', null,
            `#brush-prompt {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-combo-card', 'live', '隐藏 右侧-弹幕栏 互动框(他们都在说)', null,
            `#combo-card:has(.combo-tips) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-service-card-container', 'live', '隐藏 右侧-弹幕栏 互动框(找TA玩)', null,
            `.play-together-service-card-container {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-compact-danmaku', 'live', '右侧-弹幕栏 使弹幕列表紧凑', null,
            `.chat-history-panel .chat-history-list .chat-item.danmaku-item.chat-colorful-bubble {margin: 2px 0 !important;}
            .chat-history-panel .chat-history-list .chat-item {padding: 3px 5px !important; font-size: 1.2rem !important;}
            .chat-history-panel .chat-history-list .chat-item.danmaku-item .user-name {font-size: 1.2rem !important;}
            .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname {font-size: 1.2rem !important;}
            .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname .common-nickname-wrapper {font-size: 1.2rem !important;}`
        ))
        liveItems.push(new Item(
            'live-page-control-panel-icon-row-left', 'live', '隐藏 右侧-弹幕控制按钮 左侧', null,
            `#chat-control-panel-vm .control-panel-icon-row .icon-left-part {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-control-panel-icon-row-right', 'live', '隐藏 右侧-弹幕控制按钮 右侧', null,
            `#chat-control-panel-vm .control-panel-icon-row .icon-right-part {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-bottom-actions', 'live', '隐藏 右侧-弹幕发送按钮', null,
            `#chat-control-panel-vm .bottom-actions {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-chat-input-ctnr', 'live', '隐藏 右侧-弹幕发送框', null,
            `#chat-control-panel-vm .chat-input-ctnr, #chat-control-panel-vm .bottom-actions {display: none !important;}
            .chat-control-panel {height: unset !important;}
            .chat-history-panel {height: calc(100% - 45px) !important; padding-top: 8px;}
            .chat-history-panel .danmaku-at-prompt {bottom: 50px !important;}`
        ))
        // 顶栏相关
        liveItems.push(new Item(
            'live-page-header-entry-logo', 'live', '隐藏 顶栏-直播LOGO', null,
            `#main-ctnr a.entry_logo[href="//live.bilibili.com"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-entry-title', 'live', '隐藏 顶栏-首页', null,
            `#main-ctnr a.entry-title[href="//www.bilibili.com"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-live', 'live', '隐藏 顶栏-直播', null,
            `#main-ctnr .dp-table-cell a[name="live"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-all', 'live', '隐藏 顶栏-全部', null,
            `#main-ctnr .dp-table-cell a[name="all"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-net-game', 'live', '隐藏 顶栏-网游', null,
            `#main-ctnr .dp-table-cell a[name="网游"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-mobile-game', 'live', '隐藏 顶栏-手游', null,
            `#main-ctnr .dp-table-cell a[name="手游"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-game', 'live', '隐藏 顶栏-单机游戏', null,
            `#main-ctnr .dp-table-cell a[name="单机游戏"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-entertainment', 'live', '隐藏 顶栏-娱乐', null,
            `#main-ctnr .dp-table-cell a[name="娱乐"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-radio', 'live', '隐藏 顶栏-电台', null,
            `#main-ctnr .dp-table-cell a[name="电台"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-vtuber', 'live', '隐藏 顶栏-虚拟主播', null,
            `#main-ctnr .dp-table-cell a[name="虚拟主播"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-chatroom', 'live', '隐藏 顶栏-聊天室', null,
            `#main-ctnr .dp-table-cell a[name="聊天室"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-living', 'live', '隐藏 顶栏-生活', null,
            `#main-ctnr .dp-table-cell a[name="生活"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-knowledge', 'live', '隐藏 顶栏-知识', null,
            `#main-ctnr .dp-table-cell a[name="知识"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-match', 'live', '隐藏 顶栏-赛事', null,
            `#main-ctnr .dp-table-cell a[name="赛事"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-helpmeplay', 'live', '隐藏 顶栏-帮我玩', null,
            `#main-ctnr .dp-table-cell a[name="帮我玩"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-interact', 'live', '隐藏 顶栏-互动玩法', null,
            `#main-ctnr .dp-table-cell a[name="互动玩法"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-shopping', 'live', '隐藏 顶栏-购物', null,
            `#main-ctnr .dp-table-cell a[name="购物"] {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-showmore-link', 'live', '隐藏 顶栏-更多', null,
            `#main-ctnr .showmore-link {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-search-block-placeholder', 'live', '隐藏 顶栏-搜索框内推荐搜索', null,
            `#nav-searchform input::placeholder {visibility: hidden;}`
        ))
        liveItems.push(new Item(
            'live-page-header-search-block', 'live', '隐藏 顶栏-搜索框', null,
            `#nav-searchform {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-avatar', 'live', '隐藏 顶栏-头像', null,
            `#right-part .user-panel {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-dynamic', 'live', '隐藏 顶栏-动态', null,
            `#right-part .shortcuts-ctnr .shortcut-item:has(.link-panel-ctnr) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-checkin', 'live', '隐藏 顶栏-签到', null,
            `#right-part .shortcuts-ctnr .shortcut-item:has(.calendar-checkin) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-interact', 'live', '隐藏 顶栏-互动', null,
            `#right-part .shortcuts-ctnr .shortcut-item:has(.fanbox-panel-ctnr) {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-header-go-live', 'live', '隐藏 顶栏-我要开播', null,
            `#right-part .shortcuts-ctnr .shortcut-item:has(.download-panel-ctnr) {visibility: hidden;}`
        ))
    }
    // 通用header净化，直播页除外
    if (host != 'live.bilibili.com') {
        commonItems.push(new Item(
            'common-hide-nav-homepage-logo', 'common', '隐藏 顶栏-主站Logo', null,
            `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) svg {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-homepage', 'common', '隐藏 顶栏-首页', null,
            `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) span {display: none !important;}
            div.bili-header__bar .v-popover-wrap:has(>a[href="//www.bilibili.com"]) div {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-anime', 'common', '隐藏 顶栏-番剧', null,
            `div.bili-header__bar li:has(>a[href="//www.bilibili.com/anime/"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-live', 'common', '隐藏 顶栏-直播', null,
            `div.bili-header__bar li:has(>a[href="//live.bilibili.com"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-game', 'common', '隐藏 顶栏-游戏中心', null,
            `div.bili-header__bar li:has(>a[href^="//game.bilibili.com"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-vipshop', 'common', '隐藏 顶栏-会员购', null,
            `div.bili-header__bar li:has(>a[href^="//show.bilibili.com"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-manga', 'common', '隐藏 顶栏-漫画', null,
            `div.bili-header__bar li:has(>a[href^="//manga.bilibili.com"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-match', 'common', '隐藏 顶栏-赛事', null,
            `div.bili-header__bar li:has(>a[href^="//www.bilibili.com/match/"], >a[href^="//www.bilibili.com/v/game/match/"]) {
                display: none !important;
            }`
        ))
        commonItems.push(new Item(
            'common-hide-nav-moveclip', 'common', '隐藏 顶栏-活动/活动直播', null,
            `div.bili-header__bar li:has(.loc-mc-box) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-bdu', 'common', '隐藏 顶栏-百大评选', null,
            `div.bili-header__bar li:has(a[href*="bilibili.com/BPU20"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-download-app', 'common', '隐藏 顶栏-下载客户端', null,
            `div.bili-header__bar li:has(a[href="//app.bilibili.com"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-blackboard', 'common', '隐藏 顶栏-所有官方活动(blackboard)', null,
            `div.bili-header__bar li:has(>a[href*="bilibili.com/blackboard"]) {display: none !important;}
            div.bili-header__bar li:has(>div>a[href*="bilibili.com/blackboard"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-search-rcmd', 'common', '隐藏 顶栏-搜索框 推荐搜索', null,
            `#nav-searchform .nav-search-input::placeholder {color: transparent;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-search-history', 'common', '隐藏 顶栏-搜索框 搜索历史', null,
            `.search-panel .history {display: none;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-search-trending', 'common', '隐藏 顶栏-搜索框 bilibili热搜', null,
            `.search-panel .trending {display: none;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-avatar', 'common', '隐藏 顶栏-头像', null,
            `.v-popover-wrap.header-avatar-wrap {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-vip', 'common', '隐藏 顶栏-大会员', null,
            `.vip-wrap:has([href="//account.bilibili.com/big"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-message', 'common', '隐藏 顶栏-消息', null,
            `.v-popover-wrap:has([href^="//message.bilibili.com"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-dynamic', 'common', '隐藏 顶栏-动态', null,
            `.v-popover-wrap:has([href^="//t.bilibili.com"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-favorite', 'common', '隐藏 顶栏-收藏', null,
            `.v-popover-wrap:has(.header-favorite-container) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-history', 'common', '隐藏 顶栏-历史', null,
            `.v-popover-wrap:has([href="//www.bilibili.com/account/history"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-member', 'common', '隐藏 顶栏-创作中心', null,
            `.right-entry-item:has(a[href="//member.bilibili.com/platform/home"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-upload', 'common', '隐藏 顶栏-投稿', null,
            // 不可设定 display: none, 会导致历史和收藏popover显示不全
            `.right-entry-item.right-entry-item--upload {visibility: hidden !important;}`
        ))
    }
    // 通用滚动条样式
    commonItems.push(new Item(
        'beauty-scrollbar', 'common', '美化页面滚动条', null,
        `
        ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
            background: transparent !important;
        }
        ::-webkit-scrollbar:hover {
            background: rgba(128, 128, 128, 0.4) !important;
        }
        ::-webkit-scrollbar-thumb {
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            background-color: rgba(0, 0, 0, 0.4) !important;
            z-index: 2147483647;
            -webkit-border-radius: 8px !important;
            background-clip: content-box !important;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.8) !important;
        }
        ::-webkit-scrollbar-thumb:active {
            background-color: rgba(0, 0, 0, 0.6) !important;
        }
        `
    ))
    // 通用URL净化
    commonItems.push(new Item(
        'url-cleaner', 'common', 'URL参数净化 (需刷新, 给UP充电时需关闭)', cleanURL, null
    ))


    log('item list complete')

    homepageItems.length && GROUPS.push(new Group('homepage', '当前是：首页', homepageItems))
    videoItems.length && GROUPS.push(new Group('video', '当前是：播放页', videoItems))
    bangumiItems.length && GROUPS.push(new Group('bangumi', '当前是：版权视频播放页', bangumiItems))
    searchItems.length && GROUPS.push(new Group('search', '当前是：搜索页', searchItems))
    dynamicItems.length && GROUPS.push(new Group('dynamic', '当前是：动态页', dynamicItems))
    liveItems.length && GROUPS.push(new Group('live', '当前是：直播页', liveItems))
    commonItems.length && GROUPS.push(new Group('common', '通用', commonItems))

    log('build group complete')

    GROUPS.forEach(e => { e.enableGroup() })

    log('enable group complete')

    // 监听各种形式的URL变化(普通监听无法检测到切换视频)
    let currURL = location.href
    setInterval(() => {
        let newURL = location.href
        if (newURL !== currURL) {
            log('url change detect, run itemFunc again')
            GROUPS.forEach(e => { e.enableGroup(true) })
            currURL = newURL
        }
    }, 500)

    //=======================================================================================
    function openSettings() {
        const panel = document.getElementById('bili-cleaner')
        if (panel) {
            return
        }
        log('panel create start')
        addGlobalCSS()
        createPanel()
        GROUPS.forEach(e => {
            e.insertGroup()
            e.insertItems()
        })
        log('panel create complete')
    }
    // 注册油猴插件菜单选项
    GM_registerMenuCommand("设置", openSettings)
    log('register menu complete')
})();
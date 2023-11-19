// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      1.0.10
// @description  净化B站页面内的各种元素，提供200项自定义功能，深度定制自己的B站页面
// @author       festoney8
// @license      MIT
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict'

    class Group {
        // Group id，描述，item数组
        constructor(groupID, description, items) {
            this.groupID = groupID
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
        enableGroup() {
            try {
                this.items.forEach(e => {
                    e.enableItem()
                })
            } catch (err) {
                console.log('[bili-cleaner] enableGroup err')
                console.log(err)
                console.log(this)
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
                console.log('[bili-cleaner] insertItem err')
                console.log(err)
                console.log(this)
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
                console.log('[bili-cleaner] watchItem err')
                console.log(err)
                console.log(this)
            }
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
                document.head.appendChild(style)
            }
        }
        // 停用CSS片段
        removeItemCSS() {
            if (this.itemCSS) {
                const style = document.querySelector(`style[bili-cleaner-css-item=${this.itemID}]`)
                if (style) {
                    style.parentNode.removeChild(style)
                }
            }
        }
        // 执行功能（由group调用）
        enableItem() {
            this.getStatus()
            if (this.isEnable) {
                try {
                    this.insertItemCSS()
                    if (this.itemFunc instanceof Function) {
                        this.itemFunc()
                    }
                } catch (err) {
                    console.log('[bili-cleaner] enableItem Error')
                    console.log(this)
                    console.log(err)
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
        if (newUrl.endsWith('/')) {
            newUrl = newUrl.slice(0, -1);
        }
        if (newUrl !== url) {
            history.replaceState(null, null, newUrl);
        }
    }

    //===================================================================================
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
    const dynamicItems = []
    // 直播页
    const liveItems = []

    const host = location.host
    const url = location.href
    const pathname = location.pathname

    if (url.startsWith('https://www.bilibili.com/') && pathname == '/') {
        // 页面直角化
        homepageItems.push(new Item(
            'homepage-border-radius', 'bili-cleaner-group-homepage', '页面直角化 去除圆角', null,
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
            'homepage-hide-recommend-swipe', 'bili-cleaner-group-homepage', '隐藏 大图活动轮播', null,
            `
            .recommended-swipe {
                display: none;
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
            'homepage-hide-subarea', 'bili-cleaner-group-homepage', '隐藏 整个分区栏', null,
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
        ))
        homepageItems.push(new Item(
            'homepage-hide-sticky-header', 'bili-cleaner-group-homepage', '隐藏 滚动页面时 顶部吸附顶栏', null,
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
            `
        ))
        homepageItems.push(new Item(
            'homepage-hide-sticky-subarea', 'bili-cleaner-group-homepage', '隐藏 滚动页面时 顶部吸附分区栏', null,
            `#i_cecream .header-channel {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-up-info-icon', 'bili-cleaner-group-homepage', '隐藏 [已关注][1万点赞]信息', null,
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
                user-select: none;
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
            'homepage-hide-danmaku-count', 'bili-cleaner-group-homepage', '隐藏 视频弹幕数显示', null,
            `.bili-video-card__stats--item:nth-child(2) {visibility: hidden;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-video-info-date', 'bili-cleaner-group-homepage', '隐藏 视频发布时间', null,
            `.bili-video-card__info--date {display: none;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-bili-watch-later', 'bili-cleaner-group-homepage', '隐藏 稍后再看按钮', null,
            `.bili-watch-later {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-ad-card', 'bili-cleaner-group-homepage', '隐藏 推荐视频中的广告', null,
            `
            .feed-card:has(.bili-video-card__info--ad, [href*="cm.bilibili.com"]) {
                display: none;
            }
            .bili-video-card.is-rcmd:has(.bili-video-card__info--ad, [href*="cm.bilibili.com"]) {
                display: none;
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
            'homepage-hide-live-card-recommend', 'bili-cleaner-group-homepage', '隐藏 直播间推荐', null,
            `.bili-live-card.is-rcmd {display: none;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-sub-area-card-recommend', 'bili-cleaner-group-homepage', '隐藏 分区视频推荐', null,
            `.floor-single-card {display: none;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-flexible-roll-btn', 'bili-cleaner-group-homepage', '隐藏 右下角-刷新', null,
            `.palette-button-wrap .flexible-roll-btn {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-feedback', 'bili-cleaner-group-homepage', '隐藏 右下角-客服和反馈', null,
            `.palette-button-wrap .storage-box {display: none !important;}`
        ))
        homepageItems.push(new Item(
            'homepage-hide-top-btn', 'bili-cleaner-group-homepage', '隐藏 右下角-回顶部', null,
            `.palette-button-wrap .top-btn-wrap {display: none !important;}`
        ))
        // 首页Group
        GROUPS.push(new Group('bili-cleaner-group-homepage', '当前是：首页', homepageItems))
    }
    else if (url.startsWith('https://www.bilibili.com/video/')) {
        // BV号转AV号
        videoItems.push(new Item(
            'video-page-bv2av', 'bili-cleaner-group-video', 'BV号转AV号 (需刷新)', bv2av, null
        ))
        // 去除圆角
        videoItems.push(new Item(
            'video-page-border-radius', 'bili-cleaner-group-video', '页面直角化 去除圆角', null,
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
            'video-page-hide-fixed-header', 'bili-cleaner-group-video', '顶栏 滚动页面后不再吸附顶部', null,
            `.fixed-header .bili-header__bar {position: relative !important;}`
        ))
        // 视频信息
        videoItems.push(new Item(
            'video-page-hide-video-info-danmaku-count', 'bili-cleaner-group-video', '隐藏 视频信息-弹幕数', null,
            `.video-info-detail .dm {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-video-info-pubdate', 'bili-cleaner-group-video', '隐藏 视频信息-发布日期', null,
            `.video-info-detail .pubdate-ip {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-video-info-copyright', 'bili-cleaner-group-video', '隐藏 视频信息-版权声明', null,
            `.video-info-detail .copyright {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-video-info-honor', 'bili-cleaner-group-video', '隐藏 视频信息-视频荣誉(排行榜/每周必看)', null,
            `.video-info-detail .honor-rank, .video-info-detail .honor-weekly {display: none !important;}`
        ))
        // 播放器相关
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-guide-all', 'bili-cleaner-group-video', '隐藏 播放器-视频内 一键三连窗口', null,
            `.bpx-player-video-area .bili-guide.bili-guide-all {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-vote', 'bili-cleaner-group-video', '隐藏 播放器-视频内 投票', null,
            `.bpx-player-video-area .bili-vote {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-score', 'bili-cleaner-group-video', '隐藏 播放器-视频内 评分', null,
            `.bpx-player-video-area .bili-score {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-bili-reserve', 'bili-cleaner-group-video', '隐藏 播放器-视频内 视频预告', null,
            `.bpx-player-video-area .bili-reserve {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-top-issue', 'bili-cleaner-group-video', '隐藏 播放器-右上角 反馈按钮', null,
            `.bpx-player-top-issue {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-top-left-title', 'bili-cleaner-group-video', '隐藏 播放器-左上角 全屏下视频标题', null,
            `.bpx-player-top-left-title {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-top-left-music', 'bili-cleaner-group-video', '隐藏 播放器-左上角 视频音乐链接', null,
            `.bpx-player-top-left-music {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-top-left-follow', 'bili-cleaner-group-video', '隐藏 播放器-左上角 关注UP主', null,
            `.bpx-player-top-left-follow {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-state-wrap', 'bili-cleaner-group-video', '隐藏 播放器-控制 视频暂停时Logo', null,
            `.bpx-player-state-wrap {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dialog-wrap', 'bili-cleaner-group-video', '隐藏 播放器-控制 弹幕悬停点赞/复制/举报', null,
            `.bpx-player-dialog-wrap {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-video-info-online', 'bili-cleaner-group-video', '隐藏 播放器-控制 同时在看人数', null,
            `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-video-info-dm', 'bili-cleaner-group-video', '隐藏 播放器-控制 载入弹幕数量', null,
            `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-prev', 'bili-cleaner-group-video', '隐藏 播放器-控制 上一个视频', null,
            `.bpx-player-ctrl-prev {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-play', 'bili-cleaner-group-video', '隐藏 播放器-控制 播放/暂停', null,
            `.bpx-player-ctrl-play {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-next', 'bili-cleaner-group-video', '隐藏 播放器-控制 下一个视频', null,
            `.bpx-player-ctrl-next {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-pip', 'bili-cleaner-group-video', '隐藏 播放器-控制 画中画', null,
            `.bpx-player-ctrl-pip {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-eplist', 'bili-cleaner-group-video', '隐藏 播放器-控制 选集', null,
            `.bpx-player-ctrl-eplist {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-wide', 'bili-cleaner-group-video', '隐藏 播放器-控制 宽屏', null,
            `.bpx-player-ctrl-wide {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-volume', 'bili-cleaner-group-video', '隐藏 播放器-控制 音量', null,
            `.bpx-player-ctrl-volume {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-subtitle', 'bili-cleaner-group-video', '隐藏 播放器-控制 字幕', null,
            `.bpx-player-ctrl-subtitle {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-playbackrate', 'bili-cleaner-group-video', '隐藏 播放器-控制 倍速', null,
            `.bpx-player-ctrl-playbackrate {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-ctrl-setting', 'bili-cleaner-group-video', '隐藏 播放器-控制 视频设置', null,
            `.bpx-player-ctrl-setting {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-shadow-progress-area', 'bili-cleaner-group-video', '隐藏 播放器-控制 底边mini视频进度', null,
            `.bpx-player-shadow-progress-area {display: none;}`
        ))
        // 弹幕发布相关
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-hint', 'bili-cleaner-group-video', '隐藏 弹幕发送-弹幕礼仪', null,
            `.bpx-player-dm-hint {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-btn-send', 'bili-cleaner-group-video', '隐藏 弹幕发送-发送按钮', null,
            `.bpx-player-dm-btn-send {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-video-btn-dm', 'bili-cleaner-group-video', '隐藏 弹幕发送-弹幕样式', null,
            `.bpx-player-video-btn-dm {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-input', 'bili-cleaner-group-video', '隐藏 弹幕发送-占位文字', null,
            `.bpx-player-dm-input::placeholder {color: transparent !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-setting', 'bili-cleaner-group-video', '隐藏 弹幕发送-弹幕显示设置', null,
            `.bpx-player-dm-setting {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-switch', 'bili-cleaner-group-video', '隐藏 弹幕发送-弹幕启用', null,
            `.bpx-player-dm-switch {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-dm-root', 'bili-cleaner-group-video', '隐藏 弹幕发送框-只在hover时显示', null,
            `.bpx-player-dm-root {opacity: 0; transition: ease .1s;}
            .bpx-player-control-wrap:hover .bpx-player-dm-root {opacity: 1; transition: ease .1s;}
            .bpx-player-sending-area:hover .bpx-player-dm-root {opacity: 1; transition: ease .1s;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bpx-player-sending-area', 'bili-cleaner-group-video', '隐藏 弹幕发送-关闭整个弹幕框', null,
            `.bpx-player-sending-area {display: none;}`
        ))
        // 视频下信息
        videoItems.push(new Item(
            'video-page-hide-below-info-video-ai-assistant', 'bili-cleaner-group-video', '隐藏 视频下方-AI总结', null,
            `.video-toolbar-right .video-ai-assistant {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-video-note', 'bili-cleaner-group-video', '隐藏 视频下方-记笔记', null,
            `.video-toolbar-right .video-note {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-video-report-menu', 'bili-cleaner-group-video', '隐藏 视频下方-举报/笔记/稍后再看', null,
            `.video-toolbar-right .video-tool-more {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-desc', 'bili-cleaner-group-video', '隐藏 视频下方-视频简介', null,
            `#v_desc {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-info-tag', 'bili-cleaner-group-video', '隐藏 视频下方-tag列表', null,
            `#v_tag {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-below-activity-vote', 'bili-cleaner-group-video', '隐藏 视频下方-活动宣传', null,
            `#activity_vote {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-video-share-popover', 'bili-cleaner-group-video', '隐藏 视频下方-分享按钮弹出菜单', null,
            `.video-share-popover {display: none;}`
        ))
        // up主信息
        videoItems.push(new Item(
            'video-page-hide-up-sendmsg', 'bili-cleaner-group-video', '隐藏 UP主-给UP发消息', null,
            `.up-detail .send-msg {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-up-description', 'bili-cleaner-group-video', '隐藏 UP主-UP简介', null,
            `.up-detail .up-description {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-up-charge', 'bili-cleaner-group-video', '隐藏 UP主-充电', null,
            `.upinfo-btn-panel .new-charge-btn, .upinfo-btn-panel .old-charge-btn {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-up-bili-avatar-pendent-dom', 'bili-cleaner-group-video', '隐藏 UP主-头像外饰品', null,
            `.up-info-container .bili-avatar-pendent-dom {display: none !important;}
            .up-avatar-wrap .up-avatar {background-color: transparent !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-up-membersinfo-normal-header', 'bili-cleaner-group-video', '隐藏 UP主-创作团队header', null,
            `.membersinfo-normal .header {display: none;}`
        ))
        // 视频右侧
        videoItems.push(new Item(
            'video-page-hide-right-container-ad', 'bili-cleaner-group-video', '隐藏 右栏-广告', null,
            `#slide_ad {display: none !important;}
            .ad-report.video-card-ad-small {display: none !important;}
            .video-page-special-card-small {display: none !important;}
            #reco_list {margin-top: 0 !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-video-page-game-card-small', 'bili-cleaner-group-video', '隐藏 右栏-游戏推荐', null,
            `#reco_list .video-page-game-card-small {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-danmaku', 'bili-cleaner-group-video', '隐藏 右栏-弹幕列表', null,
            `#danmukuBox {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-height', 'bili-cleaner-group-video', '视频合集列表 增加高度', null,
            `.base-video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important};`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-next-btn', 'bili-cleaner-group-video', '隐藏 右栏-视频合集 自动连播', null,
            `.base-video-sections-v1 .next-button {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-play-num', 'bili-cleaner-group-video', '隐藏 右栏-视频合集 播放量', null,
            `.base-video-sections-v1 .play-num, .base-video-sections-v1 img {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-abstract', 'bili-cleaner-group-video', '隐藏 右栏-视频合集 简介', null,
            `.base-video-sections-v1 .abstract {display: none;}
            .base-video-sections-v1 .second-line_left img {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-section-subscribe', 'bili-cleaner-group-video', '隐藏 右栏-视频合集 订阅合集', null,
            `.base-video-sections-v1 .second-line_right {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-multi-page-next-btn', 'bili-cleaner-group-video', '隐藏 右栏-视频选集(分P) 自动连播', null,
            `#multi_page .next-button {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-next-play-next-button', 'bili-cleaner-group-video', '隐藏 右栏-自动连播按钮', null,
            `#reco_list .next-play .next-button {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-rec-list', 'bili-cleaner-group-video', '隐藏 右栏-相关视频', null,
            `#reco_list .rec-list {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-watch-later-video', 'bili-cleaner-group-video', '隐藏 右栏-相关视频 稍后再看', null,
            `#reco_list .watch-later-video {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-rec-list-info-up', 'bili-cleaner-group-video', '隐藏 右栏-相关视频 UP主', null,
            `#reco_list .rec-list .info .upname {
                display: none;
            }
            #reco_list .rec-list .info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-reco-list-rec-list-info-plays', 'bili-cleaner-group-video', '隐藏 右栏-相关视频 播放和弹幕', null,
            `#reco_list .rec-list .info .playinfo {
                display: none;
            }
            #reco_list .rec-list .info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-duration', 'bili-cleaner-group-video', '隐藏 右栏-视频时长', null,
            `#reco_list .duration {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-right-bottom-banner', 'bili-cleaner-group-video', '隐藏 右栏-活动banner', null,
            `#right-bottom-banner {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-right-container-live', 'bili-cleaner-group-video', '隐藏 右栏-直播间推荐', null,
            `.right-container .pop-live-small-mode {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-sidenav-right-container-live', 'bili-cleaner-group-video', '隐藏 右下角-小窗播放器', null,
            `.fixed-sidenav-storage .mini-player-window {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-sidenav-customer-service', 'bili-cleaner-group-video', '隐藏 右下角-客服', null,
            `.fixed-sidenav-storage .customer-service {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-sidenav-back-to-top', 'bili-cleaner-group-video', '隐藏 右下角-回顶部', null,
            `.fixed-sidenav-storage .back-to-top {display: none !important;}`
        ))
        // 评论区相关
        videoItems.push(new Item(
            'video-page-hide-reply-notice', 'bili-cleaner-group-video', '隐藏 评论区-活动/notice', null,
            `#comment .reply-header .reply-notice {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-main-reply-box', 'bili-cleaner-group-video', '隐藏 评论区-发评论功能', null,
            `#comment .main-reply-box {display: none;}
            #comment .reply-list {margin-top: -20px !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-fixed-reply-box', 'bili-cleaner-group-video', '隐藏 评论区-页面底部 浮动评论发送框', null,
            `.fixed-reply-box {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-reply-box-textarea-placeholder', 'bili-cleaner-group-video', '隐藏 评论区-评论编辑器内占位文字', null,
            `.reply-box-textarea::placeholder {color: transparent !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-reply-decorate', 'bili-cleaner-group-video', '隐藏 评论区-评论右侧装饰', null,
            `#comment .reply-decorate {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-fan-badge', 'bili-cleaner-group-video', '隐藏 评论区-ID后粉丝牌', null,
            `#comment .fan-badge {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-user-level', 'bili-cleaner-group-video', '隐藏 评论区-一级评论用户等级', null,
            `#comment .user-level {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-sub-user-level', 'bili-cleaner-group-video', '隐藏 评论区-二级评论用户等级', null,
            `#comment .sub-user-level {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bili-avatar-pendent-dom', 'bili-cleaner-group-video', '隐藏 评论区-用户头像外圈饰品', null,
            `#comment .root-reply-avatar .bili-avatar-pendent-dom {display: none;}
            #comment .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-bili-avatar-nft-icon', 'bili-cleaner-group-video', '隐藏 评论区-用户头像右下小icon', null,
            `#comment .root-reply-avatar .bili-avatar-nft-icon {display: none !important;}
            #comment .root-reply-avatar .bili-avatar-icon {display: none !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-reply-tag-list', 'bili-cleaner-group-video', '隐藏 评论区-评论内容下tag(UP觉得很赞)', null,
            `#comment .reply-tag-list {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-note-prefix', 'bili-cleaner-group-video', '隐藏 评论区-笔记评论前的小Logo', null,
            `#comment .note-prefix {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-jump-link-search-word', 'bili-cleaner-group-video', '隐藏 评论区-评论内容搜索关键词高亮', null,
            `#comment .reply-content .jump-link.search-word {color: inherit !important;}
            #comment .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
            #comment .reply-content .icon.search-word {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-reply-content-user-highlight', 'bili-cleaner-group-video', '隐藏 评论区-二级评论中的@高亮', null,
            `#comment .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
            #comment .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-zero-like-at-reply', 'bili-cleaner-group-video', '隐藏 评论区-包含@的 无人点赞评论', null,
            `#comment .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-at-reply-all', 'bili-cleaner-group-video', '隐藏 评论区-包含@的 全部评论', null,
            `#comment .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-zero-like-lv1-reply', 'bili-cleaner-group-video', '隐藏 评论区-LV1 无人点赞评论', null,
            `#comment .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-zero-like-lv2-reply', 'bili-cleaner-group-video', '隐藏 评论区-LV2 无人点赞评论', null,
            `#comment .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-zero-like-lv3-reply', 'bili-cleaner-group-video', '隐藏 评论区-LV3 无人点赞评论', null,
            `#comment .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-emoji-large', 'bili-cleaner-group-video', '隐藏 评论区-大表情', null,
            `#comment .emoji-large {display: none;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-emoji-large-zoom', 'bili-cleaner-group-video', '评论区-大表情变成小表情', null,
            `#comment .emoji-large {zoom: .5;}`
        ))
        videoItems.push(new Item(
            'video-page-hide-root-reply-dislike-reply-btn', 'bili-cleaner-group-video', '隐藏 一级评论 踩/回复/举报 hover时显示', null,
            `#comment .root-reply .reply-btn, 
            #comment .root-reply .reply-dislike {
                visibility: hidden;
            }
            #comment .reply-item:hover .root-reply .reply-btn, 
            #comment .reply-item:hover .root-reply .reply-dislike {
                visibility: visible;
            }`
        ))
        videoItems.push(new Item(
            'video-page-hide-sub-reply-dislike-reply-btn', 'bili-cleaner-group-video', '隐藏 二级评论 踩/回复/举报 hover时显示', null,
            `#comment .sub-reply-container .sub-reply-item .sub-reply-btn, 
            #comment .sub-reply-container .sub-reply-item .sub-reply-dislike {
                visibility: hidden;
            }
            #comment .sub-reply-container .sub-reply-item:hover .sub-reply-btn, 
            #comment .sub-reply-container .sub-reply-item:hover .sub-reply-dislike {
                visibility: visible;
            }`
        ))
        videoItems.push(new Item(
            'video-page-reply-user-name-color-pink', 'bili-cleaner-group-video', '隐藏 评论区-用户名全部大会员色', null,
            `#comment .reply-item .user-name, #comment .reply-item .sub-user-name {color: #FB7299 !important;}}`
        ))
        videoItems.push(new Item(
            'video-page-reply-user-name-color-default', 'bili-cleaner-group-video', '隐藏 评论区-用户名全部恢复默认色', null,
            `#comment .reply-item .user-name, #comment .reply-item .sub-user-name {color: #61666d !important;}}`
        ))

        // 视频页Group
        GROUPS.push(new Group('bili-cleaner-group-video', '当前是：播放页', videoItems))
    }
    else if (host == 'search.bilibili.com') {
        searchItems.push(new Item(
            'search-page-border-radius', 'bili-cleaner-group-search', '页面直角化 去除圆角', null,
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
            'hide-search-page-ad', 'bili-cleaner-group-search', '隐藏 搜索结果中的广告', null,
            `.video-list.row>div:has([href*="cm.bilibili.com"]) {display: none;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-danmaku-count', 'bili-cleaner-group-search', '隐藏 弹幕数量', null,
            `.bili-video-card .bili-video-card__stats--left .bili-video-card__stats--item:nth-child(2) {display: none !important;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-date', 'bili-cleaner-group-search', '隐藏 视频日期', null,
            `.bili-video-card .bili-video-card__info--date {display: none;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-search-sticky-header', 'bili-cleaner-group-search', '隐藏 顶部sticky搜索框', null,
            `.search-sticky-header {display: none !important;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-customer-service', 'bili-cleaner-group-search', '隐藏 右下角 客服', null,
            `.side-buttons div:nth-child(1) {display: none;}`
        ))
        searchItems.push(new Item(
            'hide-search-page-btn-to-top', 'bili-cleaner-group-search', '隐藏 右下角 回顶部', null,
            `.side-buttons .btn-to-top-wrap {display: none;}`
        ))

        GROUPS.push(new Group('bili-cleaner-group-search', '当前是：搜索页', searchItems))
    }
    else if (host == 't.bilibili.com') {
        // 去圆角
        dynamicItems.push(new Item(
            'dynamic-page-border-radius', 'bili-cleaner-group-dynamic', '页面直角化 去除圆角', null,
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
            'hide-dynamic-page-bili-dyn-my-info', 'bili-cleaner-group-dynamic', '顶栏 不再吸附顶部', null,
            `.fixed-header .bili-header__bar {position: relative !important;}
            .bili-dyn-live-users {top: 15px !important; transform: unset !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-my-info', 'bili-cleaner-group-dynamic', '隐藏 左栏 个人信息框', null,
            `.bili-dyn-my-info {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-live-users__item__living', 'bili-cleaner-group-dynamic', '隐藏 左栏 直播中Logo', null,
            `.bili-dyn-live-users__item__living {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-publishing', 'bili-cleaner-group-dynamic', '隐藏 中栏 动态发布框', null,
            `.bili-dyn-publishing {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-list-tabs', 'bili-cleaner-group-dynamic', '隐藏 中栏 动态分类Tab', null,
            `.bili-dyn-list-tabs {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-ornament', 'bili-cleaner-group-dynamic', '隐藏 中栏 动态右侧饰品', null,
            `.bili-dyn-ornament {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-banner', 'bili-cleaner-group-dynamic', '隐藏 右栏 社区中心', null,
            `.bili-dyn-banner {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-dyn-topic-box', 'bili-cleaner-group-dynamic', '隐藏 右栏 话题列表', null,
            `.bili-dyn-topic-box, .topic-panel {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-aside-right', 'bili-cleaner-group-dynamic', '隐藏 整个右栏', null,
            `aside.right {display: none;}`
        ))
        // 动态评论区
        dynamicItems.push(new Item(
            'hide-dynamic-page-main-reply-box', 'bili-cleaner-group-dynamic', '隐藏 评论区-发评论功能', null,
            `.comment-container .main-reply-box {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-reply-box-textarea-placeholder', 'bili-cleaner-group-dynamic', '隐藏 评论区-评论编辑器内占位文字', null,
            `.comment-container .reply-box-textarea::placeholder {color: transparent !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-reply-decorate', 'bili-cleaner-group-dynamic', '隐藏 评论区-评论右侧装饰', null,
            `.comment-container .reply-decorate {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-fan-badge', 'bili-cleaner-group-dynamic', '隐藏 评论区-ID后粉丝牌', null,
            `.comment-container .fan-badge {display: none !important;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-user-level', 'bili-cleaner-group-dynamic', '隐藏 评论区-一级评论用户等级', null,
            `.comment-container .user-level {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-sub-user-level', 'bili-cleaner-group-dynamic', '隐藏 评论区-二级评论用户等级', null,
            `.comment-container .sub-user-level {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-bili-avatar-pendent-dom', 'bili-cleaner-group-dynamic', '隐藏 评论区-用户头像外圈饰品', null,
            `.comment-container .bili-avatar-pendent-dom {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-reply-notice', 'bili-cleaner-group-dynamic', '隐藏 评论区-活动/notice', null,
            `.comment-container .reply-header .reply-notice {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-page-note-prefix', 'bili-cleaner-group-dynamic', '隐藏 评论区-笔记评论前的小Logo', null,
            `.comment-container .note-prefix {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-dynamic-jump-link-search-word', 'bili-cleaner-group-dynamic', '隐藏 评论区-评论内容搜索关键词高亮', null,
            `.comment-container .reply-content .jump-link.search-word {color: inherit !important;}
            .comment-container .reply-content .icon.search-word {display: none;}`
        ))
        dynamicItems.push(new Item(
            'hide-root-reply-dislike-reply-btn', 'bili-cleaner-group-dynamic', '隐藏 一级评论 踩/回复/举报 hover时显示', null,
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
            'hide-sub-reply-dislike-reply-btn', 'bili-cleaner-group-dynamic', '隐藏 二级评论 踩/回复/举报 hover时显示', null,
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
            'video-page-reply-user-name-color-pink', 'bili-cleaner-group-dynamic', '隐藏 评论区-用户名全部大会员色', null,
            `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}}`
        ))
        dynamicItems.push(new Item(
            'video-page-reply-user-name-color-default', 'bili-cleaner-group-dynamic', '隐藏 评论区-用户名全部恢复默认色', null,
            `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}}`
        ))

        GROUPS.push(new Group('bili-cleaner-group-dynamic', '当前是：动态页', dynamicItems))
    }
    else if (host == 'live.bilibili.com') {
        // 去除圆角
        liveItems.push(new Item(
            'live-page-border-radius', 'bili-cleaner-group-live', '页面直角化 去除圆角', null,
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
            'live-page-head-info-vm', 'bili-cleaner-group-live', '隐藏 信息栏-关闭整个信息栏', null,
            `#head-info-vm {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-follow-ctnr', 'bili-cleaner-group-live', '隐藏 信息栏-粉丝团', null,
            `#head-info-vm .upper-row .follow-ctnr {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-visited', 'bili-cleaner-group-live', '隐藏 信息栏-xx人看过', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.watched-icon) {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-popular', 'bili-cleaner-group-live', '隐藏 信息栏-人气', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-popular) {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-like', 'bili-cleaner-group-live', '隐藏 信息栏-点赞', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.like-icon) {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-report', 'bili-cleaner-group-live', '隐藏 信息栏-举报', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-report) {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-upper-row-share', 'bili-cleaner-group-live', '隐藏 信息栏-分享', null,
            `#head-info-vm .upper-row .right-ctnr div:has(.icon-share) {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-lower-row-hot-rank', 'bili-cleaner-group-live', '隐藏 信息栏-人气榜', null,
            `#head-info-vm .lower-row .right-ctnr .popular-and-hot-rank {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-lower-row-gift-planet-entry', 'bili-cleaner-group-live', '隐藏 信息栏-礼物', null,
            `#head-info-vm .lower-row .right-ctnr .gift-planet-entry {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-info-vm-lower-row-activity-gather-entry', 'bili-cleaner-group-live', '隐藏 信息栏-活动', null,
            `#head-info-vm .lower-row .right-ctnr .activity-gather-entry {display: none;}`
        ))
        // 播放器
        liveItems.push(new Item(
            'live-page-head-web-player-icon-feedback', 'bili-cleaner-group-live', '隐藏 播放器-右上角反馈', null,
            `#live-player .web-player-icon-feedback {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-web-player-shop-popover-vm', 'bili-cleaner-group-live', '隐藏 播放器-购物小橙车提示', null,
            `#shop-popover-vm {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-web-player-awesome-pk-vm', 'bili-cleaner-group-live', '隐藏 播放器-直播PK特效', null,
            `#pk-vm, #awesome-pk-vm {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-head-web-player-announcement-wrapper', 'bili-cleaner-group-live', '隐藏 播放器-滚动礼物通告', null,
            `#live-player .announcement-wrapper {display: none;}`
        ))
        // 视频下方
        liveItems.push(new Item(
            'live-page-gift-control-vm', 'bili-cleaner-group-live', '隐藏 视频下方-礼物栏', null,
            `#gift-control-vm, #gift-control-vm-new {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-flip-view', 'bili-cleaner-group-live', '隐藏 视频下方-活动海报', null,
            `.flip-view {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-room-info-ctnr', 'bili-cleaner-group-live', '隐藏 视频下方-直播间介绍', null,
            `.room-info-ctnr {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-room-feed', 'bili-cleaner-group-live', '隐藏 视频下方-UP主动态', null,
            `.room-feed {display: none;}`
        ))
        // 视频右侧
        liveItems.push(new Item(
            'live-page-sidebar-vm', 'bili-cleaner-group-live', '隐藏 右侧-实验室/关注', null,
            `#sidebar-vm {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-announcement-cntr', 'bili-cleaner-group-live', '隐藏 右侧-主播公告', null,
            `#sections-vm .announcement-cntr {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-rank-list-vm', 'bili-cleaner-group-live', '隐藏 右侧-高能榜/大航海', null,
            `#rank-list-vm {display: none;}
            #aside-area-vm {overflow: hidden;}
            .chat-history-panel {height: calc(100% - 145px) !important; padding-top: 8px;}`
        ))
        liveItems.push(new Item(
            'live-page-convention-msg', 'bili-cleaner-group-live', '隐藏 右侧-弹幕栏 系统提示', null,
            `.convention-msg.border-box {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-rank-icon', 'bili-cleaner-group-live', '隐藏 右侧-弹幕栏 用户排名', null,
            `.chat-item .rank-icon {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-title-label', 'bili-cleaner-group-live', '隐藏 右侧-弹幕栏 头衔装扮', null,
            `.chat-item .title-label {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-wealth-medal-ctnr', 'bili-cleaner-group-live', '隐藏 右侧-弹幕栏 用户等级', null,
            `.chat-item .wealth-medal-ctnr {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-fans-medal-item-ctnr', 'bili-cleaner-group-live', '隐藏 右侧-弹幕栏 粉丝牌', null,
            `.chat-item .fans-medal-item-ctnr {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-chat-item-background-color', 'bili-cleaner-group-live', '隐藏 右侧-弹幕栏 高亮底色去除', null,
            `.chat-item {background-color: unset !important;}`
        ))
        liveItems.push(new Item(
            'live-page-gift-item', 'bili-cleaner-group-live', '隐藏 右侧-弹幕栏 礼物弹幕', null,
            `.chat-item.gift-item, .chat-item.common-danmuku-msg {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-brush-prompt', 'bili-cleaner-group-live', '隐藏 右侧-弹幕栏 底部滚动提示', null,
            `#brush-prompt {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-control-panel-icon-row-left', 'bili-cleaner-group-live', '隐藏 右侧-弹幕控制按钮 左侧', null,
            `#chat-control-panel-vm .control-panel-icon-row .icon-left-part {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-control-panel-icon-row-right', 'bili-cleaner-group-live', '隐藏 右侧-弹幕控制按钮 右侧', null,
            `#chat-control-panel-vm .control-panel-icon-row .icon-right-part {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-bottom-actions', 'bili-cleaner-group-live', '隐藏 右侧-弹幕发送按钮', null,
            `#chat-control-panel-vm .bottom-actions {display: none !important;}`
        ))
        liveItems.push(new Item(
            'live-page-chat-input-ctnr', 'bili-cleaner-group-live', '隐藏 右侧-弹幕发送框', null,
            `#chat-control-panel-vm .chat-input-ctnr, #chat-control-panel-vm .bottom-actions {display: none !important;}
            .chat-control-panel {height: unset !important;}
            .chat-history-panel {height: calc(100% - 45px) !important; padding-top: 8px;}`
        ))
        // 顶栏相关
        liveItems.push(new Item(
            'live-page-header-entry-logo', 'bili-cleaner-group-live', '隐藏 顶栏-直播LOGO', null,
            `#main-ctnr a.entry_logo[href="//live.bilibili.com"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-entry-title', 'bili-cleaner-group-live', '隐藏 顶栏-首页', null,
            `#main-ctnr a.entry-title[href="//www.bilibili.com"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-live', 'bili-cleaner-group-live', '隐藏 顶栏-直播', null,
            `#main-ctnr .dp-table-cell a[name="live"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-all', 'bili-cleaner-group-live', '隐藏 顶栏-全部', null,
            `#main-ctnr .dp-table-cell a[name="all"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-net-game', 'bili-cleaner-group-live', '隐藏 顶栏-网游', null,
            `#main-ctnr .dp-table-cell a[name="网游"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-mobile-game', 'bili-cleaner-group-live', '隐藏 顶栏-手游', null,
            `#main-ctnr .dp-table-cell a[name="手游"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-game', 'bili-cleaner-group-live', '隐藏 顶栏-单机游戏', null,
            `#main-ctnr .dp-table-cell a[name="单机游戏"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-entertainment', 'bili-cleaner-group-live', '隐藏 顶栏-娱乐', null,
            `#main-ctnr .dp-table-cell a[name="娱乐"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-standalone-radio', 'bili-cleaner-group-live', '隐藏 顶栏-电台', null,
            `#main-ctnr .dp-table-cell a[name="电台"] {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-showmore-link', 'bili-cleaner-group-live', '隐藏 顶栏-更多', null,
            `#main-ctnr .showmore-link {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-search-block-placeholder', 'bili-cleaner-group-live', '隐藏 顶栏-搜索框内推荐搜索', null,
            `#nav-searchform input::placeholder {visibility: hidden;}`
        ))
        liveItems.push(new Item(
            'live-page-header-search-block', 'bili-cleaner-group-live', '隐藏 顶栏-搜索框', null,
            `#nav-searchform {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-avatar', 'bili-cleaner-group-live', '隐藏 顶栏-头像', null,
            `#right-part .user-panel {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-dynamic', 'bili-cleaner-group-live', '隐藏 顶栏-动态', null,
            `#right-part .shortcuts-ctnr .shortcut-item:nth-child(1) {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-checkin', 'bili-cleaner-group-live', '隐藏 顶栏-签到', null,
            `#right-part .shortcuts-ctnr .shortcut-item:nth-child(2) {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-interact', 'bili-cleaner-group-live', '隐藏 顶栏-互动', null,
            `#right-part .shortcuts-ctnr .shortcut-item:nth-child(3) {display: none;}`
        ))
        liveItems.push(new Item(
            'live-page-header-go-live', 'bili-cleaner-group-live', '隐藏 顶栏-我要开播', null,
            `#right-part .shortcuts-ctnr .shortcut-item:nth-child(4) {visibility: hidden;}`
        ))
        GROUPS.push(new Group('bili-cleaner-group-live', '当前是：直播页', liveItems))
    }
    // 通用header净化，直播页除外
    if (host != 'live.bilibili.com') {
        commonItems.push(new Item(
            'common-hide-nav-homepage-logo', 'bili-cleaner-group-common', '隐藏 顶栏-主站Logo', null,
            `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) svg {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-homepage', 'bili-cleaner-group-common', '隐藏 顶栏-首页', null,
            `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) span {display: none !important;}
            div.bili-header__bar .v-popover-wrap:has(>a[href="//www.bilibili.com"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-anime', 'bili-cleaner-group-common', '隐藏 顶栏-番剧', null,
            `div.bili-header__bar li:has(>a[href="//www.bilibili.com/anime/"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-live', 'bili-cleaner-group-common', '隐藏 顶栏-直播', null,
            `div.bili-header__bar li:has(>a[href="//live.bilibili.com"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-game', 'bili-cleaner-group-common', '隐藏 顶栏-游戏中心', null,
            `div.bili-header__bar li:has(>a[href^="//game.bilibili.com"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-vipshop', 'bili-cleaner-group-common', '隐藏 顶栏-会员购', null,
            `div.bili-header__bar li:has(>a[href^="//show.bilibili.com"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-manga', 'bili-cleaner-group-common', '隐藏 顶栏-漫画', null,
            `div.bili-header__bar li:has(>a[href^="//manga.bilibili.com"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-match', 'bili-cleaner-group-common', '隐藏 顶栏-赛事', null,
            `div.bili-header__bar li:has(>a[href^="//www.bilibili.com/match/"])  {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-moveclip', 'bili-cleaner-group-common', '隐藏 顶栏-活动直播', null,
            `div.bili-header__bar li:has(.loc-mc-box) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-download-app', 'bili-cleaner-group-common', '隐藏 顶栏-下载客户端', null,
            `div.bili-header__bar li:has(a[href="//app.bilibili.com"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-blackboard', 'bili-cleaner-group-common', '隐藏 顶栏-所有官方活动(blackboard)', null,
            `div.bili-header__bar li:has(>a[href*="bilibili.com/blackboard"]) {display: none !important;}
            div.bili-header__bar li:has(>div>a[href*="bilibili.com/blackboard"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-search-rcmd', 'bili-cleaner-group-common', '隐藏 顶栏-搜索框内的推荐搜索', null,
            `#nav-searchform .nav-search-input::placeholder {color: transparent;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-search-history', 'bili-cleaner-group-common', '隐藏 顶栏-搜索框内搜索历史', null,
            `.search-panel .history {display: none;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-search-trending', 'bili-cleaner-group-common', '隐藏 顶栏-搜索框内bilibili热搜', null,
            `.search-panel .trending {display: none;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-avatar', 'bili-cleaner-group-common', '隐藏 顶栏-头像', null,
            `.v-popover-wrap.header-avatar-wrap {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-vip', 'bili-cleaner-group-common', '隐藏 顶栏-大会员', null,
            `.vip-wrap:has([href="//account.bilibili.com/big"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-message', 'bili-cleaner-group-common', '隐藏 顶栏-消息', null,
            `.v-popover-wrap:has([href^="//message.bilibili.com"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-dynamic', 'bili-cleaner-group-common', '隐藏 顶栏-动态', null,
            `.v-popover-wrap:has([href^="//t.bilibili.com"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-favorite', 'bili-cleaner-group-common', '隐藏 顶栏-收藏', null,
            `.v-popover-wrap:has(.header-favorite-container) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-history', 'bili-cleaner-group-common', '隐藏 顶栏-历史', null,
            `.v-popover-wrap:has([href="//www.bilibili.com/account/history"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-member', 'bili-cleaner-group-common', '隐藏 顶栏-创作中心', null,
            `.right-entry-item:has(a[href="//member.bilibili.com/platform/home"]) {display: none !important;}`
        ))
        commonItems.push(new Item(
            'common-hide-nav-upload', 'bili-cleaner-group-common', '隐藏 顶栏-投稿', null,
            // 不可设定 display: none, 会导致历史和收藏popover显示不全
            `.right-entry-item.right-entry-item--upload {visibility: hidden !important;}`
        ))
    }
    commonItems.push(new Item(
        'url-cleaner', 'bili-cleaner-group-common', 'URL参数净化 (需刷新)', removeQueryParams, null
    ))
    // 通用Group
    GROUPS.push(new Group('bili-cleaner-group-common', '通用', commonItems))

    GROUPS.forEach(e => { e.enableGroup() })

    // 监听各种形式的URL变化(普通监听无法检测到切换视频)
    let currURL = location.href
    setInterval(() => {
        let newURL = location.href
        if (newURL !== currURL) {
            GROUPS.forEach(e => { e.enableGroup() })
            currURL = newURL
        }
    }, 1000)

    //=======================================================================================
    function openSettings() {
        const panel = document.getElementById('bili-cleaner')
        if (panel) {
            return
        }
        addGlobalCSS()
        createPanel()
        GROUPS.forEach(e => {
            e.insertGroup()
            e.insertItems()
        })
    }
    // 注册油猴插件菜单选项
    GM_registerMenuCommand("设置", openSettings)
})();
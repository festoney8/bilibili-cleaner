// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @author       festoney8
// @description  净化 B站/哔哩哔哩 页面内的各种元素，去广告，提供300+项自定义功能，深度定制自己的B站页面
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @supportURL   https://github.com/festoney8/bilibili-cleaner
// @match        *://*.bilibili.com/*
// @exclude      *://message.bilibili.com/pages/nav/header_sync
// @exclude      *://data.bilibili.com/*
// @exclude      *://cm.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @exclude      *://api.bilibili.com/*
// @exclude      *://api.*.bilibili.com/*
// @exclude      *://*.chat.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  const debugMode = false;
  const startTime = performance.now();
  let lastTime = startTime;
  let currTime = startTime;
  const wrapper = (loggingFunc, forceEnable, isDebugMode) => {
    if (forceEnable || isDebugMode) {
      return (...innerArgs) => {
        currTime = performance.now();
        const during = (currTime - lastTime).toFixed(1);
        const total = (currTime - startTime).toFixed(1);
        loggingFunc(`[bili-cleaner] ${during} / ${total} ms | ${innerArgs.join(" ")}`);
        lastTime = currTime;
      };
    }
    return (..._args) => {
      return void 0;
    };
  };
  const log = wrapper(console.log, true, debugMode);
  const debug = wrapper(console.log, false, debugMode);
  const error = wrapper(console.error, false, debugMode);
  const init = async () => {
    if (navigator.userAgent.toLowerCase().includes("firefox") && document.head === null) {
      await waitForHead();
      debug("firefox waitForHead complete");
      await waitForHeadBuild();
      debug("waitForHeadBuild complete");
    }
    log("wait for head complete");
  };
  const waitForHead = () => {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        observer.disconnect();
        resolve();
      });
      observer.observe(document.documentElement, { childList: true });
    });
  };
  const waitForHeadBuild = () => {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList" && mutation.target === document.head) {
            observer.disconnect();
            resolve();
          }
        }
      });
      observer.observe(document.head, { childList: true });
    });
  };
  class Panel {
    constructor() {
      __publicField(this, "panelCSS", `
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
        border: 1px solid #ddd;
        margin-top: 3px;
        margin-bottom: 3px;
    }
    .bili-cleaner-group-title {
        font-size: 22px;
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
    .bili-cleaner-item-list hr {
        border: 1px solid #eee;
        margin: 12px 15px;
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
    }`);
      __publicField(this, "panelHTML", `
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
    </div>`);
    }
    /**
     * 向document.head中添加panel CSS
     */
    insertPanelCSS() {
      try {
        if (document.head.querySelector("#bili-cleaner-panel-css")) {
          return;
        }
        const style = document.createElement("style");
        style.innerHTML = this.panelCSS.trim();
        style.setAttribute("id", "bili-cleaner-panel-css");
        document.head.appendChild(style);
        debug("insertPanelCSS OK");
      } catch (err) {
        error(`insertPanelCSS failed`);
        error(err);
      }
    }
    /**
     * 向document.body后添加panel html代码
     */
    insertPanelHTML() {
      try {
        if (document.getElementById("bili-cleaner")) {
          return;
        }
        const html = document.createElement("div");
        html.setAttribute("id", "bili-cleaner");
        html.innerHTML = this.panelHTML;
        document.body.appendChild(html);
        debug("insertPanelHTML OK");
      } catch (err) {
        error(`insertPanelHTML failed`);
        error(err);
      }
    }
    /**
     * 右上角关闭按钮
     */
    watchCloseBtn() {
      try {
        const panel = document.getElementById("bili-cleaner");
        const closeBtn = document.getElementById("bili-cleaner-close");
        closeBtn.addEventListener("click", () => {
          panel.remove();
        });
        debug("watchCloseBtn OK");
      } catch (err) {
        error(`watchCloseBtn failed`);
        error(err);
      }
    }
    /**
     * 可拖拽panel bar, 拖拽panel顶部的bar可移动panel, 其他区域不可拖拽
     */
    draggableBar() {
      try {
        const panel = document.getElementById("bili-cleaner");
        const bar = document.getElementById("bili-cleaner-bar");
        let isDragging = false;
        let initX, initY, initLeft, initTop;
        bar.addEventListener("mousedown", (e) => {
          isDragging = true;
          initX = e.clientX;
          initY = e.clientY;
          const c = window.getComputedStyle(panel);
          initLeft = parseInt(c.getPropertyValue("left"), 10);
          initTop = parseInt(c.getPropertyValue("top"), 10);
        });
        document.addEventListener("mousemove", (e) => {
          if (isDragging) {
            const diffX = e.clientX - initX;
            const diffY = e.clientY - initY;
            panel.style.left = `${initLeft + diffX}px`;
            panel.style.top = `${initTop + diffY}px`;
          }
        });
        document.addEventListener("mouseup", () => {
          isDragging = false;
        });
        debug("draggableBar OK");
      } catch (err) {
        error(`draggableBar failed`);
        error(err);
      }
    }
    /**
     * 创建Panel流程
     */
    createPanel() {
      this.insertPanelCSS();
      this.insertPanelHTML();
      this.watchCloseBtn();
      this.draggableBar();
    }
  }
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  class NormalItem {
    /**
     * @param itemID item的唯一ID, 与GM database中的Key对应, 使用相同ID可共享item状态
     * @param description item的功能介绍, 显示在panel内
     * @param defaultStatus item默认开启状态, 第一次安装时使用, 对于所有用户均开启的项目默认给true
     * @param itemFunc 功能函数
     * @param isItemFuncReload 功能函数是否在URL变动时重新运行
     * @param itemCSS item的CSS
     */
    constructor(itemID, description, defaultStatus, itemFunc, isItemFuncReload, itemCSS) {
      __publicField(this, "uncheckedHTML", `<input class="bili-cleaner-item-switch" type="checkbox">`);
      __publicField(this, "checkedHTML", `<input class="bili-cleaner-item-switch" type="checkbox" checked>`);
      __publicField(this, "isEnable");
      // item对应的HTML input node
      __publicField(this, "itemEle");
      this.itemID = itemID;
      this.description = description;
      this.defaultStatus = defaultStatus;
      this.itemFunc = itemFunc;
      this.isItemFuncReload = isItemFuncReload;
      this.itemCSS = itemCSS;
      this.isEnable = false;
      this.itemEle = void 0;
    }
    /**
     * 设定并记录item开关状态
     * @param value checkbox开关状态
     */
    setStatus(value) {
      _GM_setValue(`BILICLEANER_${this.itemID}`, value);
      this.isEnable = value;
    }
    /** 获取item开关状态, 若第一次安装时不存在该key, 使用默认值 */
    getStatus() {
      this.isEnable = _GM_getValue(`BILICLEANER_${this.itemID}`, this.defaultStatus);
      this.setStatus(this.isEnable);
    }
    /**
     * 在相应group内添加item
     * @param groupID item所属groupID, 由Group调用insertItem时传入
     */
    insertItem(groupID) {
      try {
        this.getStatus();
        const e = document.createElement("label");
        e.id = this.itemID;
        if (this.isEnable) {
          e.innerHTML = this.checkedHTML + this.description;
        } else {
          e.innerHTML = this.uncheckedHTML + this.description;
        }
        const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`);
        if (itemGroupList) {
          itemGroupList.appendChild(e);
          debug(`insertItem ${this.itemID} OK`);
        }
      } catch (err) {
        error(`insertItem ${this.itemID} err`);
        error(err);
      }
    }
    /** 启用CSS片段, 向document.head插入style */
    insertItemCSS() {
      if (!this.itemCSS) {
        return;
      }
      try {
        if (document.querySelector(`head style[bili-cleaner-css=${this.itemID}]`)) {
          debug(`insertItemCSS ${this.itemID} CSS exist, ignore`);
          return;
        }
        const style = document.createElement("style");
        style.innerHTML = this.itemCSS.trim();
        style.setAttribute("bili-cleaner-css", this.itemID);
        document.head.appendChild(style);
        debug(`insertItemCSS ${this.itemID} OK`);
      } catch (err) {
        error(`insertItemCSS ${this.itemID} failed`);
        error(err);
      }
    }
    /** 停用CSS片段, 从document.head移除style */
    removeItemCSS() {
      var _a;
      if (this.itemCSS) {
        const style = document.querySelector(`head style[bili-cleaner-css=${this.itemID}]`);
        if (style) {
          (_a = style.parentNode) == null ? void 0 : _a.removeChild(style);
          debug(`removeItemCSS ${this.itemID} OK`);
        }
      }
    }
    /** 监听item chekbox开关 */
    watchItem() {
      try {
        this.itemEle = document.getElementById(this.itemID);
        this.itemEle.addEventListener("change", (event) => {
          if (event.target.checked) {
            this.setStatus(true);
            this.insertItemCSS();
          } else {
            this.setStatus(false);
            this.removeItemCSS();
          }
        });
        debug(`watchItem ${this.itemID} OK`);
      } catch (err) {
        error(`watchItem ${this.itemID} err`);
        error(err);
      }
    }
    /** 执行item功能, 在页面head添加CSS并执行func */
    enableItem() {
      this.getStatus();
      if (this.isEnable) {
        try {
          this.insertItemCSS();
          if (this.itemFunc instanceof Function) {
            this.itemFunc();
            debug(`enableItem ${this.itemID} OK`);
          }
        } catch (err) {
          error(`enableItem ${this.itemID} Error`);
          error(err);
        }
      }
    }
    /**
     * 重载item, 用于非页面刷新但URL变动情况, 此时已注入CSS只重新运行func, 如: 非刷新式切换视频
     */
    reloadItem() {
      if (this.isItemFuncReload && this.isEnable && this.itemFunc instanceof Function) {
        try {
          this.itemFunc();
          debug(`reloadItem ${this.itemID} OK`);
        } catch (err) {
          error(`reloadItem ${this.itemID} Error`);
          error(err);
        }
      }
    }
  }
  class SeparatorItem {
    constructor() {
    }
    /**
     * 向item list中添加分隔符<hr>, 用于划分功能组别
     * @param groupID 由调用SeparatorItem的上级Group提供
     */
    insertItem(groupID) {
      try {
        const e = document.createElement("hr");
        const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`);
        if (itemGroupList) {
          itemGroupList.appendChild(e);
          debug(`insertItem separator OK`);
        }
      } catch (err) {
        error(`insertItem separator err`);
        error(err);
      }
    }
  }
  class Group {
    /**
     * Group是每个页面的规则集合
     * @param groupID group的唯一ID
     * @param title group标题, 显示在group顶部
     * @param items group内功能列表
     */
    constructor(groupID, title, items) {
      __publicField(this, "groupHTML", `
    <div class="bili-cleaner-group">
        <div class="bili-cleaner-group-title">
        </div>
        <hr>
        <div class="bili-cleaner-item-list">
        </div>
    </div>`);
      this.groupID = groupID;
      this.title = title;
      this.items = items;
      this.groupID = "bili-cleaner-group-" + groupID;
    }
    // 在panel内添加一个group
    insertGroup() {
      const e = document.createElement("div");
      e.innerHTML = this.groupHTML;
      e.querySelector(".bili-cleaner-group").id = this.groupID;
      e.querySelector(".bili-cleaner-group-title").textContent = this.title;
      const groupList = document.getElementById("bili-cleaner-group-list");
      groupList.appendChild(e);
    }
    // 添加group内item并监听状态
    insertGroupItems() {
      try {
        this.items.forEach((e) => {
          e.insertItem(this.groupID);
          if (e instanceof NormalItem) {
            e.watchItem();
          }
        });
        debug(`insertGroupItems ${this.groupID} OK`);
      } catch (err) {
        error(`insertGroupItems ${this.groupID} err`);
        error(err);
      }
    }
    // 启用group，启用group内items
    enableGroup() {
      try {
        this.items.forEach((e) => {
          if (e instanceof NormalItem) {
            e.enableItem();
          }
        });
        debug(`enableGroup ${this.groupID} OK`);
      } catch (err) {
        error(`enableGroup ${this.groupID} err`);
        error(err);
      }
    }
    reloadGroup() {
      try {
        this.items.forEach((e) => {
          if (e instanceof NormalItem) {
            e.reloadItem();
          }
        });
        debug(`reloadGroup ${this.groupID} OK`);
      } catch (err) {
        error(`reloadGroup ${this.groupID} err`);
        error(err);
      }
    }
  }
  const homepageItems = [];
  if (location.href.startsWith("https://www.bilibili.com/") && ["/index.html", "/"].includes(location.pathname)) {
    homepageItems.push(
      new NormalItem(
        "homepage-border-radius",
        "页面直角化 去除圆角",
        false,
        void 0,
        false,
        `#nav-searchform,
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
            .v-popover-content {
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
            }`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-banner",
        "隐藏 横幅banner",
        false,
        void 0,
        false,
        `.header-banner__inner, .bili-header__banner {
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
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-recommend-swipe",
        "隐藏 大图活动轮播",
        true,
        void 0,
        false,
        `.recommended-swipe {
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
            }`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-subarea",
        "隐藏 整个分区栏",
        false,
        void 0,
        false,
        `.bili-header__channel .channel-icons {
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
            }`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-sticky-header",
        "隐藏 滚动页面时 顶部吸附顶栏",
        false,
        void 0,
        false,
        `.bili-header .left-entry__title svg {
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
            .bilibili-app-recommend-root .area-header {
                top: 0 !important;
            }`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-sticky-subarea",
        "隐藏 滚动页面时 顶部吸附分区栏",
        true,
        void 0,
        false,
        `#i_cecream .header-channel {display: none !important;}`
      )
    );
    homepageItems.push(new SeparatorItem());
    homepageItems.push(
      new NormalItem(
        "homepage-hide-up-info-icon",
        "隐藏 视频tag (已关注/1万点赞)",
        false,
        void 0,
        false,
        `/* CSS伪造Logo */
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
            }`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-danmaku-count",
        "隐藏 弹幕数",
        true,
        void 0,
        false,
        `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__stats--item:nth-child(2) {visibility: hidden;}`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-video-info-date",
        "隐藏 发布时间",
        false,
        void 0,
        false,
        `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__info--date {display: none !important;}`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-bili-watch-later",
        "隐藏 稍后再看按钮",
        false,
        void 0,
        false,
        `.bili-watch-later {display: none !important;}`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-ad-card",
        "隐藏 推荐视频中的广告",
        true,
        void 0,
        false,
        `.feed-card:has(.bili-video-card__info--ad, [href*="cm.bilibili.com"]) {
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
            }`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-live-card-recommend",
        "隐藏 直播间推荐",
        false,
        void 0,
        false,
        `.bili-live-card.is-rcmd {display: none !important;}`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-sub-area-card-recommend",
        "隐藏 分区视频推荐",
        false,
        void 0,
        false,
        `.floor-single-card {display: none !important;}`
      )
    );
    homepageItems.push(new SeparatorItem());
    homepageItems.push(
      new NormalItem(
        "homepage-hide-flexible-roll-btn",
        "隐藏 右下角-刷新",
        false,
        void 0,
        false,
        `.palette-button-wrap .flexible-roll-btn {display: none !important;}`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-feedback",
        "隐藏 右下角-客服和反馈",
        true,
        void 0,
        false,
        `.palette-button-wrap .storage-box {display: none !important;}`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-top-btn",
        "隐藏 右下角-回顶部",
        false,
        void 0,
        false,
        `.palette-button-wrap .top-btn-wrap {display: none !important;}`
      )
    );
    homepageItems.push(new SeparatorItem());
    homepageItems.push(
      new NormalItem(
        "homepage-hide-up-info-icon-bilibili-app-recommend",
        "隐藏 视频tag (bilibili-app-recommend)",
        false,
        void 0,
        false,
        `/* adapt bilibili-app-recommend */
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
            }`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-danmaku-count-bilibili-app-recommend",
        "隐藏 弹幕数 (bilibili-app-recommend)",
        false,
        void 0,
        false,
        `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-video-danmaku"]) {display: none !important;}`
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-agree-count-bilibili-app-recommend",
        "隐藏 点赞数 (bilibili-app-recommend)",
        false,
        void 0,
        false,
        `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-agree"]) {display: none !important;}`
      )
    );
  }
  const homepageGroup = new Group("homepage", "当前是：首页", homepageItems);
  log("script start");
  try {
    init();
  } catch (err) {
    error(err);
    error("FATAL ERROR, EXIT");
  }
  const Groups = [homepageGroup];
  Groups.forEach((e) => e.enableGroup());
  const openSettings = () => {
    if (document.getElementById("bili-cleaner")) {
      return;
    }
    debug("panel create start");
    const panel = new Panel();
    panel.createPanel();
    Groups.forEach((e) => {
      e.insertGroup();
      e.insertGroupItems();
    });
    debug("panel create complete");
  };
  _GM_registerMenuCommand("设置", openSettings);
  debug("register menu complete");
  log("script end");

})();
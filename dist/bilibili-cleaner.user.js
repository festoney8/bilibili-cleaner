// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @author       festoney8
// @description  净化 B站/哔哩哔哩 页面内各种元素，去广告，BV号转AV号，提供300+项功能，定制自己的B站页面
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://github.com/festoney8/bilibili-cleaner
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
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const debugMode = true;
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
        width: 33vw;
        height: 90vh;
        border-radius: 10px;
        background: rgba(250, 250, 250, 1);
        box-shadow: 0 2px 5px rgba(251, 114, 153, 1);
        overflow: auto;
        z-index: 2147483647;
    }
    #bili-cleaner-bar {
        width: 33vw;
        height: 6vh;
        background: rgba(251, 114, 153, 1);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        cursor: move;
        user-select: none;
    }
    #bili-cleaner-title {
        width: 33vw;
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
        border: 1px solid #eee;
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
        margin: 15px 20px;
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
      this.isEnable = void 0;
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
      this.isEnable = _GM_getValue(`BILICLEANER_${this.itemID}`);
      if (this.isEnable === void 0) {
        this.isEnable = this.defaultStatus;
        this.setStatus(this.isEnable);
      }
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
    /**
     * @returns group内规则是否为空
     */
    isEmpty() {
      return this.items.length === 0;
    }
    /** 在panel内添加一个group */
    insertGroup() {
      const e = document.createElement("div");
      e.innerHTML = this.groupHTML;
      e.querySelector(".bili-cleaner-group").id = this.groupID;
      e.querySelector(".bili-cleaner-group-title").textContent = this.title;
      const groupList = document.getElementById("bili-cleaner-group-list");
      groupList.appendChild(e);
    }
    /** 插入group内item列表, 并逐一监听 */
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
    /** 启用group，启用group内items */
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
    /** 在URL变动时, 重载group内需要重载的项目 */
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
            }
            /* 压缩分区栏高度, 压缩16px */
            @media (max-width: 1099.9px) {.bili-header .bili-header__channel {height:84px!important}}
            @media (min-width: 1100px) and (max-width: 1366.9px) {.bili-header .bili-header__channel {height:84px!important}}
            @media (min-width: 1367px) and (max-width: 1700.9px) {.bili-header .bili-header__channel {height:94px!important}}
            @media (min-width: 1701px) and (max-width: 2199.9px) {.bili-header .bili-header__channel {height:104px!important}}
            @media (min-width: 2200px) {.bili-header .bili-header__channel {height:114px!important}}
            `
      )
    );
    homepageItems.push(
      new NormalItem(
        "homepage-hide-subarea",
        "隐藏 整个分区栏",
        false,
        void 0,
        false,
        // 高权限, 否则被压缩分区栏高度影响
        `#i_cecream .bili-header__channel .channel-icons {
                display: none !important;
            }
            #i_cecream .bili-header__channel .right-channel-container {
                display: none !important;
            }
            /* adapt bilibili-app-recommend */
            #i_cecream .bili-header__channel {
                height: 0 !important;
            }
            #i_cecream main.bili-feed4-layout:not(:has(.bilibili-app-recommend-root)) {
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
  const cleanURL = () => {
    const keysToRemove = /* @__PURE__ */ new Set([
      "from_source",
      "spm_id_from",
      "search_source",
      "vd_source",
      "unique_k",
      "is_story_h5",
      "from_spmid",
      "share_plat",
      "share_medium",
      "share_from",
      "share_source",
      "share_tag",
      "up_id",
      "timestamp",
      "mid",
      "live_from",
      "launch_id",
      "session_id",
      "share_session_id",
      "broadcast_type",
      "is_room_feed",
      "spmid",
      "plat_id",
      "goto",
      "report_flow_data",
      "trackid",
      "live_form",
      "track_id",
      "from",
      "visit_id"
    ]);
    const url = location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const temp = [];
    for (const k of params.keys()) {
      if (keysToRemove.has(k)) {
        temp.push(k);
      }
    }
    for (const k of temp) {
      params.delete(k);
    }
    if (params.has("p") && params.get("p") == "1") {
      params.delete("p");
    }
    urlObj.search = params.toString();
    let newURL = urlObj.toString();
    if (newURL.endsWith("/")) {
      newURL = newURL.slice(0, -1);
    }
    if (newURL !== url) {
      history.replaceState(null, "", newURL);
    }
    debug("cleanURL complete");
  };
  const commonItems = [];
  commonItems.push(new NormalItem("url-cleaner", "URL参数净化 (需刷新, 给UP充电时需关闭)", false, cleanURL, true, null));
  commonItems.push(
    new NormalItem(
      "beauty-scrollbar",
      "美化页面滚动条",
      true,
      void 0,
      false,
      `
        /* WebKit */
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

        /* Firefox */
        * {
            scrollbar-color: rgba(0, 0, 0, 0.6) transparent !important;
            scrollbar-width: thin !important;
        }
        `
    )
  );
  if (location.host != "live.bilibili.com") {
    commonItems.push(new SeparatorItem());
    commonItems.push(
      new NormalItem(
        "common-hide-nav-homepage-logo",
        "隐藏 顶栏-主站Logo",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com"]) svg {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-homepage",
        "隐藏 顶栏-首页",
        false,
        void 0,
        false,
        `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) span {display: none !important;}
            div.bili-header__bar .left-entry .v-popover-wrap:has(>a[href="//www.bilibili.com"]) div {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-anime",
        "隐藏 顶栏-番剧",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com/anime/"])  {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-live",
        "隐藏 顶栏-直播",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(>a[href="//live.bilibili.com"])  {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-game",
        "隐藏 顶栏-游戏中心",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(>a[href^="//game.bilibili.com"])  {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-vipshop",
        "隐藏 顶栏-会员购",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(>a[href^="//show.bilibili.com"])  {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-manga",
        "隐藏 顶栏-漫画",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(>a[href^="//manga.bilibili.com"])  {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-match",
        "隐藏 顶栏-赛事",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(>a[href^="//www.bilibili.com/match/"], >a[href^="//www.bilibili.com/v/game/match/"]) {
                display: none !important;
            }`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-moveclip",
        "隐藏 顶栏-活动/活动直播",
        false,
        void 0,
        false,
        `div.bili-header__bar li:has(.loc-mc-box) {display: none !important;}
            div.bili-header__bar .left-entry li:not(:has(.v-popover)):has([href^="https://live.bilibili.com/"]) {
                display: none !important;
            }`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-bdu",
        "隐藏 顶栏-百大评选",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(a[href*="bilibili.com/BPU20"]) {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-download-app",
        "隐藏 顶栏-下载客户端",
        true,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(a[href="//app.bilibili.com"]) {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-blackboard",
        "隐藏 顶栏-所有官方活动(blackboard)",
        false,
        void 0,
        false,
        `div.bili-header__bar .left-entry li:has(>a[href*="bilibili.com/blackboard"]) {display: none !important;}
            div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/blackboard"]) {display: none !important;}`
      )
    );
    commonItems.push(new SeparatorItem());
    commonItems.push(
      new NormalItem(
        "common-hide-nav-search-rcmd",
        "隐藏 顶栏-搜索框 推荐搜索",
        false,
        void 0,
        false,
        `#nav-searchform .nav-search-input::placeholder {color: transparent;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-search-history",
        "隐藏 顶栏-搜索框 搜索历史",
        false,
        void 0,
        false,
        `.search-panel .history {display: none;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-search-trending",
        "隐藏 顶栏-搜索框 bilibili热搜",
        false,
        void 0,
        false,
        `.search-panel .trending {display: none;}`
      )
    );
    commonItems.push(new SeparatorItem());
    commonItems.push(
      new NormalItem(
        "common-hide-nav-avatar",
        "隐藏 顶栏-头像",
        false,
        void 0,
        false,
        `.right-entry .v-popover-wrap.header-avatar-wrap {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-vip",
        "隐藏 顶栏-大会员",
        true,
        void 0,
        false,
        `.right-entry .vip-wrap:has([href="//account.bilibili.com/big"]) {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-message",
        "隐藏 顶栏-消息",
        false,
        void 0,
        false,
        `.right-entry .v-popover-wrap:has([href^="//message.bilibili.com"], [data-idx="message"]) {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-dynamic",
        "隐藏 顶栏-动态",
        false,
        void 0,
        false,
        `.right-entry .v-popover-wrap:has([href^="//t.bilibili.com"], [data-idx="dynamic"]) {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-favorite",
        "隐藏 顶栏-收藏",
        false,
        void 0,
        false,
        `.right-entry .v-popover-wrap:has(.header-favorite-container, [data-idx="fav"]) {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-history",
        "隐藏 顶栏-历史",
        false,
        void 0,
        false,
        `.right-entry .v-popover-wrap:has([href="//www.bilibili.com/account/history"], [data-idx="history"]) {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-member",
        "隐藏 顶栏-创作中心",
        false,
        void 0,
        false,
        `.right-entry .right-entry-item:has(a[href="//member.bilibili.com/platform/home"], [data-idx="creation"]) {display: none !important;}`
      )
    );
    commonItems.push(
      new NormalItem(
        "common-hide-nav-upload",
        "隐藏 顶栏-投稿",
        false,
        void 0,
        false,
        // 不可设定 display: none, 会导致历史和收藏popover显示不全
        `.right-entry .right-entry-item.right-entry-item--upload {visibility: hidden !important;}`
      )
    );
  }
  const commonGroup = new Group("common", "通用", commonItems);
  function bv2av() {
    function dec(x) {
      const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
      const tr = {};
      for (let i = 0; i < 58; i++) {
        tr[table[i]] = i;
      }
      const s = [11, 10, 3, 8, 4, 6];
      const xor = 177451812;
      const add = 8728348608;
      let r = 0;
      for (let i = 0; i < 6; i++) {
        r += tr[x[s[i]]] * 58 ** i;
      }
      return r - add ^ xor;
    }
    if (location.href.includes("bilibili.com/video/BV")) {
      const regex = /bilibili.com\/video\/(BV[0-9a-zA-Z]+)/;
      const match = regex.exec(location.href);
      if (match) {
        let partNum = "";
        const params = new URLSearchParams(location.search);
        if (params.has("p")) {
          partNum += `?p=${params.get("p")}`;
        }
        const aid = dec(match[1]);
        const newURL = `https://www.bilibili.com/video/av${aid}${partNum}${location.hash}`;
        history.replaceState(null, "", newURL);
        debug("bv2av complete");
      }
    }
  }
  let isSimpleShareBtn = false;
  function simpleShare() {
    if (isSimpleShareBtn) {
      return;
    }
    let shareBtn;
    let counter = 0;
    const checkElement = setInterval(() => {
      counter++;
      shareBtn = document.getElementById("share-btn-outer");
      if (shareBtn) {
        isSimpleShareBtn = true;
        clearInterval(checkElement);
        shareBtn.addEventListener("click", () => {
          var _a;
          let title = (_a = document.querySelector("#viewbox_report > h1")) == null ? void 0 : _a.textContent;
          if (!"（({【[［《「＜｛〔〖<〈『".includes(title[0])) {
            title = `【${title}】`;
          }
          let urlPath = location.pathname;
          if (urlPath.endsWith("/")) {
            urlPath = urlPath.slice(0, -1);
          }
          const urlObj = new URL(location.href);
          const params = new URLSearchParams(urlObj.search);
          let shareText = `${title} 
https://www.bilibili.com${urlPath}`;
          if (params.has("p")) {
            shareText += `?p=${params.get("p")}`;
          }
          navigator.clipboard.writeText(shareText);
        });
        debug("simpleShare complete");
      } else if (counter > 50) {
        clearInterval(checkElement);
        debug("simpleShare timeout");
      }
    }, 200);
  }
  const videoItems = [];
  if (location.href.startsWith("https://www.bilibili.com/video/")) {
    videoItems.push(new NormalItem("video-page-bv2av", "BV号转AV号 (需刷新)", false, bv2av, true, null));
    videoItems.push(
      new NormalItem(
        "video-page-simple-share",
        "净化分享功能 (需刷新)",
        true,
        simpleShare,
        false,
        `.video-share-popover .video-share-dropdown .dropdown-bottom {display: none !important;}
            .video-share-popover .video-share-dropdown .dropdown-top {padding: 15px !important;}
            .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-right {display: none !important;}
            .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-left {padding-right: 0 !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-border-radius",
        "页面直角化 去除圆角",
        false,
        void 0,
        false,
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
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-fixed-header",
        "顶栏 滚动页面后不再吸附顶部",
        false,
        void 0,
        false,
        `.fixed-header .bili-header__bar {position: relative !important;}`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-video-info-danmaku-count",
        "隐藏 视频信息-弹幕数",
        false,
        void 0,
        false,
        `.video-info-detail .dm {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-video-info-pubdate",
        "隐藏 视频信息-发布日期",
        false,
        void 0,
        false,
        `.video-info-detail .pubdate-ip {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-video-info-copyright",
        "隐藏 视频信息-版权声明",
        false,
        void 0,
        false,
        `.video-info-detail .copyright {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-video-info-honor",
        "隐藏 视频信息-视频荣誉(排行榜/每周必看)",
        false,
        void 0,
        false,
        `.video-info-detail .honor-rank, .video-info-detail .honor-weekly {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-video-info-argue",
        "隐藏 视频信息-温馨提示(饮酒/危险/AI生成)",
        true,
        void 0,
        false,
        `.video-info-detail .argue, .video-info-detail .video-argue {display: none !important;}`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-bili-guide-all",
        "隐藏 播放器-视频内 一键三连窗口",
        false,
        void 0,
        false,
        `.bpx-player-video-area .bili-guide, .bpx-player-video-area .bili-guide-all {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-bili-vote",
        "隐藏 播放器-视频内 投票",
        false,
        void 0,
        false,
        `.bpx-player-video-area .bili-vote, .bpx-player-video-area .bili-cmd-shrink {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-bili-score",
        "隐藏 播放器-视频内 评分",
        false,
        void 0,
        false,
        `.bpx-player-video-area .bili-score {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-bili-reserve",
        "隐藏 播放器-视频内 视频预告",
        false,
        void 0,
        false,
        `.bpx-player-video-area .bili-reserve {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-bili-link",
        "隐藏 播放器-视频内 视频链接",
        false,
        void 0,
        false,
        `.bpx-player-video-area .bili-link {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-top-issue",
        "隐藏 播放器-右上角 反馈按钮",
        true,
        void 0,
        false,
        `.bpx-player-top-issue {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-top-left-title",
        "隐藏 播放器-左上角 播放器内标题",
        false,
        void 0,
        false,
        `.bpx-player-top-title {display: none !important;}
            .bpx-player-top-left-title {display: none !important;}
            /* 播放器上方阴影渐变 */
            .bpx-player-top-mask {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-top-left-music",
        "隐藏 播放器-左上角 视频音乐链接",
        false,
        void 0,
        false,
        `.bpx-player-top-left-music {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-top-left-follow",
        "隐藏 播放器-左上角 关注UP主",
        true,
        void 0,
        false,
        `.bpx-player-top-left-follow {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-state-wrap",
        "隐藏 播放器-视频暂停时大Logo",
        false,
        void 0,
        false,
        `.bpx-player-state-wrap {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dialog-wrap",
        "隐藏 播放器-弹幕悬停点赞/复制/举报",
        false,
        void 0,
        false,
        `.bpx-player-dialog-wrap {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-bpx-player-bili-high-icon",
        "隐藏 播放器-高赞弹幕前点赞按钮",
        false,
        void 0,
        false,
        `.bili-dm .bili-high-icon {display: none !important}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-bpx-player-bili-dm-vip-white",
        "播放器-彩色渐变弹幕 变成白色",
        false,
        void 0,
        false,
        `#bilibili-player .bili-dm>.bili-dm-vip {
                background: unset !important;
                background-size: unset !important;
                /* 父元素未指定 var(--textShadow), 默认重墨描边凑合用 */
                text-shadow: 1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000 !important;
                text-stroke: none !important;
                -webkit-text-stroke: none !important;
                -moz-text-stroke: none !important;
                -ms-text-stroke: none !important;
            }`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-prev",
        "隐藏 播放控制-上一个视频",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-prev {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-play",
        "隐藏 播放控制-播放/暂停",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-play {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-next",
        "隐藏 播放控制-下一个视频",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-next {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-viewpoint",
        "隐藏 播放控制-章节列表",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-viewpoint {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-pip",
        "隐藏 播放控制-画中画(Chrome)",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-pip {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-eplist",
        "隐藏 播放控制-选集",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-eplist {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-wide",
        "隐藏 播放控制-宽屏",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-wide {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-volume",
        "隐藏 播放控制-音量",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-volume {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-subtitle",
        "隐藏 播放控制-字幕",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-subtitle {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-playbackrate",
        "隐藏 播放控制-倍速",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-playbackrate {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-setting",
        "隐藏 播放控制-视频设置",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-setting {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-shadow-progress-area",
        "隐藏 播放控制-底边mini视频进度",
        true,
        void 0,
        false,
        `.bpx-player-shadow-progress-area {display: none !important;}`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-video-info-online",
        "隐藏 弹幕栏-同时在看人数",
        false,
        void 0,
        false,
        `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-video-info-dm",
        "隐藏 弹幕栏-载入弹幕数量",
        false,
        void 0,
        false,
        `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-switch",
        "隐藏 弹幕栏-弹幕启用",
        false,
        void 0,
        false,
        `.bpx-player-dm-switch {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-setting",
        "隐藏 弹幕栏-弹幕显示设置",
        false,
        void 0,
        false,
        `.bpx-player-dm-setting {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-video-btn-dm",
        "隐藏 弹幕栏-弹幕样式",
        false,
        void 0,
        false,
        `.bpx-player-video-btn-dm {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-input",
        "隐藏 弹幕栏-占位文字",
        true,
        void 0,
        false,
        `.bpx-player-dm-input::placeholder {color: transparent !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-hint",
        "隐藏 弹幕栏-弹幕礼仪",
        true,
        void 0,
        false,
        `.bpx-player-dm-hint {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-btn-send",
        "隐藏 弹幕栏-发送按钮",
        false,
        void 0,
        false,
        `.bpx-player-dm-btn-send {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-postpanel",
        "隐藏 弹幕栏-智能弹幕/广告弹幕",
        false,
        void 0,
        false,
        `.bpx-player-postpanel-sug,
            .bpx-player-postpanel-carousel,
            .bpx-player-postpanel-popup {
                color: transparent !important;
            }`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-sending-area",
        "隐藏 弹幕栏-关闭整个弹幕栏",
        false,
        void 0,
        false,
        `.bpx-player-sending-area {display: none !important;}
            /* video page的player, height由JS动态设定, 无法去黑边 */
            #bilibili-player-wrap {height: calc(var(--video-width)*.5625)}`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-video-share-popover",
        "隐藏 视频下方-分享按钮弹出菜单",
        false,
        void 0,
        false,
        `.video-share-popover {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-below-info-video-ai-assistant",
        "隐藏 视频下方-官方AI总结",
        false,
        void 0,
        false,
        `.video-toolbar-right .video-ai-assistant {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-below-info-video-note",
        "隐藏 视频下方-记笔记",
        false,
        void 0,
        false,
        `.video-toolbar-right .video-note {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-below-info-video-report-menu",
        "隐藏 视频下方-举报/笔记/稍后再看",
        false,
        void 0,
        false,
        `.video-toolbar-right .video-tool-more {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-below-info-desc",
        "隐藏 视频下方-视频简介",
        false,
        void 0,
        false,
        `#v_desc {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-below-info-tag",
        "隐藏 视频下方-tag列表",
        false,
        void 0,
        false,
        `#v_tag {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-below-activity-vote",
        "隐藏 视频下方-活动宣传",
        true,
        void 0,
        false,
        `#activity_vote {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-below-bannerAd",
        "隐藏 视频下方-广告banner",
        true,
        void 0,
        false,
        `#bannerAd {display: none !important;}`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-up-sendmsg",
        "隐藏 UP主信息-给UP发消息",
        true,
        void 0,
        false,
        `.up-detail .send-msg {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-up-description",
        "隐藏 UP主信息-UP简介",
        false,
        void 0,
        false,
        `.up-detail .up-description {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-up-charge",
        "隐藏 UP主信息-充电",
        false,
        void 0,
        false,
        `.upinfo-btn-panel .new-charge-btn, .upinfo-btn-panel .old-charge-btn {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-up-bili-avatar-pendent-dom",
        "隐藏 UP主信息-UP主头像外饰品",
        false,
        void 0,
        false,
        `.up-info-container .bili-avatar-pendent-dom {display: none !important;}
            .up-avatar-wrap .up-avatar {background-color: transparent !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-up-membersinfo-normal-header",
        "隐藏 UP主信息-创作团队header",
        true,
        void 0,
        false,
        `.membersinfo-normal .header {display: none !important;}`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-ad",
        "隐藏 右栏-广告",
        true,
        void 0,
        false,
        `#slide_ad {display: none !important;}
            .ad-report.video-card-ad-small {display: none !important;}
            .video-page-special-card-small {display: none !important;}
            #reco_list {margin-top: 0 !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-video-page-game-card-small",
        "隐藏 右栏-游戏推荐",
        false,
        void 0,
        false,
        `#reco_list .video-page-game-card-small {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-danmaku",
        "隐藏 右栏-弹幕列表",
        true,
        void 0,
        false,
        `
            /* 不可使用 display:none 否则播放器宽屏模式下danmukuBox的margin-top失效，导致视频覆盖右侧列表 */
            #danmukuBox {
                visibility: hidden !important;
                height: 0 !important;
                margin-bottom: 0 !important;
            }`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-reco-list-next-play-next-button",
        "隐藏 右栏-自动连播按钮",
        false,
        void 0,
        false,
        `#reco_list .next-play .next-button {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-section-height",
        "右栏 视频合集 增加合集列表高度",
        true,
        void 0,
        false,
        `.base-video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important};
            .video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important};`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-section-next-btn",
        "隐藏 右栏-视频合集 自动连播",
        false,
        void 0,
        false,
        `.base-video-sections-v1 .next-button {display: none !important;}
            .video-sections-head_first-line .next-button {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-section-play-num",
        "隐藏 右栏-视频合集 播放量",
        false,
        void 0,
        false,
        `.base-video-sections-v1 .play-num {display: none !important;}
            .video-sections-head_second-line .play-num {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-section-abstract",
        "隐藏 右栏-视频合集 简介",
        true,
        void 0,
        false,
        `.base-video-sections-v1 .abstract {display: none !important;}
            .base-video-sections-v1 .second-line_left img {display: none !important;}
            .video-sections-head_second-line .abstract {display: none !important;}
            .video-sections-head_second-line .second-line_left img {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-section-subscribe",
        "隐藏 右栏-视频合集 订阅合集",
        false,
        void 0,
        false,
        `.base-video-sections-v1 .second-line_right {display: none !important;}
            .video-sections-head_second-line .second-line_right {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-multi-page-next-btn",
        "隐藏 右栏-分P视频 自动连播",
        false,
        void 0,
        false,
        `#multi_page .next-button {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-reco-list-watch-later-video",
        "隐藏 右栏-相关视频 稍后再看按钮",
        false,
        void 0,
        false,
        `#reco_list .watch-later-video {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-reco-list-rec-list-info-up",
        "隐藏 右栏-相关视频 UP主",
        false,
        void 0,
        false,
        `#reco_list .info .upname {
                display: none !important;
            }
            #reco_list .info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-reco-list-rec-list-info-plays",
        "隐藏 右栏-相关视频 播放和弹幕",
        false,
        void 0,
        false,
        `#reco_list .info .playinfo {
                display: none !important;
            }
            #reco_list .info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-duration",
        "隐藏 右栏-相关视频 视频时长",
        false,
        void 0,
        false,
        `#reco_list .duration {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-reco-list-rec-list",
        "隐藏 右栏-全部相关视频",
        false,
        void 0,
        false,
        `#reco_list .rec-list {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-right-bottom-banner",
        "隐藏 右栏-活动banner",
        true,
        void 0,
        false,
        `#right-bottom-banner {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-right-container-live",
        "隐藏 右栏-直播间推荐",
        true,
        void 0,
        false,
        `.right-container .pop-live-small-mode {display: none !important;}`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-reply-notice",
        "隐藏 评论区-活动/notice",
        false,
        void 0,
        false,
        `#comment .reply-header .reply-notice {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-main-reply-box",
        "隐藏 评论区-整个评论框",
        false,
        void 0,
        false,
        // 不可使用display: none, 会使底部吸附评论框宽度变化
        `#comment .main-reply-box {height: 0 !important; visibility: hidden !important;}
            #comment .reply-list {margin-top: -20px !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-fixed-reply-box",
        "隐藏 评论区-页面底部 吸附评论框",
        true,
        void 0,
        false,
        `#comment .fixed-reply-box {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-reply-box-textarea-placeholder",
        "隐藏 评论区-评论编辑器内占位文字",
        true,
        void 0,
        false,
        `.main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
            .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-reply-decorate",
        "隐藏 评论区-评论内容右侧装饰",
        false,
        void 0,
        false,
        `#comment .reply-decorate {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-fan-badge",
        "隐藏 评论区-ID后粉丝牌",
        false,
        void 0,
        false,
        `#comment .fan-badge {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-user-level",
        "隐藏 评论区-一级评论用户等级",
        false,
        void 0,
        false,
        `#comment .user-level {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-sub-user-level",
        "隐藏 评论区-二级评论用户等级",
        false,
        void 0,
        false,
        `#comment .sub-user-level {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bili-avatar-pendent-dom",
        "隐藏 评论区-用户头像外圈饰品",
        false,
        void 0,
        false,
        `#comment .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            #comment .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-bili-avatar-nft-icon",
        "隐藏 评论区-用户头像右下小icon",
        false,
        void 0,
        false,
        `#comment .bili-avatar-nft-icon {display: none !important;}
            #comment .bili-avatar-icon {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-reply-tag-list",
        "隐藏 评论区-评论内容下tag(UP觉得很赞)",
        false,
        void 0,
        false,
        `#comment .reply-tag-list {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-note-prefix",
        "隐藏 评论区-笔记评论前的小Logo",
        true,
        void 0,
        false,
        `#comment .note-prefix {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-jump-link-search-word",
        "隐藏 评论区-评论内容搜索关键词高亮",
        true,
        void 0,
        false,
        `#comment .reply-content .jump-link.search-word {color: inherit !important;}
            #comment .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
            #comment .reply-content .icon.search-word {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-reply-content-user-highlight",
        "隐藏 评论区-二级评论中的@高亮",
        false,
        void 0,
        false,
        `#comment .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
            #comment .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-at-reply-at-bots",
        "隐藏 评论区-召唤AI机器人的评论",
        true,
        void 0,
        false,
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
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-zero-like-at-reply",
        "隐藏 评论区-包含@的 无人点赞评论",
        false,
        void 0,
        false,
        `#comment .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-at-reply-all",
        "隐藏 评论区-包含@的 全部评论",
        false,
        void 0,
        false,
        `#comment .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv1-reply",
        "隐藏 评论区-LV1 无人点赞评论",
        false,
        void 0,
        false,
        `#comment .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv2-reply",
        "隐藏 评论区-LV2 无人点赞评论",
        false,
        void 0,
        false,
        `#comment .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv3-reply",
        "隐藏 评论区-LV3 无人点赞评论",
        false,
        void 0,
        false,
        `#comment .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-root-reply-dislike-reply-btn",
        "隐藏 一级评论 踩/回复/举报 hover时显示",
        true,
        void 0,
        false,
        `#comment .reply-info:not(:has(i.disliked)) .reply-btn,
            #comment .reply-info:not(:has(i.disliked)) .reply-dislike {
                visibility: hidden;
            }
            #comment .reply-item:hover .reply-btn,
            #comment .reply-item:hover .reply-dislike {
                visibility: visible !important;
            }`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-sub-reply-dislike-reply-btn",
        "隐藏 二级评论 踩/回复/举报 hover时显示",
        true,
        void 0,
        false,
        `#comment .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
            #comment .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                visibility: hidden;
            }
            #comment .sub-reply-item:hover .sub-reply-btn,
            #comment .sub-reply-item:hover .sub-reply-dislike {
                visibility: visible !important;
            }`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-emoji-large",
        "隐藏 评论区-大表情",
        false,
        void 0,
        false,
        `#comment .emoji-large {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-emoji-large-zoom",
        "评论区-大表情变成小表情",
        false,
        void 0,
        false,
        `#comment .emoji-large {zoom: .5;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-reply-user-name-color-pink",
        "评论区-用户名 全部大会员色",
        false,
        void 0,
        false,
        `#comment .reply-item .user-name, #comment .reply-item .sub-user-name {color: #FB7299 !important;}}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-reply-user-name-color-default",
        "评论区-用户名 全部恢复默认色",
        false,
        void 0,
        false,
        `#comment .reply-item .user-name, #comment .reply-item .sub-user-name {color: #61666d !important;}}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-reply-view-image-optimize",
        "评论区-笔记图片 查看大图优化",
        true,
        void 0,
        false,
        // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
        `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
            .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
            .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
            .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
            .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
            .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`
      )
    );
    videoItems.push(new SeparatorItem());
    videoItems.push(
      new NormalItem(
        "video-page-hide-sidenav-right-container-live",
        "隐藏 右下角-小窗播放器",
        false,
        void 0,
        false,
        `.fixed-sidenav-storage .mini-player-window {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-sidenav-customer-service",
        "隐藏 右下角-客服",
        true,
        void 0,
        false,
        `.fixed-sidenav-storage .customer-service {display: none !important;}`
      )
    );
    videoItems.push(
      new NormalItem(
        "video-page-hide-sidenav-back-to-top",
        "隐藏 右下角-回顶部",
        false,
        void 0,
        false,
        `.fixed-sidenav-storage .back-to-top {display: none !important;}`
      )
    );
  }
  const videoGroup = new Group("video", "当前是：播放页", videoItems);
  const bangumiItems = [];
  let isBangumiSimpleShareBtn = false;
  const bangumiSimpleShare = () => {
    if (isBangumiSimpleShareBtn) {
      return;
    }
    let shareBtn;
    let counter = 0;
    const checkElement = setInterval(() => {
      counter++;
      shareBtn = document.getElementById("share-container-id");
      if (shareBtn) {
        isBangumiSimpleShareBtn = true;
        clearInterval(checkElement);
        shareBtn.addEventListener("click", () => {
          var _a, _b;
          const mainTitle = (_a = document.querySelector("[class^='mediainfo_mediaTitle']")) == null ? void 0 : _a.textContent;
          const subTitle = (_b = document.getElementById("player-title")) == null ? void 0 : _b.textContent;
          const shareText = `《${mainTitle}》${subTitle} 
https://www.bilibili.com${location.pathname}`;
          navigator.clipboard.writeText(shareText);
        });
        debug("bangumiSimpleShare complete");
      } else if (counter > 50) {
        clearInterval(checkElement);
        debug("bangumiSimpleShare timeout");
      }
    }, 200);
  };
  if (location.href.startsWith("https://www.bilibili.com/bangumi/play/")) {
    bangumiItems.push(
      new NormalItem(
        "video-page-simple-share",
        "净化分享功能 (需刷新)",
        true,
        bangumiSimpleShare,
        false,
        `#share-container-id [class^='Share_boxBottom'] {display: none !important;}
            #share-container-id [class^='Share_boxTop'] {padding: 15px !important;}
            #share-container-id [class^='Share_boxTopRight'] {display: none !important;}
            #share-container-id [class^='Share_boxTopLeft'] {padding: 0 !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-fixed-header",
        "顶栏 滚动页面后不再吸附顶部",
        false,
        void 0,
        false,
        `.fixed-header .bili-header__bar {position: relative !important;}`
      )
    );
    bangumiItems.push(new SeparatorItem());
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-top-left-title",
        "隐藏 播放器-播放器内标题",
        false,
        void 0,
        false,
        `.bpx-player-top-title {display: none !important;}
            /* 播放器上方阴影渐变 */
            .bpx-player-top-mask {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-bpx-player-top-follow",
        "隐藏 播放器-追番/追剧按钮 ★",
        false,
        void 0,
        false,
        `.bpx-player-top-follow {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-top-issue",
        "隐藏 播放器-反馈按钮",
        true,
        void 0,
        false,
        `.bpx-player-top-issue {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-state-wrap",
        "隐藏 播放器-视频暂停时大Logo",
        false,
        void 0,
        false,
        `.bpx-player-state-wrap {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-bpx-player-record-item-wrap",
        "隐藏 播放器-视频内封审核号(非内嵌) ★",
        true,
        void 0,
        false,
        `.bpx-player-record-item-wrap {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dialog-wrap",
        "隐藏 播放器-弹幕悬停点赞/复制/举报",
        false,
        void 0,
        false,
        `.bpx-player-dialog-wrap {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-bpx-player-bili-high-icon",
        "隐藏 播放器-高赞弹幕前点赞按钮",
        false,
        void 0,
        false,
        `.bili-high-icon {display: none !important}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-bpx-player-bili-dm-vip-white",
        "播放器-彩色渐变弹幕 变成白色",
        false,
        void 0,
        false,
        `#bilibili-player .bili-dm>.bili-dm-vip {
                background: unset !important;
                background-size: unset !important;
                /* 父元素未指定 var(--textShadow), 默认重墨描边凑合用 */
                text-shadow: 1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000 !important;
                text-stroke: none !important;
                -webkit-text-stroke: none !important;
                -moz-text-stroke: none !important;
                -ms-text-stroke: none !important;
            }`
      )
    );
    bangumiItems.push(new SeparatorItem());
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-prev",
        "隐藏 播放控制-上一个视频",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-prev {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-play",
        "隐藏 播放控制-播放/暂停",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-play {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-next",
        "隐藏 播放控制-下一个视频",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-next {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-pip",
        "隐藏 播放控制-画中画(Chrome)",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-pip {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-eplist",
        "隐藏 播放控制-选集",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-eplist {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-wide",
        "隐藏 播放控制-宽屏",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-wide {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-volume",
        "隐藏 播放控制-音量",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-volume {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-subtitle",
        "隐藏 播放控制-字幕",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-subtitle {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-playbackrate",
        "隐藏 播放控制-倍速",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-playbackrate {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-ctrl-setting",
        "隐藏 播放控制-视频设置",
        false,
        void 0,
        false,
        `.bpx-player-ctrl-setting {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-shadow-progress-area",
        "隐藏 播放控制-底边mini视频进度",
        true,
        void 0,
        false,
        `.bpx-player-shadow-progress-area {display: none !important;}`
      )
    );
    bangumiItems.push(new SeparatorItem());
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-video-info-online",
        "隐藏 弹幕栏-同时在看人数",
        false,
        void 0,
        false,
        `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-video-info-dm",
        "隐藏 弹幕栏-载入弹幕数量",
        false,
        void 0,
        false,
        `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-switch",
        "隐藏 弹幕栏-弹幕启用",
        false,
        void 0,
        false,
        `.bpx-player-dm-switch {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-setting",
        "隐藏 弹幕栏-弹幕显示设置",
        false,
        void 0,
        false,
        `.bpx-player-dm-setting {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-video-btn-dm",
        "隐藏 弹幕栏-弹幕样式",
        false,
        void 0,
        false,
        `.bpx-player-video-btn-dm {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-input",
        "隐藏 弹幕栏-占位文字",
        true,
        void 0,
        false,
        `.bpx-player-dm-input::placeholder {color: transparent !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-hint",
        "隐藏 弹幕栏-弹幕礼仪",
        true,
        void 0,
        false,
        `.bpx-player-dm-hint {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-dm-btn-send",
        "隐藏 弹幕栏-发送按钮",
        false,
        void 0,
        false,
        `.bpx-player-dm-btn-send {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bpx-player-sending-area",
        "隐藏 弹幕栏-关闭整个弹幕栏",
        false,
        void 0,
        false,
        `.bpx-player-sending-area {display: none !important;}
            /* 关闭弹幕栏后 播放器去黑边 */
            #bilibili-player-wrap[class^='video_playerNormal'] {height: calc(var(--video-width)*.5625)}
            #bilibili-player-wrap[class^='video_playerWide'] {height: calc(var(--containerWidth)*.5625)}
            `
      )
    );
    bangumiItems.push(new SeparatorItem());
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-video-share-popover",
        "隐藏 视频下方-分享按钮弹出菜单",
        false,
        void 0,
        false,
        `#share-container-id [class^='Share_share'] {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-watch-on-phone",
        "隐藏 视频下方-用手机观看 ★",
        true,
        void 0,
        false,
        `.toolbar span:has(>[class^='Phone_mobile']) {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-watch-together",
        "隐藏 视频下方-一起看 ★",
        true,
        void 0,
        false,
        `.toolbar span:has(>#watch_together_tab) {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-toolbar",
        "隐藏 视频下方-整个工具栏(赞币转) ★",
        false,
        void 0,
        false,
        `.player-left-components .toolbar {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-media-info",
        "隐藏 视频下方-作品介绍 ★",
        false,
        void 0,
        false,
        `[class^='mediainfo_mediaInfo'] {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-simple-media-info",
        "精简 视频下方-作品介绍 ★",
        true,
        void 0,
        false,
        `[class^='mediainfo_btnHome'], [class^='upinfo_upInfoCard'] {display: none !important;}
            [class^='mediainfo_score'] {font-size: 25px !important;}
            [class^='mediainfo_mediaDesc']:has( + [class^='mediainfo_media_desc_section']) {
                visibility: hidden !important;
                height: 0 !important;
                margin-bottom: 8px !important;
            }
            [class^='mediainfo_media_desc_section'] {height: 60px !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-sponsor-module",
        "隐藏 视频下方-承包榜 ★",
        false,
        void 0,
        false,
        `#sponsor_module {display: none !important;}`
      )
    );
    bangumiItems.push(new SeparatorItem());
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-right-container-section-height",
        "隐藏 右栏-大会员按钮 ★",
        true,
        void 0,
        false,
        `[class^='vipPaybar_'] {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-right-container-danmaku",
        "隐藏 右栏-弹幕列表",
        true,
        void 0,
        false,
        `#danmukuBox {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-eplist-badge",
        "隐藏 右栏-视频列表 会员/限免标记 ★",
        false,
        void 0,
        false,
        // 蓝色预告badge不可隐藏
        `[class^='eplist_ep_list_wrapper'] [class^='imageListItem_badge']:not([style*='#00C0FF']) {display: none !important;}
            [class^='eplist_ep_list_wrapper'] [class^='numberListItem_badge']:not([style*='#00C0FF']) {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-recommend",
        "隐藏 右栏-相关作品推荐 ★",
        false,
        void 0,
        false,
        `.plp-r [class^='recommend_wrap'] {display: none !important;}`
      )
    );
    bangumiItems.push(new SeparatorItem());
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-reply-notice",
        "隐藏 评论区-活动/notice",
        false,
        void 0,
        false,
        `#comment-module .reply-header .reply-notice {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-main-reply-box",
        "隐藏 评论区-整个评论框",
        false,
        void 0,
        false,
        `#comment-module .main-reply-box {height: 0 !important; visibility: hidden !important;}
            #comment-module .reply-list {margin-top: -20px !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-fixed-reply-box",
        "隐藏 评论区-页面底部 吸附评论框",
        true,
        void 0,
        false,
        `#comment-module .fixed-reply-box {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-reply-box-textarea-placeholder",
        "隐藏 评论区-评论编辑器内占位文字",
        true,
        void 0,
        false,
        `#comment-module .main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
            #comment-module .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-reply-decorate",
        "隐藏 评论区-评论内容右侧装饰",
        false,
        void 0,
        false,
        `#comment-module .reply-decorate {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-fan-badge",
        "隐藏 评论区-ID后粉丝牌",
        false,
        void 0,
        false,
        `#comment-module .fan-badge {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-user-level",
        "隐藏 评论区-一级评论用户等级",
        false,
        void 0,
        false,
        `#comment-module .user-level {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-sub-user-level",
        "隐藏 评论区-二级评论用户等级",
        false,
        void 0,
        false,
        `#comment-module .sub-user-level {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bili-avatar-pendent-dom",
        "隐藏 评论区-用户头像外圈饰品",
        false,
        void 0,
        false,
        `#comment-module .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            #comment-module .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-bili-avatar-nft-icon",
        "隐藏 评论区-用户头像右下小icon",
        false,
        void 0,
        false,
        `#comment-module .bili-avatar-nft-icon {display: none !important;}
            #comment-module .bili-avatar-icon {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-reply-tag-list",
        "隐藏 评论区-评论内容下tag(热评)",
        false,
        void 0,
        false,
        `#comment-module .reply-tag-list {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-note-prefix",
        "隐藏 评论区-笔记评论前的小Logo",
        true,
        void 0,
        false,
        `#comment-module .note-prefix {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-jump-link-search-word",
        "隐藏 评论区-评论内容搜索关键词高亮",
        true,
        void 0,
        false,
        `#comment-module .reply-content .jump-link.search-word {color: inherit !important;}
            #comment-module .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
            #comment-module .reply-content .icon.search-word {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-reply-content-user-highlight",
        "隐藏 评论区-二级评论中的@高亮",
        false,
        void 0,
        false,
        `#comment-module .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
            #comment-module .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-at-reply-at-bots",
        "隐藏 评论区-召唤AI机器人的评论",
        true,
        void 0,
        false,
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
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-zero-like-at-reply",
        "隐藏 评论区-包含@的 无人点赞评论",
        false,
        void 0,
        false,
        `#comment-module .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-at-reply-all",
        "隐藏 评论区-包含@的 全部评论",
        false,
        void 0,
        false,
        `#comment-module .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv1-reply",
        "隐藏 评论区-LV1 无人点赞评论",
        false,
        void 0,
        false,
        `#comment-module .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv2-reply",
        "隐藏 评论区-LV2 无人点赞评论",
        false,
        void 0,
        false,
        `#comment-module .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv3-reply",
        "隐藏 评论区-LV3 无人点赞评论",
        false,
        void 0,
        false,
        `#comment-module .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-root-reply-dislike-reply-btn",
        "隐藏 一级评论 踩/回复/举报 hover时显示",
        true,
        void 0,
        false,
        `#comment-module .reply-info:not(:has(i.disliked)) .reply-btn,
            #comment-module .reply-info:not(:has(i.disliked)) .reply-dislike {
                visibility: hidden;
            }
            #comment-module .reply-item:hover .reply-info .reply-btn,
            #comment-module .reply-item:hover .reply-info .reply-dislike {
                visibility: visible !important;
            }`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-sub-reply-dislike-reply-btn",
        "隐藏 二级评论 踩/回复/举报 hover时显示",
        true,
        void 0,
        false,
        `#comment-module .sub-reply-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
            #comment-module .sub-reply-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                visibility: hidden;
            }
            #comment-module .sub-reply-container .sub-reply-item:hover .sub-reply-btn,
            #comment-module .sub-reply-container .sub-reply-item:hover .sub-reply-dislike {
                visibility: visible !important;
            }`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-emoji-large",
        "隐藏 评论区-大表情",
        false,
        void 0,
        false,
        `#comment-module .emoji-large {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-emoji-large-zoom",
        "评论区-大表情变成小表情",
        false,
        void 0,
        false,
        `#comment-module .emoji-large {zoom: .5;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-reply-user-name-color-pink",
        "评论区-用户名 全部大会员色",
        false,
        void 0,
        false,
        `#comment-module .reply-item .user-name, #comment-module .reply-item .sub-user-name {color: #FB7299 !important;}}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-reply-user-name-color-default",
        "评论区-用户名 全部恢复默认色",
        false,
        void 0,
        false,
        `#comment-module .reply-item .user-name, #comment-module .reply-item .sub-user-name {color: #61666d !important;}}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-reply-view-image-optimize",
        "评论区-笔记图片 查看大图优化",
        true,
        void 0,
        false,
        // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
        `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
            .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
            .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
            .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
            .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
            .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`
      )
    );
    bangumiItems.push(new SeparatorItem());
    bangumiItems.push(
      new NormalItem(
        "bangumi-page-hide-sidenav-issue",
        "隐藏 右下角-新版反馈 ★",
        true,
        void 0,
        false,
        `[class*='navTools_navMenu'] [title='新版反馈'] {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-sidenav-mini",
        "隐藏 右下角-小窗播放器",
        false,
        void 0,
        false,
        `[class*='navTools_navMenu'] [title*='迷你播放器'] {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-sidenav-customer-service",
        "隐藏 右下角-客服",
        true,
        void 0,
        false,
        `[class*='navTools_navMenu'] [title='帮助反馈'] {display: none !important;}`
      )
    );
    bangumiItems.push(
      new NormalItem(
        "video-page-hide-sidenav-back-to-top",
        "隐藏 右下角-回顶部",
        false,
        void 0,
        false,
        `[class*='navTools_navMenu'] [title='返回顶部'] {display: none !important;}`
      )
    );
  }
  const bangumiGroup = new Group("bangumi", "当前是：版权视频播放页 ★是独有项", bangumiItems);
  const searchItems = [];
  if (location.host == "search.bilibili.com") {
    searchItems.push(
      new NormalItem(
        "hide-search-page-search-sticky-header",
        "隐藏 滚动页面后 顶栏吸附",
        false,
        void 0,
        false,
        `.search-sticky-header {display: none !important;}`
      )
    );
    searchItems.push(
      new NormalItem(
        "hide-search-page-ad",
        "隐藏 搜索结果中的广告",
        true,
        void 0,
        false,
        `.video-list.row>div:has([href*="cm.bilibili.com"]) {display: none !important;}`
      )
    );
    searchItems.push(
      new NormalItem(
        "hide-search-page-danmaku-count",
        "隐藏 弹幕数量",
        true,
        void 0,
        false,
        `.bili-video-card .bili-video-card__stats--left .bili-video-card__stats--item:nth-child(2) {display: none !important;}`
      )
    );
    searchItems.push(
      new NormalItem(
        "hide-search-page-date",
        "隐藏 视频日期",
        false,
        void 0,
        false,
        `.bili-video-card .bili-video-card__info--date {display: none !important;}`
      )
    );
    searchItems.push(
      new NormalItem(
        "hide-search-page-bili-watch-later",
        "隐藏 稍后再看按钮",
        false,
        void 0,
        false,
        `.bili-video-card .bili-watch-later {display: none !important;}`
      )
    );
    searchItems.push(new SeparatorItem());
    searchItems.push(
      new NormalItem(
        "hide-search-page-customer-service",
        "隐藏 右下角 客服",
        true,
        void 0,
        false,
        `.side-buttons div:has(>a[href*="customer-service"]) {display: none !important;}`
      )
    );
    searchItems.push(
      new NormalItem(
        "hide-search-page-btn-to-top",
        "隐藏 右下角 回顶部",
        false,
        void 0,
        false,
        `.side-buttons .btn-to-top-wrap {display: none !important;}`
      )
    );
    searchItems.push(
      new NormalItem(
        "search-page-border-radius",
        "页面直角化 去除圆角",
        false,
        void 0,
        false,
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
      )
    );
  }
  const searchGroup = new Group("search", "当前是：搜索页", searchItems);
  const liveItems = [];
  if (location.host == "live.bilibili.com") {
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-upper-row-follow-ctnr",
        "隐藏 信息栏-粉丝团",
        false,
        void 0,
        false,
        `#head-info-vm .upper-row .follow-ctnr {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-upper-row-visited",
        "隐藏 信息栏-xx人看过",
        false,
        void 0,
        false,
        `#head-info-vm .upper-row .right-ctnr div:has(.watched-icon) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-upper-row-popular",
        "隐藏 信息栏-人气",
        false,
        void 0,
        false,
        `#head-info-vm .upper-row .right-ctnr div:has(.icon-popular) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-upper-row-like",
        "隐藏 信息栏-点赞",
        false,
        void 0,
        false,
        `#head-info-vm .upper-row .right-ctnr div:has(.like-icon) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-upper-row-report",
        "隐藏 信息栏-举报",
        true,
        void 0,
        false,
        `#head-info-vm .upper-row .right-ctnr div:has(.icon-report) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-upper-row-share",
        "隐藏 信息栏-分享",
        true,
        void 0,
        false,
        `#head-info-vm .upper-row .right-ctnr div:has(.icon-share) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-lower-row-hot-rank",
        "隐藏 信息栏-人气榜",
        true,
        void 0,
        false,
        `#head-info-vm .lower-row .right-ctnr .popular-and-hot-rank {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-lower-row-gift-planet-entry",
        "隐藏 信息栏-礼物",
        false,
        void 0,
        false,
        `#head-info-vm .lower-row .right-ctnr .gift-planet-entry {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm-lower-row-activity-gather-entry",
        "隐藏 信息栏-活动",
        true,
        void 0,
        false,
        `#head-info-vm .lower-row .right-ctnr .activity-gather-entry {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-info-vm",
        "隐藏 信息栏-关闭整个信息栏",
        false,
        void 0,
        false,
        `#head-info-vm {display: none !important;}`
      )
    );
    liveItems.push(new SeparatorItem());
    liveItems.push(
      new NormalItem(
        "live-page-head-web-player-icon-feedback",
        "隐藏 播放器-右上角反馈",
        true,
        void 0,
        false,
        `#live-player .web-player-icon-feedback {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-web-player-shop-popover-vm",
        "隐藏 播放器-购物小橙车提示",
        true,
        void 0,
        false,
        `#shop-popover-vm {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-web-player-awesome-pk-vm",
        "隐藏 播放器-直播PK特效",
        false,
        void 0,
        false,
        `#pk-vm, #awesome-pk-vm {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-web-player-announcement-wrapper",
        "隐藏 播放器-滚动礼物通告",
        false,
        void 0,
        false,
        `#live-player .announcement-wrapper {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-head-web-player-game-id",
        "隐藏 播放器-幻星互动游戏",
        false,
        void 0,
        false,
        `#game-id {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-combo-danmaku",
        "隐藏 播放器-复读计数弹幕",
        false,
        void 0,
        false,
        `.danmaku-item-container > div.combo {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-gift-control-vm",
        "隐藏 播放器-礼物栏",
        false,
        void 0,
        false,
        `#gift-control-vm, #gift-control-vm-new {display: none !important;}`
      )
    );
    liveItems.push(new SeparatorItem());
    liveItems.push(
      new NormalItem(
        "live-page-rank-list-vm",
        "隐藏 右侧-高能榜/大航海 (需刷新)",
        false,
        void 0,
        false,
        `#rank-list-vm {display: none !important;}
        #aside-area-vm {overflow: hidden;}
        .chat-history-panel {height: calc(100% - 145px) !important; padding-top: 8px;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-convention-msg",
        "隐藏 右侧-弹幕栏 系统提示",
        true,
        void 0,
        false,
        `.convention-msg.border-box {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-rank-icon",
        "隐藏 右侧-弹幕栏 用户排名",
        false,
        void 0,
        false,
        `.chat-item .rank-icon {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-title-label",
        "隐藏 右侧-弹幕栏 头衔装扮",
        false,
        void 0,
        false,
        `.chat-item .title-label {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-wealth-medal-ctnr",
        "隐藏 右侧-弹幕栏 用户等级",
        true,
        void 0,
        false,
        `.chat-item .wealth-medal-ctnr {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-group-medal-ctnr",
        "隐藏 右侧-弹幕栏 团体勋章",
        false,
        void 0,
        false,
        `.chat-item .group-medal-ctnr {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-fans-medal-item-ctnr",
        "隐藏 右侧-弹幕栏 粉丝牌",
        false,
        void 0,
        false,
        `.chat-item .fans-medal-item-ctnr {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-chat-item-background-color",
        "隐藏 右侧-弹幕栏 弹幕的高亮底色",
        false,
        void 0,
        false,
        `.chat-item {background-color: unset !important; border-image-source: unset !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-gift-item",
        "隐藏 右侧-弹幕栏 礼物弹幕",
        false,
        void 0,
        false,
        `.chat-item.gift-item, .chat-item.common-danmuku-msg {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-brush-prompt",
        "隐藏 右侧-弹幕栏 底部滚动提示",
        true,
        void 0,
        false,
        `#brush-prompt {display: none !important;}
            /* 弹幕栏高度 */
            .chat-history-panel .chat-history-list.with-brush-prompt {height: 100% !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-combo-card",
        "隐藏 右侧-弹幕栏 互动框(他们都在说)",
        false,
        void 0,
        false,
        `#combo-card:has(.combo-tips) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-service-card-container",
        "隐藏 右侧-弹幕栏 互动框(找TA玩)",
        false,
        void 0,
        false,
        `.play-together-service-card-container {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-compact-danmaku",
        "右侧-弹幕栏 使弹幕列表紧凑",
        true,
        void 0,
        false,
        `.chat-history-panel .chat-history-list .chat-item.danmaku-item.chat-colorful-bubble {margin: 2px 0 !important;}
        .chat-history-panel .chat-history-list .chat-item {padding: 3px 5px !important; font-size: 1.2rem !important;}
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .user-name {font-size: 1.2rem !important;}
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname {font-size: 1.2rem !important;}
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname .common-nickname-wrapper {font-size: 1.2rem !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-control-panel-icon-row-left",
        "隐藏 右侧-弹幕控制按钮 左侧",
        false,
        void 0,
        false,
        `#chat-control-panel-vm .control-panel-icon-row .icon-left-part {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-control-panel-icon-row-right",
        "隐藏 右侧-弹幕控制按钮 右侧",
        false,
        void 0,
        false,
        `#chat-control-panel-vm .control-panel-icon-row .icon-right-part {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-chat-input-ctnr",
        "隐藏 右侧-弹幕发送框",
        false,
        void 0,
        false,
        `#chat-control-panel-vm .chat-input-ctnr, #chat-control-panel-vm .bottom-actions {display: none !important;}
        .chat-control-panel {height: unset !important;}
        .chat-history-panel {height: calc(100% - 45px) !important; padding-top: 8px;}
        .chat-history-panel .danmaku-at-prompt {bottom: 50px !important;}`
      )
    );
    liveItems.push(new SeparatorItem());
    liveItems.push(
      new NormalItem(
        "live-page-flip-view",
        "隐藏 视频下方-活动海报",
        true,
        void 0,
        false,
        `.flip-view {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-room-info-ctnr",
        "隐藏 视频下方-直播间介绍",
        false,
        void 0,
        false,
        `#sections-vm .room-info-ctnr {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-room-feed",
        "隐藏 视频下方-主播动态",
        false,
        void 0,
        false,
        `#sections-vm .room-feed {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-announcement-cntr",
        "隐藏 视频下方-主播公告",
        false,
        void 0,
        false,
        `#sections-vm .announcement-cntr {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-sections-vm",
        "隐藏 视频下方-关闭全部内容",
        false,
        void 0,
        false,
        `#sections-vm {display: none !important;}`
      )
    );
    liveItems.push(new SeparatorItem());
    liveItems.push(
      new NormalItem(
        "live-page-header-entry-logo",
        "隐藏 顶栏-直播LOGO",
        false,
        void 0,
        false,
        `#main-ctnr a.entry_logo[href="//live.bilibili.com"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-entry-title",
        "隐藏 顶栏-首页",
        false,
        void 0,
        false,
        `#main-ctnr a.entry-title[href="//www.bilibili.com"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-live",
        "隐藏 顶栏-直播",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="live"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-all",
        "隐藏 顶栏-全部",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="all"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-net-game",
        "隐藏 顶栏-网游",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="网游"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-mobile-game",
        "隐藏 顶栏-手游",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="手游"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-game",
        "隐藏 顶栏-单机游戏",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="单机游戏"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-entertainment",
        "隐藏 顶栏-娱乐",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="娱乐"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-radio",
        "隐藏 顶栏-电台",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="电台"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-vtuber",
        "隐藏 顶栏-虚拟主播",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="虚拟主播"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-chatroom",
        "隐藏 顶栏-聊天室",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="聊天室"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-living",
        "隐藏 顶栏-生活",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="生活"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-knowledge",
        "隐藏 顶栏-知识",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="知识"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-match",
        "隐藏 顶栏-赛事",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="赛事"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-helpmeplay",
        "隐藏 顶栏-帮我玩",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="帮我玩"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-interact",
        "隐藏 顶栏-互动玩法",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="互动玩法"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-standalone-shopping",
        "隐藏 顶栏-购物",
        false,
        void 0,
        false,
        `#main-ctnr .dp-table-cell a[name="购物"] {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-showmore-link",
        "隐藏 顶栏-更多",
        true,
        void 0,
        false,
        `#main-ctnr .showmore-link {display: none !important;}`
      )
    );
    liveItems.push(new SeparatorItem());
    liveItems.push(
      new NormalItem(
        "live-page-header-search-block-placeholder",
        "隐藏 顶栏-搜索框内推荐搜索",
        false,
        void 0,
        false,
        `#nav-searchform input::placeholder {visibility: hidden;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-search-block",
        "隐藏 顶栏-搜索框",
        false,
        void 0,
        false,
        `#nav-searchform {display: none !important;}`
      )
    );
    liveItems.push(new SeparatorItem());
    liveItems.push(
      new NormalItem(
        "live-page-header-avatar",
        "隐藏 顶栏-头像",
        false,
        void 0,
        false,
        `#right-part .user-panel {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-dynamic",
        "隐藏 顶栏-动态",
        false,
        void 0,
        false,
        `#right-part .shortcuts-ctnr .shortcut-item:has(.link-panel-ctnr) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-checkin",
        "隐藏 顶栏-签到",
        false,
        void 0,
        false,
        `#right-part .shortcuts-ctnr .shortcut-item:has(.calendar-checkin) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-interact",
        "隐藏 顶栏-幻星互动",
        true,
        void 0,
        false,
        `#right-part .shortcuts-ctnr .shortcut-item:has(.fanbox-panel-ctnr) {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-header-go-live",
        "隐藏 顶栏-我要开播",
        true,
        void 0,
        false,
        `#right-part .shortcuts-ctnr .shortcut-item:has(.download-panel-ctnr) {visibility: hidden;}`
      )
    );
    liveItems.push(new SeparatorItem());
    liveItems.push(
      new NormalItem(
        "live-page-sidebar-vm",
        "隐藏 右侧浮动按钮-实验室/关注",
        true,
        void 0,
        false,
        `#sidebar-vm {display: none !important;}`
      )
    );
    liveItems.push(
      new NormalItem(
        "live-page-border-radius",
        "页面直角化 去除圆角",
        false,
        void 0,
        false,
        `#nav-searchform,
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
            #rank-list-vm,
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
            }`
      )
    );
  }
  const liveGroup = new Group("live", "当前是：直播页", liveItems);
  const dynamicItems = [];
  if (location.host === "t.bilibili.com") {
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-fixed-header",
        "顶栏 不再吸附顶部",
        false,
        void 0,
        false,
        `.fixed-header .bili-header__bar {position: relative !important;}
        .bili-dyn-live-users {top: 15px !important; transform: unset !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "dynamic-page-border-radius",
        "页面直角化 去除圆角",
        false,
        void 0,
        false,
        `#nav-searchform,
            .nav-search-content,
            .header-upload-entry,
            .v-popover-content,
            .van-popover,
            .v-popover-wrap,
            .v-popover,
            .topic-panel,
            .bili-dyn-up-list,
            .bili-dyn-publishing,
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
            .bili-dyn-list-tabs,
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
            }`
      )
    );
    dynamicItems.push(new SeparatorItem());
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-bili-dyn-my-info",
        "隐藏 左栏 个人信息框",
        false,
        void 0,
        false,
        `section:has(> .bili-dyn-my-info) {display: none !important;}
            .bili-dyn-live-users {top: 8px !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-bili-dyn-live-users__item__living",
        "隐藏 左栏 直播中Logo",
        false,
        void 0,
        false,
        `.bili-dyn-live-users__item__living {display: none !important;}`
      )
    );
    dynamicItems.push(new SeparatorItem());
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-bili-dyn-publishing",
        "隐藏 中栏 动态发布框",
        false,
        void 0,
        false,
        `.bili-dyn-publishing {display: none !important;}
            main section:nth-child(1) {margin-bottom: 0 !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-bili-dyn-list-tabs",
        "隐藏 中栏 动态分类Tab",
        false,
        void 0,
        false,
        `.bili-dyn-list-tabs {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-bili-dyn-ornament",
        "隐藏 中栏 动态右侧饰品",
        false,
        void 0,
        false,
        `.bili-dyn-ornament {display: none !important;}`
      )
    );
    dynamicItems.push(new SeparatorItem());
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-bili-dyn-banner",
        "隐藏 右栏 社区中心",
        true,
        void 0,
        false,
        `.bili-dyn-banner {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-bili-dyn-ads",
        "隐藏 右栏 广告",
        true,
        void 0,
        false,
        `section:has(.bili-dyn-ads) {display: none !important;}
            aside.right section {margin-bottom: 0 !important;}
            aside.right section.sticky {top: 15px !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-bili-dyn-topic-box",
        "隐藏 右栏 话题列表",
        false,
        void 0,
        false,
        `.bili-dyn-topic-box, .topic-panel {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-aside-right",
        "隐藏 整个右栏",
        false,
        void 0,
        false,
        `aside.right {display: none !important;}`
      )
    );
    dynamicItems.push(new SeparatorItem());
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-reply-notice",
        "隐藏 评论区-活动/notice",
        false,
        void 0,
        false,
        `.comment-container .reply-header .reply-notice {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-main-reply-box",
        "隐藏 评论区-整个评论框",
        false,
        void 0,
        false,
        `.comment-container .main-reply-box, .fixed-reply-box {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-reply-box-textarea-placeholder",
        "隐藏 评论区-评论编辑器内占位文字",
        true,
        void 0,
        false,
        `.comment-container .reply-box-textarea::placeholder {color: transparent !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-reply-decorate",
        "隐藏 评论区-评论右侧装饰",
        false,
        void 0,
        false,
        `.comment-container .reply-decorate {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-fan-badge",
        "隐藏 评论区-ID后粉丝牌",
        false,
        void 0,
        false,
        `.comment-container .fan-badge {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-user-level",
        "隐藏 评论区-一级评论用户等级",
        false,
        void 0,
        false,
        `.comment-container .user-level {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-sub-user-level",
        "隐藏 评论区-二级评论用户等级",
        false,
        void 0,
        false,
        `.comment-container .sub-user-level {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-bili-avatar-pendent-dom",
        "隐藏 评论区-用户头像外圈饰品",
        false,
        void 0,
        false,
        `.comment-container .bili-avatar-pendent-dom {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-bili-avatar-nft-icon",
        "隐藏 评论区-用户头像右下小icon",
        false,
        void 0,
        false,
        `.comment-container .bili-avatar-nft-icon {display: none !important;}
            .comment-container .bili-avatar-icon {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-reply-tag-list",
        "隐藏 评论区-评论内容下tag(UP觉得很赞)",
        false,
        void 0,
        false,
        `.comment-container .reply-tag-list {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-note-prefix",
        "隐藏 评论区-笔记评论前的小Logo",
        true,
        void 0,
        false,
        `.comment-container .note-prefix {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-jump-link-search-word",
        "隐藏 评论区-评论内容搜索关键词高亮",
        true,
        void 0,
        false,
        `.comment-container .reply-content .jump-link.search-word {color: inherit !important;}
            .comment-container .reply-content .icon.search-word {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-reply-content-user-highlight",
        "隐藏 评论区-二级评论中的@高亮",
        false,
        void 0,
        false,
        `.comment-container .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
            .comment-container .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-at-reply-at-bots",
        "隐藏 评论区-召唤AI机器人的评论",
        true,
        void 0,
        false,
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
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-zero-like-at-reply",
        "隐藏 评论区-包含@的 无人点赞评论",
        false,
        void 0,
        false,
        `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-at-reply-all",
        "隐藏 评论区-包含@的 全部评论",
        false,
        void 0,
        false,
        `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv1-reply",
        "隐藏 评论区-LV1 无人点赞评论",
        false,
        void 0,
        false,
        `.comment-container .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv2-reply",
        "隐藏 评论区-LV2 无人点赞评论",
        false,
        void 0,
        false,
        `.comment-container .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-zero-like-lv3-reply",
        "隐藏 评论区-LV3 无人点赞评论",
        false,
        void 0,
        false,
        `.comment-container .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-root-reply-dislike-reply-btn",
        "隐藏 一级评论 踩/回复/举报 hover时显示",
        true,
        void 0,
        false,
        `.comment-container .reply-info:not(:has(i.disliked)) .reply-btn,
            .comment-container .reply-info:not(:has(i.disliked)) .reply-dislike {
                visibility: hidden;
            }
            .comment-container .reply-item:hover .reply-btn,
            .comment-container .reply-item:hover .reply-dislike {
                visibility: visible !important;
            }`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-sub-reply-dislike-reply-btn",
        "隐藏 二级评论 踩/回复/举报 hover时显示",
        true,
        void 0,
        false,
        `.comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
            .comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                visibility: hidden;
            }
            .comment-container .sub-reply-item:hover .sub-reply-btn,
            .comment-container .sub-reply-item:hover .sub-reply-dislike {
                visibility: visible !important;
            }`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-emoji-large",
        "隐藏 评论区-大表情",
        false,
        void 0,
        false,
        `.comment-container .emoji-large {display: none !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-hide-emoji-large-zoom",
        "评论区-大表情变成小表情",
        false,
        void 0,
        false,
        `.comment-container .emoji-large {zoom: .5;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-reply-user-name-color-pink",
        "评论区-用户名 全部大会员色",
        false,
        void 0,
        false,
        `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-reply-user-name-color-default",
        "评论区-用户名 全部恢复默认色",
        false,
        void 0,
        false,
        `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "video-page-reply-view-image-optimize",
        "评论区-笔记图片 查看大图优化",
        true,
        void 0,
        false,
        // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
        `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
            .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
            .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
            .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
            .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
            .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`
      )
    );
    dynamicItems.push(new SeparatorItem());
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-sidebar-feedback",
        "隐藏 右下角-新版反馈",
        true,
        void 0,
        false,
        `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(1) {visibility: hidden !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-sidebar-old-version",
        "隐藏 右下角-回到旧版",
        true,
        void 0,
        false,
        `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(2) {visibility: hidden !important;}`
      )
    );
    dynamicItems.push(
      new NormalItem(
        "hide-dynamic-page-sidebar-back-to-top",
        "隐藏 右下角-回顶部",
        false,
        void 0,
        false,
        `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(3) {visibility: hidden !important;}`
      )
    );
  }
  const dynamicGroup = new Group("dynamic", "当前是：动态页", dynamicItems);
  log("script start");
  const main = () => {
    try {
      init();
    } catch (err) {
      error("init error, try continue");
    }
    const GROUPS = [];
    homepageGroup.isEmpty() || GROUPS.push(homepageGroup);
    videoGroup.isEmpty() || GROUPS.push(videoGroup);
    bangumiGroup.isEmpty() || GROUPS.push(bangumiGroup);
    searchGroup.isEmpty() || GROUPS.push(searchGroup);
    dynamicGroup.isEmpty() || GROUPS.push(dynamicGroup);
    liveGroup.isEmpty() || GROUPS.push(liveGroup);
    commonGroup.isEmpty() || GROUPS.push(commonGroup);
    GROUPS.forEach((e) => e.enableGroup());
    let lastURL = location.href;
    setInterval(() => {
      const currURL = location.href;
      if (currURL !== lastURL) {
        debug("url change detected");
        GROUPS.forEach((e) => e.reloadGroup());
        lastURL = currURL;
        debug("url change reload groups complete");
      }
    }, 500);
    if (location.pathname.startsWith("/bangumi/play") && navigator.userAgent.toLowerCase().includes("chrome")) {
      window.addEventListener("load", () => {
        debug("chrome patch, recheck start");
        for (let i = GROUPS.length - 1; i >= 0; i--) {
          GROUPS[i].enableGroup();
        }
        debug("chrome patch, recheck complete");
      });
    }
    const openSettings = () => {
      if (document.getElementById("bili-cleaner")) {
        return;
      }
      debug("panel create start");
      const panel = new Panel();
      panel.createPanel();
      GROUPS.forEach((e) => {
        e.insertGroup();
        e.insertGroupItems();
      });
      debug("panel create complete");
    };
    _GM_registerMenuCommand("设置", openSettings);
    debug("register menu complete");
  };
  try {
    main();
  } catch (err) {
    error(err);
  }
  log("script end");

})();
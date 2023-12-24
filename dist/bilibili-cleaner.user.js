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
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
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
  const trace = () => {
    console.trace("[bili-cleaner]");
  };
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
        style.innerHTML = this.panelCSS;
        style.setAttribute("id", "bili-cleaner-panel-css");
        document.head.appendChild(style);
        debug("insertPanelCSS OK");
      } catch (err) {
        error(`insertPanelCSS failed`);
        error(err);
        trace();
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
        trace();
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
        trace();
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
        trace();
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
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  class BaseItem {
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
      // item当前状态
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
    /**
     * 获取item开关状态, 若第一次安装时不存在该key, 使用默认值
     */
    getStatus() {
      this.isEnable = _GM_getValue(`BILICLEANER_${this.itemID}`);
      if (!this.isEnable) {
        const keys = _GM_listValues();
        if (!keys.includes(`BILICLEANER_${this.itemID}`)) {
          this.isEnable = this.defaultStatus;
          this.setStatus(this.isEnable);
          debug(`item ${this.itemID} status not exist, use default: ${this.defaultStatus}`);
        }
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
        trace();
      }
    }
    /**
     * 启用CSS片段, 向document.head插入style
     */
    insertItemCSS() {
      if (!this.itemCSS) {
        return;
      }
      try {
        if (document.querySelector(`head style[bili-cleaner-css=${this.itemID}]`)) {
          debug(`insertCSS ${this.itemID} CSS exist, ignore`);
          return;
        }
        const style = document.createElement("style");
        style.innerHTML = this.itemCSS;
        style.setAttribute("bili-cleaner-css", this.itemID);
        document.head.appendChild(style);
        debug(`insertCSS ${this.itemID} OK`);
      } catch (err) {
        error(`insertCSS ${this.itemID} failed`);
        error(err);
        trace();
      }
    }
    /**
     * 停用CSS片段, 从document.head移除style
     */
    removeItemCSS() {
      var _a;
      if (this.itemCSS) {
        const style = document.querySelector(`head style[bili-cleaner-css=${this.itemID}]`);
        if (style) {
          (_a = style.parentNode) == null ? void 0 : _a.removeChild(style);
          debug(`removeCSS ${this.itemID} OK`);
        }
      }
    }
    /**
     * 监听item chekbox开关
     */
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
        trace();
      }
    }
    /**
     * 执行item功能, 在页面head添加CSS并执行func
     */
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
          trace();
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
          trace();
        }
      }
    }
  }
  class SeparatorItem {
    constructor() {
      __publicField(this, "itemHTML", `<hr>`);
    }
    /**
     * 向item list中添加分隔符, 用于划分功能组别
     * @param groupID 由调用SeparatorItem的上级Group提供
     */
    insertItem(groupID) {
      try {
        const e = document.createElement("label");
        const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`);
        if (itemGroupList) {
          itemGroupList.appendChild(e);
          debug(`insertItem separator OK`);
        }
      } catch (err) {
        error(`insertItem separator err`);
        error(err);
        trace();
      }
    }
  }
  log("script start");
  try {
    init();
  } catch (err) {
    error(err);
    error("FATAL ERROR, EXIT");
  }
  const item = new SeparatorItem();
  item.insertItem("");
  const item2 = new BaseItem("abc", "abc", true, () => {
  }, true, "abc");
  item2.insertItem("");
  const openSettings = () => {
    if (document.getElementById("bili-cleaner")) {
      return;
    }
    debug("panel create start");
    const panel = new Panel();
    panel.createPanel();
    debug("panel create complete");
  };
  _GM_registerMenuCommand("设置", openSettings);
  debug("register menu complete");
  log("script end");

})();
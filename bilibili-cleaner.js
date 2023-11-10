/*

<label><input id="" class="switch" type="checkbox">Example</label>
<label><input id="" class="switch" type="checkbox" checked>Example</label>

.bilibili-cleaner label {
  display: block;
}
.bilibili-cleaner label, .bilibili-cleaner input {
  vertical-align: middle;
}
.bilibili-cleaner .switch {
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
.bilibili-cleaner .switch:before {
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
.bilibili-cleaner .switch:checked {
  border-color: #64bd63;
  box-shadow: #64bd63 0 0 0 16px inset;
  background-color: #64bd63;
}
.bilibili-cleaner .switch:checked:before {
  left: 25px;
}

*/

// ==UserScript==
// @name         Bangumi/bgm.tv 显示中文标题，样式优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  我看不懂日文标题啊！
// @author       Marsen
// @match        http*://bgm.tv/*
// @match        http*://bangumi.tv/*
// @match        http*://chii.in/*
// @icon         https://bgm.tv/img/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    function createConfigPanel() {
        const panelHTML = `
        <div id="bili-cleaner">
            <div id="bili-cleaner-header">
                <div id="bili-cleaner-title">
                    <span>bilibili 页面净化</span>
                </div>
                <div id="bili-cleaner-close">
                    <span><svg t="1699596998657" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="2106" width="28" height="28">
                            <path
                                d="M512 456.310154L94.247385 38.557538a39.542154 39.542154 0 0 0-55.689847 0 39.266462 39.266462 0 0 0 0 55.689847L456.310154 512 38.557538 929.752615a39.542154 39.542154 0 0 0 0 55.689847 39.266462 39.266462 0 0 0 55.689847 0L512 567.689846l417.752615 417.752616c15.163077 15.163077 40.290462 15.36 55.689847 0a39.266462 39.266462 0 0 0 0-55.689847L567.689846 512 985.442462 94.247385a39.542154 39.542154 0 0 0 0-55.689847 39.266462 39.266462 0 0 0-55.689847 0L512 456.310154z"
                                fill="#ffffff" p-id="2107"></path>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
        `
        const panelCSS = `
          #bili-cleaner {
            left: 50%;
            top: 50%;
            width: 600px;
            height: 800px;
            border-radius: 15px;
            overflow: hidden;
            background: rgba(250, 250, 250, 1);
            border: 1px solid rgba(196, 196, 196, 1);
          }
          #bili-cleaner-header {
            width: 600px;
            height: 60px;
            background: rgba(251, 114, 153, 1);
            position: relative;
          }
          #bili-cleaner-title {
            width: 600px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
            font-size: 1.8em;
          }
          #bili-cleaner-title span {
            text-align: center;
          }
          #bili-cleaner-close {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            margin: 10px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #bili-cleaner-close span {
            text-align: center;
          }
          #bili-cleaner-close span:hover {
            zoom: 1.2;
          }
        `
    }
    function createLabelGroup(title) {

    }
    function createLabel() {

    }

})();

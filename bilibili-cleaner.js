// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  净化B站页面内的各种元素，高度定制化
// @author       festoney8
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM.addStyle
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';
    function createConfigPanel() {
        const panelHTML = `
        <div id="bili-cleaner">
            <div id="bili-cleaner-bar">
                <div id="bili-cleaner-title">
                    <span>bilibili 页面净化</span>
                </div>
                <div id="bili-cleaner-close">
                    <svg t="1699601981125" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5964" width="20" height="20"><path d="M996.742543 154.815357L639.810328 511.747572l356.932215 356.932215a90.158906 90.158906 0 0 1-127.490994 127.490994L512.319334 639.195998l-356.932215 356.889647A90.158906 90.158906 0 1 1 27.896126 868.637219L384.82834 511.747572 27.896126 154.815357A90.158906 90.158906 0 1 1 155.387119 27.324364L512.319334 384.256578 869.251549 27.324364a90.158906 90.158906 0 1 1 127.490994 127.490993z" fill="#ffffff" p-id="5965"></path></svg>
                </div>
            </div>
        </div>`
        const panelCSS = `#bili-cleaner {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 30vw;
            height: 80vh;
            border-radius: 10px;
            overflow: hidden;
            background: rgba(250, 250, 250, 1);
            border: 1px solid rgba(251, 114, 153, 1);
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
          }`
        const styleSheet = document.createElement("style");
        styleSheet.innerText = panelCSS;
        document.head.appendChild(styleSheet);

        const p = document.createElement('div');
        p.innerHTML = panelHTML;
        document.body.appendChild(p);

        // panel关闭按钮
        function closePanel() {
            const closeBtn = document.getElementById("bili-cleaner-close");
            closeBtn.addEventListener('click', function () {
                const closeBtn = document.getElementById("bili-cleaner-close");
                p.remove();
            });
        }
        closePanel();

        // 可拖拽panel bar
        const panel = document.getElementById('bili-cleaner');
        const bar = document.getElementById('bili-cleaner-bar');

        let isDragging = false;
        let initX, initY, initLeft, initTop;

        function onMouseDown(e) {
            isDragging = true;
            initX = e.clientX;
            initY = e.clientY;
            const c = window.getComputedStyle(panel);
            initLeft = parseInt(c.getPropertyValue('left'), 10);
            initTop = parseInt(c.getPropertyValue('top'), 10);
        }

        function onMouseMove(e) {
            if (isDragging) {
                const diffX = e.clientX - initX;
                const diffY = e.clientY - initY;
                panel.style.left = `${initLeft + diffX}px`;
                panel.style.top = `${initTop + diffY}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
        }

        bar.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
    function createLabelGroup(title) {

    }
    function createLabel() {

    }

    createConfigPanel();

})();

<div align="center">
<image src="./images/logo.png" height="120"></image>
<h1>bilibili 页面净化大师</h1>
<div>高度定制化的 bilibili 网页净化插件，提供 300+ 个功能开关，深度净化页面</div>
<div>支持「精简功能、去广告、BV号转AV号、播放器净化、过滤视频、全站黑白名单」等多种细节功能</div>
<br>

[安装使用](#安装) / [功能介绍](#功能介绍) / [浏览器适配](#浏览器适配) / [净化效果](#净化效果对比) / [插件兼容](#与其他-bilibili-插件的兼容性) / [数据备份](#数据导入与导出)
<br>
<br>

</div>

## 主要功能：页面净化、视频过滤

-   **页面净化**：隐藏网页内各种元素，去除无用功能，净化顶栏、播放器、评论区等

-   **视频过滤**：根据视频时长、UP 主黑名单、标题关键词、BV 号筛选视频推荐

![](images/preview.jpg)

## 安装

### 稳定版：[前往 Greasyfork 安装](https://greasyfork.org/zh-CN/scripts/479861)

-   **Firefox** 浏览器请查看 [**浏览器适配**](#浏览器适配)
-   稳定版持续在 Greasyfork 发布，油猴插件会定期检查，自动更新

### 测试版：[Release安装](https://github.com/festoney8/bilibili-cleaner/releases/)

-   开发版：[CI Build](https://github.com/festoney8/bilibili-cleaner/actions/workflows/dev-ci.yml?query=is%3Asuccess)

## 使用

> [!IMPORTANT]
>
> -   **页面净化：「首页、播放页、影视番剧播放页、直播间、搜索页、动态页、热门页、频道页」**
> -   **视频过滤：「首页、播放页、搜索页、热门页、频道页」**
> -   **每个页面都有独立菜单**，按下图打开菜单进行设置，实时生效

![](images/usage.png)

## 功能介绍

### 1. 页面净化

-   适用于 **净化新版 bilibili 网页**，不做老版本页面适配
-   混搭各种功能，调节浏览器缩放比例，可调节出自己满意的页面效果
-   默认用户已登录，默认开启基础屏蔽功能，大会员体验最佳
-   已知bug：支持切换视角的直播和特殊活动直播，调节净化规则无法实时生效，需刷新页面

> [!NOTE]
>
> -   给 UP 主充电时，若出现 **充电窗口载入失败 (报错NaN)**，请关闭 **通用项「URL参数净化」**，刷新页面再充电
> -   **「影视番剧播放页」多数功能与「播放页」一致且互相同步，独有功能已用 "★" 重点标出**
> -   「动态页」评论区功能与「播放页」一致且互相同步

### 2. 视频过滤

-   视频过滤支持「UP主、BV号、标题关键词、视频时长」四种模式
-   **每个页面有独立的功能开关，但黑名单、白名单全站共用一份**
-   **白名单权限高于黑名单，命中白名单的视频不会被隐藏**
-   「标题关键词过滤」和「标题关键词白名单」大小写不敏感。均支持正则（大小写不敏感），正则用 `/ ... /` 括起来，如：`/abc|\d+/`
-   **已知bug：视频过滤在带`index.html`后缀的首页不生效**，请使用无后缀首页 `https://www.bilibili.com/`

> [!NOTE]
>
> -   **时长过滤不宜过长**，会错过优质视频，推荐设定 60~90 秒
> -   **编写正则要慎重**，可能造成大量视频屏蔽和频繁载入
> -   **编写白名单注意影响范围**，白名单权限高，可能会让不喜欢的视频出现
> -   **屏蔽后，如果视频没有消失，很可能命中了白名单**
> -   你不喜欢的低创 UP 主可能在「热门视频、每周必看、排行榜」出没，记得去热门页屏蔽一波
> -   遇到高质量 UP 主，可以顺手把他加入白名单
> -   屏蔽视频时会在 Console 输出日志，按 F12 查看日志
> -   这里有一些常见标题关键词整理：[查看](./NOTE.md)

> [!CAUTION]
>
> -   **如果屏蔽了大量内容，请定时备份，更换电脑或浏览器务必备份，[备份方法](#数据导入与导出)**
> -   如果你在意推送质量，不要点开不喜欢的视频，不要点开不喜欢的 UP 主的个人页
> -   点开视频/点开个人页是正反馈，推荐系统误认为你喜欢，导致推送变差，请复制链接使用无痕浏览

### 3. 快捷键

-   支持使用快捷键 `Alt + B` 或 `Ctrl + Alt + B` 快速开启/关闭**页面净化**功能，迅速查看净化对比
-   Firefox 浏览器仅支持 `Ctrl + Alt + B`
-   临时使用被隐藏的按钮时，只需快捷键快速关闭插件，不用打开菜单寻找选项
-   快速关闭只支持停用CSS规则

## 浏览器适配

### Chrome / Edge

-   **要求 Chrome 内核版本 >= 105**，浏览器内核版本过低会导致部分功能失效，如：无法净化顶栏

    > 鉴于 Google 在推行 [Manifest V3](https://developer.chrome.com/docs/extensions/migrating/checklist)，未来会影响油猴插件，参考[Tampermonkey changelog](https://www.tampermonkey.net/changelog.php#v5.0.0)。
    > 可考虑启用浏览器开发者模式，Chrome 和 Edge 均可在插件管理页找到开关。

### Firefox

-   **Firefox版本 103~120，按如下步骤开启高级设定**
    -   在浏览器内打开网址 [about:config](about:config)，若出现风险提示，点击「接受风险并继续」
    -   搜索 `layout.css.has-selector.enabled` ，将这一项的开关改为 `true`，并刷新标签页
-   **Firefox版本 > 121，无需修改设定**

### Safari

-   完全未测试

### 脚本管理插件

-   **[Tampermonkey](https://www.tampermonkey.net/)（油猴插件）：已测试，推荐**

-   **[Violentmonkey](https://violentmonkey.github.io/)（暴力猴）：支持，部分测试**

-   [Greasemonkey](https://www.greasespot.net/) 和 [ScriptCat](https://docs.scriptcat.org/) 未进行测试

## 净化效果对比

<details>
<summary><b>查看 视频过滤 对比图（webp动图）</b></summary>

![](images/screenshot-filter.webp)

</details>

<details>
<summary><b>查看 播放页 对比图（webp动图）</b></summary>

![](images/screenshot-video.webp)

</details>

<details>
<summary><b>查看 首页 对比图（webp动图）</b></summary>

![](images/screenshot-homepage.webp)

</details>

<details>
<summary><b>查看 动态页 对比图（webp动图）</b></summary>

![](images/screenshot-dynamic.webp)

</details>

<details>
<summary><b>查看 直播页 对比图</b></summary>

### before

![](images/screenshot-live-before.png)

### after

![](images/screenshot-live-after.png)

</details>

<details>

<summary><b>查看 热门视频/排行榜页 对比图</b></summary>

### before

![](images/screenshot-popular-before.png)

### after

![](images/screenshot-popular-after.png)

</details>

## 与其他 bilibili 插件的兼容性

### 1. 与 [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) 的兼容性

-   绝大多数功能兼容，小部分功能重复，均不会产生崩坏

-   本脚本中的 通用项「隐藏-顶栏相关」对 Evolved 的自定义顶栏无效

-   **隐藏首页banner**

    -   使用「Evolved 夜间模式」时，开启 Evolved 的「隐藏顶部横幅」，关闭本脚本的「隐藏 banner」

    -   使用「Evolved 顶栏」时，开启 Evolved 的「隐藏顶部横幅」，关闭本脚本的「隐藏 banner」
    -   不使用「Evolved 顶栏」时，关闭 Evolved 的「隐藏顶部横幅」，开启本脚本的「隐藏 banner」

-   **清爽首页、极简首页** 会接管首页布局，本脚本对其无效

-   可能存在其他未测试到的不兼容情况

### 2. 与 [bilibili-app-recommend](https://greasyfork.org/zh-CN/scripts/443530) 的兼容性

-   **兼容**，提供 **隐藏 视频tag / 隐藏 弹幕数 / 隐藏 点赞数** 功能，在首页功能菜单末尾

### 3. 与 [Bilibili 旧播放页](https://github.com/MotooriKashin/Bilibili-Old) 的兼容性

-   **不兼容**，旧播放页脚本完全接管页面，使用该脚本时请在脚本管理器中关闭本净化脚本，以免造成干扰

### 4. 与 [Pakku.js](https://github.com/xmcp/pakku.js) 的兼容性

-   **兼容**，推荐搭配使用

## 数据导入与导出

<details>
<summary><b>导出数据</b></summary>

![](images/how-to-export.png)

</details>
<details>
<summary><b>导入数据</b></summary>

![](images/how-to-import.png)

</details>
<details>
<summary><b>数据云同步</b></summary>

-   Tampermonkey/Violentmonkey 均支持同步数据到 Google Drive/Onedrive 等网盘
-   [Tampermonkey Q105: How can I sync all scripts installed at Tampermonkey to another browser?](https://www.tampermonkey.net/faq.php?locale=en#Q105)
-   [开启 Chrome 油猴插件「Tampermonkey」的同步备份功能](https://www.10wan.com/software-guide/1015_7tg8bw/)
-   同步到 Google drive 的数据是默认隐藏的，参考 [Google Drive Appdata](https://developers.google.com/drive/api/guides/appdata?hl=zh-cn)

</details>

## Ref

-   [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey)
-   [Manifest V3](https://developer.chrome.com/docs/extensions/migrating/checklist)
-   [TamperMonkey 5.0](https://www.tampermonkey.net/changelog.php#v5.0.0)

## Contribution

-   main branch 只用于发布测试版和稳定版
-   dev branch 用于开发

<details>
<summary>视频过滤流程</summary>

![](images/filter-flowchart.jpg)

</details>

<div align="center">
<image src="./images/logo.png" height="120"></image>
<h1>bilibili 页面净化大师</h1>
<div><b>高度定制化的 bilibili 网页净化插件，提供 300+ 个功能开关，深度净化页面元素</b></div>
<br>
<div>支持去广告、BV号转AV号、URL参数净化、播放器净化 等多种细节功能</div>
<div>专注于净化/优化页面，轻量高效无浏览器负担，载入时不闪屏</div>
<br>

[安装](#%E5%AE%89%E8%A3%85) / [功能介绍](#%E5%8A%9F%E8%83%BD%E4%BB%8B%E7%BB%8D) / [浏览器适配](#%E6%B5%8F%E8%A7%88%E5%99%A8%E9%80%82%E9%85%8D) / [净化效果](#%E5%87%80%E5%8C%96%E6%95%88%E6%9E%9C%E5%AF%B9%E6%AF%94) / [插件兼容](#%E4%B8%8E%E5%85%B6%E4%BB%96-bilibili-%E6%8F%92%E4%BB%B6%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7) / [数据导出](#%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%85%A5%E4%B8%8E%E5%AF%BC%E5%87%BA)
<br>
<br>

</div>

## 功能一览

![](images/preview.png)

<details>
<summary><b>查看 全部功能长图</b></summary>

![](images/preview-full.jpg)

</details>

## 安装

### 稳定版：[**前往 Greasyfork 安装**](https://greasyfork.org/zh-CN/scripts/479861)

-   **Firefox** 浏览器请查看 [**浏览器适配**](#%E6%B5%8F%E8%A7%88%E5%99%A8%E9%80%82%E9%85%8D)
-   稳定版持续在 Greasyfork 发布，油猴插件会定期检查，自动更新

### 测试版：[Release安装](https://github.com/festoney8/bilibili-cleaner/releases/)

-   开发版：[CI Build](https://github.com/festoney8/bilibili-cleaner/actions/workflows/dev-ci.yml?query=is%3Asuccess)

## 使用

-   **注意「首页、播放页、版权作品播放页、直播间、搜索页、动态页、热门视频/排行榜页」这 7 个页面，菜单各不相同**

-   「通用」项目对所有页面生效

-   按下图打开菜单，在每个页面进行自定义净化，支持实时预览

![](images/usage.png)

## 功能介绍

-   适用于 **净化新版 bilibili 网页**，不做老版本页面适配
-   目前支持 **「首页、播放页、版权作品播放页、直播间、搜索页、动态页、热门视频/排行榜页」** 这 7 个页面，可在每个页面下开启插件菜单，查看功能列表
-   「通用」功能主要用于净化顶栏，对全站所有页面生效
-   脚本默认用户已登录，大会员下(开发环境)体验最佳
-   脚本默认开启少数基础功能，其余功能由用户自行设定
-   大多数功能实时生效，方便用户进行页面定制
-   脚本在开启网页后立即注入，所有隐藏元素规则在开启页面后 1 秒内生效。其他需要等待元素出现的功能，如「净化分享」生效较慢

### 快捷键

-   支持使用快捷键 `Alt + B` 或 `Ctrl + Alt + B` 快速开启/关闭插件功能，迅速查看净化对比
-   Firefox 浏览器仅支持 `Ctrl + Alt + B`

### 注意事项

-   给 UP 主充电时，若出现 **充电窗口载入失败 (报错NaN)**，请关闭 **通用项「URL参数净化」** 功能，刷新页面再充电
-   **「版权视频播放页」大部分功能与「播放页」一致且互相同步，小部分独有功能已用 "★" 重点标出**
-   「动态页」评论区相关功能与「播放页」一致且互相同步
-   「直播页」顶栏与普通顶栏不同，通用功能对其不生效（仅搜索栏少数功能与通用同步）
-   「首页」默认 10 个推荐位，在显示 5 列的情况下，若同时隐藏广告和分区视频，会产生一个待载入空位（骨架），可调节骨架相关选项改善观感

## 浏览器适配

### Chrome / Edge

-   **要求 Chrome 内核版本 >= 105**，浏览器内核版本过低会导致部分功能失效，如：无法净化顶栏

### Firefox

-   **Firefox版本 103~120，按如下步骤开启高级设定**
    -   在浏览器内打开网址 [about:config](about:config)，若出现提示页面，点击「接受风险并继续」
    -   搜索 `layout.css.has-selector.enabled` ，将这一项的开关改为 `true`，并刷新标签页
-   **Firefox版本 > 121，无需修改设定**

### 脚本管理插件

|         | [Tampermonkey](https://www.tampermonkey.net/) (油猴插件)                                                | [Violentmonkey](https://violentmonkey.github.io/) (暴力猴)                                       |
| ------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Chrome  | [链接](https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo)                      | [链接](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) |
| Edge    | [链接](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) | [链接](https://microsoftedge.microsoft.com/addons/detail/eeagobfjdenkkddmbclomhiblgggliao)       |
| Firefox | [链接](https://addons.mozilla.org/firefox/addon/tampermonkey/)                                          | [链接](https://addons.mozilla.org/firefox/addon/violentmonkey/)                                  |
| 测试    | **已测试，推荐**                                                                                        | 支持，部分测试                                                                                   |

-   [Greasemonkey](https://www.greasespot.net/) 和 [ScriptCat](https://docs.scriptcat.org/) 未进行测试

## 净化效果对比

<details>
<summary><b>查看 播放页 对比图</b></summary>

### before

![](images/screenshot-video-before.png)

### after

![](images/screenshot-video-after.png)

</details>

<details>
<summary><b>查看 首页 对比图</b></summary>

### before，4 列模式，浏览器缩放 110%~125%

![](images/screenshot-homepage-before-4col.png)

### after

![](images/screenshot-homepage-after-4col.png)

### before，5 列模式，浏览器缩放 90%~100%

![](images/screenshot-homepage-before-5col.png)

### after

![](images/screenshot-homepage-after-5col.png)

</details>

<details>
<summary><b>查看 直播页 对比图</b></summary>

### before

![](images/screenshot-live-before.png)

### after

![](images/screenshot-live-after.png)

</details>

<details>
<summary><b>查看 动态页 对比图</b></summary>

### before

![](images/screenshot-dynamic-before.png)

### after

![](images/screenshot-dynamic-after.png)

</details>

<details>
<summary><b>查看 插件混用首页 (cleaner + Evolved + app-recommend)</b></summary>

![](images/screenshot-homepage-multi-plugins.png)

</details>

## 与其他 bilibili 插件的兼容性

### 与 [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) 的兼容性

-   绝大多数功能兼容，小部分功能重复，均不会产生崩坏

-   本脚本中的 通用项「隐藏-顶栏相关」对 Evolved 的自定义顶栏无效

-   **隐藏首页banner**

    -   使用「Evolved 夜间模式」时，开启 Evolved 的「隐藏顶部横幅」，关闭本脚本的「隐藏 banner」

    -   使用「Evolved 顶栏」时，开启 Evolved 的「隐藏顶部横幅」，关闭本脚本的「隐藏 banner」
    -   不使用「Evolved 顶栏」时，关闭 Evolved 的「隐藏顶部横幅」，开启本脚本的「隐藏 banner」

-   **清爽首页、极简首页** 会接管首页布局，本脚本对其无效

### 与 [bilibili-app-recommend](https://greasyfork.org/zh-CN/scripts/443530) 的兼容性

-   **兼容**，提供 **隐藏 视频tag / 隐藏 弹幕数 / 隐藏 点赞数** 功能，在首页功能菜单末尾

## 数据导入与导出

### 导出数据 (以 Tampermonkey 为例)

![](images/how-to-export.png)

### 导入数据

![](images/how-to-import.png)

## Ref

-   [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey)

## Contribution

-   main branch 用于发布测试版和稳定版
-   dev branch 用于开发

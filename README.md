<center><h1>bilibili-cleaner</h1></center>
<center><h4>bilibili 页面净化大师</h4></center>

## 介绍

-   **适用于净化新版 B站 web 页面，提供 300+ 功能开关，深度净化页面元素，定制自己的净化方式**
-   **支持净化的页面：首页、普通播放页、版权视频播放页、直播间、搜索页、动态页**

## 安装

### 1. 安装方法

-   **稳定版：[点此安装](https://greasyfork.org/zh-CN/scripts/479861)**
    -   稳定版本会持续在 Greasyfork 更新
    -   油猴插件会每天检测脚本版本，并自动更新
-   **开发测试版：**GitHub Release

### 2. 浏览器支持

#### Chrome 或 Edge

-   要求 Chrome 内核版本 >= 105，浏览器内核版本过低会导致部分功能失效

#### Firefox

-   **Firefox版本 103~120，需开启高级设定**
    1. 在浏览器内打开网址 [about:config](about:config)，若出现提示页面，点击「接受风险并继续」
    2. 搜索 `layout.css.has-selector.enabled` ，将这一项的开关改为 `true`
-   Firefox版本 > 121，无需修改设定

### 3. 插件支持

|         | [油猴插件 (tampermonkey)](https://www.tampermonkey.net/)                                                    | [暴力猴插件 (violentmonkey)](https://violentmonkey.github.io/)                                         |
| ------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Chrome  | [Chrome插件](https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo)                    | [Chrome插件](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) |
| Edge    | [Edge插件](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) | [Edge插件](https://microsoftedge.microsoft.com/addons/detail/eeagobfjdenkkddmbclomhiblgggliao)         |
| Firefox | [Firefox插件](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)                                 | [Firefox插件](https://addons.mozilla.org/firefox/addon/violentmonkey/)                                 |
| 测试    | 已测试，推荐                                                                                                | 未完全测试，基本支持                                                                                   |

-   **注意：URL参数净化** 功能，由于比较激进，会导致 **Web 端充电窗口载入失败**，需充电时请关闭该功能并刷新页面

## 使用

### 1. 开启菜单

-   **注意：【首页、普通播放页、版权视频播放页、直播间、搜索页、动态页】这 6 个页面的菜单各不相同，每个页面都有对应的选项**

-   **【普通播放页、版权视频播放页】大部分功能一致且互相同步，小部分功能为该页面独有**

![](images/usage.png)

## 兼容性

### 1. 与 [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) 的兼容性

-   绝大多数功能兼容，小部分功能重复，均不会产生崩坏

-   本脚本中的「通用项-隐藏 顶栏」相关对 Evolved 的自定义顶栏功能无效，自定义顶栏有自己的设定界面

-   **隐藏首页banner**

    -   使用「Evolved 顶栏」时，开启 Evolved 的「隐藏顶部横幅」，关闭本脚本的「隐藏 banner」

    -   不使用「Evolved 顶栏」时，关闭 Evolved 的「隐藏顶部横幅」，开启本脚本的「隐藏 banner」

-   **清爽首页、极简首页** 会接管首页布局，本脚本对其无效

### 与 [bilibili-app-recommend](https://greasyfork.org/zh-CN/scripts/443530) 的兼容性

-   **兼容**，提供 **隐藏 视频tag / 隐藏 弹幕数 / 隐藏 点赞数** 功能，在首页功能菜单末尾

## 净化效果对比

<details>
<summary>查看 首页 对比图</summary>

#### 4 列模式 (浏览器缩放110%) before

![](images/screenshot-homepage-before-4col.png)

#### 5 列模式 (浏览器缩放100%) before

![](images/screenshot-homepage-before-5col.png)

### after

![](images/screenshot-homepage-after-4col.png)
![](images/screenshot-homepage-after-5col.png)

</details>

<details>
<summary>查看 播放页 对比图</summary>

## before

![](images/screenshot-video-before.png)

## after

![](images/screenshot-video-after.png)

</details>

<details>
<summary>查看 直播页 对比图</summary>

## before

![](images/screenshot-live-before.png)

## after

![](images/screenshot-live-after.png)

</details>

<details>
<summary>查看 动态页 对比图</summary>

### before

![](images/screenshot-dynamic-before.png)

### after

![](images/screenshot-dynamic-after.png)

</details>

# 如何导入导出数据

### 导出数据 (以 Tampermonkey 为例)

![](images/how-to-export.png)

### 导入数据

![](images/how-to-import.png)

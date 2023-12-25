# bilibili-cleaner bilibili 页面净化大师

# 功能介绍

-   **适用于净化新版 B站 web 页面，提供 300+ 功能开关，深度净化页面元素，定制自己的净化方式**

-   支持净化的页面：**首页、普通播放页、版权视频播放页、直播间、搜索页、动态页**

# 安装

-   浏览器支持：**Chrominum 内核 >= 105，Firefox >= 121**

    -   **注意：Firefox 103-120** 需输入网址 `about:config` 打开高级设定，开启 `layout.css.has-selector.enabled` 功能

    -   浏览器内核版本过低会导致部分功能失效

-   **注意：URL参数净化** 功能，由于比较激进，会导致 **Web 端充电窗口载入失败**，需充电时请关闭该功能并刷新页面

# 菜单开启方法

-   **注意：【首页、普通播放页、版权视频播放页、直播间、搜索页、动态页】这 6 个页面的菜单各不相同，每个页面都有对应的选项**

-   **【普通播放页、版权视频播放页】大部分功能一致且互相同步，小部分功能为该页面独有**

![](images/usage.png)

# 与 [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) 的兼容性

-   绝大多数功能兼容，小部分功能重复，均不会产生崩坏

-   本脚本中的「通用项-隐藏 顶栏」相关对 Evolved 的自定义顶栏功能无效，自定义顶栏有自己的设定界面

-   **隐藏首页banner**

    -   使用「Evolved 顶栏」时，开启 Evolved 的「隐藏顶部横幅」，关闭本脚本的「隐藏 banner」

    -   不使用「Evolved 顶栏」时，关闭 Evolved 的「隐藏顶部横幅」，开启本脚本的「隐藏 banner」

-   **清爽首页、极简首页** 会接管首页布局，本脚本对其无效

# 与 [bilibili-app-recommend](https://greasyfork.org/zh-CN/scripts/443530) 的兼容性

-   **兼容**，提供 **隐藏 视频tag / 隐藏 弹幕数 / 隐藏 点赞数** 功能，在首页功能菜单末尾

# 净化效果示意

<details>
<summary>查看 首页 对比图</summary>

## before

![](images/screenshot-homepage-before-4col.png)
![](images/screenshot-homepage-before-5col.png)

## after

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

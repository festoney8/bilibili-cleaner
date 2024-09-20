import { Group } from '../components/group'
import { CheckboxItem, NumberItem, RadioItem } from '../components/item'
import fetchHook from '../utils/fetch'
import { isPageHomepage } from '../utils/pageType'

const homepageGroupList: Group[] = []

if (isPageHomepage()) {
    // 基础项
    const basicItems = [
        // 隐藏 横幅banner
        new CheckboxItem({
            itemID: 'homepage-hide-banner',
            description: '隐藏 横幅banner',
            itemCSS: `.header-banner__inner, .bili-header__banner {
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
                }
                /* header滚动后渐变出现, 否则闪动 */
                #i_cecream .bili-header__bar.slide-down {
                    transition: background-color 0.3s ease-out, box-shadow 0.3s ease-out !important;
                }
                #i_cecream .bili-header__bar:not(.slide-down) {
                    transition: background-color 0.3s ease-out !important;
                }
                /* 分区菜单 第一排按钮的二级菜单下置  */
                .v-popover.is-top {padding-top: 5px; padding-bottom: unset !important; bottom: unset !important;}
                @media (min-width: 2200px) {.v-popover.is-top {top:32px;}}
                @media (min-width: 1701px) and (max-width: 2199.9px) {.v-popover.is-top {top:32px;}}
                @media (min-width: 1367px) and (max-width: 1700.9px) {.v-popover.is-top {top:28px;}}
                @media (min-width: 1100px) and (max-width: 1366.9px) {.v-popover.is-top {top:28px;}}
                @media (max-width: 1099.9px) {.v-popover.is-top {top:24px;}}
            `,
        }),
        // 隐藏 大图活动轮播, 默认开启
        new CheckboxItem({
            itemID: 'homepage-hide-recommend-swipe',
            description: '隐藏 大图活动轮播',
            defaultStatus: true,
            itemCSS: `.recommended-swipe {
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
                `,
        }),
        // 隐藏 整个分区栏
        new CheckboxItem({
            itemID: 'homepage-hide-subarea',
            description: '隐藏 整个分区栏',
            // 高权限, 否则被压缩分区栏高度影响
            itemCSS: `#i_cecream .bili-header__channel .channel-icons {
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
                }`,
        }),
        // 隐藏 滚动页面时 顶部吸附顶栏
        new CheckboxItem({
            itemID: 'homepage-hide-sticky-header',
            description: '隐藏 滚动页面时 顶部吸附顶栏',
            itemCSS: `.bili-header .left-entry__title svg {
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
                /* 不可添加important, 否则与Evolved的黑暗模式冲突 */
                #nav-searchform {
                    background: #f1f2f3;
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
                }`,
        }),
        // 隐藏 滚动页面时 顶部吸附分区栏
        new CheckboxItem({
            itemID: 'homepage-hide-sticky-subarea',
            description: '隐藏 滚动页面时 顶部吸附分区栏',
            defaultStatus: true,
            itemCSS: `#i_cecream .header-channel {display: none !important;}
                /* 吸附分区栏的动效转移给吸附header, 滚动后渐变出现 */
                #i_cecream .bili-header__bar.slide-down {
                    transition: background-color 0.3s ease-out, box-shadow 0.3s ease-out !important;
                }
                #i_cecream .bili-header__bar:not(.slide-down) {
                    transition: background-color 0.3s ease-out;
                }`,
        }),
        // 隐藏 顶部adblock提示, 默认开启
        new CheckboxItem({
            itemID: 'homepage-hide-adblock-tips',
            description: '隐藏 顶部adblock提示',
            defaultStatus: true,
            itemCSS: `.adblock-tips {display: none !important;}`,
        }),
        // 恢复 原始动态按钮
        new CheckboxItem({
            itemID: 'homepage-revert-channel-dynamic-icon',
            description: '恢复 原始动态按钮',
            itemCSS: `
                .bili-header__channel .channel-icons .icon-bg__dynamic picture {
                    display: none !important;
                }
                .bili-header__channel .channel-icons .icon-bg__dynamic svg {
                    display: none !important;
                }
                .bili-header__channel .channel-icons .icon-bg__dynamic::after {
                    content: "";
                    width: 25px;
                    height: 25px;
                    background-image: url('data:image/svg+xml,<svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-bg--icon" data-v-674f5b07=""> <path d="M6.41659 15.625C3.88528 15.625 1.83325 13.7782 1.83325 11.5H10.9999C10.9999 13.7782 8.94789 15.625 6.41659 15.625Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.125 16.0827C15.125 18.614 13.2782 20.666 11 20.666L11 11.4993C13.2782 11.4993 15.125 13.5514 15.125 16.0827Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6.875 6.91667C6.875 9.44797 8.72183 11.5 11 11.5L11 2.33333C8.72182 2.33333 6.875 4.38536 6.875 6.91667Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.5833 7.375C13.052 7.375 11 9.22183 11 11.5H20.1667C20.1667 9.22183 18.1146 7.375 15.5833 7.375Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }`,
        }),
        // 修改 页面两侧边距
        new NumberItem({
            itemID: 'homepage-layout-padding',
            description: '修改 页面两侧边距 (-1禁用)',
            defaultValue: -1,
            minValue: -1,
            maxValue: 500,
            disableValue: -1,
            unit: 'px',
            itemCSS: `.bili-feed4-layout, .bili-feed4 .bili-header .bili-header__channel {padding: 0 ???px !important;}
                    .bili-feed4-layout, .bili-feed4 .bili-header .bili-header__channel {width: 100% !important;}`,
            itemCSSPlaceholder: '???',
        }),
    ]
    homepageGroupList.push(new Group('homepage-basic', '首页 基本功能', basicItems))

    // 页面布局, 一组互斥选项
    const layoutItems = [
        // 官方默认布局, 默认开启
        new RadioItem({
            itemID: 'homepage-layout-default',
            description: '官方默认，自动匹配页面缩放',
            radioName: 'homepage-layout-option',
            radioItemIDList: [
                'homepage-layout-default',
                'homepage-layout-4-column',
                'homepage-layout-5-column',
                'homepage-layout-6-column',
            ],
            defaultStatus: true,
        }),
        // 使用 4 列布局
        new RadioItem({
            itemID: 'homepage-layout-4-column',
            description: '使用 4 列布局',
            radioName: 'homepage-layout-option',
            radioItemIDList: [
                'homepage-layout-default',
                'homepage-layout-4-column',
                'homepage-layout-5-column',
                'homepage-layout-6-column',
            ],
            itemCSS: `#i_cecream .recommended-container_floor-aside .container {
                    grid-template-columns: repeat(4,1fr) !important;
                }`,
        }),
        // 使用 5 列布局
        new RadioItem({
            itemID: 'homepage-layout-5-column',
            description: '使用 5 列布局\n建议开启 增大视频信息字号',
            radioName: 'homepage-layout-option',
            radioItemIDList: [
                'homepage-layout-default',
                'homepage-layout-4-column',
                'homepage-layout-5-column',
                'homepage-layout-6-column',
            ],
            itemCSS: `#i_cecream .recommended-container_floor-aside .container {
                    grid-template-columns: repeat(5,1fr) !important;
                }`,
        }),
        // 使用 6 列布局
        new RadioItem({
            itemID: 'homepage-layout-6-column',
            description: '使用 6 列布局\n建议 隐藏发布时间，可选 显示活动轮播',
            radioName: 'homepage-layout-option',
            radioItemIDList: [
                'homepage-layout-default',
                'homepage-layout-4-column',
                'homepage-layout-5-column',
                'homepage-layout-6-column',
            ],
            itemCSS: `#i_cecream .recommended-container_floor-aside .container {
                    grid-template-columns: repeat(6,1fr) !important;
                }`,
        }),
    ]
    homepageGroupList.push(new Group('homepage-layout', '页面强制布局 (单选)', layoutItems))

    // 视频列表
    const rcmdListItems = [
        // 增大 视频信息字号
        new CheckboxItem({
            itemID: 'homepage-increase-rcmd-list-font-size',
            description: '增大 视频信息字号',
            itemCSS: `.bili-video-card .bili-video-card__info--tit,
                .bili-live-card .bili-live-card__info--tit,
                .single-card.floor-card .title {
                    font-size: 16px !important;
                }
                .bili-video-card .bili-video-card__info--bottom,
                .floor-card .sub-title.sub-title {
                    font-size: 14px !important;
                }
                .bili-video-card__stats,
                .bili-video-card__stats .bili-video-card__stats--left,
                .bili-video-card__stats .bili-video-card__stats--right {
                    font-size: 14px !important;
                }`,
        }),
        // 隐藏 视频负反馈 恢复标题宽度
        new CheckboxItem({
            itemID: 'homepage-hide-no-interest',
            description: '隐藏 视频负反馈 恢复标题宽度',
            itemCSS: `.bili-video-card.enable-no-interest, .bili-live-card.enable-no-interest {--title-padding-right: 0;}
                    .bili-video-card__info--no-interest, .bili-live-card__info--no-interest {display: none !important;}`,
        }),
        // 隐藏 视频tag (已关注/1万点赞)
        new CheckboxItem({
            itemID: 'homepage-hide-up-info-icon',
            description: '隐藏 视频tag (已关注/1万点赞)',
            itemCSS: `/* CSS伪造Logo */
                .bili-video-card .bili-video-card__info--icon-text {
                    width: 17px;
                    height: 17px;
                    color: transparent !important;
                    background-color: unset !important;
                    border-radius: unset !important;
                    margin: 0 2px 0 0 !important;
                    font-size: 0 !important;
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
                }`,
        }),
        // 隐藏 发布时间
        new CheckboxItem({
            itemID: 'homepage-hide-video-info-date',
            description: '隐藏 发布时间',
            itemCSS: `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__info--date {display: none !important;}`,
        }),
        // 隐藏 弹幕数, 默认开启
        new CheckboxItem({
            itemID: 'homepage-hide-danmaku-count',
            description: '隐藏 弹幕数',
            defaultStatus: true,
            itemCSS: `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__stats--item:nth-child(2) {display: none !important;}`,
        }),
        // 隐藏 稍后再看提示语
        new CheckboxItem({
            itemID: 'homepage-hide-bili-watch-later-tip',
            description: '隐藏 稍后再看提示语',
            itemCSS: `.bili-watch-later__tip--lab {display: none !important;}`,
        }),
        // 隐藏 稍后再看按钮
        new CheckboxItem({
            itemID: 'homepage-hide-bili-watch-later',
            description: '隐藏 稍后再看按钮',
            itemCSS: `.bili-watch-later {display: none !important;}`,
        }),
        // 隐藏 视频预览中的弹幕
        new CheckboxItem({
            itemID: 'homepage-hide-inline-player-danmaku',
            description: '隐藏 视频预览中的弹幕',
            itemCSS: `.bpx-player-row-dm-wrap, .bpx-player-cmd-dm-wrap {display: none !important;}`,
        }),
        // 隐藏 广告, 默认开启
        new CheckboxItem({
            itemID: 'homepage-hide-ad-card',
            description: '隐藏 广告',
            defaultStatus: true,
            itemCSS: `
                :is(.feed-card, .bili-video-card):has(.bili-video-card__info--ad, [href*="cm.bilibili.com"], .bili-video-card__info--creative-ad) {
                    display: none !important;
                }
                :is(.feed-card, .bili-video-card):not(:has(.bili-video-card__wrap, .bili-video-card__skeleton)) {
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
                }`,
        }),
        // 隐藏 直播间推荐
        new CheckboxItem({
            itemID: 'homepage-hide-live-card-recommend',
            description: '隐藏 直播间推荐',
            itemCSS: `
                .bili-live-card,
                .floor-single-card:has(use[*|href$='#channel-live']) {
                    display: none !important;
                }
            `,
        }),
        // 精简 分区视频推荐, 默认开启
        new CheckboxItem({
            itemID: 'homepage-simple-sub-area-card-recommend',
            description: '简化 分区视频推荐',
            defaultStatus: true,
            itemCSS: `.floor-single-card .layer {display: none !important;}
                .floor-single-card .floor-card {box-shadow: unset !important; border: none !important;}
                .single-card.floor-card .floor-card-inner:hover {background: none !important;}`,
        }),
        // 隐藏 分区视频推荐
        new CheckboxItem({
            itemID: 'homepage-hide-sub-area-card-recommend',
            description: '隐藏 分区视频推荐',
            // 含skeleton时不隐藏否则出现空档
            itemCSS: `.floor-single-card:not(:has(.skeleton, .skeleton-item)) {display: none !important;}`,
        }),
        // 关闭 视频载入 骨架动效(skeleton animation)
        new CheckboxItem({
            itemID: 'homepage-hide-skeleton-animation',
            description: '关闭 视频载入 骨架动效',
            itemCSS: `.bili-video-card .loading_animation .bili-video-card__skeleton--light,
                .bili-video-card .loading_animation .bili-video-card__skeleton--text,
                .bili-video-card .loading_animation .bili-video-card__skeleton--face,
                .bili-video-card .loading_animation .bili-video-card__skeleton--cover {
                    animation: none !important;
                }
                .skeleton .skeleton-item {
                    animation: none !important;
                }
                .floor-skeleton .skeleton-item {
                    animation: none !important;
                }`,
        }),
        // 隐藏 视频载入 骨架(skeleton)
        new CheckboxItem({
            itemID: 'homepage-hide-skeleton',
            description: '隐藏 视频载入 骨架',
            // anchor占位也隐藏
            itemCSS: `
                .bili-video-card:not(.is-rcmd) {
                    visibility: hidden;
                }
                .floor-single-card:has(.skeleton, .skeleton-item) {
                    visibility: hidden;
                }`,
        }),
        // 增大 视频载入 视频数量
        new CheckboxItem({
            itemID: 'homepage-increase-rcmd-load-size',
            description: '增大 视频载入 视频数量 (实验功能)',
            itemCSS: `
            /* 扩增载入后会产生奇怪的骨架空位 */
            .container.is-version8 > .floor-single-card:has(.skeleton, .skeleton-item, .floor-skeleton) {
                display: none;
            }`,
            enableFunc: () => {
                fetchHook.addPreFn((input: RequestInfo | URL, init: RequestInit | undefined): RequestInfo | URL => {
                    if (
                        typeof input === 'string' &&
                        input.includes('api.bilibili.com') &&
                        input.includes('feed/rcmd') &&
                        init?.method?.toUpperCase() === 'GET'
                    ) {
                        input = input.replace('&ps=12&', '&ps=24&')
                    }
                    return input
                })
            },
        }),
        // 启用 视频列表预加载
        new CheckboxItem({
            itemID: 'homepage-rcmd-video-preload',
            description: '启用 视频列表预加载 (不稳定功能)\n需开启"隐藏 分区视频推荐"\n建议开启"增大视频载入数量"',
            itemCSS: `
                /* 隐藏anchor前的skeleton */
                .bili-video-card:not(.is-rcmd):has(~ .load-more-anchor) {
                    display: none !important;
                }
                .load-more-anchor.preload {
                    position: fixed;
                    top: -100px;
                    left: -100px;
                    opacity: 0;
                }
            `,
            enableFunc: async () => {
                let cnt = 0
                const id = setInterval(() => {
                    const anchor = document.querySelector('.load-more-anchor') as HTMLElement
                    if (anchor) {
                        clearInterval(id)

                        // 向下滚动时，调整anchor位置
                        let lastScrollTop = 0
                        let isPreload = false
                        window.addEventListener('scroll', function () {
                            const scrollTop = window.scrollY || document.documentElement.scrollTop
                            if (scrollTop > lastScrollTop) {
                                const gap = innerHeight - anchor.getBoundingClientRect().top
                                if (gap > -innerHeight * 0.75 && !isPreload) {
                                    anchor.classList.add('preload')
                                    isPreload = true
                                } else {
                                    isPreload && anchor.classList.remove('preload')
                                    isPreload = false
                                }
                            } else {
                                isPreload && anchor.classList.remove('preload')
                                isPreload = false
                            }
                            lastScrollTop = scrollTop
                        })
                    }
                    if (++cnt > 80) {
                        clearInterval(id)
                    }
                }, 250)
            },
            enableFuncRunAt: 'document-end',
        }),
    ]
    homepageGroupList.push(new Group('homepage-rcmd-list', '视频列表', rcmdListItems))

    // 页面侧栏 小组件
    const sidebarItems = [
        // 隐藏 下载桌面端弹窗, 默认开启
        new CheckboxItem({
            itemID: 'homepage-hide-desktop-download-tip',
            description: '隐藏 下载桌面端弹窗',
            defaultStatus: true,
            itemCSS: `.desktop-download-tip {display: none !important;}`,
        }),
        // 隐藏 下滑浏览推荐提示, 默认开启
        new CheckboxItem({
            itemID: 'homepage-hide-trial-feed-wrap',
            description: '隐藏 下滑浏览推荐提示',
            defaultStatus: true,
            itemCSS: `.trial-feed-wrap {display: none !important;}`,
        }),
        // 隐藏 换一换
        new CheckboxItem({
            itemID: 'homepage-hide-feed-roll-btn',
            description: '隐藏 换一换',
            itemCSS: `.feed-roll-btn {display: none !important;}`,
        }),
        // 隐藏 稍后再看
        new CheckboxItem({
            itemID: 'homepage-hide-watchlater-pip-button',
            description: '隐藏 稍后再看',
            itemCSS: `.watchlater-pip-button {display: none !important;}`,
        }),
        // 隐藏 刷新
        new CheckboxItem({
            itemID: 'homepage-hide-flexible-roll-btn',
            description: '隐藏 刷新',
            itemCSS: `.palette-button-wrap .flexible-roll-btn {display: none !important;}`,
        }),
        // 隐藏 客服和反馈, 默认开启
        new CheckboxItem({
            itemID: 'homepage-hide-feedback',
            description: '隐藏 客服和反馈',
            defaultStatus: true,
            itemCSS: `.palette-button-wrap .storage-box {display: none !important;}`,
        }),
        // 隐藏 回顶部
        new CheckboxItem({
            itemID: 'homepage-hide-top-btn',
            description: '隐藏 回顶部',
            itemCSS: `.palette-button-wrap .top-btn-wrap {display: none !important;}`,
        }),
    ]
    homepageGroupList.push(new Group('homepage-sidebar', '页面侧栏 小组件', sidebarItems))

    // bilibili-app-recommend插件
    const biliAppRcmdItems = [
        // 适配bilibili-app-recommend插件
        // 隐藏 视频tag (bilibili-app-recommend)
        new CheckboxItem({
            itemID: 'homepage-hide-up-info-icon-bilibili-app-recommend',
            description: '隐藏 视频tag',
            itemCSS: `/* adapt bilibili-app-recommend */
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
                }`,
        }),
        // 隐藏 弹幕数 (bilibili-app-recommend)
        new CheckboxItem({
            itemID: 'homepage-hide-danmaku-count-bilibili-app-recommend',
            description: '隐藏 弹幕数',
            itemCSS: `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-video-danmaku"]) {display: none !important;}`,
        }),
        // 隐藏 点赞数 (bilibili-app-recommend)
        new CheckboxItem({
            itemID: 'homepage-hide-agree-count-bilibili-app-recommend',
            description: '隐藏 点赞数',
            itemCSS: `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-agree"]) {display: none !important;}`,
        }),
    ]
    homepageGroupList.push(new Group('homepage-bili-app-rcmd', '适配插件[bilibili-app-recommend]', biliAppRcmdItems))
}

export { homepageGroupList }

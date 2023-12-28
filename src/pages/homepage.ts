import { Group } from '../core/group'
import { NormalItem, SeparatorItem } from '../core/item'

const homepageItems: (NormalItem | SeparatorItem)[] = []

if (location.href.startsWith('https://www.bilibili.com/') && ['/index.html', '/'].includes(location.pathname)) {
    // 基础项part
    {
        // 隐藏 横幅banner
        homepageItems.push(
            new NormalItem(
                'homepage-hide-banner',
                '隐藏 横幅banner',
                false,
                undefined,
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
                }`,
            ),
        )
        // 隐藏 大图活动轮播, 默认开启
        homepageItems.push(
            new NormalItem(
                'homepage-hide-recommend-swipe',
                '隐藏 大图活动轮播',
                true,
                undefined,
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
                `,
            ),
        )
        // 隐藏 整个分区栏
        homepageItems.push(
            new NormalItem(
                'homepage-hide-subarea',
                '隐藏 整个分区栏',
                false,
                undefined,
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
                }`,
            ),
        )
        // 隐藏 滚动页面时 顶部吸附顶栏
        homepageItems.push(
            new NormalItem(
                'homepage-hide-sticky-header',
                '隐藏 滚动页面时 顶部吸附顶栏',
                false,
                undefined,
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
            ),
        )
        // 隐藏 滚动页面时 顶部吸附分区栏
        homepageItems.push(
            new NormalItem(
                'homepage-hide-sticky-subarea',
                '隐藏 滚动页面时 顶部吸附分区栏',
                true,
                undefined,
                false,
                `#i_cecream .header-channel {display: none !important;}`,
            ),
        )
        // 页面直角化 去除圆角
        homepageItems.push(
            new NormalItem(
                'homepage-border-radius',
                '页面直角化 去除圆角',
                false,
                undefined,
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
                }`,
            ),
        )
    }

    // 视频分区part
    homepageItems.push(new SeparatorItem())
    {
        // 隐藏 视频列表-视频tag (已关注/1万点赞)
        homepageItems.push(
            new NormalItem(
                'homepage-hide-up-info-icon',
                '隐藏 视频列表-视频tag (已关注/1万点赞)',
                false,
                undefined,
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
                }`,
            ),
        )
        // 隐藏 视频列表-弹幕数, 默认开启
        homepageItems.push(
            new NormalItem(
                'homepage-hide-danmaku-count',
                '隐藏 视频列表-弹幕数',
                true,
                undefined,
                false,
                `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__stats--item:nth-child(2) {visibility: hidden;}`,
            ),
        )
        // 隐藏 视频列表-发布时间
        homepageItems.push(
            new NormalItem(
                'homepage-hide-video-info-date',
                '隐藏 视频列表-发布时间',
                false,
                undefined,
                false,
                `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__info--date {display: none !important;}`,
            ),
        )
        // 隐藏 视频列表-稍后再看按钮
        homepageItems.push(
            new NormalItem(
                'homepage-hide-bili-watch-later',
                '隐藏 视频列表-稍后再看按钮',
                false,
                undefined,
                false,
                `.bili-watch-later {display: none !important;}`,
            ),
        )
        // 隐藏 视频列表-广告, 默认开启
        homepageItems.push(
            new NormalItem(
                'homepage-hide-ad-card',
                '隐藏 视频列表-广告',
                true,
                undefined,
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
                }`,
            ),
        )
        // 隐藏 视频列表-直播间推荐
        homepageItems.push(
            new NormalItem(
                'homepage-hide-live-card-recommend',
                '隐藏 视频列表-直播间推荐',
                false,
                undefined,
                false,
                `.bili-live-card.is-rcmd {display: none !important;}`,
            ),
        )
        // 隐藏 视频列表-分区视频推荐
        homepageItems.push(
            new NormalItem(
                'homepage-hide-sub-area-card-recommend',
                '隐藏 视频列表-分区视频推荐',
                false,
                undefined,
                false,
                `.floor-single-card {display: none !important;}`,
            ),
        )
    }

    // 右下角part
    homepageItems.push(new SeparatorItem())
    {
        // 隐藏 右下角-下载桌面端弹窗
        homepageItems.push(
            new NormalItem(
                'homepage-hide-desktop-download-tip',
                '隐藏 右下角-下载桌面端弹窗',
                false,
                undefined,
                false,
                `.desktop-download-tip {display: none !important;}`,
            ),
        )
        // 隐藏 右下角-刷新
        homepageItems.push(
            new NormalItem(
                'homepage-hide-flexible-roll-btn',
                '隐藏 右下角-刷新',
                false,
                undefined,
                false,
                `.palette-button-wrap .flexible-roll-btn {display: none !important;}`,
            ),
        )
        // 隐藏 右下角-客服和反馈, 默认开启
        homepageItems.push(
            new NormalItem(
                'homepage-hide-feedback',
                '隐藏 右下角-客服和反馈',
                true,
                undefined,
                false,
                `.palette-button-wrap .storage-box {display: none !important;}`,
            ),
        )
        // 隐藏 右下角-回顶部
        homepageItems.push(
            new NormalItem(
                'homepage-hide-top-btn',
                '隐藏 右下角-回顶部',
                false,
                undefined,
                false,
                `.palette-button-wrap .top-btn-wrap {display: none !important;}`,
            ),
        )
    }

    // bilibili-app-recommend插件part
    homepageItems.push(new SeparatorItem())
    {
        // 适配bilibili-app-recommend插件
        // 隐藏 视频tag (bilibili-app-recommend)
        homepageItems.push(
            new NormalItem(
                'homepage-hide-up-info-icon-bilibili-app-recommend',
                '隐藏 视频tag (bilibili-app-recommend)',
                false,
                undefined,
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
                }`,
            ),
        )
        // 隐藏 弹幕数 (bilibili-app-recommend)
        homepageItems.push(
            new NormalItem(
                'homepage-hide-danmaku-count-bilibili-app-recommend',
                '隐藏 弹幕数 (bilibili-app-recommend)',
                false,
                undefined,
                false,
                `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-video-danmaku"]) {display: none !important;}`,
            ),
        )
        // 隐藏 点赞数 (bilibili-app-recommend)
        homepageItems.push(
            new NormalItem(
                'homepage-hide-agree-count-bilibili-app-recommend',
                '隐藏 点赞数 (bilibili-app-recommend)',
                false,
                undefined,
                false,
                `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-agree"]) {display: none !important;}`,
            ),
        )
    }
}

export const homepageGroup = new Group('homepage', '当前是：首页', homepageItems)

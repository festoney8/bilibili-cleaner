import { Group } from '../core/group'
import { NormalItem } from '../core/item'

const basicItems: NormalItem[] = []
const hotItems: NormalItem[] = []
const weeklyItems: NormalItem[] = []
const historyItems: NormalItem[] = []
// GroupList
const popularGroupList: Group[] = []

if (location.href.includes('bilibili.com/v/popular/')) {
    // 基础功能part, basicItems
    {
        // 隐藏 横幅banner, 同步首页设定
        basicItems.push(
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
                }
                /* header滚动后渐变出现, 否则闪动 */
                #i_cecream .bili-header__bar.slide-down {
                    transition: background-color 0.3s ease-out, box-shadow 0.3s ease-out !important;
                }
                #i_cecream .bili-header__bar:not(.slide-down) {
                    transition: background-color 0.3s ease-out !important;
                }
                /* header高度 */
                #biliMainHeader {min-height: unset !important;}
                `,
            ),
        )
        // 隐藏 滚动页面时 顶部吸附顶栏, 同步首页设定
        basicItems.push(
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
                }`,
            ),
        )
        // 隐藏 tips, 默认开启
        basicItems.push(
            new NormalItem(
                'popular-hide-tips',
                '隐藏 tips',
                true,
                undefined,
                false,
                `.popular-list .popular-tips,
                .rank-container .rank-tips,
                .history-list .history-tips {display: none !important;}
                .rank-container .rank-tab-wrap {
                    margin-bottom: 0 !important;
                    padding: 10px 0 !important;
                }`,
            ),
        )
        // 隐藏 稍后再看按钮
        basicItems.push(
            new NormalItem(
                'popular-hide-watchlater',
                '隐藏 稍后再看按钮',
                false,
                undefined,
                false,
                `.rank-container .rank-item .van-watchlater,
                .history-list .video-card .van-watchlater,
                .history-list .video-card .watch-later,
                .weekly-list .video-card .van-watchlater,
                .weekly-list .video-card .watch-later,
                .popular-list .video-card .van-watchlater,
                .popular-list .video-card .watch-later {
                    display: none !important;
                }`,
            ),
        )
        // 强制使用四列布局 (实验性 会覆盖其余功能)
        basicItems.push(
            new NormalItem(
                'popular-four-column-layout',
                '强制使用四列布局 (实验性 会覆盖其余功能)',
                false,
                undefined,
                false,
                `
                /* 页面宽度 */
                @media (min-width: 1300px) and (max-width: 1399.9px) {
                    .popular-container {
                        max-width: 1180px !important;
                    }
                }
                @media (max-width: 1139.9px) {
                    .popular-container {
                        max-width: 1020px !important;
                    }
                }
                /* 布局高度 */
                .rank-container .rank-tab-wrap {
                  margin-bottom: 0 !important;
                  padding: 5px 0 !important;
                }
                .nav-tabs {
                  height: 64px !important;
                }
                .popular-list {
                  padding: 10px 0 0 !important;
                }
                .video-list {
                  margin-top: 15px !important;
                }
                /* 屏蔽 Tips */
                .popular-list .popular-tips, .rank-container .rank-tips, .history-list .history-tips {
                  display: none !important;
                }
                /* 屏蔽 Hint */
                .popular-list .popular-tips, .weekly-list .weekly-hint, .history-list .history-hint {
                  display: none !important;
                }
                /* 通用：综合热门, 每周必看, 入站必刷, grid布局 */
                .card-list, .video-list {
                  width: 100% !important;
                  display: grid !important;
                  grid-gap: 20px !important;
                  grid-column: span 4 !important;
                  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                }
                .card-list .video-card, .video-list .video-card {
                  display: unset !important;
                  width: unset !important;
                  height: unset !important;
                  margin-right: unset !important;
                  margin-bottom: unset !important;
                }
                .card-list .video-card .video-card__content, .video-list .video-card .video-card__content {
                  background: none;
                  width: unset !important;
                  height: unset !important;
                  margin: 4px !important;
                  border-radius: 6px;
                  overflow: hidden !important;
                }
                .card-list .video-card .video-card__info, .video-list .video-card .video-card__info {
                  margin-top: 8px !important;
                  padding: 0 4px !important;
                  font-size: 14px;
                }
                .card-list .video-card .video-card__info .rcmd-tag, .video-list .video-card .video-card__info .rcmd-tag {
                  display: none !important;
                }
                .card-list .video-card .video-card__info .video-name, .video-list .video-card .video-card__info .video-name {
                  font-weight: normal !important;
                  margin-bottom: 8px !important;
                  font-size: 15px !important;
                  line-height: 22px !important;
                  height: 44px !important;
                  overflow: hidden !important;
                }
                .card-list .video-card .video-card__info .up-name, .video-list .video-card .video-card__info .up-name {
                  margin: unset !important;
                  font-size: 14px !important;
                  text-wrap: nowrap !important;
                }
                .card-list .video-card .video-card__info > div, .video-list .video-card .video-card__info > div {
                  display: flex !important;
                  justify-content: space-between !important;
                }
                .card-list .video-card .video-card__info .video-stat .play-text, .video-list .video-card .video-card__info .video-stat .play-text {
                  text-wrap: nowrap !important;
                }
                /* 排行榜, grid布局 */
                .rank-list {
                  width: 100% !important;
                  display: grid !important;
                  grid-gap: 20px !important;
                  grid-column: span 4 !important;
                  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                }
                .rank-list .rank-item {
                  display: unset !important;
                  width: unset !important;
                  height: unset !important;
                  margin-right: unset !important;
                  margin-bottom: unset !important;
                }
                .rank-list .rank-item > .content {
                  display: unset !important;
                  padding: unset !important;
                }
                .rank-list .rank-item > .content > .img {
                  background: none;
                  width: unset !important;
                  height: unset !important;
                  margin: 4px !important;
                  border-radius: 6px;
                  overflow: hidden !important;
                }
                .rank-list .rank-item > .content > .img .num {
                  font-size: 18px;
                  zoom: 1.25;
                }
                .rank-list .rank-item > .content > .info {
                  margin-top: 8px !important;
                  margin-left: unset !important;
                  padding-left: 4px !important;
                  padding-right: 4px !important;
                  font-size: 14px;
                  height: unset !important;
                }
                .rank-list .rank-item > .content > .info .title {
                  height: 44px !important;
                  line-height: 22px !important;
                  font-weight: 500 !important;
                  font-size: 15px !important;
                  overflow: hidden !important;
                }
                .rank-list .rank-item > .content > .info .detail {
                  display: flex !important;
                  justify-content: space-between !important;
                  align-items: center !important;
                  margin-top: 8px !important;
                }
                .rank-list .rank-item > .content > .info .detail .up-name {
                  margin: unset !important;
                  font-size: 14px;
                  text-wrap: nowrap !important;
                }
                .rank-list .rank-item > .content > .info .detail .data-box {
                  line-height: unset !important;
                  margin: 0 12px 0 0 !important;
                  text-wrap: nowrap !important;
                }
                .rank-list .rank-item > .content .more-data {
                  display: none !important;
                }
                `,
            ),
        )
    }
    popularGroupList.push(new Group('popular-basic', '热门/排行榜页 基本功能', basicItems))

    // 综合热门part, hotItems
    {
        // 隐藏 视频tag (人气飙升/1万点赞)
        hotItems.push(
            new NormalItem(
                'popular-hot-hide-tag',
                '隐藏 视频tag (已关注/1万点赞)',
                false,
                undefined,
                false,
                `.popular-list .rcmd-tag {display: none !important;}`,
            ),
        )
    }
    popularGroupList.push(new Group('popular-hot', '综合热门', hotItems))

    // 每周必看part, weeklyItems
    {
        // 隐藏 一句话简介
        weeklyItems.push(
            new NormalItem(
                'popular-weekly-hide-hint',
                '隐藏 一句话简介',
                false,
                undefined,
                false,
                `.weekly-list .weekly-hint {display: none !important;}`,
            ),
        )
    }
    popularGroupList.push(new Group('popular-weekly', '每周必看', weeklyItems))

    // 入站必刷part, historyItems
    {
        // 隐藏 一句话简介
        historyItems.push(
            new NormalItem(
                'popular-history-hide-hint',
                '隐藏 一句话简介',
                false,
                undefined,
                false,
                `.history-list .history-hint {display: none !important;}`,
            ),
        )
    }
    popularGroupList.push(new Group('popular-history', '入站必刷', historyItems))
}

export { popularGroupList }

import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageDynamic } from '../utils/pageType'
import fontFaceRegular from './styles/fontFaceRegular.scss?inline'
import fontFaceMedium from './styles/fontFaceMedium.scss?inline'

const dynamicGroupList: Group[] = []

/**
 * 动态页面规则
 * 动态评论区的规则尽可能使用与video page相同的itemID, 同步开关状态
 * 评论区规则适配2种动态详情页(t.bilibili.com/12121212和bilibili.com/opus/12121212)
 */
if (isPageDynamic()) {
    let fontPatchCSS = ''
    if (location.href.match(/www\.bilibili\.com\/opus\/\d+/)) {
        fontPatchCSS = `
        ${fontFaceRegular}
        ${fontFaceMedium}
        .reply-item .root-reply-container .content-warp .user-info .user-name {
            font-family: PingFang SC,HarmonyOS_Medium,Helvetica Neue,Microsoft YaHei,sans-serif !important;
            font-weight: 500 !important;
            font-size: 14px !important;
        }`
    } else if (location.href.match(/t\.bilibili\.com\/\d+/)) {
        fontPatchCSS = `
        ${fontFaceRegular}
        body {
            font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif !important;
            font-weight: 400;
        }`
    } else if (location.href.includes('www.bilibili.com/v/topic/detail/')) {
        fontPatchCSS = `
        ${fontFaceRegular}
        body {
            font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif !important;
            font-weight: 400;
        }`
    }

    // 基本功能
    const basicItems = [
        // 顶栏 不再吸附顶部
        new CheckboxItem({
            itemID: 'hide-dynamic-page-fixed-header',
            description: '顶栏 不再吸附顶部',
            itemCSS: `.fixed-header .bili-header__bar {position: relative !important;}
                /* 高权限覆盖*/
                aside.right section.sticky {top: 15px !important;}`,
        }),
        // 交换 左栏与右栏位置
        new CheckboxItem({
            itemID: 'exchange-dynamic-page-left-right-aside',
            description: '交换 左栏与右栏位置',
            itemCSS: `
                aside.left {order: 3; margin-right: 0 !important;}
                main {order: 2;}
                aside.right {order: 1; margin-right: 12px !important;}
                .bili-dyn-sidebar {order: 4;}`,
        }),
        // 修复字体
        new CheckboxItem({
            itemID: 'font-patch',
            description: '修复字体',
            itemCSS: fontPatchCSS,
        }),
    ]
    dynamicGroupList.push(new Group('dynamic-basic', '动态页 基本功能', basicItems))

    // 左栏
    const leftItems = [
        // 隐藏 个人信息框
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-my-info',
            description: '隐藏 个人信息框',
            itemCSS: `aside.left section {display: none !important;}
                .bili-dyn-live-users {top: 15px !important;}`,
        }),
        // 隐藏 直播中Logo
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-live-users__item__living',
            description: '隐藏 直播中Logo',
            itemCSS: `.bili-dyn-live-users__item__living {display: none !important;}`,
        }),
        // 隐藏 整个左栏
        new CheckboxItem({
            itemID: 'hide-dynamic-page-aside-left',
            description: '隐藏 整个左栏',
            itemCSS: `aside.left {display: none !important;}`,
        }),
    ]
    dynamicGroupList.push(new Group('dynamic-left', '左栏 个人信息/正在直播', leftItems))

    // 右栏
    const rightItems = [
        // 隐藏 社区中心, 默认开启
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-banner',
            description: '隐藏 社区中心',
            defaultStatus: true,
            itemCSS: `.bili-dyn-banner {display: none !important;}`,
        }),
        // 隐藏 广告, 默认开启
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-ads',
            description: '隐藏 广告',
            defaultStatus: true,
            itemCSS: `section:has(.bili-dyn-ads) {display: none !important;}
                aside.right section {margin-bottom: 0 !important;}
                /* header吸附时 */
                aside.right section.sticky {top: 72px}`,
        }),
        // 隐藏 话题列表
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-topic-box',
            description: '隐藏 话题列表',
            itemCSS: `.bili-dyn-topic-box, .topic-panel {display: none !important;}`,
        }),
        // 隐藏 整个右栏
        new CheckboxItem({
            itemID: 'hide-dynamic-page-aside-right',
            description: '隐藏 整个右栏',
            itemCSS: `aside.right {display: none !important;}`,
        }),
    ]
    dynamicGroupList.push(new Group('dynamic-right', '右栏 热门话题', rightItems))

    // 中栏顶部
    const centerTopItems = [
        // 扩增 中栏宽度
        new CheckboxItem({
            itemID: 'expand-dynamic-page-bili-dyn-width',
            description: '扩增 中栏宽度',
            itemCSS: `
                main {flex-grow: 0.8 !important;}
                /* 限制查看图片时img高度 */
                .bili-album__watch__content img {max-height: 80vh !important;}
            `,
        }),
        // 双行显示 UP 主列表
        new CheckboxItem({
            itemID: 'dynamic-page-up-list-dual-line-mode',
            description: '双行显示 UP 主列表',
            itemCSS: `
                .bili-dyn-up-list__content {
                    display: grid !important;
                    grid-auto-flow: column !important;
                    grid-template-rows: auto auto !important;
                }
                .bili-dyn-up-list__content .shim {
                    display: none !important;
                }
                .bili-dyn-up-list__item {
                    height: auto !important;
                }
                .bili-dyn-up-list__window {
                    padding: 10px !important;
                }
                /* 左右按钮突出显示 */
                .bili-dyn-up-list__nav__btn {
                    zoom: 1.4;
                    transition: background-color 0.1s linear;
                }
                .bili-dyn-up-list__nav__btn:hover {
                    background-color: #00AEEC !important;
                    color: white !important;
                }
            `,
        }),
        // 淡化 UP 主列表 已查看项
        new CheckboxItem({
            itemID: 'dynamic-page-up-list-checked-item-opacity',
            description: '淡化 UP 主列表 已查看项',
            itemCSS: `
                .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child) {
                    transition: opacity 0.2s ease-out;
                    opacity: 0.25;
                }
                .bili-dyn-up-list__item:hover {
                    transition: opacity 0.1s linear !important;
                    opacity: 1 !important;
                }`,
        }),
        // 隐藏 UP 主列表 已查看项
        new CheckboxItem({
            itemID: 'dynamic-page-up-list-checked-item-hide',
            description: '隐藏 UP 主列表 已查看项',
            itemCSS: `
                /* keyframes 不支持 display, 但chrome可正常处理, firefox不消失 */
                @keyframes disappear {
                    0% {opacity: 1; width: 68px; margin-right: 6px;}
                    99% {opacity: 0; width: 0; margin-right: 0;}
                    100% {opacity: 0; width: 0; margin-right: 0; display: none;}
                }
                .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child) {
                    animation: disappear;
                    animation-duration: .5s;
                    animation-delay: 1s;
                    animation-fill-mode: forwards;
                }
                /* firefox无动画 */
                @-moz-document url-prefix() {
                    .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child) {
                        display: none;
                    }
                }`,
        }),
        // 隐藏 动态发布框
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-publishing',
            description: '隐藏 动态发布框',
            itemCSS: `.bili-dyn-publishing {display: none !important;}
                        main section:nth-child(1) {margin-bottom: 0 !important;}`,
        }),
        // 隐藏 动态分类Tab bar
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-list-tabs',
            description: '隐藏 动态分类Tab bar',
            itemCSS: `.bili-dyn-list-tabs {display: none !important;}`,
        }),
    ]
    dynamicGroupList.push(new Group('dynamic-center-top', '中栏 顶部功能', centerTopItems))

    // 中栏 动态列表
    const centerDynItems = [
        // 隐藏 头像框
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-avatar-pendent',
            description: '隐藏 头像框',
            itemCSS: `
                .b-avatar__layer.center {width: 48px !important; height: 48px !important;}
                .b-avatar__layers .b-avatar__layer.center:nth-child(2) picture {display: none !important;}
                .b-avatar__layers:has(.b-avatar__layer__res[style^="background"]) {display: none !important;}
            `,
        }),
        // 隐藏 头像徽章
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-avatar-icon',
            description: '隐藏 头像徽章',
            itemCSS: `.b-avatar__layers .b-avatar__layer:last-child:not(.center) {display: none !important;}`,
        }),
        // 隐藏 动态右侧饰品
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-ornament',
            description: '隐藏 动态右侧饰品',
            itemCSS: `.bili-dyn-ornament, .bili-dyn-item__ornament {display: none !important;}`,
        }),
        // 隐藏 警告notice, 默认开启
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-dispute',
            description: '隐藏 警告notice',
            defaultStatus: true,
            itemCSS: `.bili-dyn-content__dispute {display: none !important;}`,
        }),
        // 隐藏 稍后再看按钮
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-watchlater',
            description: '隐藏 稍后再看按钮',
            itemCSS: `.bili-dyn-card-video__mark {display: none !important;}`,
        }),
        // 隐藏 官方话题Tag
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-official-topic',
            description: '隐藏 官方话题Tag',
            // 不得隐藏普通tag .bili-rich-text-topic
            itemCSS: `.bili-dyn-content__orig__topic, .bili-dyn-content__forw__topic {
                display: none !important;
            }`,
        }),
        // 禁用 普通话题#Tag#高亮
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-text-topic',
            description: '禁用 普通话题#Tag#高亮',
            itemCSS: `.bili-rich-text-topic {color: inherit !important;}
                .bili-rich-text-topic:hover {color: var(--brand_blue) !important;}`,
        }),
        // 隐藏 动态精选互动 XXX赞了/XXX回复
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-item-interaction',
            description: '隐藏 动态精选互动 XXX赞了/XXX回复',
            itemCSS: `.bili-dyn-item__interaction {display: none !important;}`,
        }),
        // 隐藏 视频预约/直播预约动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-card-reserve',
            description: '隐藏 视频预约/直播预约动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-reserve) {display: none !important;}`,
        }),
        // 隐藏 带货动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-card-goods',
            description: '隐藏 带货动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-goods),
                .bili-dyn-list__item:has(.bili-rich-text-module.goods),
                .bili-dyn-list__item:has([data-type="goods"]) {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin: 0 !important;
                }`,
        }),
        // 隐藏 抽奖动态(含转发)
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-lottery',
            description: '隐藏 抽奖动态(含转发)',
            itemCSS: `.bili-dyn-list__item:has([data-type="lottery"]) {display: none !important;}`,
        }),
        // 隐藏 转发的动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-forward',
            description: '隐藏 转发的动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-content__orig.reference) {
                    display: none !important;
                }`,
        }),
        // 隐藏 投票动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-vote',
            description: '隐藏 投票动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-vote) {
                    display: none !important;
                }`,
        }),
        // 隐藏 直播通知动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-live',
            description: '隐藏 直播通知动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-live) {
                    display: none !important;
                }`,
        }),
        // 隐藏 被block的充电动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-blocked',
            description: '隐藏 被block的充电动态',
            itemCSS: `.bili-dyn-list__item:has(.dyn-blocked-mask) {
                    display: none !important;
                }`,
        }),
        // 隐藏 全部充电视频(含已充电)
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-charge-video',
            description: '隐藏 全部充电视频(含已充电)',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-video__badge [src*="qcRJ6sJU91"]) {
                    display: none !important;
                }`,
        }),
        // 自动展开 相同UP主被折叠的动态
        new CheckboxItem({
            itemID: 'dynamic-page-unfold-dynamic',
            description: '自动展开 相同UP主被折叠的动态',
            enableFunc: async () => {
                // 大量动态下，单次耗时10ms内
                const unfold = () => {
                    const dynFoldNodes = document.querySelectorAll('main .bili-dyn-list__item .bili-dyn-item-fold')
                    if (dynFoldNodes.length) {
                        dynFoldNodes.forEach((e) => {
                            e instanceof HTMLDivElement && e.click()
                        })
                    }
                }
                setInterval(unfold, 500)
            },
        }),
    ]
    dynamicGroupList.push(new Group('dynamic-center-dyn', '中栏 动态列表', centerDynItems))

    // 页面右下角 小按钮
    const sidebarItems = [
        // 隐藏 回到旧版, 默认开启
        new CheckboxItem({
            itemID: 'hide-dynamic-page-sidebar-old-version',
            description: '隐藏 回到旧版',
            defaultStatus: true,
            itemCSS: `.bili-dyn-sidebar .bili-dyn-sidebar__btn:first-child {visibility: hidden !important;}
            .opus-detail .side-toolbar__bottom .side-toolbar__btn:not(.backtop) {display: none !important;}`,
        }),
        // 隐藏 回顶部
        new CheckboxItem({
            itemID: 'hide-dynamic-page-sidebar-back-to-top',
            description: '隐藏 回顶部',
            itemCSS: `.bili-dyn-sidebar .bili-dyn-sidebar__btn:last-child {visibility: hidden !important;}`,
        }),
    ]
    dynamicGroupList.push(new Group('dynamic-sidebar', '页面右下角 小按钮', sidebarItems))
}

export { dynamicGroupList }

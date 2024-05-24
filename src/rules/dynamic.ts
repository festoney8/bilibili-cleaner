import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageDynamic } from '../utils/page-type'

// 自动展开 相同UP主被折叠的动态
const dynamicUnfold = () => {
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
}

const dynamicGroupList: Group[] = []

/**
 * 动态页面规则
 * 动态评论区的规则尽可能使用与video page相同的itemID, 同步开关状态
 * 评论区规则适配2种动态详情页(t.bilibili.com/12121212和bilibili.com/opus/12121212)
 */
if (isPageDynamic()) {
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

    // 中栏
    const centerItems = [
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
            itemCSS: `.bili-dyn-ornament {display: none !important;}`,
        }),
        // 隐藏 动态内容中 警告notice, 默认开启
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-dispute',
            description: '隐藏 动态内容中 警告notice',
            defaultStatus: true,
            itemCSS: `.bili-dyn-content__dispute {display: none !important;}`,
        }),
        // 隐藏 动态内容中 稍后再看按钮
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-watchlater',
            description: '隐藏 动态内容中 稍后再看按钮',
            itemCSS: `.bili-dyn-card-video__mark {display: none !important;}`,
        }),
        // 隐藏 动态内容中 官方话题Tag
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-official-topic',
            description: '隐藏 动态内容中 官方话题Tag',
            // 不得隐藏普通tag .bili-rich-text-topic
            itemCSS: `.bili-dyn-content__orig__topic, .bili-dyn-content__forw__topic {
                display: none !important;
            }`,
        }),
        // 动态内容中 普通Tag 去除高亮
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-text-topic',
            description: '动态内容中 普通Tag 去除高亮',
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
            itemFunc: dynamicUnfold,
        }),
    ]
    dynamicGroupList.push(new Group('dynamic-center', '中栏 动态列表', centerItems))

    // 动态评论区, 尽可能同步video page
    const commentItems = [
        // 隐藏 活动/notice, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-notice',
            description: '隐藏 活动/notice',
            defaultStatus: true,
            itemCSS: `.reply-header .reply-notice {display: none !important;}`,
        }),
        // 隐藏 投票
        new CheckboxItem({
            itemID: 'video-page-hide-top-vote-card',
            description: '隐藏 投票',
            itemCSS: `.comment-container .top-vote-card {display: none !important;}`,
        }),
        // 隐藏 整个评论框
        new CheckboxItem({
            itemID: 'video-page-hide-main-reply-box',
            description: '隐藏 整个评论框',
            itemCSS: `.main-reply-box, .comment-container .fixed-reply-box {display: none !important;}`,
        }),
        // 隐藏 页面底部 吸附评论框, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-fixed-reply-box',
            description: '隐藏 页面底部 吸附评论框',
            defaultStatus: true,
            itemCSS: `.fixed-reply-box {display: none !important;}`,
        }),
        // 隐藏 评论编辑器内占位文字, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-box-textarea-placeholder',
            description: '隐藏 评论编辑器内占位文字',
            defaultStatus: true,
            itemCSS: `.reply-box-textarea::placeholder {color: transparent !important;}`,
        }),
        // 隐藏 评论区用户卡片
        new CheckboxItem({
            itemID: 'video-page-hide-comment-user-card',
            description: '隐藏 评论区用户卡片\n鼠标放在用户名上时不显示卡片',
            itemCSS: `.user-card {display: none!important;}`,
        }),
        // 隐藏 评论右侧装饰
        new CheckboxItem({
            itemID: 'video-page-hide-reply-decorate',
            description: '隐藏 评论右侧装饰',
            itemCSS: `.reply-decorate {display: none !important;}`,
        }),
        // 隐藏 ID后粉丝牌
        new CheckboxItem({
            itemID: 'video-page-hide-fan-badge',
            description: '隐藏 ID后粉丝牌',
            itemCSS: `.fan-badge {display: none !important;}`,
        }),
        // 隐藏 老粉、原始粉丝Tag
        new CheckboxItem({
            itemID: 'video-page-hide-contractor-box',
            description: '隐藏 老粉、原始粉丝Tag',
            itemCSS: `.contractor-box {display: none !important;}`,
        }),
        // 隐藏 一级评论用户等级
        new CheckboxItem({
            itemID: 'video-page-hide-user-level',
            description: '隐藏 一级评论用户等级',
            itemCSS: `.user-level {display: none !important;}`,
        }),
        // 隐藏 二级评论用户等级
        new CheckboxItem({
            itemID: 'video-page-hide-sub-user-level',
            description: '隐藏 二级评论用户等级',
            itemCSS: `.sub-user-level {display: none !important;}`,
        }),
        // 隐藏 用户头像外圈饰品
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-pendent-dom',
            description: '隐藏 用户头像外圈饰品',
            itemCSS: `.bili-avatar-pendent-dom {display: none !important;}`,
        }),
        // 隐藏 用户头像右下小icon
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-nft-icon',
            description: '隐藏 用户头像右下小icon',
            itemCSS: `.bili-avatar-nft-icon {display: none !important;}
                .comment-container .bili-avatar-icon {display: none !important;}`,
        }),
        // 隐藏 用户投票 (红方/蓝方)
        new CheckboxItem({
            itemID: 'video-page-hide-vote-info',
            description: '隐藏 用户投票 (红方/蓝方)',
            itemCSS: `.comment-container .vote-info {display: none !important;}`,
        }),
        // 隐藏 评论内容下tag(UP觉得很赞)
        new CheckboxItem({
            itemID: 'video-page-hide-reply-tag-list',
            description: '隐藏 评论内容下tag(UP觉得很赞)',
            itemCSS: `.reply-tag-list {display: none !important;}`,
        }),
        // 隐藏 笔记评论前的小Logo, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-note-prefix',
            description: '隐藏 笔记评论前的小Logo',
            defaultStatus: true,
            itemCSS: `.note-prefix {display: none !important;}`,
        }),
        // 隐藏 评论内容搜索关键词高亮, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-jump-link-search-word',
            description: '隐藏 评论内容搜索关键词高亮',
            defaultStatus: true,
            itemCSS: `.reply-content .jump-link.search-word {color: inherit !important;}
                .comment-container .reply-content .icon.search-word {display: none !important;}`,
        }),
        // 隐藏 二级评论中的@高亮
        new CheckboxItem({
            itemID: 'video-page-hide-reply-content-user-highlight',
            description: '隐藏 二级评论中的@高亮',
            itemCSS: `.sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                .comment-container .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`,
        }),
        // 隐藏 召唤AI机器人的评论, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-at-reply-at-bots',
            description: '隐藏 召唤AI机器人的评论',
            defaultStatus: true,
            itemCSS:
                // 8455326 @机器工具人
                // 234978716 @有趣的程序员
                // 1141159409 @AI视频小助理
                // 437175450 @AI视频小助理总结一下 (误伤)
                // 1692825065 @AI笔记侠
                // 690155730 @AI视频助手
                // 689670224 @哔哩哔理点赞姬
                // 3494380876859618 @课代表猫
                // 1168527940 @AI课代表呀
                // 439438614 @木几萌Moe
                // 1358327273 @星崽丨StarZai
                // 3546376048741135 @AI沈阳美食家
                // 1835753760 @AI识片酱
                // 9868463 @AI头脑风暴
                // 358243654 @GPT_5
                `.reply-item:has(.jump-link.user[data-user-id="8455326"]),
                .reply-item:has(.jump-link.user[data-user-id="234978716"]),
                .reply-item:has(.jump-link.user[data-user-id="1141159409"]),
                .reply-item:has(.jump-link.user[data-user-id="437175450"]),
                .reply-item:has(.jump-link.user[data-user-id="1692825065"]),
                .reply-item:has(.jump-link.user[data-user-id="690155730"]),
                .reply-item:has(.jump-link.user[data-user-id="689670224"]),
                .reply-item:has(.jump-link.user[data-user-id="3494380876859618"]),
                .reply-item:has(.jump-link.user[data-user-id="1168527940"]),
                .reply-item:has(.jump-link.user[data-user-id="439438614"]),
                .reply-item:has(.jump-link.user[data-user-id="1358327273"]),
                .reply-item:has(.jump-link.user[data-user-id="3546376048741135"]),
                .reply-item:has(.jump-link.user[data-user-id="1835753760"]),
                .reply-item:has(.jump-link.user[data-user-id="9868463"]),
                .reply-item:has(.jump-link.user[data-user-id="358243654"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 AI机器人发布的评论
        new CheckboxItem({
            itemID: 'video-page-hide-bots-reply',
            description: '隐藏 AI机器人发布的评论',
            defaultStatus: false,
            itemCSS:
                // 8455326 @机器工具人
                // 234978716 @有趣的程序员
                // 1141159409 @AI视频小助理
                // 437175450 @AI视频小助理总结一下 (误伤)
                // 1692825065 @AI笔记侠
                // 690155730 @AI视频助手
                // 689670224 @哔哩哔理点赞姬
                // 3494380876859618 @课代表猫
                // 1168527940 @AI课代表呀
                // 439438614 @木几萌Moe
                // 1358327273 @星崽丨StarZai
                // 3546376048741135 @AI沈阳美食家
                // 1835753760 @AI识片酱
                // 9868463 @AI头脑风暴
                // 358243654 @GPT_5
                `.reply-item:has(.root-reply-container .user-name[data-user-id="8455326"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="234978716"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1141159409"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="437175450"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1692825065"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="690155730"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="689670224"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="3494380876859618"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1168527940"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="439438614"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1358327273"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="3546376048741135"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="1835753760"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="9868463"]),
                .reply-item:has(.root-reply-container .user-name[data-user-id="358243654"]) {
                    display: none !important;
                }`,
        }),
        // 隐藏 包含@的 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-at-reply',
            description: '隐藏 包含@的 无人点赞评论',
            itemCSS: `.reply-item:has(.root-reply .jump-link.user):not(:has(.delete-reply, .top-icon, .sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 包含@的 全部评论
        new CheckboxItem({
            itemID: 'video-page-hide-at-reply-all',
            description: '隐藏 包含@的 全部评论',
            itemCSS: `.reply-item:has(.root-reply .jump-link.user):not(:has(.delete-reply, .top-icon, .sub-up-icon)) {display: none !important;}`,
        }),
        // 隐藏 LV1 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv1-reply',
            description: '隐藏 LV1 无人点赞评论',
            itemCSS: `.reply-item:has(.user-level.level-1):not(:has(.delete-reply, .top-icon, .sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 LV2 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv2-reply',
            description: '隐藏 LV2 无人点赞评论',
            itemCSS: `.reply-item:has(.user-level.level-2):not(:has(.delete-reply, .top-icon, .sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 隐藏 LV3 无人点赞评论
        new CheckboxItem({
            itemID: 'video-page-hide-zero-like-lv3-reply',
            description: '隐藏 LV3 无人点赞评论',
            itemCSS: `.reply-item:has(.user-level.level-3):not(:has(.delete-reply, .top-icon, .sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
        }),
        // 一级评论 踩/回复 只在hover时显示, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-root-reply-dislike-reply-btn',
            description: '一级评论 踩/回复 只在hover时显示',
            defaultStatus: true,
            itemCSS: `.reply-info:not(:has(i.disliked)) .reply-btn,
                .comment-container .reply-info:not(:has(i.disliked)) .reply-dislike {
                    visibility: hidden;
                }
                .comment-container .reply-item:hover .reply-btn,
                .comment-container .reply-item:hover .reply-dislike {
                    visibility: visible !important;
                }`,
        }),
        // 二级评论 踩/回复 只在hover时显示, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-sub-reply-dislike-reply-btn',
            description: '二级评论 踩/回复 只在hover时显示',
            defaultStatus: true,
            itemCSS: `.sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
                .comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                    visibility: hidden;
                }
                .comment-container .sub-reply-item:hover .sub-reply-btn,
                .comment-container .sub-reply-item:hover .sub-reply-dislike {
                    visibility: visible !important;
                }`,
        }),
        // 隐藏 大表情
        new CheckboxItem({
            itemID: 'video-page-hide-emoji-large',
            description: '隐藏 大表情',
            itemCSS: `.emoji-large {display: none !important;}`,
        }),
        // 大表情变成小表情
        new CheckboxItem({
            itemID: 'video-page-hide-emoji-large-zoom',
            description: '大表情变成小表情',
            itemCSS: `.emoji-large {zoom: .5;}`,
        }),
        // 用户名 全部大会员色
        new CheckboxItem({
            itemID: 'video-page-reply-user-name-color-pink',
            description: '用户名 全部大会员色',
            itemCSS: `.reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}}`,
        }),
        // 用户名 全部恢复默认色
        new CheckboxItem({
            itemID: 'video-page-reply-user-name-color-default',
            description: '用户名 全部恢复默认色',
            itemCSS: `.reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}}`,
        }),
        // 笔记图片 查看大图优化, 默认开启
        new CheckboxItem({
            itemID: 'video-page-reply-view-image-optimize',
            description: '笔记图片 查看大图优化',
            defaultStatus: true,
            // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
            itemCSS: `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list {display: none !important;}`,
        }),
    ]
    dynamicGroupList.push(new Group('dynamic-comment', '动态评论区', commentItems))

    // 右下角
    const sidebarItems = [
        // 隐藏 回到旧版, 默认开启
        new CheckboxItem({
            itemID: 'hide-dynamic-page-sidebar-old-version',
            description: '隐藏 回到旧版',
            defaultStatus: true,
            itemCSS: `.bili-dyn-sidebar .bili-dyn-sidebar__btn:first-child {visibility: hidden !important;}`,
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

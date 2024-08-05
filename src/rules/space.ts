import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageSpace } from '../utils/pageType'
import fontFaceRegular from './styles/fontFaceRegular.scss?inline'

const spaceGroupList: Group[] = []

if (isPageSpace()) {
    // 基本功能
    const basicItems = [
        // 打开用户主页 自动跳转到投稿
        new CheckboxItem({
            itemID: 'space-page-redirect-to-video',
            description: '打开用户主页 自动跳转到投稿',
            enableFunc: () => {
                if (/\/\d+\/?($|\?)/.test(location.pathname)) {
                    const userid = location.pathname.match(/\d+/)?.[0]
                    if (userid) {
                        location.href = `https://space.bilibili.com/${userid}/video`
                    }
                }
            },
        }),
        // 修复字体
        new CheckboxItem({
            itemID: 'font-patch',
            description: '修复字体',
            itemCSS: `
                ${fontFaceRegular}
                body,
                .h .h-sign,
                .reply-item .root-reply-container .content-warp .user-info .user-name,
                .bili-comment.browser-pc * {
                    font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif !important;
                    font-weight: 400;
                }
                body,
                .n .n-text {
                    font-size: 14px;
                }
                #page-index .channel .channel-item .small-item,
                #page-video .page-head__left .be-tab-item,
                .n .n-data .n-data-k,
                .n .n-data .n-data-v {
                    font-size: 13px;
                }
            `,
        }),
    ]
    spaceGroupList.push(new Group('space-basic', '空间页 基本功能', basicItems))

    // 动态列表, 尽可能同步动态页
    const spaceDynItems = [
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
    ]
    spaceGroupList.push(new Group('space-dyn', '动态列表', spaceDynItems))

    // 动态评论区, 尽可能同步播放页
    const commentItems = [
        // 隐藏 整个评论区
        new CheckboxItem({
            itemID: 'video-page-hide-all-comment',
            description: '隐藏 整个评论区',
            itemCSS: `
                /* .bili-dyn-item__panel {padding-bottom: 0 !important;} */
                .bili-comment-container, .bili-tabs {display: none !important;}
                .bili-opus-view {border-radius: 6px !important;}
                .opus-detail {margin-bottom: 10px !important; min-height: unset !important;}
                #app .content .dyn-tabs {display: none !important;}
                #app .content .card {padding-bottom: 30px!important;}
            `,
        }),
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
        // 隐藏 评论编辑器
        new CheckboxItem({
            itemID: 'video-page-hide-main-reply-box',
            description: '隐藏 评论编辑器',
            itemCSS: `.main-reply-box, .comment-container .fixed-reply-box {display: none !important;}`,
        }),
        // 隐藏 评论编辑器内占位文字, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-box-textarea-placeholder',
            description: '隐藏 评论编辑器内占位文字',
            defaultStatus: true,
            itemCSS: `:not(.reply-item) .reply-box-textarea::placeholder {color: transparent !important;}`,
        }),
        // 隐藏 用户卡片
        new CheckboxItem({
            itemID: 'video-page-hide-comment-user-card',
            description: '隐藏 用户卡片\n鼠标放在用户名上时不显示卡片',
            itemCSS: `.user-card {display: none!important;}`,
        }),
        // 隐藏 评论右侧装饰
        new CheckboxItem({
            itemID: 'video-page-hide-reply-decorate',
            description: '隐藏 评论右侧装饰',
            itemCSS: `.reply-decorate {display: none !important;}`,
        }),
        // 隐藏 粉丝牌
        new CheckboxItem({
            itemID: 'video-page-hide-fan-badge',
            description: '隐藏 粉丝牌',
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
        // 隐藏 用户头像饰品
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-pendent-dom',
            description: '隐藏 用户头像饰品',
            itemCSS: `.bili-avatar-pendent-dom {display: none !important;}`,
        }),
        // 隐藏 用户头像徽章
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-nft-icon',
            description: '隐藏 用户头像徽章',
            itemCSS: `.bili-avatar-nft-icon {display: none !important;}
                .comment-container .bili-avatar-icon {display: none !important;}`,
        }),
        // 隐藏 用户投票 (红方/蓝方)
        new CheckboxItem({
            itemID: 'video-page-hide-vote-info',
            description: '隐藏 用户投票 (红方/蓝方)',
            itemCSS: `.comment-container .vote-info {display: none !important;}`,
        }),
        // 隐藏 评论内容下Tag(UP觉得很赞)
        new CheckboxItem({
            itemID: 'video-page-hide-reply-tag-list',
            description: '隐藏 评论内容下Tag(UP觉得很赞)',
            itemCSS: `.reply-tag-list {display: none !important;}`,
        }),
        // 隐藏 笔记评论前的小Logo, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-note-prefix',
            description: '隐藏 笔记评论前的小Logo',
            defaultStatus: true,
            itemCSS: `.note-prefix {display: none !important;}`,
        }),
        // 禁用 评论内容搜索关键词高亮, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-jump-link-search-word',
            description: '禁用 评论内容搜索关键词高亮',
            defaultStatus: true,
            itemCSS: `.reply-content .jump-link.search-word {color: inherit !important;}
                .comment-container .reply-content .icon.search-word {display: none !important;}`,
        }),
        // 禁用 二级评论中的@高亮
        new CheckboxItem({
            itemID: 'video-page-hide-reply-content-user-highlight',
            description: '禁用 二级评论中的@高亮',
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
                // 393788832 @Juice_AI
                // 91394217 @AI全文总结
                // 473018527 @AI视频总结
                // 3546639035795567 @AI总结视频
                `.reply-item:has(.jump-link.user:is(
                    [data-user-id="8455326"],
                    [data-user-id="234978716"],
                    [data-user-id="1141159409"],
                    [data-user-id="437175450"],
                    [data-user-id="1692825065"],
                    [data-user-id="690155730"],
                    [data-user-id="689670224"],
                    [data-user-id="3494380876859618"],
                    [data-user-id="1168527940"],
                    [data-user-id="439438614"],
                    [data-user-id="1358327273"],
                    [data-user-id="3546376048741135"],
                    [data-user-id="1835753760"],
                    [data-user-id="9868463"],
                    [data-user-id="358243654"],
                    [data-user-id="393788832"],
                    [data-user-id="91394217"],
                    [data-user-id="473018527"],
                    [data-user-id="3546639035795567"]
                )) {
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
                // 393788832 @Juice_AI
                // 91394217 @AI全文总结
                // 473018527 @AI视频总结
                // 3546639035795567 @AI总结视频
                `.reply-item:has(.root-reply-container .user-name:is(
                    [data-user-id="8455326"],
                    [data-user-id="234978716"],
                    [data-user-id="1141159409"],
                    [data-user-id="437175450"],
                    [data-user-id="1692825065"],
                    [data-user-id="690155730"],
                    [data-user-id="689670224"],
                    [data-user-id="3494380876859618"],
                    [data-user-id="1168527940"],
                    [data-user-id="439438614"],
                    [data-user-id="1358327273"],
                    [data-user-id="3546376048741135"],
                    [data-user-id="1835753760"],
                    [data-user-id="9868463"],
                    [data-user-id="358243654"],
                    [data-user-id="393788832"],
                    [data-user-id="91394217"],
                    [data-user-id="473018527"],
                    [data-user-id="3546639035795567"]
                )) {
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
            itemCSS: `
                .reply-item:not(:has(i.disliked)) :is(.reply-btn, .reply-dislike) {
                    opacity: 0;
                }
                @keyframes appear {
                    0% {opacity: 0;}
                    100% {opacity: 1;}
                }
                .reply-item:hover :is(.reply-btn, .reply-dislike) {
                    animation: appear;
                    animation-duration: 0.2s;
                    animation-delay: 0.3s;
                    animation-fill-mode: forwards;
                }`,
        }),
        // 二级评论 踩/回复 只在hover时显示, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-sub-reply-dislike-reply-btn',
            description: '二级评论 踩/回复 只在hover时显示',
            defaultStatus: true,
            itemCSS: `
                .sub-reply-item:not(:has(i.disliked)) :is(.sub-reply-btn, .sub-reply-dislike) {
                    opacity: 0;
                }
                @keyframes appear {
                    0% {opacity: 0;}
                    100% {opacity: 1;}
                }
                .sub-reply-item:hover :is(.sub-reply-btn, .sub-reply-dislike) {
                    animation: appear;
                    animation-duration: 0.2s;
                    animation-delay: 0.3s;
                    animation-fill-mode: forwards;
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
    spaceGroupList.push(new Group('space-comment', '动态评论区', commentItems))
}

export { spaceGroupList }

import { Group } from '../core/group'
import { NormalItem, SeparatorItem } from '../core/item'

const dynamicItems: (NormalItem | SeparatorItem)[] = []

/**
 * 动态页面规则
 * 动态评论区的规则尽可能使用与video page相同的itemID, 同步开关状态
 */
if (location.host === 't.bilibili.com') {
    // 基本功能part
    {
        // 顶栏 不再吸附顶部
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-fixed-header',
                '顶栏 不再吸附顶部',
                false,
                undefined,
                false,
                `.fixed-header .bili-header__bar {position: relative !important;}
                /* 高权限覆盖*/
                aside.right section.sticky {top: 15px !important;}`,
            ),
        )
    }

    // 左栏part
    dynamicItems.push(new SeparatorItem())
    {
        // 隐藏 左栏 个人信息框
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-my-info',
                '隐藏 左栏 个人信息框',
                false,
                undefined,
                false,
                `section:has(> .bili-dyn-my-info) {display: none !important;}
                .bili-dyn-live-users {top: 15px !important;}`,
            ),
        )
        // 隐藏 左栏 直播中Logo
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-live-users__item__living',
                '隐藏 左栏 直播中Logo',
                false,
                undefined,
                false,
                `.bili-dyn-live-users__item__living {display: none !important;}`,
            ),
        )
    }

    // 右栏part
    dynamicItems.push(new SeparatorItem())
    {
        // 隐藏 右栏 社区中心, 默认开启
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-banner',
                '隐藏 右栏 社区中心',
                true,
                undefined,
                false,
                `.bili-dyn-banner {display: none !important;}`,
            ),
        )
        // 隐藏 右栏 广告, 默认开启
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-ads',
                '隐藏 右栏 广告',
                true,
                undefined,
                false,
                `section:has(.bili-dyn-ads) {display: none !important;}
                aside.right section {margin-bottom: 0 !important;}
                /* header吸附时 */
                aside.right section.sticky {top: 72px}`,
            ),
        )
        // 隐藏 右栏 话题列表
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-topic-box',
                '隐藏 右栏 话题列表',
                false,
                undefined,
                false,
                `.bili-dyn-topic-box, .topic-panel {display: none !important;}`,
            ),
        )
        // 隐藏 整个右栏
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-aside-right',
                '隐藏 整个右栏',
                false,
                undefined,
                false,
                `aside.right {display: none !important;}`,
            ),
        )
    }

    // 中栏part
    dynamicItems.push(new SeparatorItem())
    {
        // 隐藏 中栏 动态发布框
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-publishing',
                '隐藏 中栏 动态发布框',
                false,
                undefined,
                false,
                `.bili-dyn-publishing {display: none !important;}
                main section:nth-child(1) {margin-bottom: 0 !important;}`,
            ),
        )
        // 隐藏 中栏 动态分类Tab
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-list-tabs',
                '隐藏 中栏 动态分类Tab',
                false,
                undefined,
                false,
                `.bili-dyn-list-tabs {display: none !important;}`,
            ),
        )
        // 隐藏 中栏 动态右侧饰品
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-ornament',
                '隐藏 中栏 动态右侧饰品',
                false,
                undefined,
                false,
                `.bili-dyn-ornament {display: none !important;}`,
            ),
        )
        // 隐藏 中栏 视频警告notice, 默认开启
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-bili-dyn-dispute',
                '隐藏 中栏 视频警告notice',
                true,
                undefined,
                false,
                `.bili-dyn-content__dispute {display: none !important;}`,
            ),
        )
    }

    // 动态评论区part, 尽可能同步video page
    dynamicItems.push(new SeparatorItem())
    {
        // 隐藏 评论区-活动/notice, 默认开启
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-reply-notice',
                '隐藏 评论区-活动/notice',
                true,
                undefined,
                false,
                `.comment-container .reply-header .reply-notice {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-整个评论框
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-main-reply-box',
                '隐藏 评论区-整个评论框',
                false,
                undefined,
                false,
                `.comment-container .main-reply-box, .fixed-reply-box {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-评论编辑器内占位文字, 默认开启
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-reply-box-textarea-placeholder',
                '隐藏 评论区-评论编辑器内占位文字',
                true,
                undefined,
                false,
                `.comment-container .reply-box-textarea::placeholder {color: transparent !important;}`,
            ),
        )
        // 隐藏 评论区-评论右侧装饰
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-reply-decorate',
                '隐藏 评论区-评论右侧装饰',
                false,
                undefined,
                false,
                `.comment-container .reply-decorate {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-ID后粉丝牌
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-fan-badge',
                '隐藏 评论区-ID后粉丝牌',
                false,
                undefined,
                false,
                `.comment-container .fan-badge {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-一级评论用户等级
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-user-level',
                '隐藏 评论区-一级评论用户等级',
                false,
                undefined,
                false,
                `.comment-container .user-level {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-二级评论用户等级
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-sub-user-level',
                '隐藏 评论区-二级评论用户等级',
                false,
                undefined,
                false,
                `.comment-container .sub-user-level {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-用户头像外圈饰品
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-bili-avatar-pendent-dom',
                '隐藏 评论区-用户头像外圈饰品',
                false,
                undefined,
                false,
                `.comment-container .bili-avatar-pendent-dom {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-用户头像右下小icon
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-bili-avatar-nft-icon',
                '隐藏 评论区-用户头像右下小icon',
                false,
                undefined,
                false,
                `.comment-container .bili-avatar-nft-icon {display: none !important;}
                .comment-container .bili-avatar-icon {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-评论内容下tag(UP觉得很赞)
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-reply-tag-list',
                '隐藏 评论区-评论内容下tag(UP觉得很赞)',
                false,
                undefined,
                false,
                `.comment-container .reply-tag-list {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-笔记评论前的小Logo, 默认开启
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-note-prefix',
                '隐藏 评论区-笔记评论前的小Logo',
                true,
                undefined,
                false,
                `.comment-container .note-prefix {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-评论内容搜索关键词高亮, 默认开启
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-jump-link-search-word',
                '隐藏 评论区-评论内容搜索关键词高亮',
                true,
                undefined,
                false,
                `.comment-container .reply-content .jump-link.search-word {color: inherit !important;}
                .comment-container .reply-content .icon.search-word {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-二级评论中的@高亮
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-reply-content-user-highlight',
                '隐藏 评论区-二级评论中的@高亮',
                false,
                undefined,
                false,
                `.comment-container .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                .comment-container .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`,
            ),
        )
        // 隐藏 评论区-召唤AI机器人的评论, 默认开启
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-at-reply-at-bots',
                '隐藏 评论区-召唤AI机器人的评论',
                true,
                undefined,
                false,
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
                .reply-item:has(.jump-link.user[data-user-id="1835753760"]) {
                    display: none !important;
                }`,
            ),
        )
        // 隐藏 评论区-包含@的 无人点赞评论
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-zero-like-at-reply',
                '隐藏 评论区-包含@的 无人点赞评论',
                false,
                undefined,
                false,
                `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-包含@的 全部评论
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-at-reply-all',
                '隐藏 评论区-包含@的 全部评论',
                false,
                undefined,
                false,
                `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-LV1 无人点赞评论
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv1-reply',
                '隐藏 评论区-LV1 无人点赞评论',
                false,
                undefined,
                false,
                `.comment-container .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-LV2 无人点赞评论
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv2-reply',
                '隐藏 评论区-LV2 无人点赞评论',
                false,
                undefined,
                false,
                `.comment-container .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 评论区-LV3 无人点赞评论
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-zero-like-lv3-reply',
                '隐藏 评论区-LV3 无人点赞评论',
                false,
                undefined,
                false,
                `.comment-container .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`,
            ),
        )
        // 隐藏 一级评论 踩/回复/举报 hover时显示, 默认开启
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-root-reply-dislike-reply-btn',
                '隐藏 一级评论 踩/回复/举报 hover时显示',
                true,
                undefined,
                false,
                `.comment-container .reply-info:not(:has(i.disliked)) .reply-btn,
                .comment-container .reply-info:not(:has(i.disliked)) .reply-dislike {
                    visibility: hidden;
                }
                .comment-container .reply-item:hover .reply-btn,
                .comment-container .reply-item:hover .reply-dislike {
                    visibility: visible !important;
                }`,
            ),
        )
        // 隐藏 二级评论 踩/回复/举报 hover时显示, 默认开启
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-sub-reply-dislike-reply-btn',
                '隐藏 二级评论 踩/回复/举报 hover时显示',
                true,
                undefined,
                false,
                `.comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
                .comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                    visibility: hidden;
                }
                .comment-container .sub-reply-item:hover .sub-reply-btn,
                .comment-container .sub-reply-item:hover .sub-reply-dislike {
                    visibility: visible !important;
                }`,
            ),
        )
        // 隐藏 评论区-大表情
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-emoji-large',
                '隐藏 评论区-大表情',
                false,
                undefined,
                false,
                `.comment-container .emoji-large {display: none !important;}`,
            ),
        )
        // 评论区-大表情变成小表情
        dynamicItems.push(
            new NormalItem(
                'video-page-hide-emoji-large-zoom',
                '评论区-大表情变成小表情',
                false,
                undefined,
                false,
                `.comment-container .emoji-large {zoom: .5;}`,
            ),
        )
        // 评论区-用户名 全部大会员色
        dynamicItems.push(
            new NormalItem(
                'video-page-reply-user-name-color-pink',
                '评论区-用户名 全部大会员色',
                false,
                undefined,
                false,
                `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}}`,
            ),
        )
        // 评论区-用户名 全部恢复默认色
        dynamicItems.push(
            new NormalItem(
                'video-page-reply-user-name-color-default',
                '评论区-用户名 全部恢复默认色',
                false,
                undefined,
                false,
                `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}}`,
            ),
        )
        // 评论区-笔记图片 查看大图优化, 默认开启
        dynamicItems.push(
            new NormalItem(
                'video-page-reply-view-image-optimize',
                '评论区-笔记图片 查看大图优化',
                true,
                undefined,
                false,
                // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
                `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
                .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
                .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`,
            ),
        )
    }

    // 右下角part
    dynamicItems.push(new SeparatorItem())
    {
        // 隐藏 右下角-新版反馈, 默认开启
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-sidebar-feedback',
                '隐藏 右下角-新版反馈',
                true,
                undefined,
                false,
                `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(1) {visibility: hidden !important;}`,
            ),
        )
        // 隐藏 右下角-回到旧版, 默认开启
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-sidebar-old-version',
                '隐藏 右下角-回到旧版',
                true,
                undefined,
                false,
                `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(2) {visibility: hidden !important;}`,
            ),
        )
        // 隐藏 右下角-回顶部
        dynamicItems.push(
            new NormalItem(
                'hide-dynamic-page-sidebar-back-to-top',
                '隐藏 右下角-回顶部',
                false,
                undefined,
                false,
                `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(3) {visibility: hidden !important;}`,
            ),
        )
    }
}

export const dynamicGroup = new Group('dynamic', '当前是：动态页', dynamicItems)

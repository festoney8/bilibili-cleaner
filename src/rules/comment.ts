import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageBangumi, isPageDynamic, isPagePlaylist, isPageSpace, isPageVideo } from '../utils/pageType'
import { Shadow } from '../utils/shadow'

const commentGroupList: Group[] = []

if (isPageBangumi() || isPageVideo() || isPageDynamic() || isPageSpace() || isPagePlaylist()) {
    // shadow DOM 评论区
    const shadow = new Shadow([
        'bili-comments-header-renderer', // 评论区header(notice,编辑器)
        'bili-comment-textarea', // 主编辑器、底部编辑器输入框
        'bili-comment-rich-textarea', // 主编辑器、底部编辑器输入框
        'bili-comment-renderer', // 一级评论
        'bili-comment-user-info', // 一级二级评论用户信息
        'bili-rich-text', // 一级二级评论内容
        'bili-avatar', // 头像
        'bili-photoswipe', // 全屏图片查看(笔记图片)
        'bili-user-profile', // 用户卡片
        'bili-comment-user-medal', // 昵称后勋章
        'bili-comment-action-buttons-renderer', // 赞踩回复按钮区域
        'bili-comment-reply-renderer', // 单个二级评论
    ])

    const commentItems = [
        // 隐藏 活动通知, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-notice',
            description: '隐藏 活动通知',
            defaultStatus: true,
            itemCSS: `.reply-header .reply-notice {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comments-header-renderer',
                    'video-page-hide-reply-notice',
                    `#notice {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comments-header-renderer', 'video-page-hide-reply-notice')
            },
        }),
        // 隐藏 评论编辑器
        new CheckboxItem({
            itemID: 'video-page-hide-main-reply-box',
            description: '隐藏 评论编辑器',
            // 不可使用display: none, 会使底部吸附评论框宽度变化
            itemCSS: `.main-reply-box {height: 0 !important; visibility: hidden !important;}
                .comment-container .reply-list {margin-top: -20px !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comments-header-renderer',
                    'video-page-hide-main-reply-box',
                    `#commentbox bili-comment-box {display: none !important;}
                        #navbar {margin-bottom: 0 !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comments-header-renderer', 'video-page-hide-main-reply-box')
            },
        }),
        // 隐藏 评论编辑器内占位文字, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-box-textarea-placeholder',
            description: '隐藏 评论编辑器内占位文字\n同时会隐藏回复评论时文字提示',
            defaultStatus: true,
            itemCSS: `.main-reply-box .reply-box-textarea::placeholder {color: transparent !important; user-select: none;}
                .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important; user-select: none;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-textarea',
                    'video-page-hide-reply-box-textarea-placeholder',
                    `textarea:not([placeholder^="回复"])::placeholder {color: transparent !important; user-select: none;}`,
                )
                shadow.register(
                    'bili-comment-rich-textarea',
                    'video-page-hide-reply-box-textarea-placeholder',
                    `.brt-placeholder {display: none;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-textarea', 'video-page-hide-reply-box-textarea-placeholder')
                shadow.unregister('bili-comment-rich-textarea', 'video-page-hide-reply-box-textarea-placeholder')
            },
        }),
        // 隐藏 页面底部 吸附评论框, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-fixed-reply-box',
            description: '隐藏 页面底部 吸附评论框',
            defaultStatus: true,
            itemCSS: `.fixed-reply-box {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comments-header-renderer',
                    'video-page-hide-fixed-reply-box',
                    `.bili-comments-bottom-fixed-wrapper {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comments-header-renderer', 'video-page-hide-fixed-reply-box')
            },
        }),
        // 隐藏 投票栏 (红方/蓝方)
        // https://b23.tv/av1805762267
        new CheckboxItem({
            itemID: 'video-page-hide-top-vote-card',
            description: '隐藏 投票栏 (红方/蓝方)',
            itemCSS: `.top-vote-card {display: none !important;}`,
            defaultStatus: true,
            enableFunc: () => {
                shadow.register(
                    'bili-comments-header-renderer',
                    'video-page-hide-top-vote-card',
                    `#vote {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comments-header-renderer', 'video-page-hide-top-vote-card')
            },
        }),
        // 隐藏 用户卡片
        new CheckboxItem({
            itemID: 'video-page-hide-comment-user-card',
            description: '隐藏 用户卡片\n鼠标放在用户名上时不显示卡片',
            itemCSS: `.user-card {display: none!important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-user-profile',
                    'video-page-hide-comment-user-card',
                    `#wrap {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-user-profile', 'video-page-hide-comment-user-card')
            },
        }),
        // 隐藏 评论右侧装饰
        new CheckboxItem({
            itemID: 'video-page-hide-reply-decorate',
            description: '隐藏 评论右侧装饰',
            itemCSS: `.reply-decorate {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-reply-decorate',
                    `#ornament {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-reply-decorate')
            },
        }),
        // 隐藏 粉丝牌
        new CheckboxItem({
            itemID: 'video-page-hide-fan-badge',
            description: '隐藏 粉丝牌',
            itemCSS: `.fan-badge {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-medal',
                    'video-page-hide-fan-badge',
                    `#fans {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-medal', 'video-page-hide-fan-badge')
            },
        }),
        // 隐藏 老粉、原始粉丝Tag
        // https://b23.tv/av479061422
        new CheckboxItem({
            itemID: 'video-page-hide-contractor-box',
            description: '隐藏 老粉、原始粉丝Tag',
            itemCSS: `.contractor-box {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-medal',
                    'video-page-hide-contractor-box',
                    `#contractor {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-medal', 'video-page-hide-contractor-box')
            },
        }),
        // 隐藏 用户等级
        new CheckboxItem({
            itemID: 'video-page-hide-user-level',
            description: '隐藏 用户等级',
            itemCSS: `.user-level, .sub-user-level {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-info',
                    'video-page-hide-user-level',
                    `#user-level {display: none !important;}
                    #user-name {margin-right: 5px;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-info', 'video-page-hide-user-level')
            },
        }),
        // 隐藏 用户头像饰品
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-pendent-dom',
            description: '隐藏 用户头像饰品',
            itemCSS: `.root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            .comment-container .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-avatar',
                    'video-page-hide-bili-avatar-pendent-dom',
                    `picture:has(img[src*="/bfs/garb/"]) {display: none !important;}
                    .layer-res[style*="bfs/garb/"] {display: none !important;}
                    .layer.center[style^="width: 66px"] {display: none !important;}
                    /* 统一头像大小 */
                    .layer.center {width: 48px !important; height: 48px !important;}
                    `,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-avatar', 'video-page-hide-bili-avatar-pendent-dom')
            },
        }),
        // 隐藏 用户头像徽章
        new CheckboxItem({
            itemID: 'video-page-hide-bili-avatar-nft-icon',
            description: '隐藏 用户头像徽章',
            itemCSS: `.bili-avatar-nft-icon {display: none !important;}
                .comment-container .bili-avatar-icon {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-avatar',
                    'video-page-hide-bili-avatar-nft-icon',
                    `.layer:not(.center) {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-avatar', 'video-page-hide-bili-avatar-nft-icon')
            },
        }),
        // 隐藏 用户投票 (红方/蓝方)
        // https://b23.tv/av1805762267
        new CheckboxItem({
            itemID: 'video-page-hide-vote-info',
            description: '隐藏 用户投票 (红方/蓝方)',
            defaultStatus: true,
            itemCSS: `.vote-info {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-vote-info',
                    `bili-comment-vote-option {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-vote-info')
            },
        }),
        // 隐藏 评论内容下Tag (UP觉得很赞)
        new CheckboxItem({
            itemID: 'video-page-hide-reply-tag-list',
            description: '隐藏 评论内容下Tag (UP觉得很赞)',
            itemCSS: `.reply-tag-list {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-reply-tag-list',
                    `#tags {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-reply-tag-list')
            },
        }),
        // 隐藏 笔记评论前的小Logo, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-note-prefix',
            description: '隐藏 笔记评论前的小Logo',
            defaultStatus: true,
            itemCSS: `.note-prefix {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-renderer',
                    'video-page-hide-note-prefix',
                    `#note {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-note-prefix')
            },
        }),
        // 禁用 评论内容搜索关键词高亮, 默认开启
        // https://b23.tv/av1406084552
        new CheckboxItem({
            itemID: 'video-page-hide-jump-link-search-word',
            description: '禁用 评论内容搜索关键词高亮',
            defaultStatus: true,
            itemCSS: `.reply-content .jump-link.search-word {color: inherit !important;}
                .comment-container .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
                .comment-container .reply-content .icon.search-word {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-rich-text',
                    'video-page-hide-jump-link-search-word',
                    `#contents a[href*="search.bilibili.com"] {color: inherit !important;}
                    #contents a[href*="search.bilibili.com"]:hover {color: #008AC5 !important;}
                    #contents a[href*="search.bilibili.com"] img {display: none !important;}
                    `,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-rich-text', 'video-page-hide-jump-link-search-word')
            },
        }),
        // 禁用 评论中的@高亮
        new CheckboxItem({
            itemID: 'video-page-hide-reply-content-user-highlight',
            description: '禁用 评论中的@高亮',
            itemCSS: `.sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                .comment-container .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-rich-text',
                    'video-page-hide-reply-content-user-highlight',
                    `#contents a[href*="space.bilibili.com"] {color: inherit !important;}
                    #contents a[href*="space.bilibili.com"]:hover {color: #008AC5 !important;}
                    `,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-rich-text', 'video-page-hide-reply-content-user-highlight')
            },
        }),
        // 隐藏 踩/回复 只在hover时显示, 默认开启
        new CheckboxItem({
            itemID: 'video-page-hide-reply-dislike-reply-btn',
            description: '隐藏 踩/回复 只在hover时显示',
            defaultStatus: true,
            itemCSS: `
                @keyframes appear {
                    0% {opacity: 0;}
                    100% {opacity: 1;}
                }
                /* 一级评论 */
                .reply-item:not(:has(i.disliked)) :is(.reply-btn, .reply-dislike) {
                    opacity: 0;
                }
                .reply-item:hover :is(.reply-btn, .reply-dislike) {
                    animation: appear;
                    animation-duration: 0.2s;
                    animation-delay: 0.3s;
                    animation-fill-mode: forwards;
                }
                /* 二级评论 */
                .sub-reply-item:not(:has(i.disliked)) :is(.sub-reply-btn, .sub-reply-dislike) {
                    opacity: 0;
                }
                .sub-reply-item:hover :is(.sub-reply-btn, .sub-reply-dislike) {
                    animation: appear;
                    animation-duration: 0.2s;
                    animation-delay: 0.3s;
                    animation-fill-mode: forwards;
                }
            `,
            enableFunc: () => {
                /* 借用more button的display样式，改为传透明度值 */
                shadow.register(
                    'bili-comment-renderer', // 一级评论
                    'video-page-hide-root-reply-dislike-reply-btn',
                    `#body {
                        --bili-comment-hover-more-display: 0 !important;
                    }
                    #body:hover {
                        --bili-comment-hover-more-display: 1 !important;
                    }`,
                )
                shadow.register(
                    'bili-comment-reply-renderer', // 二级评论
                    'video-page-hide-sub-reply-dislike-reply-btn',
                    `
                    #body {
                        --bili-comment-hover-more-display: 0 !important;
                    }
                    #body:hover {
                        --bili-comment-hover-more-display: 1 !important;
                    }`,
                )
                shadow.register(
                    'bili-comment-action-buttons-renderer',
                    'video-page-hide-root-reply-dislike-reply-btn',
                    `#dislike button, #reply button, #more button {
                        display: block !important;
                        opacity: var(--bili-comment-action-buttons-more-display);
                        transition: opacity 0.2s 0.3s;
                    }`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-renderer', 'video-page-hide-root-reply-dislike-reply-btn')
                shadow.unregister(
                    'bili-comment-action-buttons-renderer',
                    'video-page-hide-root-reply-dislike-reply-btn',
                )
            },
        }),
        // 隐藏 大表情
        // https://b23.tv/av1406211916
        new CheckboxItem({
            itemID: 'video-page-hide-emoji-large',
            description: '隐藏 大表情',
            itemCSS: `.emoji-large {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-rich-text',
                    'video-page-hide-emoji-large',
                    `#contents img:is(.emoji-large, [style^="width:50px"]) {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-rich-text', 'video-page-hide-emoji-large')
            },
        }),
        // 大表情变成小表情
        // https://b23.tv/av1406211916
        new CheckboxItem({
            itemID: 'video-page-hide-emoji-large-zoom',
            description: '大表情变成小表情',
            itemCSS: `.emoji-large {zoom: 0.5;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-rich-text',
                    'video-page-hide-emoji-large-zoom',
                    `#contents img:is(.emoji-large, [style^="width:50px"]) {zoom: 0.5 !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-rich-text', 'video-page-hide-emoji-large-zoom')
            },
        }),
        // 用户名 全部大会员色
        new CheckboxItem({
            itemID: 'video-page-reply-user-name-color-pink',
            description: '用户名 全部大会员色',
            itemCSS: `.reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-info',
                    'video-page-reply-user-name-color-pink',
                    `#user-name {color: #FB7299 !important;}
                    #user-name a {color: #FB7299 !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-info', 'video-page-reply-user-name-color-pink')
            },
        }),
        // 用户名 全部恢复默认色
        new CheckboxItem({
            itemID: 'video-page-reply-user-name-color-default',
            description: '用户名 全部恢复默认色',
            itemCSS: `.reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-comment-user-info',
                    'video-page-reply-user-name-color-default',
                    `#user-name {color: #61666d !important;}
                    #user-name a {color: #61666d !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-comment-user-info', 'video-page-reply-user-name-color-default')
            },
        }),
        // 笔记图片 查看大图优化, 默认开启
        // https://b23.tv/av34205337
        new CheckboxItem({
            itemID: 'video-page-reply-view-image-optimize',
            description: '笔记图片 查看大图优化',
            defaultStatus: true,
            // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
            itemCSS: `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list {display: none !important;}`,
            enableFunc: () => {
                shadow.register(
                    'bili-photoswipe',
                    'video-page-reply-view-image-optimize',
                    `#wrap:has(#thumb:empty) :is(#prev, #next) {display: none !important;}
                    #prev, #next {zoom: 1.3;}
                    #thumb {display: none !important;}`,
                )
            },
            disableFunc: () => {
                shadow.unregister('bili-photoswipe', 'video-page-reply-view-image-optimize')
            },
        }),

        // 隐藏 视频评论区 (播放页/番剧页)
        new CheckboxItem({
            itemID: 'video-page-hide-comment',
            description: '隐藏 视频评论区 (播放页/番剧页)',
            itemCSS: `#commentapp bili-comments, #comment-module {display: none !important;}`,
        }),
        // 隐藏 动态评论区 (动态页/空间页)
        new CheckboxItem({
            itemID: 'dynamic-page-hide-all-comment',
            description: '隐藏 动态评论区 (动态页/空间页)',
            itemCSS: `
                .bili-comment-container {display: none !important;}
                .comment-wrap bili-comments {display: none !important;}
                .bili-opus-view {border-radius: 6px !important;}
                .opus-detail {margin-bottom: 10px !important; min-height: unset !important;}
                #app .content .dyn-tabs {display: none !important;}
                #app .content .card {padding-bottom: 30px !important;}
            `,
        }),
    ]
    commentGroupList.push(new Group('comment-items', '评论区', commentItems))
}

export { commentGroupList }

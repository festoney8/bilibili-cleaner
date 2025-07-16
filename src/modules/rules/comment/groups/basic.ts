import { Item } from '@/types/item'
import shadow from '@/utils/shadow'

export const commentBasicItems: Item[] = [
    {
        type: 'switch',
        id: 'video-page-hide-reply-notice',
        name: '隐藏 活动通知',
        defaultEnable: true,
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comments-header-renderer',
                'video-page-hide-reply-notice',
                `#notice {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comments-header-renderer', 'video-page-hide-reply-notice')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-main-reply-box',
        name: '隐藏 评论编辑器',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comments-header-renderer',
                'video-page-hide-main-reply-box',
                `#commentbox bili-comment-box {display: none !important;}
                    #navbar {margin-bottom: 0 !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comments-header-renderer', 'video-page-hide-main-reply-box')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-reply-box-textarea-placeholder',
        name: '隐藏 评论编辑器内占位文字',
        description: ['同时会隐藏回复评论时的文字提示'],
        defaultEnable: true,
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-textarea',
                'video-page-hide-reply-box-textarea-placeholder',
                `textarea:not([placeholder^="回复"])::placeholder {color: transparent !important; user-select: none;}`,
            )
            shadow.addShadowStyle(
                'bili-comment-rich-textarea',
                'video-page-hide-reply-box-textarea-placeholder',
                `.brt-placeholder {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-textarea', 'video-page-hide-reply-box-textarea-placeholder')
            shadow.removeShadowStyle('bili-comment-rich-textarea', 'video-page-hide-reply-box-textarea-placeholder')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-fixed-reply-box',
        name: '隐藏 页面底部 吸附评论框',
        defaultEnable: true,
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comments-header-renderer',
                'video-page-hide-fixed-reply-box',
                `.bili-comments-bottom-fixed-wrapper {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comments-header-renderer', 'video-page-hide-fixed-reply-box')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-top-vote-card',
        name: '隐藏 投票栏 (红方/蓝方)',
        defaultEnable: true,
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comments-header-renderer',
                'video-page-hide-top-vote-card',
                `#vote {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comments-header-renderer', 'video-page-hide-top-vote-card')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-comment-user-card',
        name: '隐藏 用户卡片',
        description: ['鼠标放在用户名上时不显示卡片'],
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-user-profile',
                'video-page-hide-comment-user-card',
                `#wrap {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-user-profile', 'video-page-hide-comment-user-card')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-reply-decorate',
        name: '隐藏 评论右侧装饰',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-renderer',
                'video-page-hide-reply-decorate',
                `#ornament {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-renderer', 'video-page-hide-reply-decorate')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-fan-badge',
        name: '隐藏 粉丝牌',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-user-medal',
                'video-page-hide-fan-badge',
                `#fans {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-user-medal', 'video-page-hide-fan-badge')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-contractor-box',
        name: '隐藏 老粉、原始粉丝Tag',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-user-medal',
                'video-page-hide-contractor-box',
                `#contractor {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-user-medal', 'video-page-hide-contractor-box')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-user-level',
        name: '隐藏 用户等级',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-user-info',
                'video-page-hide-user-level',
                `#user-level {display: none !important;}
                #user-name {margin-right: 5px;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-user-info', 'video-page-hide-user-level')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-bili-avatar-pendent-dom',
        name: '隐藏 用户头像饰品',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
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
        disableFn: () => {
            shadow.removeShadowStyle('bili-avatar', 'video-page-hide-bili-avatar-pendent-dom')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-bili-avatar-nft-icon',
        name: '隐藏 用户头像徽章',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-avatar',
                'video-page-hide-bili-avatar-nft-icon',
                `.layer:not(.center) {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-avatar', 'video-page-hide-bili-avatar-nft-icon')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-vote-info',
        name: '隐藏 用户投票 (红方/蓝方)',
        defaultEnable: true,
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-renderer',
                'video-page-hide-vote-info',
                `bili-comment-vote-option {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-renderer', 'video-page-hide-vote-info')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-reply-tag-list',
        name: '隐藏 评论内容下Tag',
        description: ['如：热评、UP主觉得很赞'],
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-renderer',
                'video-page-hide-reply-tag-list',
                `#tags {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-renderer', 'video-page-hide-reply-tag-list')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-note-prefix',
        name: '隐藏 笔记评论前的小Logo',
        defaultEnable: true,
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-renderer',
                'video-page-hide-note-prefix',
                `#note {display: none !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-renderer', 'video-page-hide-note-prefix')
        },
    },
    {
        type: 'switch',
        id: 'video-page-fix-note-thumbnail-scale',
        name: '优化 笔记评论缩略图比例',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-pictures-renderer',
                'video-page-fix-note-thumbnail-scale',
                `#content img:only-child {width: auto !important;}
                #content {zoom: 1.1;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-pictures-renderer', 'video-page-fix-note-thumbnail-scale')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-jump-link-search-word',
        name: '禁用 评论内容搜索关键词高亮',
        defaultEnable: true,
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-rich-text',
                'video-page-hide-jump-link-search-word',
                `#contents a[href*="search.bilibili.com"] {color: inherit !important;}
                #contents a[href*="search.bilibili.com"]:hover {color: #008AC5 !important;}
                #contents a[href*="search.bilibili.com"] img {display: none !important;}
                `,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-rich-text', 'video-page-hide-jump-link-search-word')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-reply-content-user-highlight',
        name: '禁用 评论中的@高亮',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-rich-text',
                'video-page-hide-reply-content-user-highlight',
                `#contents a[href*="space.bilibili.com"] {color: inherit !important;}
                #contents a[href*="space.bilibili.com"]:hover {color: #008AC5 !important;}
                `,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-rich-text', 'video-page-hide-reply-content-user-highlight')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-reply-dislike-reply-btn',
        name: '隐藏 踩/回复 只在hover时显示',
        defaultEnable: true,
        noStyle: true,
        enableFn: () => {
            /* 借用more button的display样式，改为传透明度值 */
            shadow.addShadowStyle(
                'bili-comment-renderer', // 一级评论
                'video-page-hide-root-reply-dislike-reply-btn',
                `#body {
                    --bili-comment-hover-more-display: 0 !important;
                }
                #body:hover {
                    --bili-comment-hover-more-display: 1 !important;
                }`,
            )
            shadow.addShadowStyle(
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
            shadow.addShadowStyle(
                'bili-comment-action-buttons-renderer',
                'video-page-hide-root-reply-dislike-reply-btn',
                `#dislike button:not(:has(bili-icon[icon="BDC/hand_thumbsdown_fill/2"])), #reply button, #more button {
                    display: block !important;
                    opacity: var(--bili-comment-action-buttons-more-display);
                    transition: opacity 0.2s 0.3s;
                }`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-renderer', 'video-page-hide-root-reply-dislike-reply-btn')
            shadow.removeShadowStyle('bili-comment-reply-renderer', 'video-page-hide-sub-reply-dislike-reply-btn')
            shadow.removeShadowStyle(
                'bili-comment-action-buttons-renderer',
                'video-page-hide-root-reply-dislike-reply-btn',
            )
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-emoji-small',
        name: '隐藏 小表情',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-rich-text',
                'video-page-hide-emoji-small',
                `#contents img[style^="width:1.4em"] { display: none !important; }
                #contents img[style^="width:1.4em"]:not(:first-child) + span { margin-left: 0.5em; }
                `,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-rich-text', 'video-page-hide-emoji-small')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-emoji-large',
        name: '隐藏 大表情',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-rich-text',
                'video-page-hide-emoji-large',
                `#contents img[style^="width:50px"] {display: none !important; }
                #contents img[style^="width:50px"] + span {margin-left: 0.5em; }
                `,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-rich-text', 'video-page-hide-emoji-large')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-emoji-large-zoom',
        name: '大表情变成小表情',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-rich-text',
                'video-page-hide-emoji-large-zoom',
                `#contents img[style^="width:50px"] {zoom: 0.5 !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-rich-text', 'video-page-hide-emoji-large-zoom')
        },
    },
    {
        type: 'switch',
        id: 'video-page-reply-user-name-color-pink',
        name: '用户名 全部大会员色',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-user-info',
                'video-page-reply-user-name-color-pink',
                `#user-name {color: #FB7299 !important;}
                #user-name a {color: #FB7299 !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-user-info', 'video-page-reply-user-name-color-pink')
        },
    },
    {
        type: 'switch',
        id: 'video-page-reply-user-name-color-default',
        name: '用户名 全部恢复默认色',
        noStyle: true,
        enableFn: () => {
            shadow.addShadowStyle(
                'bili-comment-user-info',
                'video-page-reply-user-name-color-default',
                `#user-name {color: #61666d !important;}
                #user-name a {color: #61666d !important;}`,
            )
        },
        disableFn: () => {
            shadow.removeShadowStyle('bili-comment-user-info', 'video-page-reply-user-name-color-default')
        },
    },
    {
        type: 'switch',
        id: 'video-page-hide-comment',
        name: '隐藏 视频评论区 (播放页/番剧页)',
    },
    {
        type: 'switch',
        id: 'dynamic-page-hide-all-comment',
        name: '隐藏 动态评论区 (动态页/空间页)',
    },
]

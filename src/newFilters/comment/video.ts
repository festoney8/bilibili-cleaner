import { unsafeWindow } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import callBotFilterInstance from '../../filters/commentFilter/filters/subfilters/callBot'
import fetchHook from '../../utils/fetch'
import { error } from '../../utils/logger'
import {
    CommentBotFilter,
    CommentCallBotFilter,
    CommentCallUserFilter,
    CommentContentFilter,
    CommentLevelFilter,
    CommentUsernameFilter,
} from './subFilters/black'
import { CommentIsLinkFilter, CommentIsNoteFilter, CommentIsPinFilter, CommentIsUpFilter } from './subFilters/white'

const GM_KEYS = {
    black: {
        username: {
            statusKey: 'video-comment-username-filter-status',
            valueKey: 'global-comment-username-filter-value',
        },
        content: {
            statusKey: 'video-comment-content-filter-status',
            valueKey: 'global-comment-content-filter-value',
        },
        level: {
            statusKey: 'video-comment-level-filter-status',
            valueKey: 'global-comment-level-filter-value',
        },
        bot: {
            statusKey: 'video-comment-bot-filter-status',
        },
        callBot: {
            statusKey: 'video-comment-call-bot-filter-status',
        },
        callUser: {
            statusKey: 'video-comment-call-user-filter-status',
        },
    },
    white: {
        root: {
            statusKey: 'video-comment-root-whitelist-status',
        },
        sub: {
            statusKey: 'video-comment-sub-whitelist-status',
        },
        isUp: {
            statusKey: 'video-comment-uploader-whitelist-status',
        },
        isPin: {
            statusKey: 'video-comment-pinned-whitelist-status',
        },
        isNote: {
            statusKey: 'video-comment-note-whitelist-status',
        },
        isTLink: {
            statusKey: 'video-comment-link-whitelist-status',
        },
    },
}

const videoPageCommentFilterGroupList: Group[] = []

// 右键菜单功能
let isContextMenuFuncRunning = false
let isContextMenuUsernameEnable = false

// 一二级评论
let isRootCommentWhitelistEnable = false
let isSubCommentWhitelistEnable = false

let isV2 = false
const isCommentV2 = () => {
    if (!isV2) {
        isV2 = unsafeWindow.__INITIAL_STATE__?.abtest?.comment_next_version === 'ELEMENTS'
    }
    return isV2
}

if (isPageVideo() || isPageBangumi() || isPagePlaylist()) {
    // 一级评论
    const rootCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const uname = (comment as any).__data?.member?.uname?.trim()
                return uname ? uname : null
            }
            const uname = comment.querySelector('.root-reply-container .user-name')?.textContent?.trim()
            return uname ? uname : null
        },
        content: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const content = (comment as any).__data?.content?.message?.replace(/@[^@ ]+?( |$)/g, '').trim()
                return content ? content : null
            }
            const content = comment
                .querySelector('.root-reply-container .reply-content')
                ?.textContent?.trim()
                .replace(/@[^@ ]+?( |$)/g, '')
                .trim()
            return content ? content : null
        },
        callUser: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const uname = (comment as any).__data?.content?.members[0]?.uname
                return uname ? uname : null
            }
            const uname = comment
                .querySelector('.root-reply-container .reply-content .jump-link.user')
                ?.textContent?.replace('@', '')
                .trim()
            return uname ? uname : null
        },
        level: (comment: HTMLElement): number | null => {
            if (isCommentV2()) {
                const lv = (comment as any).__data?.member?.level_info?.current_level
                return lv ? lv : null
            }
            const c = comment.querySelector('.root-reply-container .user-level')?.className
            const lv = c?.match(/level-([1-6])/)?.[1] // 忽略level-hardcore
            return lv ? parseInt(lv) : null
        },
    }
    // 二级评论
    const subCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const uname = (comment as any).__data?.member?.uname?.trim()
                return uname ? uname : null
            }
            const uname = comment.querySelector('.sub-user-name')?.textContent?.trim()
            return uname ? uname : null
        },
        content: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const content = (comment as any).__data?.content?.message
                    ?.trim()
                    ?.replace(/@[^@ ]+?( |$)/g, '')
                    .replace(/^回复 *:?/, '')
                    .trim()
                return content ? content : null
            }

            const content = comment
                .querySelector('.reply-content')
                ?.textContent?.trim()
                ?.replace(/@[^@ ]+?( |$)/g, '')
                .replace(/^回复 *:?/, '')
                .trim()
            return content ? content : null
        },
        callUser: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const uname = (comment as any).__data?.content?.message
                    ?.trim()
                    .replace(/^回复 ?@[^@ ]+? :/, '')
                    .trim()
                    ?.match(/@[^@ ]+( |$)/)?.[0]
                    .replace('@', '')
                    .trim()
                return uname ? uname : null
            }

            const uname = comment
                .querySelector('.reply-content')
                ?.textContent?.trim()
                .replace(/^回复 ?@[^@ ]+? :/, '')
                .trim()
                ?.match(/@[^@ ]+( |$)/)?.[0]
                .replace('@', '')
                .trim()
            return uname ? uname : null
        },
        level: (comment: HTMLElement): number | null => {
            if (isCommentV2()) {
                const lv = (comment as any).__data?.member?.level_info?.current_level
                return lv ? lv : null
            }
            const c = comment.querySelector('.sub-user-info .sub-user-level')?.className
            const lv = c?.match(/level-([1-6])/)?.[1] // 忽略level-hardcore
            return lv ? parseInt(lv) : null
        },
    }

    // 检测评论列表
    const checkCommentList = (fullSite: boolean) => {
        try {
            let rootComments: HTMLElement[] = []
            let subComments: HTMLElement[] = []
            if (isCommentV2()) {
                const shadowRoot = document.querySelector('bili-comments')?.shadowRoot
                if (!shadowRoot) {
                    return
                }
                if (fullSite) {
                    rootComments = Array.from(shadowRoot.querySelectorAll<HTMLElement>('bili-comment-thread-renderer'))
                    rootComments.forEach((c) => {
                        const replies = c.shadowRoot
                            ?.querySelector('bili-comment-replies-renderer')
                            ?.shadowRoot?.querySelectorAll<HTMLElement>('bili-comment-reply-renderer')
                        if (replies?.length) {
                            subComments = subComments.concat(Array.from(replies))
                        }
                    })
                } else {
                    rootComments = Array.from(
                        shadowRoot.querySelectorAll<HTMLElement>(
                            `bili-comment-thread-renderer:not([${settings.filterSign}])`,
                        ),
                    )
                    rootComments.forEach((c) => {
                        const replies = c.shadowRoot
                            ?.querySelector('bili-comment-replies-renderer')
                            ?.shadowRoot?.querySelectorAll<HTMLElement>(
                                `bili-comment-reply-renderer:not([${settings.filterSign}])`,
                            )
                        if (replies?.length) {
                            subComments = subComments.concat(Array.from(replies))
                        }
                    })
                }

                // 白名单过滤
                // 测试视频：https://b23.tv/av1855797296 https://b23.tv/av1706101190 https://b23.tv/av1705573085
                rootComments = rootComments.filter((e) => {
                    const root = e.shadowRoot?.querySelector('bili-comment-renderer')?.shadowRoot
                    const isWhite =
                        isRootCommentWhitelistEnable ||
                        (isNoteCommentWhitelistEnable && root?.querySelector('i#note')) ||
                        (isPinnedCommentWhitelistEnable && root?.querySelector('i#top')) ||
                        (isUploaderCommentWhitelistEnable &&
                            root?.querySelector('bili-comment-user-info')?.shadowRoot?.querySelector('#user-up')) ||
                        (isLinkCommentWhitelistEnable &&
                            root
                                ?.querySelector('bili-rich-text')
                                ?.shadowRoot?.querySelector(
                                    `a:not([href*="space.bilibili.com"], [href*="search.bilibili.com"], [data-video-time])`,
                                ))
                    if (isWhite) {
                        showEle(e)
                    }
                    return !isWhite
                })
                subComments = subComments.filter((e) => {
                    const sub = e.shadowRoot
                    const isWhite =
                        isSubCommentWhitelistEnable ||
                        (isUploaderCommentWhitelistEnable &&
                            sub?.querySelector('bili-comment-user-info')?.shadowRoot?.querySelector('#user-up')) ||
                        (isLinkCommentWhitelistEnable &&
                            sub
                                ?.querySelector('bili-rich-text')
                                ?.shadowRoot?.querySelector(`a:not([href*="space.bilibili.com"])`))
                    if (isWhite) {
                        showEle(e)
                    }
                    return !isWhite
                })

                rootComments.length && coreCommentFilterInstance.checkAll(rootComments, true, rootCommentSelectorFunc)
                subComments.length && coreCommentFilterInstance.checkAll(subComments, true, subCommentSelectorFunc)
                debug(`check ${rootComments.length} V2 root, ${subComments.length} V2 sub comments`)
            } else {
                if (fullSite) {
                    rootComments = Array.from(document.querySelectorAll<HTMLElement>(`.reply-item`))
                    subComments = Array.from(
                        document.querySelectorAll<HTMLElement>(`.sub-reply-item:not(.jump-link.user)`),
                    )
                } else {
                    rootComments = Array.from(
                        document.querySelectorAll<HTMLElement>(`.reply-item:not([${settings.filterSign}])`),
                    )
                    subComments = Array.from(
                        document.querySelectorAll<HTMLElement>(
                            `.sub-reply-item:not(.jump-link.user):not([${settings.filterSign}])`,
                        ),
                    )
                }

                // 白名单过滤
                rootComments = rootComments.filter((e) => {
                    const isWhite =
                        isRootCommentWhitelistEnable ||
                        (isUploaderCommentWhitelistEnable && e.querySelector('.root-reply-container .up-icon')) ||
                        (isNoteCommentWhitelistEnable && e.querySelector('.root-reply-container .note-prefix')) ||
                        (isPinnedCommentWhitelistEnable && e.querySelector('.root-reply-container .top-icon')) ||
                        (isLinkCommentWhitelistEnable &&
                            e.querySelector(
                                `.root-reply-container .jump-link.video-time,
                                .root-reply-container .jump-link.normal,
                                .root-reply-container .jump-link.video`,
                            ))
                    if (isWhite) {
                        showEle(e)
                    }
                    return !isWhite
                })
                subComments = subComments.filter((e) => {
                    const isWhite =
                        isSubCommentWhitelistEnable ||
                        (isUploaderCommentWhitelistEnable && e.querySelector('.sub-up-icon')) ||
                        (isLinkCommentWhitelistEnable &&
                            e.querySelector(
                                `.jump-link.video-time,
                                .jump-link.normal,
                                .jump-link.video`,
                            ))

                    if (isWhite) {
                        showEle(e)
                    }
                    return !isWhite
                })

                rootComments.length && coreCommentFilterInstance.checkAll(rootComments, true, rootCommentSelectorFunc)
                subComments.length && coreCommentFilterInstance.checkAll(subComments, true, subCommentSelectorFunc)
                debug(`check ${rootComments.length} root, ${subComments.length} sub comments`)
            }
        } catch (err) {
            error('checkCommentList error', err)
        }
    }

    /**
     * 评论区过滤，新旧通用
     * 在获取评论相关API时触发检测
     * 多层 Shadow DOM 套娃对MutationObserver不友好
     * 切换视频会导致observe对象被替换
     * 使用监听一级二级评论载入方法触发评论区检测
     */
    const startCheck = (fullSite: boolean) => {
        ;(usernameAction.status || contentAction.status) && checkCommentList(fullSite)
    }
    fetchHook.addPostFn((input: RequestInfo | URL, init: RequestInit | undefined, _resp?: Response) => {
        if (typeof input === 'string' && init?.method?.toUpperCase() === 'GET' && input.includes('api.bilibili.com')) {
            // 主评论载入
            if (input.includes('/v2/reply/wbi/main')) {
                setTimeout(() => startCheck(false), 100)
                setTimeout(() => startCheck(false), 200)
                setTimeout(() => startCheck(false), 500)
                setTimeout(() => startCheck(false), 1000)
                setTimeout(() => startCheck(false), 2000)
                setTimeout(() => startCheck(false), 3000)
            }
            // 二级评论翻页
            if (input.includes('/v2/reply/reply')) {
                if (isCommentV2()) {
                    setTimeout(() => startCheck(true), 100)
                    setTimeout(() => startCheck(true), 200)
                    setTimeout(() => startCheck(true), 500)
                    setTimeout(() => startCheck(true), 1000)
                    setTimeout(() => startCheck(true), 2000)
                } else {
                    setTimeout(() => startCheck(false), 100)
                    setTimeout(() => startCheck(false), 200)
                    setTimeout(() => startCheck(false), 500)
                    setTimeout(() => startCheck(false), 1000)
                    setTimeout(() => startCheck(false), 2000)
                }
            }
        }
    })

    //=======================================================================================

    /////////////////////////////////////////////////////////////////////////////////////////////

    const commentUsernameFilter = new CommentUsernameFilter()
    const commentContentFilter = new CommentContentFilter()
    const commentLevelFilter = new CommentLevelFilter()
    const commentBotFilter = new CommentBotFilter()
    const commentCallBotFilter = new CommentCallBotFilter()
    const commentCallUserFilter = new CommentCallUserFilter()

    const commentIsUpFilter = new CommentIsUpFilter()
    const commentIsPinFilter = new CommentIsPinFilter()
    const commentIsNoteFilter = new CommentIsNoteFilter()
    const commentIsLinkFilter = new CommentIsLinkFilter()

    // 右键监听函数, 屏蔽评论用户
    const contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        const menu = new ContextMenu()
        document.addEventListener('contextmenu', (e) => {
            menu.hide()
            try {
                if (e.target instanceof HTMLElement) {
                    const target = e.composedPath()[0] as HTMLElement
                    if (
                        target &&
                        isContextMenuUsernameEnable &&
                        (target.parentElement?.id === 'user-name' ||
                            target.classList.contains('user-name') ||
                            target.classList.contains('sub-user-name'))
                    ) {
                        // 命中用户
                        const username = target.textContent?.trim()
                        if (username) {
                            e.preventDefault()
                            menu.registerMenu(`屏蔽用户：${username}`, () => {
                                commentUsernameFilter.addParam(username)
                            })
                            menu.show(e.clientX, e.clientY)
                        }
                    } else {
                        menu.hide()
                    }
                }
            } catch (err) {
                error('contextmenu error', err)
            }
        })
    }

    //=======================================================================================
    // 构建UI菜单

    // UI组件, 用户名过滤
    const usernameItems = [
        // 启用 评论区 用户名过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.username.statusKey,
            description: '启用 评论区 用户名过滤\n(右键单击用户名)',
            enableFunc: () => {
                isContextMenuUsernameEnable = true
                contextMenuFunc()
                commentUsernameFilter.enable()
            },
            disableFunc: () => {
                isContextMenuUsernameEnable = false
                commentUsernameFilter.disable()
            },
        }),
        // 编辑 用户名黑名单
        new ButtonItem({
            itemID: 'comment-username-edit-button',
            description: '编辑 用户名黑名单',
            name: '编辑',
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.username.valueKey,
                    '用户名 黑名单',
                    '每行一个用户名，保存时自动去重',
                    (values: string[]) => {
                        commentUsernameFilter.setParam(values)
                    },
                ).show()
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-username-filter-group', '播放页 评论区 用户过滤', usernameItems),
    )

    // UI组件, 评论内容过滤
    const contentItems = [
        // 启用 播放页关键词过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.content.statusKey,
            description: '启用 评论区 关键词过滤',
            enableFunc: () => {
                commentContentFilter.enable()
            },
            disableFunc: () => {
                commentContentFilter.disable()
            },
        }),
        // 编辑 关键词黑名单
        new ButtonItem({
            itemID: 'comment-content-edit-button',
            description: '编辑 评论关键词黑名单（支持正则）',
            name: '编辑',
            itemFunc: () => {
                new WordList(
                    GM_KEYS.black.content.valueKey,
                    '评论关键词 黑名单',
                    `每行一个关键词或正则，不区分大小写\n正则默认iv模式无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        commentContentFilter.setParam(values)
                    },
                ).show()
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(new Group('comment-content-filter-group', '评论区 关键词过滤', contentItems))

    // UI组件, 按类型过滤
    const typeItems = [
        // 过滤 召唤AI的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.callBot.statusKey,
            description: '过滤 召唤AI的评论',
            enableFunc: () => {
                commentCallBotFilter.enable()
            },
            disableFunc: () => {
                commentCallBotFilter.disable()
            },
        }),
        // 过滤 AI发布的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.bot.statusKey,
            description: '过滤 AI发布的评论',
            enableFunc: () => {
                commentBotFilter.enable()
            },
            disableFunc: () => {
                commentBotFilter.disable()
            },
        }),
        // 过滤 @其他用户的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.callUser.statusKey,
            description: '过滤 @其他用户的评论',
            enableFunc: () => {
                commentCallUserFilter.enable()
            },
            disableFunc: () => {
                commentCallUserFilter.disable()
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(new Group('comment-type-filter-group', '评论区 按类型过滤', typeItems))

    // UI组件, 等级过滤
    const levelItems = [
        // 启用 播放页等级过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.level.statusKey,
            description: '启用 用户等级过滤',
            enableFunc: () => {
                commentLevelFilter.enable()
            },
            disableFunc: () => {
                commentLevelFilter.disable()
            },
        }),
        // 设定最低等级
        new NumberItem({
            itemID: GM_KEYS.black.level.valueKey,
            description: '设定最低等级 (0~6)',
            defaultValue: 3,
            minValue: 0,
            maxValue: 6,
            disableValue: 0,
            unit: '',
            callback: async (value: number) => {
                commentLevelFilter.setParam(value)
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-level-filter-whitelist-group', '评论区 等级过滤', levelItems),
    )

    // UI组件, 白名单
    const whitelistItems = [
        // 一级评论 免过滤
        new CheckboxItem({
            itemID: GM_KEYS.white.root.statusKey,
            description: '一级评论(主评论) 免过滤',
            enableFunc: () => {
                isRootCommentWhitelistEnable = true
                checkCommentList(true)
            },
            disableFunc: () => {
                isRootCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 二级评论 免过滤
        new CheckboxItem({
            itemID: GM_KEYS.white.sub.statusKey,
            description: '二级评论(回复) 免过滤',
            enableFunc: () => {
                isSubCommentWhitelistEnable = true
                checkCommentList(true)
            },
            disableFunc: () => {
                isSubCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // UP主的评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isUp.statusKey,
            description: 'UP主的评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsUpFilter.enable()
                checkCommentList(true)
            },
            disableFunc: () => {
                commentIsUpFilter.disable()
                checkCommentList(true)
            },
        }),
        // 置顶评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isPin.statusKey,
            description: '置顶评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsPinFilter.enable()
                checkCommentList(true)
            },
            disableFunc: () => {
                commentIsPinFilter.disable()
                checkCommentList(true)
            },
        }),
        // 笔记评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isNote.statusKey,
            description: '笔记/图片评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsNoteFilter.enable()
                checkCommentList(true)
            },
            disableFunc: () => {
                commentIsNoteFilter.disable()
                checkCommentList(true)
            },
        }),
        // 含超链接的评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isTLink.statusKey,
            description: '含超链接的评论 免过滤\n（站内视频/URL）',
            defaultStatus: true,
            enableFunc: () => {
                commentIsLinkFilter.enable()
                checkCommentList(true)
            },
            disableFunc: () => {
                commentIsLinkFilter.disable()
                checkCommentList(true)
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-content-filter-whitelist-group', '评论区 白名单设置 (免过滤)', whitelistItems),
    )
}

export { videoPageCommentFilterGroupList }

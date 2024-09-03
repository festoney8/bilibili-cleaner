import { GM_getValue, GM_setValue } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import settings from '../../settings'
import { debugCommentFilter as debug, error } from '../../utils/logger'
import { isPageSpace } from '../../utils/pageType'
import { showEle, waitForEle } from '../../utils/tool'
import { coreCheck, SelectorResult, SubFilterPair } from '../core/core'
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
            statusKey: 'dynamic-comment-username-filter-status',
            valueKey: 'global-comment-username-filter-value',
        },
        content: {
            statusKey: 'dynamic-comment-content-filter-status',
            valueKey: 'global-comment-content-filter-value',
        },
        level: {
            statusKey: 'dynamic-comment-level-filter-status',
            valueKey: 'global-comment-level-filter-value',
        },
        bot: {
            statusKey: 'dynamic-comment-bot-filter-status',
        },
        callBot: {
            statusKey: 'dynamic-comment-call-bot-filter-status',
        },
        callUser: {
            statusKey: 'dynamic-comment-call-user-filter-status',
        },
    },
    white: {
        root: {
            statusKey: 'dynamic-comment-root-whitelist-status',
        },
        sub: {
            statusKey: 'dynamic-comment-sub-whitelist-status',
        },
        isUp: {
            statusKey: 'dynamic-comment-uploader-whitelist-status',
        },
        isPin: {
            statusKey: 'dynamic-comment-pinned-whitelist-status',
        },
        isNote: {
            statusKey: 'dynamic-comment-note-whitelist-status',
        },
        isTLink: {
            statusKey: 'dynamic-comment-link-whitelist-status',
        },
    },
}

const spacePageCommentFilterGroupList: Group[] = []

// 右键菜单功能
let isContextMenuFuncRunning = false
let isContextMenuUsernameEnable = false

// 一二级评论是否检测
let isRootWhite = false
let isSubWhite = false

if (isPageSpace()) {
    // 初始化黑名单
    const bots = [
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
        '机器工具人',
        '有趣的程序员',
        'AI视频小助理',
        'AI视频小助理总结一下',
        'AI笔记侠',
        'AI视频助手',
        '哔哩哔理点赞姬',
        '课代表猫',
        'AI课代表呀',
        '木几萌Moe',
        '星崽丨StarZai',
        'AI沈阳美食家',
        'AI识片酱',
        'AI头脑风暴',
        'GPT_5',
        'Juice_AI',
        'AI全文总结',
        'AI视频总结',
        'AI总结视频',
    ]
    const commentUsernameFilter = new CommentUsernameFilter()
    commentUsernameFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.username.valueKey}`, []))

    const commentContentFilter = new CommentContentFilter()
    commentContentFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.content.valueKey}`, []))

    const commentLevelFilter = new CommentLevelFilter()
    commentLevelFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.level.valueKey}`, 0))

    const commentBotFilter = new CommentBotFilter()
    commentBotFilter.setParam(bots)

    const commentCallBotFilter = new CommentCallBotFilter()
    commentCallBotFilter.setParam(bots)

    const commentCallUserFilter = new CommentCallUserFilter()
    commentCallUserFilter.addParam(`/./`)

    // 初始化白名单
    const commentIsUpFilter = new CommentIsUpFilter()
    const commentIsPinFilter = new CommentIsPinFilter()
    const commentIsNoteFilter = new CommentIsNoteFilter()
    const commentIsLinkFilter = new CommentIsLinkFilter()

    // 一二级评论信息提取
    const selectorFns = {
        // 测试视频：
        // https://b23.tv/av810872
        // https://b23.tv/av1855797296
        // https://b23.tv/av1706101190
        // https://b23.tv/av1705573085
        // https://b23.tv/av1350214762
        root: {
            username: (comment: HTMLElement): SelectorResult => {
                return comment.querySelector('.root-reply-container .user-name')?.textContent?.trim()
            },
            content: (comment: HTMLElement): SelectorResult => {
                return comment
                    .querySelector('.root-reply-container .reply-content')
                    ?.textContent?.trim()
                    .replace(/@[^@ ]+?( |$)/g, '')
                    .trim()
            },
            callUser: (comment: HTMLElement): SelectorResult => {
                return comment
                    .querySelector('.root-reply-container .reply-content .jump-link.user')
                    ?.textContent?.replace('@', '')
                    .trim()
            },
            level: (comment: HTMLElement): SelectorResult => {
                const c = comment.querySelector('.root-reply-container .user-level')?.className
                const lv = c?.match(/level-([1-6])/)?.[1] // 忽略level-hardcore
                return lv ? parseInt(lv) : undefined
            },
            isUp: (comment: HTMLElement): SelectorResult => {
                return !!comment.querySelector('.root-reply-container .up-icon')
            },
            isPin: (comment: HTMLElement): SelectorResult => {
                return !!comment.querySelector('.root-reply-container .top-icon')
            },
            isNote: (comment: HTMLElement): SelectorResult => {
                return !!comment.querySelector('.root-reply-container .note-prefix')
            },
            isLink: (comment: HTMLElement): SelectorResult => {
                return !!comment.querySelector('.root-reply-container .jump-link:is(.normal, .video)')
            },
        },
        sub: {
            username: (comment: HTMLElement): SelectorResult => {
                return comment.querySelector('.sub-user-name')?.textContent?.trim()
            },
            content: (comment: HTMLElement): SelectorResult => {
                return comment
                    .querySelector('.reply-content')
                    ?.textContent?.trim()
                    ?.replace(/@[^@ ]+?( |$)/g, '')
                    .replace(/^回复 *:?/, '')
                    .trim()
            },
            callUser: (comment: HTMLElement): SelectorResult => {
                return comment
                    .querySelector('.reply-content')
                    ?.textContent?.trim()
                    .replace(/^回复 ?@[^@ ]+? ?:/, '')
                    .trim()
                    ?.match(/@[^@ ]+( |$)/)?.[0]
                    .replace('@', '')
                    .trim()
            },
            level: (comment: HTMLElement): SelectorResult => {
                const c = comment.querySelector('.sub-user-level')?.className
                const lv = c?.match(/level-([1-6])/)?.[1] // 忽略level-hardcore
                return lv ? parseInt(lv) : undefined
            },
            isUp: (comment: HTMLElement): SelectorResult => {
                return !!comment.querySelector('.sub-up-icon')
            },
            isLink: (comment: HTMLElement): SelectorResult => {
                return !!comment.querySelector('.sub-reply-content .jump-link:is(.normal, .video)')
            },
        },
    }

    // 检测评论列表
    const checkCommentList = async (fullSite: boolean) => {
        if (location.host === 'space.bilibili.com' && !location.pathname.includes('/dynamic')) {
            return
        }
        try {
            // 提取元素：一级评论、二级评论
            let rootComments: HTMLElement[]
            let subComments: HTMLElement[]
            if (fullSite) {
                rootComments = Array.from(document.querySelectorAll<HTMLElement>(`.reply-item`))
                subComments = Array.from(document.querySelectorAll<HTMLElement>(`.sub-reply-item:not(.jump-link.user)`))
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

            // rootComments.forEach((v) => {
            //     debug(
            //         [
            //             `rootComments`,
            //             `username: ${selectorFns.root.username(v)}`,
            //             `content: ${selectorFns.root.content(v)}`,
            //             `callUser: ${selectorFns.root.callUser(v)}`,
            //             `level: ${selectorFns.root.level(v)}`,
            //             `isUp: ${selectorFns.root.isUp(v)}`,
            //             `isPin: ${selectorFns.root.isPin(v)}`,
            //             `isNote: ${selectorFns.root.isNote(v)}`,
            //             `isLink: ${selectorFns.root.isLink(v)}`,
            //         ].join('\n'),
            //     )
            // })
            // subComments.forEach((v) => {
            //     debug(
            //         [
            //             `subComments`,
            //             `username: ${selectorFns.sub.username(v)}`,
            //             `content: ${selectorFns.sub.content(v)}`,
            //             `callUser: ${selectorFns.sub.callUser(v)}`,
            //             `level: ${selectorFns.sub.level(v)}`,
            //             `isUp: ${selectorFns.sub.isUp(v)}`,
            //             `isLink: ${selectorFns.sub.isLink(v)}`,
            //         ].join('\n'),
            //     )
            // })

            // 构建黑白检测任务
            if (!isRootWhite && rootComments.length) {
                const blackPairs: SubFilterPair[] = []
                commentUsernameFilter.isEnable && blackPairs.push([commentUsernameFilter, selectorFns.root.username])
                commentContentFilter.isEnable && blackPairs.push([commentContentFilter, selectorFns.root.content])
                commentLevelFilter.isEnable && blackPairs.push([commentLevelFilter, selectorFns.root.level])
                commentBotFilter.isEnable && blackPairs.push([commentBotFilter, selectorFns.root.username])
                commentCallBotFilter.isEnable && blackPairs.push([commentCallBotFilter, selectorFns.root.callUser])
                commentCallUserFilter.isEnable && blackPairs.push([commentCallUserFilter, selectorFns.root.callUser])

                const whitePairs: SubFilterPair[] = []
                commentIsUpFilter.isEnable && whitePairs.push([commentIsUpFilter, selectorFns.root.isUp])
                commentIsPinFilter.isEnable && whitePairs.push([commentIsPinFilter, selectorFns.root.isPin])
                commentIsNoteFilter.isEnable && whitePairs.push([commentIsNoteFilter, selectorFns.root.isNote])
                commentIsLinkFilter.isEnable && whitePairs.push([commentIsLinkFilter, selectorFns.root.isLink])

                await coreCheck(rootComments, true, blackPairs, whitePairs)
            } else {
                rootComments.forEach((el) => showEle(el))
            }
            if (!isSubWhite && subComments.length) {
                const blackPairs: SubFilterPair[] = []
                commentUsernameFilter.isEnable && blackPairs.push([commentUsernameFilter, selectorFns.sub.username])
                commentContentFilter.isEnable && blackPairs.push([commentContentFilter, selectorFns.sub.content])
                commentLevelFilter.isEnable && blackPairs.push([commentLevelFilter, selectorFns.sub.level])
                commentBotFilter.isEnable && blackPairs.push([commentBotFilter, selectorFns.sub.username])
                commentCallBotFilter.isEnable && blackPairs.push([commentCallBotFilter, selectorFns.sub.callUser])
                commentCallUserFilter.isEnable && blackPairs.push([commentCallUserFilter, selectorFns.sub.callUser])

                const whitePairs: SubFilterPair[] = []
                commentIsUpFilter.isEnable && whitePairs.push([commentIsUpFilter, selectorFns.sub.isUp])
                commentIsLinkFilter.isEnable && whitePairs.push([commentIsLinkFilter, selectorFns.sub.isLink])

                await coreCheck(subComments, true, blackPairs, whitePairs)
            } else {
                subComments.forEach((el) => showEle(el))
            }
            debug(`check ${rootComments.length} root, ${subComments.length} sub comments`)
        } catch (err) {
            error('checkCommentList error', err)
        }
    }

    const check = (fullSite: boolean) => {
        if (
            commentUsernameFilter.isEnable ||
            commentContentFilter.isEnable ||
            commentLevelFilter.isEnable ||
            commentBotFilter.isEnable ||
            commentCallBotFilter.isEnable ||
            commentCallUserFilter.isEnable
        ) {
            checkCommentList(fullSite).then().catch()
        }
    }

    // // 评论区过滤，新旧通用，在获取评论相关API后触发检测
    // fetchHook.addPostFn((input: RequestInfo | URL, init: RequestInit | undefined, _resp?: Response) => {
    //     if (typeof input === 'string' && init?.method?.toUpperCase() === 'GET' && input.includes('api.bilibili.com')) {
    //         // 主评论载入
    //         if (input.includes('/v2/reply/wbi/main')) {
    //             let cnt = 0
    //             const id = setInterval(() => {
    //                 check(false)
    //                 ++cnt > 30 && clearInterval(id)
    //             }, 100)
    //         }
    //         // 二级评论翻页
    //         if (input.includes('/v2/reply/reply')) {
    //             let cnt = 0
    //             const id = setInterval(() => {
    //                 check(false)
    //                 ++cnt > 15 && clearInterval(id)
    //             }, 200)
    //         }
    //     }
    // })

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
                                check(true)
                                try {
                                    const arr: string[] = GM_getValue(
                                        `BILICLEANER_${GM_KEYS.black.username.valueKey}`,
                                        [],
                                    )
                                    if (!arr.includes(username)) {
                                        arr.unshift(username)
                                        GM_setValue(`BILICLEANER_${GM_KEYS.black.username.valueKey}`, arr)
                                    }
                                } catch (err) {
                                    error('contextMenuFunc addParam error', err)
                                }
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

    // 监听评论列表内部变化, 有变化时检测评论列表
    let commentListContainer: HTMLElement
    const watchCommentListContainer = () => {
        if (commentListContainer) {
            // 初次全站检测
            check(true)
            const commentObserver = new MutationObserver(() => {
                // 增量检测
                check(false)
            })
            commentObserver.observe(commentListContainer, { childList: true, subtree: true })
        }
    }

    try {
        waitForEle(
            document,
            '.bili-dyn-home--member, .bili-comment-container, .bili-comment, #app',
            (node: HTMLElement): boolean => {
                return (
                    node.className === 'bili-dyn-home--member' ||
                    node.className.includes('bili-comment-container') ||
                    node.className.includes('bili-comment') ||
                    node.id === 'app'
                )
            },
        ).then((ele) => {
            if (ele) {
                commentListContainer = ele
                watchCommentListContainer()
            }
        })
    } catch (err) {
        error(`watch comment list ERROR`, err)
    }

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
                check(true)
            },
            disableFunc: () => {
                isContextMenuUsernameEnable = false
                commentUsernameFilter.disable()
                check(true)
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
                        check(true)
                    },
                ).show()
            },
        }),
    ]
    spacePageCommentFilterGroupList.push(
        new Group('comment-username-filter-group', '动态页 评论区 用户过滤', usernameItems),
    )

    // UI组件, 评论内容过滤
    const contentItems = [
        // 启用 动态页关键词过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.content.statusKey,
            description: '启用 评论区 关键词过滤',
            enableFunc: () => {
                commentContentFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentContentFilter.disable()
                check(true)
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
                    `每行一个关键词或正则，不区分大小写\n正则默认iu模式，无需flag，语法：/abc|\\d+/`,
                    (values: string[]) => {
                        commentContentFilter.setParam(values)
                        check(true)
                    },
                ).show()
            },
        }),
    ]
    spacePageCommentFilterGroupList.push(new Group('comment-content-filter-group', '评论区 关键词过滤', contentItems))

    // UI组件, 按类型过滤
    const typeItems = [
        // 过滤 召唤AI的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.callBot.statusKey,
            description: '过滤 召唤AI的评论',
            defaultStatus: true,
            enableFunc: () => {
                commentCallBotFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentCallBotFilter.disable()
                check(true)
            },
        }),
        // 过滤 AI发布的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.bot.statusKey,
            description: '过滤 AI发布的评论',
            enableFunc: () => {
                commentBotFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentBotFilter.disable()
                check(true)
            },
        }),
        // 过滤 @其他用户的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.callUser.statusKey,
            description: '过滤 @其他用户的评论',
            enableFunc: () => {
                commentCallUserFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentCallUserFilter.disable()
                check(true)
            },
        }),
    ]
    spacePageCommentFilterGroupList.push(new Group('comment-type-filter-group', '评论区 按类型过滤', typeItems))

    // UI组件, 等级过滤
    const levelItems = [
        // 启用 动态页等级过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.level.statusKey,
            description: '启用 用户等级过滤',
            enableFunc: () => {
                commentLevelFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentLevelFilter.disable()
                check(true)
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
                check(true)
            },
        }),
    ]
    spacePageCommentFilterGroupList.push(
        new Group('comment-level-filter-whitelist-group', '评论区 等级过滤', levelItems),
    )

    // UI组件, 白名单
    const whitelistItems = [
        // 一级评论 免过滤
        new CheckboxItem({
            itemID: GM_KEYS.white.root.statusKey,
            description: '一级评论(主评论) 免过滤',
            enableFunc: () => {
                isRootWhite = true
                check(true)
            },
            disableFunc: () => {
                isRootWhite = false
                check(true)
            },
        }),
        // 二级评论 免过滤
        new CheckboxItem({
            itemID: GM_KEYS.white.sub.statusKey,
            description: '二级评论(回复) 免过滤',
            enableFunc: () => {
                isSubWhite = true
                check(true)
            },
            disableFunc: () => {
                isSubWhite = false
                check(true)
            },
        }),
        // UP主的评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isUp.statusKey,
            description: 'UP主的评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsUpFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentIsUpFilter.disable()
                check(true)
            },
        }),
        // 置顶评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isPin.statusKey,
            description: '置顶评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsPinFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentIsPinFilter.disable()
                check(true)
            },
        }),
        // 笔记评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isNote.statusKey,
            description: '笔记/图片评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsNoteFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentIsNoteFilter.disable()
                check(true)
            },
        }),
        // 含超链接的评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isTLink.statusKey,
            description: '含超链接的评论 免过滤\n（站内视频/URL）',
            defaultStatus: true,
            enableFunc: () => {
                commentIsLinkFilter.enable()
                check(true)
            },
            disableFunc: () => {
                commentIsLinkFilter.disable()
                check(true)
            },
        }),
    ]
    spacePageCommentFilterGroupList.push(
        new Group('comment-content-filter-whitelist-group', '评论区 白名单设置 (免过滤)', whitelistItems),
    )
}

export { spacePageCommentFilterGroupList }

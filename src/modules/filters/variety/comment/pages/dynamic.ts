import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import fetchHook from '../../../../../utils/fetch'
import { error, log } from '../../../../../utils/logger'
import { isPageDynamic } from '../../../../../utils/pageType'
import { showEle } from '../../../../../utils/tool'
import { coreCheck } from '../../../core/core'
import {
    CommentBotFilter,
    CommentCallBotFilter,
    CommentCallUserFilter,
    CommentContentFilter,
    CommentLevelFilter,
    CommentUsernameFilter,
} from '../subFilters/black'
import { CommentIsLinkFilter, CommentIsNoteFilter, CommentIsPinFilter, CommentIsUpFilter } from '../subFilters/white'

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
        isLink: {
            statusKey: 'dynamic-comment-link-whitelist-status',
        },
    },
}

// 右键菜单功能
const isContextMenuFuncRunning = false
const isContextMenuUsernameEnable = false

// 一二级评论是否检测
const isRootWhite = false
const isSubWhite = false

if (isPageDynamic()) {
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
        // 605801219 @AI工具集
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
        'AI工具集',
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
        root: {
            username: (comment: HTMLElement): SelectorResult => {
                return (comment as any).__data?.member?.uname?.trim()
            },
            content: (comment: HTMLElement): SelectorResult => {
                return (comment as any).__data?.content?.message?.replace(/@[^@ ]+?( |$)/g, '').trim()
            },
            callUser: (comment: HTMLElement): SelectorResult => {
                return (comment as any).__data?.content?.members[0]?.uname
            },
            level: (comment: HTMLElement): SelectorResult => {
                return (comment as any).__data?.member?.level_info?.current_level
            },
            isUp: (comment: HTMLElement): SelectorResult => {
                const mid = (comment as any).__data?.mid
                const upMid = (comment as any).__upMid
                return typeof mid === 'number' && mid === upMid
            },
            isPin: (comment: HTMLElement): SelectorResult => {
                return !!(comment as any).__data?.reply_control?.is_up_top
            },
            isNote: (comment: HTMLElement): SelectorResult => {
                return !!(comment as any).__data?.reply_control?.is_note_v2
            },
            isLink: (comment: HTMLElement): SelectorResult => {
                const jump_url = (comment as any).__data?.content?.jump_url
                if (jump_url) {
                    for (const k of Object.keys(jump_url)) {
                        if (!jump_url[k]?.pc_url?.includes('search.bilibili.com')) {
                            return true
                        }
                    }
                }
                return false
            },
        },
        sub: {
            username: (comment: HTMLElement): SelectorResult => {
                return (comment as any).__data?.member?.uname?.trim()
            },
            content: (comment: HTMLElement): SelectorResult => {
                return (comment as any).__data?.content?.message
                    ?.trim()
                    ?.replace(/@[^@ ]+?( |$)/g, '')
                    .replace(/^回复 *:?/, '')
                    .trim()
            },
            callUser: (comment: HTMLElement): SelectorResult => {
                return (comment as any).__data?.content?.message
                    ?.trim()
                    .replace(/^回复 ?@[^@ ]+? ?:/, '')
                    .trim()
                    ?.match(/@[^@ ]+( |$)/)?.[0]
                    .replace('@', '')
                    .trim()
            },
            level: (comment: HTMLElement): SelectorResult => {
                return (comment as any).__data?.member?.level_info?.current_level
            },
            isUp: (comment: HTMLElement): SelectorResult => {
                const mid = (comment as any).__data?.mid
                const upMid = (comment as any).__upMid
                return typeof mid === 'number' && mid === upMid
            },
            isLink: (comment: HTMLElement): SelectorResult => {
                const urls = (comment as any).__data?.content?.jump_url
                return urls ? Object.keys(urls).length > 0 : undefined
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
            let rootComments: HTMLElement[] = []
            let subComments: HTMLElement[] = []
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

            // rootComments.forEach((v) => {
            //     log(
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
            //     log(
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
            log(`check ${rootComments.length} root, ${subComments.length} sub comments`)
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

    // 评论区过滤，新旧通用，在获取评论相关API后触发检测
    fetchHook.addPostFn((input: RequestInfo | URL, init: RequestInit | undefined, _resp?: Response) => {
        if (typeof input === 'string' && init?.method?.toUpperCase() === 'GET' && input.includes('api.bilibili.com')) {
            // 主评论载入
            if (input.includes('/v2/reply/wbi/main')) {
                let cnt = 0
                const id = setInterval(() => {
                    check(false)
                    ++cnt > 30 && clearInterval(id)
                }, 100)
            }
            // 二级评论翻页
            if (input.includes('/v2/reply/reply')) {
                let cnt = 0
                const id = setInterval(() => {
                    check(true)
                    ++cnt > 10 && clearInterval(id)
                }, 500)
            }
        }
    })

    // // 右键监听函数, 屏蔽评论用户
    // const contextMenuFunc = () => {
    //     if (isContextMenuFuncRunning) {
    //         return
    //     }
    //     isContextMenuFuncRunning = true
    //     const menu = new ContextMenu()
    //     document.addEventListener('contextmenu', (e) => {
    //         menu.hide()
    //         try {
    //             if (e.target instanceof HTMLElement) {
    //                 const target = e.composedPath()[0] as HTMLElement
    //                 if (
    //                     target &&
    //                     isContextMenuUsernameEnable &&
    //                     (target.parentElement?.id === 'user-name' ||
    //                         target.classList.contains('user-name') ||
    //                         target.classList.contains('sub-user-name'))
    //                 ) {
    //                     // 命中用户
    //                     const username = target.textContent?.trim()
    //                     if (username) {
    //                         e.preventDefault()
    //                         menu.registerMenu(`屏蔽用户：${username}`, () => {
    //                             commentUsernameFilter.addParam(username)
    //                             check(true)
    //                             try {
    //                                 const arr: string[] = GM_getValue(
    //                                     `BILICLEANER_${GM_KEYS.black.username.valueKey}`,
    //                                     [],
    //                                 )
    //                                 if (!arr.includes(username)) {
    //                                     arr.unshift(username)
    //                                     GM_setValue(`BILICLEANER_${GM_KEYS.black.username.valueKey}`, arr)
    //                                 }
    //                             } catch (err) {
    //                                 error('contextMenuFunc addParam error', err)
    //                             }
    //                         })
    //                         menu.show(e.clientX, e.clientY)
    //                     }
    //                 } else {
    //                     menu.hide()
    //                 }
    //             }
    //         } catch (err) {
    //             error('contextmenu error', err)
    //         }
    //     })
    // }
}

export const commentFilterDynamicGroups: Group[] = [
    {
        name: '用户名过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.username.statusKey,
                name: '启用 用户名过滤 (右键单击用户名)',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 用户名黑名单',
                buttonText: '编辑',
                fn: () => {},
            },
        ],
    },
    {
        name: '评论内容过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.content.statusKey,
                name: '启用 关键词过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 评论关键词黑名单',
                buttonText: '编辑',
                fn: () => {},
            },
        ],
    },
    {
        name: '按类型过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.callBot.statusKey,
                name: '过滤 召唤AI的评论',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'switch',
                id: GM_KEYS.black.bot.statusKey,
                name: '过滤 AI发布的评论',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUser.statusKey,
                name: '过滤 @其他用户的评论',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
        ],
    },
    {
        name: '等级过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.level.statusKey,
                name: '启用 用户等级过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'number',
                id: GM_KEYS.black.level.valueKey,
                name: '设定最低等级 (0~6)',
                minValue: 0,
                maxValue: 6,
                defaultValue: 0,
                disableValue: 0,
                fn: (value: number) => {},
            },
        ],
    },
    {
        name: '白名单 免过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.white.root.statusKey,
                name: '一级评论(主评论) 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'switch',
                id: GM_KEYS.white.sub.statusKey,
                name: '二级评论(回复) 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isUp.statusKey,
                name: 'UP主的评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isPin.statusKey,
                name: '置顶评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isNote.statusKey,
                name: '笔记/图片评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isLink.statusKey,
                name: '含超链接的评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {},
                disableFn() {},
            },
        ],
    },
]

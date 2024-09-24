import { GM_getValue, GM_setValue } from '$'
import { ContextMenu } from '../../components/contextmenu'
import { Group } from '../../components/group'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { WordList } from '../../components/wordlist'
import settings from '../../settings'
import fetchHook from '../../utils/fetch'
import { debugCommentFilter as debug, error } from '../../utils/logger'
import { isPageDynamic } from '../../utils/pageType'
import ShadowInstance from '../../utils/shadow'
import { showEle } from '../../utils/tool'
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
        isAD: {
            statusKey: 'dynamic-comment-ad-filter-status',
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
            if (urls) {
                for (const k of Object.keys(urls)) {
                    if (!urls[k]?.pc_url?.includes('search.bilibili.com')) {
                        return true
                    }
                }
            }
            return false
        },
    },
}

const dynamicPageCommentFilterGroupList: Group[] = []

// 右键菜单功能
let isContextMenuFuncRunning = false
let isContextMenuUsernameEnable = false

// 一二级评论是否检测
let isRootWhite = false
let isSubWhite = false

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
        // 'AI识片酱', // 听歌识曲，免除过滤
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

    // 检测一级评论
    const checkRoot = async (fullSite: boolean) => {
        if (
            !(
                commentUsernameFilter.isEnable ||
                commentContentFilter.isEnable ||
                commentLevelFilter.isEnable ||
                commentBotFilter.isEnable ||
                commentCallBotFilter.isEnable ||
                commentCallUserFilter.isEnable
            )
        ) {
            return
        }

        let rootComments: HTMLElement[] = []
        if (ShadowInstance.shadowStore.has('BILI-COMMENT-THREAD-RENDERER')) {
            rootComments = Array.from(ShadowInstance.shadowStore.get('BILI-COMMENT-THREAD-RENDERER')!).map(
                (v) => v.host as HTMLElement,
            )
            if (!fullSite) {
                rootComments = rootComments.filter((v) => !v.hasAttribute(settings.filterSign))
            }
        }
        if (!rootComments.length) {
            return
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

        if (isRootWhite) {
            rootComments.forEach((el) => showEle(el))
            return
        }

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
        debug(`check ${rootComments.length} root comments`)
    }

    // 检测二级评论
    const checkSub = async (fullSite: boolean) => {
        if (
            !(
                commentUsernameFilter.isEnable ||
                commentContentFilter.isEnable ||
                commentLevelFilter.isEnable ||
                commentBotFilter.isEnable ||
                commentCallBotFilter.isEnable ||
                commentCallUserFilter.isEnable
            )
        ) {
            return
        }

        let subComments: HTMLElement[] = []
        if (ShadowInstance.shadowStore.has('BILI-COMMENT-REPLY-RENDERER')) {
            subComments = Array.from(ShadowInstance.shadowStore.get('BILI-COMMENT-REPLY-RENDERER')!).map(
                (v) => v.host as HTMLElement,
            )
            if (!fullSite) {
                subComments = subComments.filter((v) => !v.hasAttribute(settings.filterSign))
            }
        }
        if (!subComments.length) {
            return
        }

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

        if (isSubWhite) {
            subComments.forEach((el) => showEle(el))
            return
        }

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
        debug(`check ${subComments.length} sub comments`)
    }

    // 检测全部
    const checkAll = (fullSite: boolean) => {
        if (
            commentUsernameFilter.isEnable ||
            commentContentFilter.isEnable ||
            commentLevelFilter.isEnable ||
            commentBotFilter.isEnable ||
            commentCallBotFilter.isEnable ||
            commentCallUserFilter.isEnable
        ) {
            checkRoot(fullSite).then().catch()
            checkSub(fullSite).then().catch()
        }
    }

    /**
     * 监听一级评论container
     */
    const observeRoot = () => {
        ShadowInstance.addShadowObserver(
            'BILI-COMMENTS',
            new MutationObserver(() => {
                checkRoot(true)
            }),
            {
                subtree: true,
                childList: true,
            },
        )
    }

    /**
     * 监听二级评论container
     * 使用同一Observer监视所有二级评论上级节点，所有变化只触发一次回调
     */
    const observeSub = () => {
        ShadowInstance.addShadowObserver(
            'BILI-COMMENT-REPLIES-RENDERER',
            new MutationObserver(() => {
                checkSub(true)
            }),
            {
                subtree: true,
                childList: true,
            },
        )
    }

    try {
        observeRoot()
        observeSub()
    } catch {}

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
                                checkAll(true)
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
                checkAll(true)
            },
            disableFunc: () => {
                isContextMenuUsernameEnable = false
                commentUsernameFilter.disable()
                checkAll(true)
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
                        checkAll(true)
                    },
                ).show()
            },
        }),
    ]
    dynamicPageCommentFilterGroupList.push(
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
                checkAll(true)
            },
            disableFunc: () => {
                commentContentFilter.disable()
                checkAll(true)
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
                        checkAll(true)
                    },
                ).show()
            },
        }),
    ]
    dynamicPageCommentFilterGroupList.push(new Group('comment-content-filter-group', '评论区 关键词过滤', contentItems))

    // UI组件, 按类型过滤
    const typeItems = [
        // 过滤 召唤AI的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.callBot.statusKey,
            description: '过滤 召唤AI的评论',
            defaultStatus: true,
            enableFunc: () => {
                commentCallBotFilter.enable()
                checkAll(true)
            },
            disableFunc: () => {
                commentCallBotFilter.disable()
                checkAll(true)
            },
        }),
        // 过滤 AI发布的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.bot.statusKey,
            description: '过滤 AI发布的评论',
            enableFunc: () => {
                commentBotFilter.enable()
                checkAll(true)
            },
            disableFunc: () => {
                commentBotFilter.disable()
                checkAll(true)
            },
        }),
        // 过滤 @其他用户的评论
        new CheckboxItem({
            itemID: GM_KEYS.black.callUser.statusKey,
            description: '过滤 @其他用户的评论',
            enableFunc: () => {
                commentCallUserFilter.enable()
                checkAll(true)
            },
            disableFunc: () => {
                commentCallUserFilter.disable()
                checkAll(true)
            },
        }),
        // 过滤 带货评论
        new CheckboxItem({
            itemID: GM_KEYS.black.isAD.statusKey,
            description: '过滤 带货评论 (实验功能 需刷新)',
            enableFunc: () => {
                fetchHook.addPostFn(
                    async (
                        input: RequestInfo | URL,
                        init: RequestInit | undefined,
                        resp?: Response,
                    ): Promise<Response | void> => {
                        if (!resp) {
                            return
                        }
                        if (
                            typeof input === 'string' &&
                            init?.method?.toUpperCase() === 'GET' &&
                            input.includes('api.bilibili.com/x/v2/reply/wbi/main')
                        ) {
                            try {
                                const respData = await resp.clone().json()
                                const msg = respData?.data?.top?.upper?.content?.message
                                if (msg && /b23\.tv\/mall-|领券|gaoneng\.bilibili\.com/.test(msg)) {
                                    respData.data.top = null
                                    respData.data.top_replies = null
                                    const newResp = new Response(JSON.stringify(respData), {
                                        status: resp.status,
                                        statusText: resp.statusText,
                                        headers: resp.headers,
                                    })
                                    return newResp
                                }
                            } catch {
                                return resp
                            }
                            return resp
                        }
                    },
                )
            },
        }),
    ]
    dynamicPageCommentFilterGroupList.push(new Group('comment-type-filter-group', '评论区 按类型过滤', typeItems))

    // UI组件, 等级过滤
    const levelItems = [
        // 启用 动态页等级过滤
        new CheckboxItem({
            itemID: GM_KEYS.black.level.statusKey,
            description: '启用 用户等级过滤',
            enableFunc: () => {
                commentLevelFilter.enable()
                checkAll(true)
            },
            disableFunc: () => {
                commentLevelFilter.disable()
                checkAll(true)
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
                checkAll(true)
            },
        }),
    ]
    dynamicPageCommentFilterGroupList.push(
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
                checkAll(true)
            },
            disableFunc: () => {
                isRootWhite = false
                checkAll(true)
            },
        }),
        // 二级评论 免过滤
        new CheckboxItem({
            itemID: GM_KEYS.white.sub.statusKey,
            description: '二级评论(回复) 免过滤',
            enableFunc: () => {
                isSubWhite = true
                checkAll(true)
            },
            disableFunc: () => {
                isSubWhite = false
                checkAll(true)
            },
        }),
        // UP主的评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isUp.statusKey,
            description: 'UP主的评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsUpFilter.enable()
                checkAll(true)
            },
            disableFunc: () => {
                commentIsUpFilter.disable()
                checkAll(true)
            },
        }),
        // 置顶评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isPin.statusKey,
            description: '置顶评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsPinFilter.enable()
                checkAll(true)
            },
            disableFunc: () => {
                commentIsPinFilter.disable()
                checkAll(true)
            },
        }),
        // 笔记评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isNote.statusKey,
            description: '笔记/图片评论 免过滤',
            defaultStatus: true,
            enableFunc: () => {
                commentIsNoteFilter.enable()
                checkAll(true)
            },
            disableFunc: () => {
                commentIsNoteFilter.disable()
                checkAll(true)
            },
        }),
        // 含超链接的评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: GM_KEYS.white.isLink.statusKey,
            description: '含超链接的评论 免过滤\n（站内视频/URL）',
            defaultStatus: true,
            enableFunc: () => {
                commentIsLinkFilter.enable()
                checkAll(true)
            },
            disableFunc: () => {
                commentIsLinkFilter.disable()
                checkAll(true)
            },
        }),
    ]
    dynamicPageCommentFilterGroupList.push(
        new Group('comment-content-filter-whitelist-group', '评论区 白名单设置 (免过滤)', whitelistItems),
    )
}

export { dynamicPageCommentFilterGroupList }

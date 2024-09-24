import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { error, log } from '../../../../../utils/logger'
import ShadowInstance from '../../../../../utils/shadow'
import { showEle } from '../../../../../utils/tool'
import { MainFilter, coreCheck } from '../../../core/core'
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
        isLink: {
            statusKey: 'video-comment-link-whitelist-status',
        },
    },
}

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

// 一二级评论是否检测
let isRootWhite = false
let isSubWhite = false

// CFV is CommentFilterVideo
class CFV extends MainFilter {
    // 黑名单
    static commentUsernameFilter = new CommentUsernameFilter()
    static commentContentFilter = new CommentContentFilter()
    static commentLevelFilter = new CommentLevelFilter()
    static commentBotFilter = new CommentBotFilter()
    static commentCallBotFilter = new CommentCallBotFilter()
    static commentCallUserFilter = new CommentCallUserFilter()
    // 白名单
    static commentIsUpFilter = new CommentIsUpFilter()
    static commentIsPinFilter = new CommentIsPinFilter()
    static commentIsNoteFilter = new CommentIsNoteFilter()
    static commentIsLinkFilter = new CommentIsLinkFilter()

    constructor() {
        super()
        // 黑名单
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
            // 1835753760 @AI识片酱 // 听歌识曲，免除过滤
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
            'AI头脑风暴',
            'GPT_5',
            'Juice_AI',
            'AI全文总结',
            'AI视频总结',
            'AI总结视频',
            'AI工具集',
        ]
        CFV.commentUsernameFilter.setParam(GM_getValue(GM_KEYS.black.username.valueKey, []))
        CFV.commentContentFilter.setParam(GM_getValue(GM_KEYS.black.content.valueKey, []))
        CFV.commentLevelFilter.setParam(GM_getValue(GM_KEYS.black.level.valueKey, 0))
        CFV.commentBotFilter.setParam(bots)
        CFV.commentCallBotFilter.setParam(bots)
        CFV.commentCallUserFilter.setParam([`/./`])
    }

    /**
     * 检测一级评论
     * @param mode full全量，incr增量
     * @returns
     */
    static async checkRoot(mode?: 'full' | 'incr') {
        const timer = performance.now()
        let revertAll = false
        if (
            !(
                CFV.commentUsernameFilter.isEnable ||
                CFV.commentContentFilter.isEnable ||
                CFV.commentLevelFilter.isEnable ||
                CFV.commentBotFilter.isEnable ||
                CFV.commentCallBotFilter.isEnable ||
                CFV.commentCallUserFilter.isEnable
            )
        ) {
            revertAll = true
        }

        let rootComments: HTMLElement[] = []
        if (ShadowInstance.shadowStore.has('BILI-COMMENT-THREAD-RENDERER')) {
            rootComments = Array.from(ShadowInstance.shadowStore.get('BILI-COMMENT-THREAD-RENDERER')!).map(
                (v) => v.host as HTMLElement,
            )
            if (mode === 'incr') {
                rootComments = rootComments.filter((v) => !v.hasAttribute(settings.filterSign))
            }
        }
        if (!rootComments.length) {
            return
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

        if (isRootWhite || revertAll) {
            rootComments.forEach((el) => showEle(el))
            return
        }

        const blackPairs: SubFilterPair[] = []
        CFV.commentUsernameFilter.isEnable && blackPairs.push([CFV.commentUsernameFilter, selectorFns.root.username])
        CFV.commentContentFilter.isEnable && blackPairs.push([CFV.commentContentFilter, selectorFns.root.content])
        CFV.commentLevelFilter.isEnable && blackPairs.push([CFV.commentLevelFilter, selectorFns.root.level])
        CFV.commentBotFilter.isEnable && blackPairs.push([CFV.commentBotFilter, selectorFns.root.username])
        CFV.commentCallBotFilter.isEnable && blackPairs.push([CFV.commentCallBotFilter, selectorFns.root.callUser])
        CFV.commentCallUserFilter.isEnable && blackPairs.push([CFV.commentCallUserFilter, selectorFns.root.callUser])

        const whitePairs: SubFilterPair[] = []
        CFV.commentIsUpFilter.isEnable && whitePairs.push([CFV.commentIsUpFilter, selectorFns.root.isUp])
        CFV.commentIsPinFilter.isEnable && whitePairs.push([CFV.commentIsPinFilter, selectorFns.root.isPin])
        CFV.commentIsNoteFilter.isEnable && whitePairs.push([CFV.commentIsNoteFilter, selectorFns.root.isNote])
        CFV.commentIsLinkFilter.isEnable && whitePairs.push([CFV.commentIsLinkFilter, selectorFns.root.isLink])

        const rootBlackCnt = await coreCheck(rootComments, true, blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        log(`CFV hide ${rootBlackCnt} in ${rootComments.length} root comments, mode=${mode}, time=${time}`)
    }

    /**
     * 检测二级评论
     * @param mode full全量，incr增量
     * @returns
     */
    static async checkSub(mode?: 'full' | 'incr') {
        const timer = performance.now()
        let revertAll = false
        if (
            !(
                CFV.commentUsernameFilter.isEnable ||
                CFV.commentContentFilter.isEnable ||
                CFV.commentLevelFilter.isEnable ||
                CFV.commentBotFilter.isEnable ||
                CFV.commentCallBotFilter.isEnable ||
                CFV.commentCallUserFilter.isEnable
            )
        ) {
            revertAll = true
        }

        let subComments: HTMLElement[] = []
        if (ShadowInstance.shadowStore.has('BILI-COMMENT-REPLY-RENDERER')) {
            subComments = Array.from(ShadowInstance.shadowStore.get('BILI-COMMENT-REPLY-RENDERER')!).map(
                (v) => v.host as HTMLElement,
            )
            if (mode === 'incr') {
                subComments = subComments.filter((v) => !v.hasAttribute(settings.filterSign))
            }
        }
        if (!subComments.length) {
            return
        }

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

        if (isSubWhite || revertAll) {
            subComments.forEach((el) => showEle(el))
            return
        }

        const blackPairs: SubFilterPair[] = []
        CFV.commentUsernameFilter.isEnable && blackPairs.push([CFV.commentUsernameFilter, selectorFns.sub.username])
        CFV.commentContentFilter.isEnable && blackPairs.push([CFV.commentContentFilter, selectorFns.sub.content])
        CFV.commentLevelFilter.isEnable && blackPairs.push([CFV.commentLevelFilter, selectorFns.sub.level])
        CFV.commentBotFilter.isEnable && blackPairs.push([CFV.commentBotFilter, selectorFns.sub.username])
        CFV.commentCallBotFilter.isEnable && blackPairs.push([CFV.commentCallBotFilter, selectorFns.sub.callUser])
        CFV.commentCallUserFilter.isEnable && blackPairs.push([CFV.commentCallUserFilter, selectorFns.sub.callUser])

        const whitePairs: SubFilterPair[] = []
        CFV.commentIsUpFilter.isEnable && whitePairs.push([CFV.commentIsUpFilter, selectorFns.sub.isUp])
        CFV.commentIsLinkFilter.isEnable && whitePairs.push([CFV.commentIsLinkFilter, selectorFns.sub.isLink])

        const subBlackCnt = await coreCheck(subComments, false, blackPairs, whitePairs)
        const time = (performance.now() - timer).toFixed(1)
        log(`CFV hide ${subBlackCnt} in ${subComments.length} sub comments, mode=${mode}, time=${time}`)
    }

    static check(mode?: 'full' | 'incr') {
        this.checkRoot(mode)
            .then()
            .catch((err) => {
                error('checkRoot failed', err)
            })
        this.checkSub(mode)
            .then()
            .catch((err) => {
                error('checkSub failed', err)
            })
    }

    /**
     * 监听一级评论container
     */
    observeRoot() {
        ShadowInstance.addShadowObserver(
            'BILI-COMMENTS',
            new MutationObserver(() => {
                CFV.checkRoot('incr')
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
    observeSub() {
        ShadowInstance.addShadowObserver(
            'BILI-COMMENT-REPLIES-RENDERER',
            new MutationObserver(() => {
                CFV.checkSub('full')
            }),
            {
                subtree: true,
                childList: true,
            },
        )
    }

    observe(): void {
        this.observeRoot()
        this.observeSub()
    }
}

export const commentFilterVideoEntry = async () => {
    const cfv = new CFV()
    cfv.observe()
}

export const commentFilterVideoGroups: Group[] = [
    {
        name: '用户名过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.username.statusKey,
                name: '启用 用户名过滤 (右键单击用户名)',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFV.commentUsernameFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentUsernameFilter.disable()
                    CFV.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 用户名黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
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
                enableFn: () => {
                    CFV.commentContentFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentContentFilter.disable()
                    CFV.check('full')
                },
            },
            {
                type: 'button',
                id: `${Date.now()}`,
                name: '编辑 评论关键词黑名单',
                buttonText: '编辑',
                fn: () => {
                    // Todo
                },
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
                enableFn: () => {
                    CFV.commentCallBotFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentCallBotFilter.disable()
                    CFV.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.bot.statusKey,
                name: '过滤 AI发布的评论',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFV.commentBotFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentBotFilter.disable()
                    CFV.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUser.statusKey,
                name: '过滤 @其他用户的评论',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFV.commentCallUserFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentCallUserFilter.disable()
                    CFV.check('full')
                },
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
                enableFn: () => {
                    CFV.commentLevelFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentLevelFilter.disable()
                    CFV.check('full')
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.level.valueKey,
                name: '设定最低等级 (0~6)',
                minValue: 0,
                maxValue: 6,
                defaultValue: 0,
                disableValue: 0,
                fn: (value: number) => {
                    CFV.commentLevelFilter.setParam(value)
                    CFV.check('full')
                },
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
                enableFn: () => {
                    isRootWhite = true
                    CFV.check('full')
                },
                disableFn: () => {
                    isRootWhite = false
                    CFV.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.sub.statusKey,
                name: '二级评论(回复) 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    isSubWhite = true
                    CFV.check('full')
                },
                disableFn: () => {
                    isSubWhite = false
                    CFV.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isUp.statusKey,
                name: 'UP主的评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFV.commentIsUpFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentIsUpFilter.disable()
                    CFV.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isPin.statusKey,
                name: '置顶评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFV.commentIsPinFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentIsPinFilter.disable()
                    CFV.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isNote.statusKey,
                name: '笔记/图片评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFV.commentIsNoteFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentIsNoteFilter.disable()
                    CFV.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isLink.statusKey,
                name: '含超链接的评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFV.commentIsLinkFilter.enable()
                    CFV.check('full')
                },
                disableFn: () => {
                    CFV.commentIsLinkFilter.disable()
                    CFV.check('full')
                },
            },
        ],
    },
]

import { GM_getValue } from '$'
import settings from '../../../../../settings'
import { Group } from '../../../../../types/collection'
import { SelectorResult, SubFilterPair } from '../../../../../types/filter'
import { log } from '../../../../../utils/logger'
import { showEle, waitForEle } from '../../../../../utils/tool'
import { coreCheck, MainFilter } from '../../../core/core'
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

// 一二级评论信息提取
const selectorFns = {
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

let isRootWhite = false
let isSubWhite = false

// CFSP is CommentFilterSpace
class CFSP extends MainFilter {
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
        CFSP.commentUsernameFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.username.valueKey}`, []))
        CFSP.commentContentFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.content.valueKey}`, []))
        CFSP.commentLevelFilter.setParam(GM_getValue(`BILICLEANER_${GM_KEYS.black.level.valueKey}`, 0))
        CFSP.commentBotFilter.setParam(bots)
        CFSP.commentCallBotFilter.setParam(bots)
        CFSP.commentCallUserFilter.setParam([`/./`])
    }

    static async check(mode?: 'full' | 'incr') {
        if (location.host === 'space.bilibili.com' && !location.pathname.includes('/dynamic')) {
            return
        }
        if (!CFSP.target) {
            return
        }

        let revertAll = false
        const timer = performance.now()
        if (
            !(
                CFSP.commentUsernameFilter.isEnable ||
                CFSP.commentContentFilter.isEnable ||
                CFSP.commentLevelFilter.isEnable ||
                CFSP.commentBotFilter.isEnable ||
                CFSP.commentCallBotFilter.isEnable ||
                CFSP.commentCallUserFilter.isEnable
            )
        ) {
            revertAll = true
        }

        // 提取元素：一级评论、二级评论
        const rootSelector = `.reply-item` + (mode === 'incr' ? `:not([${settings.filterSign}])` : '')
        const subSelector = `.sub-reply-item` + (mode === 'incr' ? `:not([${settings.filterSign}])` : '')
        const rootComments = Array.from(CFSP.target.querySelectorAll<HTMLElement>(rootSelector))
        const subComments = Array.from(CFSP.target.querySelectorAll<HTMLElement>(subSelector))

        // rootComments.forEach((v) => {
        //     log(
        //         [
        //             `root comment`,
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
        //             `sub comment`,
        //             `username: ${selectorFns.sub.username(v)}`,
        //             `content: ${selectorFns.sub.content(v)}`,
        //             `callUser: ${selectorFns.sub.callUser(v)}`,
        //             `level: ${selectorFns.sub.level(v)}`,
        //             `isUp: ${selectorFns.sub.isUp(v)}`,
        //             `isLink: ${selectorFns.sub.isLink(v)}`,
        //         ].join('\n'),
        //     )
        // })

        if (!rootComments.length && !subComments.length) {
            return
        }
        if (isRootWhite || revertAll) {
            rootComments.forEach((el) => showEle(el))
        }
        if (isSubWhite || revertAll) {
            subComments.forEach((el) => showEle(el))
        }
        if (revertAll) {
            return
        }

        // 构建黑白检测任务
        let rootBlackCnt = 0
        let subBlackCnt = 0
        if (!isRootWhite && rootComments.length) {
            const blackPairs: SubFilterPair[] = []
            CFSP.commentUsernameFilter.isEnable &&
                blackPairs.push([CFSP.commentUsernameFilter, selectorFns.root.username])
            CFSP.commentContentFilter.isEnable && blackPairs.push([CFSP.commentContentFilter, selectorFns.root.content])
            CFSP.commentLevelFilter.isEnable && blackPairs.push([CFSP.commentLevelFilter, selectorFns.root.level])
            CFSP.commentBotFilter.isEnable && blackPairs.push([CFSP.commentBotFilter, selectorFns.root.username])
            CFSP.commentCallBotFilter.isEnable &&
                blackPairs.push([CFSP.commentCallBotFilter, selectorFns.root.callUser])
            CFSP.commentCallUserFilter.isEnable &&
                blackPairs.push([CFSP.commentCallUserFilter, selectorFns.root.callUser])

            const whitePairs: SubFilterPair[] = []
            CFSP.commentIsUpFilter.isEnable && whitePairs.push([CFSP.commentIsUpFilter, selectorFns.root.isUp])
            CFSP.commentIsPinFilter.isEnable && whitePairs.push([CFSP.commentIsPinFilter, selectorFns.root.isPin])
            CFSP.commentIsNoteFilter.isEnable && whitePairs.push([CFSP.commentIsNoteFilter, selectorFns.root.isNote])
            CFSP.commentIsLinkFilter.isEnable && whitePairs.push([CFSP.commentIsLinkFilter, selectorFns.root.isLink])

            rootBlackCnt = await coreCheck(rootComments, true, blackPairs, whitePairs)
        }
        if (!isSubWhite && subComments.length) {
            const blackPairs: SubFilterPair[] = []
            CFSP.commentUsernameFilter.isEnable &&
                blackPairs.push([CFSP.commentUsernameFilter, selectorFns.sub.username])
            CFSP.commentContentFilter.isEnable && blackPairs.push([CFSP.commentContentFilter, selectorFns.sub.content])
            CFSP.commentLevelFilter.isEnable && blackPairs.push([CFSP.commentLevelFilter, selectorFns.sub.level])
            CFSP.commentBotFilter.isEnable && blackPairs.push([CFSP.commentBotFilter, selectorFns.sub.username])
            CFSP.commentCallBotFilter.isEnable && blackPairs.push([CFSP.commentCallBotFilter, selectorFns.sub.callUser])
            CFSP.commentCallUserFilter.isEnable &&
                blackPairs.push([CFSP.commentCallUserFilter, selectorFns.sub.callUser])

            const whitePairs: SubFilterPair[] = []
            CFSP.commentIsUpFilter.isEnable && whitePairs.push([CFSP.commentIsUpFilter, selectorFns.sub.isUp])
            CFSP.commentIsLinkFilter.isEnable && whitePairs.push([CFSP.commentIsLinkFilter, selectorFns.sub.isLink])

            subBlackCnt = await coreCheck(subComments, true, blackPairs, whitePairs)
        }

        const time = (performance.now() - timer).toFixed(1)
        log(
            `CFSP hide ${rootBlackCnt} in ${rootComments.length} root, ${subBlackCnt} in ${subComments.length} sub, mode=${mode}, time=${time}`,
        )
    }

    observe(): void {
        waitForEle(document, '#app', (node: HTMLElement): boolean => {
            return node.id === 'app'
        }).then((ele) => {
            if (ele) {
                CFSP.target = ele
                log('CFSP target appear')
                CFSP.check('full')
                const commentObserver = new MutationObserver(() => {
                    CFSP.check('incr')
                })
                commentObserver.observe(CFSP.target, { childList: true, subtree: true })
            }
        })
    }
}

export const commentFilterSpaceEntry = async () => {
    const cfsp = new CFSP()
    cfsp.observe()
}

export const commentFilterSpaceGroups: Group[] = [
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
                    CFSP.commentUsernameFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentUsernameFilter.disable()
                    CFSP.check('full').then().catch()
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
                    CFSP.commentContentFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentContentFilter.disable()
                    CFSP.check('full').then().catch()
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
                    CFSP.commentCallBotFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentCallBotFilter.disable()
                    CFSP.check('full').then().catch()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.bot.statusKey,
                name: '过滤 AI发布的评论',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFSP.commentBotFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentBotFilter.disable()
                    CFSP.check('full').then().catch()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUser.statusKey,
                name: '过滤 @其他用户的评论',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFSP.commentCallUserFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentCallUserFilter.disable()
                    CFSP.check('full').then().catch()
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
                    CFSP.commentLevelFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentLevelFilter.disable()
                    CFSP.check('full').then().catch()
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
                    CFSP.commentLevelFilter.setParam(value)
                    CFSP.check('full').then().catch()
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
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    isRootWhite = false
                    CFSP.check('full').then().catch()
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
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    isSubWhite = false
                    CFSP.check('full').then().catch()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isUp.statusKey,
                name: 'UP主的评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFSP.commentIsUpFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentIsUpFilter.disable()
                    CFSP.check('full').then().catch()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isPin.statusKey,
                name: '置顶评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFSP.commentIsPinFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentIsPinFilter.disable()
                    CFSP.check('full').then().catch()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isNote.statusKey,
                name: '笔记/图片评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFSP.commentIsNoteFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentIsNoteFilter.disable()
                    CFSP.check('full').then().catch()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isLink.statusKey,
                name: '含超链接的评论 免过滤',
                defaultEnable: false,
                noStyle: true,
                enableFn: () => {
                    CFSP.commentIsLinkFilter.enable()
                    CFSP.check('full').then().catch()
                },
                disableFn: () => {
                    CFSP.commentIsLinkFilter.disable()
                    CFSP.check('full').then().catch()
                },
            },
        ],
    },
]

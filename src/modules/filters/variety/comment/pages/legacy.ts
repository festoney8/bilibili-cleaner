import { coreCheck } from '@/modules/filters/core/core'
import settings from '@/settings'
import { Group } from '@/types/collection'
import { ContextMenuTargetHandler, FilterContextMenu, IMainFilter, SelectorResult, SubFilterPair } from '@/types/filter'
import fetchHook from '@/utils/fetch'
import { debugFilter as debug, error } from '@/utils/logger'
import { isPageSpace } from '@/utils/pageType'
import { BiliCleanerStorage } from '@/utils/storage'
import { orderedUniq, showEle, waitForEle } from '@/utils/tool'
import { bots, botsSet } from '../extra/bots'
import {
    CommentBotFilter,
    CommentCallBotFilter,
    CommentCallUserFilter,
    CommentCallUserOnlyFilter,
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
        callUserOnly: {
            statusKey: 'video-comment-call-user-only-filter-status',
        },
        isAD: {
            statusKey: 'video-comment-ad-filter-status',
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
    root: {
        username: (comment: HTMLElement): SelectorResult => {
            return comment.querySelector('.root-reply-container .user-name')?.textContent?.trim()
        },
        content: (comment: HTMLElement): SelectorResult => {
            return comment
                .querySelector('.root-reply-container .reply-content')
                ?.textContent?.trim()
                .replace(/@[^@\s]+/g, ' ')
                .trim()
        },
        callBot: (comment: HTMLElement): SelectorResult => {
            const members = Array.from(
                comment.querySelectorAll<HTMLElement>('.root-reply-container .reply-content .jump-link.user'),
            )
            return members.some((v: HTMLElement) => botsSet.has(v.textContent!.replace('@', '')))
        },
        callUser: (comment: HTMLElement): SelectorResult => {
            return comment
                .querySelector('.root-reply-container .reply-content .jump-link.user')
                ?.textContent?.replace('@', '')
                .trim()
        },
        callUserOnly: (comment: HTMLElement): SelectorResult => {
            return (
                comment
                    .querySelector('.root-reply-container .reply-content')
                    ?.textContent?.replace(/@[^@\s]+/g, ' ')
                    .trim() === ''
            )
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
                ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                ?.replace(/@[^@\s]+/g, ' ')
                .trim()
        },
        callBot: (comment: HTMLElement): SelectorResult => {
            const members = Array.from(comment.querySelectorAll<HTMLElement>('.reply-content .jump-link.user'))
            return members.some((v: HTMLElement) => botsSet.has(v.textContent!.replace('@', '')))
        },
        callUser: (comment: HTMLElement): SelectorResult => {
            return comment
                .querySelector('.reply-content')
                ?.textContent?.trim()
                ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                ?.match(/@[^@\s]+/)?.[0]
                .replace('@', '')
                .trim()
        },
        callUserOnly: (comment: HTMLElement): SelectorResult => {
            return (
                comment
                    .querySelector('.reply-content')
                    ?.textContent?.trim()
                    ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                    ?.replace(/@[^@\s]+/g, ' ')
                    .trim() === ''
            )
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

class CommentFilterLegacy implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    commentUsernameFilter = new CommentUsernameFilter()
    commentContentFilter = new CommentContentFilter()
    commentLevelFilter = new CommentLevelFilter()
    commentBotFilter = new CommentBotFilter()
    commentCallBotFilter = new CommentCallBotFilter()
    commentCallUserFilter = new CommentCallUserFilter()
    commentCallUserOnlyFilter = new CommentCallUserOnlyFilter()
    // 白名单
    commentIsUpFilter = new CommentIsUpFilter()
    commentIsPinFilter = new CommentIsPinFilter()
    commentIsNoteFilter = new CommentIsNoteFilter()
    commentIsLinkFilter = new CommentIsLinkFilter()

    init() {
        // 黑名单
        this.commentUsernameFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.username.valueKey, []))
        this.commentContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.content.valueKey, []))
        this.commentLevelFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.level.valueKey, 0))
        this.commentBotFilter.setParam(bots)
    }

    async check(mode?: 'full' | 'incr') {
        if (location.host === 'space.bilibili.com' && !location.pathname.includes('/dynamic')) {
            return
        }
        if (!this.target) {
            return
        }

        let revertAll = false
        const timer = performance.now()
        if (
            !(
                this.commentUsernameFilter.isEnable ||
                this.commentContentFilter.isEnable ||
                this.commentLevelFilter.isEnable ||
                this.commentBotFilter.isEnable ||
                this.commentCallBotFilter.isEnable ||
                this.commentCallUserFilter.isEnable ||
                this.commentCallUserOnlyFilter.isEnable
            )
        ) {
            revertAll = true
        }

        // 提取元素：一级评论、二级评论
        const rootSelector = `.reply-item` + (mode === 'incr' ? `:not([${settings.filterSign}])` : '')
        const subSelector = `.sub-reply-item` + (mode === 'incr' ? `:not([${settings.filterSign}])` : '')
        const rootComments = Array.from(this.target.querySelectorAll<HTMLElement>(rootSelector))
        const subComments = Array.from(this.target.querySelectorAll<HTMLElement>(subSelector))

        if (settings.enableDebugFilter) {
            rootComments.forEach((v) => {
                debug(
                    [
                        `CommentFilterLegacy rootComments`,
                        `username: ${selectorFns.root.username(v)}`,
                        `content: ${selectorFns.root.content(v)}`,
                        `callUser: ${selectorFns.root.callUser(v)}`,
                        `callUserOnly: ${selectorFns.root.callUserOnly(v)}`,
                        `level: ${selectorFns.root.level(v)}`,
                        `isUp: ${selectorFns.root.isUp(v)}`,
                        `isPin: ${selectorFns.root.isPin(v)}`,
                        `isNote: ${selectorFns.root.isNote(v)}`,
                        `isLink: ${selectorFns.root.isLink(v)}`,
                    ].join('\n'),
                )
            })
            subComments.forEach((v) => {
                debug(
                    [
                        `CommentFilterLegacy subComments`,
                        `username: ${selectorFns.sub.username(v)}`,
                        `content: ${selectorFns.sub.content(v)}`,
                        `callUser: ${selectorFns.sub.callUser(v)}`,
                        `callUserOnly: ${selectorFns.sub.callUserOnly(v)}`,
                        `level: ${selectorFns.sub.level(v)}`,
                        `isUp: ${selectorFns.sub.isUp(v)}`,
                        `isLink: ${selectorFns.sub.isLink(v)}`,
                    ].join('\n'),
                )
            })
        }

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
            this.commentUsernameFilter.isEnable &&
                blackPairs.push([this.commentUsernameFilter, selectorFns.root.username])
            this.commentContentFilter.isEnable && blackPairs.push([this.commentContentFilter, selectorFns.root.content])
            this.commentLevelFilter.isEnable && blackPairs.push([this.commentLevelFilter, selectorFns.root.level])
            this.commentBotFilter.isEnable && blackPairs.push([this.commentBotFilter, selectorFns.root.username])
            this.commentCallBotFilter.isEnable && blackPairs.push([this.commentCallBotFilter, selectorFns.root.callBot])
            this.commentCallUserFilter.isEnable &&
                blackPairs.push([this.commentCallUserFilter, selectorFns.root.callUser])
            this.commentCallUserOnlyFilter.isEnable &&
                blackPairs.push([this.commentCallUserOnlyFilter, selectorFns.root.callUserOnly])

            const whitePairs: SubFilterPair[] = []
            this.commentIsUpFilter.isEnable && whitePairs.push([this.commentIsUpFilter, selectorFns.root.isUp])
            this.commentIsPinFilter.isEnable && whitePairs.push([this.commentIsPinFilter, selectorFns.root.isPin])
            this.commentIsNoteFilter.isEnable && whitePairs.push([this.commentIsNoteFilter, selectorFns.root.isNote])
            this.commentIsLinkFilter.isEnable && whitePairs.push([this.commentIsLinkFilter, selectorFns.root.isLink])

            rootBlackCnt = await coreCheck(rootComments, true, blackPairs, whitePairs)
        }
        if (!isSubWhite && subComments.length) {
            const blackPairs: SubFilterPair[] = []
            this.commentUsernameFilter.isEnable &&
                blackPairs.push([this.commentUsernameFilter, selectorFns.sub.username])
            this.commentContentFilter.isEnable && blackPairs.push([this.commentContentFilter, selectorFns.sub.content])
            this.commentLevelFilter.isEnable && blackPairs.push([this.commentLevelFilter, selectorFns.sub.level])
            this.commentBotFilter.isEnable && blackPairs.push([this.commentBotFilter, selectorFns.sub.username])
            this.commentCallBotFilter.isEnable && blackPairs.push([this.commentCallBotFilter, selectorFns.sub.callBot])
            this.commentCallUserFilter.isEnable &&
                blackPairs.push([this.commentCallUserFilter, selectorFns.sub.callUser])
            this.commentCallUserOnlyFilter.isEnable &&
                blackPairs.push([this.commentCallUserOnlyFilter, selectorFns.sub.callUserOnly])

            const whitePairs: SubFilterPair[] = []
            this.commentIsUpFilter.isEnable && whitePairs.push([this.commentIsUpFilter, selectorFns.sub.isUp])
            this.commentIsLinkFilter.isEnable && whitePairs.push([this.commentIsLinkFilter, selectorFns.sub.isLink])

            subBlackCnt = await coreCheck(subComments, true, blackPairs, whitePairs)
        }

        const time = (performance.now() - timer).toFixed(1)
        debug(
            `CommentFilterLegacy hide ${rootBlackCnt} in ${rootComments.length} root, ${subBlackCnt} in ${subComments.length} sub, mode=${mode}, time=${time}`,
        )
    }

    checkFull() {
        this.check('full')
            .then()
            .catch((err) => {
                error('CommentFilterLegacy check full error', err)
            })
    }

    checkIncr() {
        this.check('incr')
            .then()
            .catch((err) => {
                error('CommentFilterLegacy check incr error', err)
            })
    }

    observe() {
        waitForEle(document, '#app', (node: HTMLElement): boolean => {
            return node.id === 'app'
        }).then((ele) => {
            if (ele) {
                debug('CommentFilterLegacy target appear')
                this.target = ele
                this.checkFull()
                const commentObserver = new MutationObserver(() => {
                    this.checkIncr()
                })
                commentObserver.observe(this.target, { childList: true, subtree: true })
            }
        })
    }
}
//==================================================================================================

const mainFilter = new CommentFilterLegacy()

export const commentFilterLegacyEntry = async () => {
    mainFilter.init()
    mainFilter.observe()
}

export const commentFilterLegacyGroups: Group[] = [
    {
        name: '评论用户过滤',
        items: [
            {
                type: 'switch',
                id: GM_KEYS.black.username.statusKey,
                name: '启用 评论用户过滤 (右键单击用户名)',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentUsernameFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentUsernameFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.username.valueKey,
                name: '编辑 评论用户黑名单',
                description: ['本黑名单与UP主黑名单互不影响', '右键屏蔽的用户会出现在首行'],
                editorTitle: '评论区 用户黑名单',
                editorDescription: ['每行一个用户名，保存时自动去重'],
                saveFn: async () => {
                    mainFilter.commentUsernameFilter.setParam(
                        BiliCleanerStorage.get(GM_KEYS.black.username.valueKey, []),
                    )
                    mainFilter.checkFull()
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
                name: '启用 评论关键词过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentContentFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentContentFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.content.valueKey,
                name: '编辑 评论关键词黑名单',
                editorTitle: '评论关键词 黑名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认 ius 模式，无需 flag，语法：/abc|\\d+/',
                ],
                saveFn: async () => {
                    mainFilter.commentContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.content.valueKey, []))
                    mainFilter.checkFull()
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
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentCallBotFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentCallBotFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.bot.statusKey,
                name: '过滤 AI发布的评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentBotFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentBotFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.isAD.statusKey,
                name: '过滤 带货评论 (实验功能)',
                noStyle: true,
                enableFn: () => {
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
                                        return new Response(JSON.stringify(respData), {
                                            status: resp.status,
                                            statusText: resp.statusText,
                                            headers: resp.headers,
                                        })
                                    }
                                } catch {
                                    return resp
                                }
                                return resp
                            }
                        },
                    )
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUserOnly.statusKey,
                name: '过滤 只含 @其他用户 的评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentCallUserOnlyFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentCallUserOnlyFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUser.statusKey,
                name: '过滤 包含 @其他用户 的评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentCallUserFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentCallUserFilter.disable()
                    mainFilter.checkFull()
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
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentLevelFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentLevelFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.level.valueKey,
                name: '设定最低等级 (0~6)',
                minValue: 0,
                maxValue: 6,
                step: 1,
                defaultValue: 0,
                disableValue: 0,
                fn: (value: number) => {
                    mainFilter.commentLevelFilter.setParam(value)
                    mainFilter.checkFull()
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
                noStyle: true,
                enableFn: () => {
                    isRootWhite = true
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    isRootWhite = false
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.sub.statusKey,
                name: '二级评论(回复) 免过滤',
                noStyle: true,
                enableFn: () => {
                    isSubWhite = true
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    isSubWhite = false
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isUp.statusKey,
                name: 'UP主的评论 免过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentIsUpFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentIsUpFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isPin.statusKey,
                name: '置顶评论 免过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentIsPinFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentIsPinFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isNote.statusKey,
                name: '笔记/图片评论 免过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentIsNoteFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentIsNoteFilter.disable()
                    mainFilter.checkFull()
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isLink.statusKey,
                name: '含超链接的评论 免过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentIsLinkFilter.enable()
                    mainFilter.checkFull()
                },
                disableFn: () => {
                    mainFilter.commentIsLinkFilter.disable()
                    mainFilter.checkFull()
                },
            },
        ],
    },
]

// 右键菜单handler
export const commentFilterLegacyHandler: ContextMenuTargetHandler = (target: HTMLElement): FilterContextMenu[] => {
    if (!isPageSpace()) {
        return []
    }

    const menus: FilterContextMenu[] = []
    if (
        target.parentElement?.id === 'user-name' ||
        target.classList.contains('user-name') ||
        target.classList.contains('sub-user-name')
    ) {
        const username = target.textContent?.trim()
        if (username && mainFilter.commentUsernameFilter.isEnable) {
            menus.push({
                name: `屏蔽用户：${username}`,
                fn: async () => {
                    try {
                        mainFilter.commentUsernameFilter.addParam(username)
                        mainFilter.checkFull()
                        const arr: string[] = BiliCleanerStorage.get(GM_KEYS.black.username.valueKey, [])
                        arr.unshift(username)
                        BiliCleanerStorage.set<string[]>(GM_KEYS.black.username.valueKey, orderedUniq(arr))
                    } catch (err) {
                        error(`commentFilterLegacyHandler add username ${username} failed`, err)
                    }
                },
            })
        }
    }
    return menus
}

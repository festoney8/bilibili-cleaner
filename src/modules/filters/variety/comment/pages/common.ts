import { coreCheck } from '@/modules/filters/core/core'
import settings from '@/settings'
import emojiRegex from 'emoji-regex-xs'
import { Group } from '@/types/collection'
import { ContextMenuTargetHandler, FilterContextMenu, IMainFilter, SelectorResult, SubFilterPair } from '@/types/filter'
import { debugFilter as debug, error } from '@/utils/logger'
import { isPageBangumi, isPageDynamic, isPagePlaylist, isPageSpace, isPageVideo } from '@/utils/pageType'
import ShadowInstance from '@/utils/shadow'
import { BiliCleanerStorage } from '@/utils/storage'
import { orderedUniq, showEle } from '@/utils/tool'
import { bots, botsSet } from '../extra/bots'
import {
    CommentAdFilter,
    CommentBotFilter,
    CommentCallBotFilter,
    CommentCallUserFilter,
    CommentCallUserNoReplyFilter,
    CommentCallUserOnlyFilter,
    CommentCallUserOnlyNoReplyFilter,
    CommentContentFilter,
    CommentEmojiOnlyFilter,
    CommentLevelFilter,
    CommentNoFaceFilter,
    CommentUsernameFilter,
    CommentUsernameKeywordFilter,
} from '../subFilters/black'
import {
    CommentIsLinkFilter,
    CommentIsMeFilter,
    CommentIsNoteFilter,
    CommentIsPinFilter,
    CommentIsUpFilter,
} from '../subFilters/white'

const GM_KEYS = {
    black: {
        username: {
            statusKey: 'video-comment-username-filter-status',
            valueKey: 'global-comment-username-filter-value',
        },
        usernameKeyword: {
            statusKey: 'video-comment-username-keyword-filter-status',
            valueKey: 'global-comment-username-keyword-filter-value',
        },
        content: {
            statusKey: 'video-comment-content-filter-status',
            valueKey: 'global-comment-content-filter-value',
        },
        level: {
            statusKey: 'video-comment-level-filter-status',
            valueKey: 'global-comment-level-filter-value',
        },
        noface: {
            statusKey: 'video-comment-noface-filter-status',
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
        callUserNoReply: {
            statusKey: 'video-comment-call-user-noreply-filter-status',
        },
        callUserOnly: {
            statusKey: 'video-comment-call-user-only-filter-status',
        },
        callUserOnlyNoReply: {
            statusKey: 'video-comment-call-user-only-noreply-filter-status',
        },
        isAD: {
            statusKey: 'video-comment-ad-filter-status',
        },
        emojiOnly: {
            statusKey: 'video-comment-emoji-only-filter-status',
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
// 测试视频：
// https://b23.tv/av810872
// https://b23.tv/av1855797296
// https://b23.tv/av1706101190
// https://b23.tv/av1705573085
// https://b23.tv/av1350214762
// https://b23.tv/av113195607985861
const emojiPattern = emojiRegex()
const selectorFns = {
    root: {
        username: (comment: HTMLElement): SelectorResult => {
            return (comment as any).__data?.member?.uname?.trim()
        },
        content: (comment: HTMLElement): SelectorResult => {
            return (comment as any).__data?.content?.message
                ?.replace(/@[^@\s]+/g, ' ')
                ?.replace(/(\[[^[\]]+\])+/g, ' ')
                .trim()
        },
        noface: (comment: HTMLElement): SelectorResult => {
            return (
                (comment as any).__data?.member?.avatar?.endsWith('noface.jpg') &&
                (comment as any).__data?.member?.vip?.vipStatus === 0
            )
        },
        callBot: (comment: HTMLElement): SelectorResult => {
            const members = (comment as any).__data?.content?.members
            if (members?.length) {
                return members.some((v: { uname: string }) => botsSet.has(v.uname))
            }
            return false
        },
        callUser: (comment: HTMLElement): SelectorResult => {
            return !!(comment as any).__data?.content?.members?.[0]
        },
        callUserNoReply: (comment: HTMLElement): SelectorResult => {
            if ((comment as any).__data?.rcount !== 0) {
                return false
            }
            return !!(comment as any).__data?.content?.members?.[0]
        },
        callUserOnly: (comment: HTMLElement): SelectorResult => {
            return (comment as any).__data?.content?.message?.replace(/@[^@\s]+/g, ' ').trim() === ''
        },
        callUserOnlyNoReply: (comment: HTMLElement): SelectorResult => {
            if ((comment as any).__data?.rcount !== 0) {
                return false
            }
            return (comment as any).__data?.content?.message?.replace(/@[^@\s]+/g, ' ').trim() === ''
        },
        level: (comment: HTMLElement): SelectorResult => {
            return (comment as any).__data?.member?.level_info?.current_level
        },
        emojiOnly: (comment: HTMLElement): SelectorResult => {
            return (
                (comment as any).__data?.content?.message
                    ?.replace(/@[^@\s]+/g, ' ')
                    ?.replace(/(\[[^[\]]+\])+/g, ' ')
                    ?.replace(emojiPattern, ' ')
                    .trim() === ''
            )
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
        // 自己发布 or @自己 的评论
        isMe: (comment: HTMLElement): SelectorResult => {
            const me = (comment as any).__user?.uname
            if (!me) {
                return false
            }
            if (
                (comment as any).__data?.member?.uname === me ||
                (comment as any).__data?.content?.message?.includes(`@${me}`)
            ) {
                return true
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
                ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                ?.replace(/@[^@\s]+/g, ' ')
                ?.replace(/(\[[^[\]]+\])+/g, ' ')
                .trim()
        },
        noface: (comment: HTMLElement): SelectorResult => {
            return (
                (comment as any).__data?.member?.avatar?.endsWith('noface.jpg') &&
                (comment as any).__data?.member?.vip?.vipStatus === 0
            )
        },
        callBot: (comment: HTMLElement): SelectorResult => {
            const members = (comment as any).__data?.content?.members
            if (members.length) {
                return members.some((v: { uname: string }) => botsSet.has(v.uname))
            }
            return false
        },
        callUser: (comment: HTMLElement): SelectorResult => {
            return !!(comment as any).__data?.content?.message
                ?.trim()
                ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                ?.match(/@[^@\s]+/)
        },
        callUserNoReply: (comment: HTMLElement): SelectorResult => {
            return !!(comment as any).__data?.content?.message
                ?.trim()
                ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                ?.match(/@[^@\s]+/)
        },
        callUserOnly: (comment: HTMLElement): SelectorResult => {
            return (
                (comment as any).__data?.content?.message
                    ?.trim()
                    ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                    ?.replace(/@[^@\s]+/g, ' ')
                    .trim() === ''
            )
        },
        callUserOnlyNoReply: (comment: HTMLElement): SelectorResult => {
            return (
                (comment as any).__data?.content?.message
                    ?.trim()
                    ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                    ?.replace(/@[^@\s]+/g, ' ')
                    .trim() === ''
            )
        },
        level: (comment: HTMLElement): SelectorResult => {
            return (comment as any).__data?.member?.level_info?.current_level
        },
        emojiOnly: (comment: HTMLElement): SelectorResult => {
            return (
                (comment as any).__data?.content?.message
                    ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                    ?.replace(/@[^@\s]+/g, ' ')
                    ?.replace(/(\[[^[\]]+\])+/g, ' ')
                    ?.replace(emojiPattern, ' ')
                    .trim() === ''
            )
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
        // 自己发布 or @自己 的评论
        isMe: (comment: HTMLElement): SelectorResult => {
            const me = (comment as any).__user?.uname
            if (!me) {
                return false
            }
            if (
                (comment as any).__data?.member?.uname === me ||
                (comment as any).__data?.content?.message
                    ?.trim()
                    ?.replace(/^回复\s?@[^@\s]+\s?:/, '')
                    .includes(`@${me}`)
            ) {
                return true
            }
            return false
        },
    },
}

// 一二级评论是否检测
let isRootWhite = false
let isSubWhite = false

class CommentFilterCommon implements IMainFilter {
    target: HTMLElement | undefined

    // 黑名单
    commentUsernameFilter = new CommentUsernameFilter()
    commentUsernameKeywordFilter = new CommentUsernameKeywordFilter()
    commentContentFilter = new CommentContentFilter()
    commentAdFilter = new CommentAdFilter()
    commentLevelFilter = new CommentLevelFilter()
    commentNoFaceFilter = new CommentNoFaceFilter()
    commentBotFilter = new CommentBotFilter()
    commentCallBotFilter = new CommentCallBotFilter()
    commentCallUserFilter = new CommentCallUserFilter()
    commentCallUserNoReplyFilter = new CommentCallUserNoReplyFilter()
    commentCallUserOnlyFilter = new CommentCallUserOnlyFilter()
    commentCallUserOnlyNoReplyFilter = new CommentCallUserOnlyNoReplyFilter()
    commentEmojiOnlyFilter = new CommentEmojiOnlyFilter()
    // 白名单
    commentIsUpFilter = new CommentIsUpFilter()
    commentIsPinFilter = new CommentIsPinFilter()
    commentIsNoteFilter = new CommentIsNoteFilter()
    commentIsLinkFilter = new CommentIsLinkFilter()
    commentIsMeFilter = new CommentIsMeFilter()

    init() {
        // 黑名单
        this.commentUsernameFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.username.valueKey, []))
        this.commentUsernameKeywordFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.usernameKeyword.valueKey, []))
        this.commentContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.content.valueKey, []))
        this.commentLevelFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.level.valueKey, 0))
        this.commentBotFilter.setParam(bots)
        this.commentAdFilter.setParam([`/(bili2233\\.cn|b23\\.tv)\\/(mall-|cm-)|领券|gaoneng\\.bilibili\\.com/`])
    }

    /**
     * 检测一级评论
     * @param mode full全量，incr增量
     * @returns
     */
    async checkRoot(mode?: 'full' | 'incr') {
        const timer = performance.now()
        let revertAll = false
        if (
            !(
                this.commentUsernameFilter.isEnable ||
                this.commentUsernameKeywordFilter.isEnable ||
                this.commentContentFilter.isEnable ||
                this.commentAdFilter.isEnable ||
                this.commentLevelFilter.isEnable ||
                this.commentNoFaceFilter.isEnable ||
                this.commentBotFilter.isEnable ||
                this.commentCallBotFilter.isEnable ||
                this.commentCallUserFilter.isEnable ||
                this.commentCallUserNoReplyFilter.isEnable ||
                this.commentCallUserOnlyFilter.isEnable ||
                this.commentCallUserOnlyNoReplyFilter.isEnable ||
                this.commentEmojiOnlyFilter.isEnable
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
                rootComments = rootComments.filter((v) => !v.hasAttribute(settings.filterVisitSign))
            }
        }
        if (!rootComments.length) {
            return
        }

        if (settings.enableDebugFilter) {
            rootComments.forEach((v) => {
                debug(
                    [
                        `CommentFilterCommon rootComments`,
                        `username: ${selectorFns.root.username(v)}`,
                        `content: ${selectorFns.root.content(v)}`,
                        `callUser: ${selectorFns.root.callUser(v)}`,
                        `callUserNoReply: ${selectorFns.root.callUserNoReply(v)}`,
                        `callUserOnly: ${selectorFns.root.callUserOnly(v)}`,
                        `callUserOnlyNoReply: ${selectorFns.root.callUserOnlyNoReply(v)}`,
                        `level: ${selectorFns.root.level(v)}`,
                        `noface: ${selectorFns.root.noface(v)}`,
                        `isUp: ${selectorFns.root.isUp(v)}`,
                        `isPin: ${selectorFns.root.isPin(v)}`,
                        `isNote: ${selectorFns.root.isNote(v)}`,
                        `isLink: ${selectorFns.root.isLink(v)}`,
                        `isMe: ${selectorFns.root.isMe(v)}`,
                        `emojiOnly: ${selectorFns.root.emojiOnly(v)}`,
                    ].join('\n'),
                )
            })
        }

        if (isRootWhite || revertAll) {
            rootComments.forEach((el) => showEle(el, 'style'))
            return
        }

        const blackPairs: SubFilterPair[] = []
        this.commentUsernameFilter.isEnable && blackPairs.push([this.commentUsernameFilter, selectorFns.root.username])
        this.commentUsernameKeywordFilter.isEnable &&
            blackPairs.push([this.commentUsernameKeywordFilter, selectorFns.root.username])
        this.commentContentFilter.isEnable && blackPairs.push([this.commentContentFilter, selectorFns.root.content])
        this.commentLevelFilter.isEnable && blackPairs.push([this.commentLevelFilter, selectorFns.root.level])
        this.commentNoFaceFilter.isEnable && blackPairs.push([this.commentNoFaceFilter, selectorFns.root.noface])
        this.commentBotFilter.isEnable && blackPairs.push([this.commentBotFilter, selectorFns.root.username])
        this.commentCallBotFilter.isEnable && blackPairs.push([this.commentCallBotFilter, selectorFns.root.callBot])
        this.commentCallUserFilter.isEnable && blackPairs.push([this.commentCallUserFilter, selectorFns.root.callUser])
        this.commentCallUserNoReplyFilter.isEnable &&
            blackPairs.push([this.commentCallUserNoReplyFilter, selectorFns.root.callUserNoReply])
        this.commentCallUserOnlyFilter.isEnable &&
            blackPairs.push([this.commentCallUserOnlyFilter, selectorFns.root.callUserOnly])
        this.commentCallUserOnlyNoReplyFilter.isEnable &&
            blackPairs.push([this.commentCallUserOnlyNoReplyFilter, selectorFns.root.callUserOnlyNoReply])
        this.commentEmojiOnlyFilter.isEnable &&
            blackPairs.push([this.commentEmojiOnlyFilter, selectorFns.root.emojiOnly])

        const whitePairs: SubFilterPair[] = []
        this.commentIsUpFilter.isEnable && whitePairs.push([this.commentIsUpFilter, selectorFns.root.isUp])
        this.commentIsPinFilter.isEnable && whitePairs.push([this.commentIsPinFilter, selectorFns.root.isPin])
        this.commentIsNoteFilter.isEnable && whitePairs.push([this.commentIsNoteFilter, selectorFns.root.isNote])
        this.commentIsLinkFilter.isEnable && whitePairs.push([this.commentIsLinkFilter, selectorFns.root.isLink])
        this.commentIsMeFilter.isEnable && whitePairs.push([this.commentIsMeFilter, selectorFns.root.isMe])

        const forceBlackPairs: SubFilterPair[] = []
        this.commentAdFilter.isEnable && forceBlackPairs.push([this.commentAdFilter, selectorFns.root.content])

        const rootBlackCnt = await coreCheck(rootComments, true, 'style', blackPairs, whitePairs, forceBlackPairs, true)
        const time = (performance.now() - timer).toFixed(1)
        debug(
            `CommentFilterCommon hide ${rootBlackCnt} in ${rootComments.length} root comments, mode=${mode}, time=${time}`,
        )
    }

    /**
     * 检测二级评论
     * @param mode full全量，incr增量
     * @returns
     */
    async checkSub(mode?: 'full' | 'incr') {
        const timer = performance.now()
        let revertAll = false
        if (
            !(
                this.commentUsernameFilter.isEnable ||
                this.commentUsernameKeywordFilter.isEnable ||
                this.commentContentFilter.isEnable ||
                this.commentAdFilter.isEnable ||
                this.commentLevelFilter.isEnable ||
                this.commentNoFaceFilter.isEnable ||
                this.commentBotFilter.isEnable ||
                this.commentCallBotFilter.isEnable ||
                this.commentCallUserFilter.isEnable ||
                this.commentCallUserNoReplyFilter.isEnable ||
                this.commentCallUserOnlyFilter.isEnable ||
                this.commentCallUserOnlyNoReplyFilter.isEnable ||
                this.commentEmojiOnlyFilter.isEnable
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
                subComments = subComments.filter((v) => !v.hasAttribute(settings.filterVisitSign))
            }
        }
        if (!subComments.length) {
            return
        }

        if (settings.enableDebugFilter) {
            subComments.forEach((v) => {
                debug(
                    [
                        `CommentFilterCommon subComments`,
                        `username: ${selectorFns.sub.username(v)}`,
                        `content: ${selectorFns.sub.content(v)}`,
                        `callUser: ${selectorFns.sub.callUser(v)}`,
                        `callUserNoReply: ${selectorFns.sub.callUserNoReply(v)}`,
                        `callUserOnly: ${selectorFns.sub.callUserOnly(v)}`,
                        `callUserOnlyNoReply: ${selectorFns.sub.callUserOnlyNoReply(v)}`,
                        `level: ${selectorFns.sub.level(v)}`,
                        `noface: ${selectorFns.sub.noface(v)}`,
                        `isUp: ${selectorFns.sub.isUp(v)}`,
                        `isLink: ${selectorFns.sub.isLink(v)}`,
                        `isMe: ${selectorFns.sub.isMe(v)}`,
                        `emojiOnly: ${selectorFns.sub.emojiOnly(v)}`,
                    ].join('\n'),
                )
            })
        }

        if (isSubWhite || revertAll) {
            subComments.forEach((el) => showEle(el, 'style'))
            return
        }

        const blackPairs: SubFilterPair[] = []
        this.commentUsernameFilter.isEnable && blackPairs.push([this.commentUsernameFilter, selectorFns.sub.username])
        this.commentUsernameKeywordFilter.isEnable &&
            blackPairs.push([this.commentUsernameKeywordFilter, selectorFns.sub.username])
        this.commentContentFilter.isEnable && blackPairs.push([this.commentContentFilter, selectorFns.sub.content])
        this.commentLevelFilter.isEnable && blackPairs.push([this.commentLevelFilter, selectorFns.sub.level])
        this.commentNoFaceFilter.isEnable && blackPairs.push([this.commentNoFaceFilter, selectorFns.sub.noface])
        this.commentBotFilter.isEnable && blackPairs.push([this.commentBotFilter, selectorFns.sub.username])
        this.commentCallBotFilter.isEnable && blackPairs.push([this.commentCallBotFilter, selectorFns.sub.callBot])
        this.commentCallUserFilter.isEnable && blackPairs.push([this.commentCallUserFilter, selectorFns.sub.callUser])
        this.commentCallUserNoReplyFilter.isEnable &&
            blackPairs.push([this.commentCallUserNoReplyFilter, selectorFns.sub.callUserNoReply])
        this.commentCallUserOnlyFilter.isEnable &&
            blackPairs.push([this.commentCallUserOnlyFilter, selectorFns.sub.callUserOnly])
        this.commentCallUserOnlyNoReplyFilter.isEnable &&
            blackPairs.push([this.commentCallUserOnlyNoReplyFilter, selectorFns.sub.callUserOnlyNoReply])
        this.commentEmojiOnlyFilter.isEnable &&
            blackPairs.push([this.commentEmojiOnlyFilter, selectorFns.sub.emojiOnly])

        const whitePairs: SubFilterPair[] = []
        this.commentIsUpFilter.isEnable && whitePairs.push([this.commentIsUpFilter, selectorFns.sub.isUp])
        this.commentIsLinkFilter.isEnable && whitePairs.push([this.commentIsLinkFilter, selectorFns.sub.isLink])
        this.commentIsMeFilter.isEnable && whitePairs.push([this.commentIsMeFilter, selectorFns.sub.isMe])

        const forceBlackPairs: SubFilterPair[] = []
        this.commentAdFilter.isEnable && forceBlackPairs.push([this.commentAdFilter, selectorFns.sub.content])

        const subBlackCnt = await coreCheck(subComments, false, 'style', blackPairs, whitePairs, forceBlackPairs, true)
        const time = (performance.now() - timer).toFixed(1)
        debug(
            `CommentFilterCommon hide ${subBlackCnt} in ${subComments.length} sub comments, mode=${mode}, time=${time}`,
        )
    }

    check(mode?: 'full' | 'incr') {
        this.checkRoot(mode).catch((err) => {
            error(`CommentFilterCommon checkRoot mode=${mode} error`, err)
        })
        this.checkSub(mode).catch((err) => {
            error(`CommentFilterCommon checkSub mode=${mode} error`, err)
        })
    }

    /**
     * 监听一级/二级评论container
     * 使用同一Observer监视所有二级评论上级节点，所有变化只触发一次回调
     */
    observe() {
        ShadowInstance.addShadowObserver(
            'BILI-COMMENTS',
            new MutationObserver(() => {
                this.checkRoot('incr').catch(() => {})
            }),
            {
                subtree: true,
                childList: true,
            },
        )

        ShadowInstance.addShadowObserver(
            'BILI-COMMENT-REPLIES-RENDERER',
            new MutationObserver(() => {
                this.checkSub('full').catch(() => {})
            }),
            {
                subtree: true,
                childList: true,
            },
        )
    }
}

//==================================================================================================

const mainFilter = new CommentFilterCommon()

export const commentFilterCommonEntry = async () => {
    mainFilter.init()
    mainFilter.commentIsMeFilter.enable()
    mainFilter.observe()
}

export const commentFilterCommonGroups: Group[] = [
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
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentUsernameFilter.disable()
                    mainFilter.check('full')
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
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.usernameKeyword.statusKey,
                name: '启用 评论用户昵称关键词过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentUsernameKeywordFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentUsernameKeywordFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.usernameKeyword.valueKey,
                name: '编辑 评论用户昵称关键词黑名单',
                editorTitle: '评论区 用户黑名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写、全半角',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认 ius 模式，无需 flag，语法：/abc|\\d+/',
                ],
                saveFn: async () => {
                    mainFilter.commentUsernameKeywordFilter.setParam(
                        BiliCleanerStorage.get(GM_KEYS.black.usernameKeyword.valueKey, []),
                    )
                    mainFilter.check('full')
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
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentContentFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'editor',
                id: GM_KEYS.black.content.valueKey,
                name: '编辑 评论关键词黑名单',
                editorTitle: '评论关键词 黑名单',
                editorDescription: [
                    '每行一个关键词或正则，不区分大小写、全半角',
                    '请勿使用过于激进的关键词或正则',
                    '正则默认 ius 模式，无需 flag，语法：/abc|\\d+/',
                ],
                saveFn: async () => {
                    mainFilter.commentContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.content.valueKey, []))
                    mainFilter.check('full')
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
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentCallBotFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.bot.statusKey,
                name: '过滤 AI发布的评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentBotFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentBotFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.isAD.statusKey,
                name: '过滤 带货评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentAdFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentAdFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.emojiOnly.statusKey,
                name: '过滤 只有表情的评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentEmojiOnlyFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentEmojiOnlyFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.noface.statusKey,
                name: '过滤 默认头像非会员用户评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentNoFaceFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentNoFaceFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUserOnly.statusKey,
                name: '过滤 只含 @其他用户 的全部评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentCallUserOnlyFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentCallUserOnlyFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUserOnlyNoReply.statusKey,
                name: '过滤 只含 @其他用户 的无回复评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentCallUserOnlyNoReplyFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentCallUserOnlyNoReplyFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUser.statusKey,
                name: '过滤 包含 @其他用户 的全部评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentCallUserFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentCallUserFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.black.callUserNoReply.statusKey,
                name: '过滤 包含 @其他用户 的无回复评论',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentCallUserNoReplyFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentCallUserNoReplyFilter.disable()
                    mainFilter.check('full')
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
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentLevelFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'number',
                id: GM_KEYS.black.level.valueKey,
                noStyle: true,
                name: '设定最低等级 (0~6)',
                minValue: 0,
                maxValue: 6,
                step: 1,
                defaultValue: 0,
                disableValue: 0,
                fn: (value: number) => {
                    mainFilter.commentLevelFilter.setParam(value)
                    mainFilter.check('full')
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
                    mainFilter.check('full')
                },
                disableFn: () => {
                    isRootWhite = false
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.sub.statusKey,
                name: '二级评论(回复) 免过滤',
                noStyle: true,
                enableFn: () => {
                    isSubWhite = true
                    mainFilter.check('full')
                },
                disableFn: () => {
                    isSubWhite = false
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isUp.statusKey,
                name: 'UP主的评论 免过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentIsUpFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentIsUpFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isPin.statusKey,
                name: '置顶评论 免过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentIsPinFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentIsPinFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isNote.statusKey,
                name: '笔记/图片评论 免过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentIsNoteFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentIsNoteFilter.disable()
                    mainFilter.check('full')
                },
            },
            {
                type: 'switch',
                id: GM_KEYS.white.isLink.statusKey,
                name: '含超链接的评论 免过滤',
                noStyle: true,
                enableFn: () => {
                    mainFilter.commentIsLinkFilter.enable()
                    mainFilter.check('full')
                },
                disableFn: () => {
                    mainFilter.commentIsLinkFilter.disable()
                    mainFilter.check('full')
                },
            },
        ],
    },
]

// 右键菜单handler
export const commentFilterCommonHandler: ContextMenuTargetHandler = (target: HTMLElement): FilterContextMenu[] => {
    if (!(isPageVideo() || isPagePlaylist() || isPageBangumi() || isPageDynamic() || isPageSpace())) {
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
                        mainFilter.check('full')
                        const arr: string[] = BiliCleanerStorage.get(GM_KEYS.black.username.valueKey, [])
                        arr.unshift(username)
                        BiliCleanerStorage.set<string[]>(GM_KEYS.black.username.valueKey, orderedUniq(arr))
                    } catch (err) {
                        error(`commentFilterCommonHandler add username ${username} failed`, err)
                    }
                },
            })
        }
    }
    return menus
}

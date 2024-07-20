import { Group } from '../../../components/group'
import { CheckboxItem, ButtonItem, NumberItem } from '../../../components/item'
import { debugCommentFilter as debug, error } from '../../../utils/logger'
import { isPageBangumi, isPagePlaylist, isPageVideo } from '../../../utils/pageType'
import { showEle } from '../../../utils/tool'
import { BotAction, CallBotAction, CallUserAction, ContentAction, LevelAction, UsernameAction } from './actions/action'
import coreCommentFilterInstance, { CommentSelectorFunc } from '../filters/core'
import settings from '../../../settings'
import { ContextMenu } from '../../../components/contextmenu'
import { unsafeWindow } from '$'
import fetchHook from '../../../utils/fetch'

const videoPageCommentFilterGroupList: Group[] = []

let isV2 = false
const isCommentV2 = () => {
    if (!isV2) {
        isV2 = unsafeWindow.__INITIAL_STATE__?.abtest?.comment_next_version === 'ELEMENTS'
    }
    return isV2
}

// 右键菜单功能
let isContextMenuFuncRunning = false
let isContextMenuUsernameEnable = false

// 白名单功能开关
let isRootCommentWhitelistEnable = false
let isSubCommentWhitelistEnable = false
let isUploaderCommentWhitelistEnable = false
let isPinnedCommentWhitelistEnable = false
let isNoteCommentWhitelistEnable = false
let isLinkCommentWhitelistEnable = false

if (isPageVideo() || isPageBangumi() || isPagePlaylist()) {
    const lvMap = new Map([
        ['level_h.svg', 6.5],
        ['level_6.svg', 6],
        ['level_5.svg', 5],
        ['level_4.svg', 4],
        ['level_3.svg', 3],
        ['level_2.svg', 2],
        ['level_1.svg', 1],

        ['level-h', 6.5],
        ['level-6', 6],
        ['level-5', 5],
        ['level-4', 4],
        ['level-3', 3],
        ['level-2', 2],
        ['level-1', 1],
    ])
    // 一级评论
    const rootCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const uname =
                    (comment as any).__data?.member?.uname ||
                    comment.shadowRoot
                        ?.querySelector('bili-comment-renderer')
                        ?.shadowRoot?.querySelector('bili-comment-user-info')
                        ?.shadowRoot?.querySelector('#user-name')
                        ?.textContent?.trim()
                return uname ? uname : null
            }

            const uname = comment.querySelector('.root-reply-container .user-name')?.textContent?.trim()
            return uname ? uname : null
        },
        content: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const content =
                    (comment as any).__data?.content?.message?.trim() ||
                    comment.shadowRoot
                        ?.querySelector('bili-comment-renderer')
                        ?.shadowRoot?.querySelector('bili-rich-text')
                        ?.shadowRoot?.querySelector('#contents')?.textContent
                return content ? content : null
            }
            let content = comment.querySelector('.root-reply-container .reply-content')?.textContent?.trim()
            const atUsers = comment.querySelectorAll('.root-reply-container .jump-link.user')
            if (atUsers.length) {
                atUsers.forEach((e) => {
                    const username = e.textContent?.trim()
                    if (content && username) {
                        content = content.replace(username, '')
                    }
                })
            }
            return content ? content : null
        },
        callUser: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const contentNode = comment.shadowRoot
                    ?.querySelector('bili-comment-renderer')
                    ?.shadowRoot?.querySelector('bili-rich-text')?.shadowRoot
                const uname = contentNode?.querySelector('a[data-user-profile-id]')?.textContent?.replace('@', '')
                return uname ? uname : null
            }
            return null
        },
        level: (comment: HTMLElement): number | null => {
            if (isCommentV2()) {
                const url = comment.shadowRoot
                    ?.querySelector('bili-comment-renderer')
                    ?.shadowRoot?.querySelector('bili-comment-user-info')
                    ?.shadowRoot?.querySelector('#user-level img')
                    ?.getAttribute('src')
                if (url) {
                    const lvMap = new Map([
                        ['level_h.svg', 6.5],
                        ['level_6.svg', 6],
                        ['level_5.svg', 5],
                        ['level_4.svg', 4],
                        ['level_3.svg', 3],
                        ['level_2.svg', 2],
                        ['level_1.svg', 1],
                    ])
                    const arr = url.split('/')
                    const lv = lvMap.get(arr[arr.length - 1])
                    return lv ? lv : null
                }
                return null
            }
            const c = comment.querySelector('.root-reply-container .user-level')?.className
            const matchLv = c && c.match(/level-([1-6]|h)/)
            if (matchLv && matchLv.length) {
                const lv = lvMap.get(matchLv[0])
                return lv ? lv : null
            }
            return null
        },
    }
    // 二级评论
    const subCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const username =
                    (comment as any).__data?.member?.uname ||
                    comment.shadowRoot
                        ?.querySelector('bili-comment-user-info')
                        ?.shadowRoot?.querySelector('#user-name a')
                        ?.textContent?.trim()
                return username ? username : null
            }
            const username = comment.querySelector('.sub-user-name')?.textContent?.trim()
            return username ? username : null
        },
        content: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const contentNode = comment.shadowRoot?.querySelector('bili-rich-text')?.shadowRoot
                let content =
                    (comment as any).__data?.content?.message?.trim() ||
                    contentNode?.querySelector('#contents')?.textContent?.trim()
                // 忽略二级回复中@多用户情况
                content = content.replace(/^回复 @[^@ ]+? :/, '').trim()
                return content ? content : null
            }

            let content = comment.querySelector('.reply-content')?.textContent?.trim()
            const atUsers = comment.querySelectorAll('.reply-content .jump-link.user')
            if (atUsers.length && content) {
                content = content.replace('回复 ', '')
                atUsers.forEach((e) => {
                    const username = e.textContent?.trim()
                    if (content && username) {
                        content = content.replace(username, '')
                    }
                })
            }
            return content ? content : null
        },
        callUser: (comment: HTMLElement): string | null => {
            if (isCommentV2()) {
                const contentNode = comment.shadowRoot?.querySelector('bili-rich-text')?.shadowRoot
                const content =
                    (comment as any).__data?.content?.message?.trim() ||
                    contentNode?.querySelector('#contents')?.textContent?.trim()
                let uname
                if (!content) {
                    uname = null
                } else {
                    if ((content as string).startsWith('回复 @')) {
                        uname = contentNode
                            ?.querySelector('a[data-user-profile-id]:nth-of-type(2)')
                            ?.textContent?.replace('@', '')
                    } else {
                        uname = contentNode?.querySelector('a[data-user-profile-id]')?.textContent?.replace('@', '')
                    }
                }
                return uname ? uname : null
            }

            return null
        },
        level: (comment: HTMLElement): number | null => {
            if (isCommentV2()) {
                const url = comment.shadowRoot
                    ?.querySelector('bili-comment-user-info')
                    ?.shadowRoot?.querySelector('#user-level img')
                    ?.getAttribute('src')
                if (url) {
                    const arr = url.split('/')
                    const lv = lvMap.get(arr[arr.length - 1])
                    return lv ? lv : null
                }
                return null
            }
            const c = comment.querySelector('.sub-user-info .sub-user-level')?.className
            const matchLv = c && c.match(/level-([1-6]|h)/)
            if (matchLv && matchLv.length) {
                const lv = lvMap.get(matchLv[0])
                return lv ? lv : null
            }
            return null
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
                        const replys = c.shadowRoot
                            ?.querySelector('bili-comment-replies-renderer')
                            ?.shadowRoot?.querySelectorAll<HTMLElement>('bili-comment-reply-renderer')
                        if (replys?.length) {
                            subComments = subComments.concat(Array.from(replys))
                        }
                    })
                } else {
                    rootComments = Array.from(
                        shadowRoot.querySelectorAll<HTMLElement>(
                            `bili-comment-thread-renderer:not([${settings.filterSign}])`,
                        ),
                    )
                    rootComments.forEach((c) => {
                        const replys = c.shadowRoot
                            ?.querySelector('bili-comment-replies-renderer')
                            ?.shadowRoot?.querySelectorAll<HTMLElement>(
                                `bili-comment-reply-renderer:not([${settings.filterSign}])`,
                            )
                        if (replys?.length) {
                            subComments = subComments.concat(Array.from(replys))
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

    // 配置 行为实例
    const usernameAction = new UsernameAction(
        'video-comment-username-filter-status',
        'global-comment-username-filter-value',
        checkCommentList,
    )
    const contentAction = new ContentAction(
        'video-comment-content-filter-status',
        'global-comment-content-filter-value',
        checkCommentList,
    )
    const botAction = new BotAction('video-comment-bot-filter-status', checkCommentList)
    const callBotAction = new CallBotAction('video-comment-call-bot-filter-status', checkCommentList)
    const callUserAction = new CallUserAction('video-comment-call-user-filter-status', checkCommentList)
    const levelAction = new LevelAction(
        'video-comment-level-filter-status',
        'global-comment-level-filter-value',
        checkCommentList,
    )

    //=======================================================================================

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
                                usernameAction.add(username)
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

    // UI组件, 用户名过滤part
    const usernameItems = [
        // 启用 播放页UP主过滤
        new CheckboxItem({
            itemID: usernameAction.statusKey,
            description: '启用 评论区 用户名过滤\n(右键单击用户名)',
            enableFunc: async () => {
                // 启用右键菜单功能
                isContextMenuUsernameEnable = true
                contextMenuFunc()
                usernameAction.enable()
            },
            disableFunc: async () => {
                // 禁用右键菜单功能
                isContextMenuUsernameEnable = false
                usernameAction.disable()
            },
        }),
        // 编辑 用户名黑名单
        new ButtonItem({
            itemID: 'comment-username-edit-button',
            description: '编辑 用户名黑名单',
            name: '编辑',
            itemFunc: async () => {
                usernameAction.blacklist.show()
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-username-filter-group', '播放页 评论区 用户过滤', usernameItems),
    )

    // UI组件, 按类型过滤part
    const typeItems = [
        // 过滤 召唤AI的评论
        new CheckboxItem({
            itemID: callBotAction.statusKey,
            description: '过滤 召唤AI的评论',
            enableFunc: async () => {
                callBotAction.enable()
            },
            disableFunc: async () => {
                callBotAction.disable()
            },
        }),
        // 过滤 AI发布的评论
        new CheckboxItem({
            itemID: botAction.statusKey,
            description: '过滤 AI发布的评论',
            enableFunc: async () => {
                botAction.enable()
            },
            disableFunc: async () => {
                botAction.disable()
            },
        }),
        // 过滤 @其他用户的评论
        new CheckboxItem({
            itemID: callUserAction.statusKey,
            description: '过滤 @其他用户的评论',
            enableFunc: async () => {
                callUserAction.enable()
            },
            disableFunc: async () => {
                callUserAction.disable()
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(new Group('comment-type-filter-group', '播放页 评论区 按类型过滤', typeItems))

    // UI组件, 评论内容过滤part
    const contentItems = [
        // 启用 播放页关键词过滤
        new CheckboxItem({
            itemID: contentAction.statusKey,
            description: '启用 评论区 关键词过滤',
            enableFunc: async () => {
                contentAction.enable()
            },
            disableFunc: async () => {
                contentAction.disable()
            },
        }),
        // 编辑 关键词黑名单
        new ButtonItem({
            itemID: 'comment-content-edit-button',
            description: '编辑 评论关键词黑名单（支持正则）',
            name: '编辑',
            itemFunc: async () => {
                contentAction.blacklist.show()
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(new Group('comment-content-filter-group', '评论区 关键词过滤', contentItems))

    // UI组件, 等级过滤part
    const levelItems = [
        // 启用 播放页等级过滤
        new CheckboxItem({
            itemID: levelAction.statusKey,
            description: '启用 用户等级过滤',
            enableFunc: async () => {
                levelAction.enable()
            },
            disableFunc: async () => {
                levelAction.disable()
            },
        }),
        // 设定最低等级
        new NumberItem({
            itemID: levelAction.valueKey,
            description: '设定最低等级 (0~6)',
            defaultValue: 3,
            minValue: 0,
            maxValue: 6,
            disableValue: 0,
            unit: '',
            callback: async (value: number) => {
                levelAction.change(value)
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-level-filter-whitelist-group', '评论区 等级过滤', levelItems),
    )

    // UI组件, 白名单part
    const whitelistItems = [
        // 一级评论 免过滤
        new CheckboxItem({
            itemID: 'video-comment-root-whitelist-status',
            description: '一级评论(主评论) 免过滤',
            enableFunc: async () => {
                isRootCommentWhitelistEnable = true
                checkCommentList(true)
            },
            disableFunc: async () => {
                isRootCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 二级评论 免过滤
        new CheckboxItem({
            itemID: 'video-comment-sub-whitelist-status',
            description: '二级评论(回复) 免过滤',
            enableFunc: async () => {
                isSubCommentWhitelistEnable = true
                checkCommentList(true)
            },
            disableFunc: async () => {
                isSubCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // UP主的评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: 'video-comment-uploader-whitelist-status',
            description: 'UP主的评论 免过滤',
            defaultStatus: true,
            enableFunc: async () => {
                isUploaderCommentWhitelistEnable = true
                checkCommentList(true)
            },
            disableFunc: async () => {
                isUploaderCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 置顶评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: 'video-comment-pinned-whitelist-status',
            description: '置顶评论 免过滤',
            defaultStatus: true,
            enableFunc: async () => {
                isPinnedCommentWhitelistEnable = true
                checkCommentList(true)
            },
            disableFunc: async () => {
                isPinnedCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 笔记评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: 'video-comment-note-whitelist-status',
            description: '笔记/图片评论 免过滤',
            defaultStatus: true,
            enableFunc: async () => {
                isNoteCommentWhitelistEnable = true
                checkCommentList(true)
            },
            disableFunc: async () => {
                isNoteCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 含超链接的评论 免过滤, 默认开启
        new CheckboxItem({
            itemID: 'video-comment-link-whitelist-status',
            description: '含超链接的评论 免过滤\n（站内视频/URL）',
            defaultStatus: true,
            enableFunc: async () => {
                isLinkCommentWhitelistEnable = true
                checkCommentList(true)
            },
            disableFunc: async () => {
                isLinkCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-content-filter-whitelist-group', '评论区 白名单设置 (免过滤)', whitelistItems),
    )
}

export { videoPageCommentFilterGroupList }

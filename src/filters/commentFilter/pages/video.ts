import { Group } from '../../../components/group'
import { CheckboxItem, ButtonItem } from '../../../components/item'
import { debugCommentFilter as debug, error } from '../../../utils/logger'
import { isPageBangumi, isPagePlaylist, isPageVideo } from '../../../utils/pageType'
import { showEle, waitForEle } from '../../../utils/tool'
import { ContentAction, UsernameAction } from './actions/action'
import coreCommentFilterInstance, { CommentSelectorFunc } from '../filters/core'
import settings from '../../../settings'
import { ContextMenu } from '../../../components/contextmenu'
import { unsafeWindow } from '$'

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
    let commentListContainer: HTMLElement
    // 一级评论
    const rootCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            const username = comment.querySelector('.root-reply-container .user-name')?.textContent?.trim()
            return username ? username : null
        },
        content: (comment: HTMLElement): string | null => {
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
    }
    // 二级评论
    const subCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            const username = comment.querySelector('.sub-user-name')?.textContent?.trim()
            return username ? username : null
        },
        content: (comment: HTMLElement): string | null => {
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
    }

    // 新版评论区 一级评论
    const rootCommentSelectorFuncV2: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            const username =
                (comment as any).__data?.member?.uname ||
                comment.shadowRoot
                    ?.querySelector('bili-comment-renderer')
                    ?.shadowRoot?.querySelector('bili-comment-user-info')
                    ?.shadowRoot?.querySelector('#user-name')
                    ?.textContent?.trim()
            return username ? username : null
        },
        content: (comment: HTMLElement): string | null => {
            const content =
                (comment as any).__data?.content?.message?.trim() ||
                comment.shadowRoot
                    ?.querySelector('bili-comment-renderer')
                    ?.shadowRoot?.querySelector('bili-rich-text')
                    ?.shadowRoot?.querySelector('#contents')?.textContent
            return content ? content : null
        },
    }
    // 新版评论区 二级评论
    const subCommentSelectorFuncV2: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            const username =
                (comment as any).__data?.member?.uname ||
                comment.shadowRoot
                    ?.querySelector('bili-comment-user-info')
                    ?.shadowRoot?.querySelector('#user-name a')
                    ?.textContent?.trim()
            return username ? username : null
        },
        content: (comment: HTMLElement): string | null => {
            const contentNode = comment.shadowRoot?.querySelector('bili-rich-text')?.shadowRoot
            let content =
                (comment as any).__data?.content?.message?.trim() ||
                contentNode?.querySelector('#contents')?.textContent?.trim()
            // 忽略二级回复中@多用户情况
            content = content.replace(/^回复 @[^@ ]+? :/, '').trim()
            return content ? content : null
        },
    }

    // 检测评论列表
    const checkCommentList = (fullSite: boolean) => {
        if (!commentListContainer) {
            debug(`checkCommentList commentListContainer not exist`)
            return
        }
        try {
            if (isCommentV2()) {
                // shadow DOM 版评论区
                let rootComments: HTMLElement[] = []
                let subComments: HTMLElement[] = []

                // 默认 full 模式，二级评论翻页时会复用元素，标记已过滤无意义
                const shadowRoot = commentListContainer.querySelector('bili-comments')?.shadowRoot
                if (!shadowRoot) {
                    return
                }
                rootComments = Array.from(shadowRoot.querySelectorAll<HTMLElement>('bili-comment-thread-renderer'))

                rootComments.forEach((c) => {
                    const replys = c.shadowRoot
                        ?.querySelector('bili-comment-replies-renderer')
                        ?.shadowRoot?.querySelectorAll<HTMLElement>('bili-comment-reply-renderer')
                    if (replys?.length) {
                        subComments = subComments.concat(Array.from(replys))
                    }
                })

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
                                ?.shadowRoot?.querySelector(`a:not([href*="space.bilibili.com"])`))
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
                rootComments.length &&
                    coreCommentFilterInstance.checkAll(rootComments, false, rootCommentSelectorFuncV2)
                debug(`check ${rootComments.length} V2 root comments`)
                subComments.length && coreCommentFilterInstance.checkAll(subComments, false, subCommentSelectorFuncV2)
                debug(`check ${subComments.length} V2 sub comments`)
            } else {
                // 一级评论
                let rootComments, subComments
                if (fullSite) {
                    rootComments = commentListContainer.querySelectorAll<HTMLElement>(`.reply-item`)
                    subComments = commentListContainer.querySelectorAll<HTMLElement>(
                        `.sub-reply-item:not(.jump-link.user)`,
                    )
                } else {
                    rootComments = commentListContainer.querySelectorAll<HTMLElement>(
                        `.reply-item:not([${settings.filterSign}])`,
                    )
                    subComments = commentListContainer.querySelectorAll<HTMLElement>(
                        `.sub-reply-item:not(.jump-link.user):not([${settings.filterSign}])`,
                    )
                }

                // 白名单过滤
                rootComments = Array.from(rootComments).filter((e) => {
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
                subComments = Array.from(subComments).filter((e) => {
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
                rootComments.length &&
                    coreCommentFilterInstance.checkAll([...rootComments], true, rootCommentSelectorFunc)
                debug(`check ${rootComments.length} root comments`)
                subComments.length && coreCommentFilterInstance.checkAll([...subComments], true, subCommentSelectorFunc)
                debug(`check ${subComments.length} sub comments`)
            }
        } catch (err) {
            error(err)
            error('checkCommentList error')
        }
    }

    const checkV2 = () => {
        if (usernameAction.status || contentAction.status) {
            checkCommentList(true)
        }
    }
    /**
     * hook fetch, 获取评论相关API时触发检测
     * 多层 Shadow DOM 套娃对MutationObserver不友好
     * 切换视频会导致observe对象被替换
     * 使用监听一级二级评论载入方法触发评论区检测
     */
    // Todo: 统一全站fetch hook
    const origFetch = unsafeWindow.fetch
    unsafeWindow.fetch = async (input, init?) => {
        if (isCommentV2()) {
            if (
                typeof input === 'string' &&
                init?.method?.toUpperCase() === 'GET' &&
                input.includes('api.bilibili.com') &&
                (input.includes('/v2/reply/reply') || input.includes('/v2/reply/wbi/main'))
            ) {
                const resp = await origFetch(input, init)
                setTimeout(checkV2, 100)
                setTimeout(checkV2, 200)
                setTimeout(checkV2, 500)
                setTimeout(checkV2, 1000)
                setTimeout(checkV2, 2000)
                return resp
            }
        }
        return origFetch(input, init)
    }

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

    // 监听评论列表内部变化, 有变化时检测评论列表
    const watchCommentListContainer = () => {
        if (commentListContainer && !isCommentV2()) {
            if (usernameAction.status || contentAction.status) {
                checkCommentList(true)
            }
            const commentObserver = new MutationObserver(() => {
                if (usernameAction.status || contentAction.status) {
                    checkCommentList(false)
                }
            })
            commentObserver.observe(commentListContainer, { childList: true, subtree: true })
        }
    }

    try {
        waitForEle(document, '#comment, #comment-body, .playlist-comment', (node: HTMLElement): boolean => {
            return ['comment', 'comment-body'].includes(node.id) || node.className === 'playlist-comment'
        }).then((ele) => {
            if (ele) {
                commentListContainer = ele
                watchCommentListContainer()
            }
        })
    } catch (err) {
        error(err)
        error(`watch comment list ERROR`)
    }

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
            description: '含超链接的评论 免过滤\n（站内视频/URL/播放时间跳转）',
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

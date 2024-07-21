import { Group } from '../../../components/group'
import { CheckboxItem, ButtonItem, NumberItem } from '../../../components/item'
import { debugCommentFilter as debug, error } from '../../../utils/logger'
import { isPageDynamic, isPageSpace } from '../../../utils/pageType'
import { showEle, waitForEle } from '../../../utils/tool'
import { BotAction, CallBotAction, CallUserAction, ContentAction, LevelAction, UsernameAction } from './actions/action'
import coreCommentFilterInstance, { CommentSelectorFunc } from '../filters/core'
import settings from '../../../settings'
import { ContextMenu } from '../../../components/contextmenu'

const dynamicPageCommentFilterGroupList: Group[] = []

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

if (isPageDynamic() || isPageSpace()) {
    let commentListContainer: HTMLElement
    // 一级评论
    const rootCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            const uname = comment.querySelector('.root-reply-container .user-name')?.textContent?.trim()
            return uname ? uname : null
        },
        content: (comment: HTMLElement): string | null => {
            const content = comment
                .querySelector('.root-reply-container .reply-content')
                ?.textContent?.trim()
                .replace(/@[^@ ]+?( |$)/g, '')
                .trim()
            return content ? content : null
        },
        callUser: (comment: HTMLElement): string | null => {
            const uname = comment
                .querySelector('.root-reply-container .reply-content .jump-link.user')
                ?.textContent?.replace('@', '')
                .trim()
            return uname ? uname : null
        },
        level: (comment: HTMLElement): number | null => {
            const c = comment.querySelector('.root-reply-container .user-level')?.className
            const lv = c?.match(/level-([1-6])/)?.[1] // 忽略level-hardcore
            return lv ? parseInt(lv) : null
        },
    }
    // 二级评论
    const subCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: HTMLElement): string | null => {
            const uname = comment.querySelector('.sub-user-name')?.textContent?.trim()
            return uname ? uname : null
        },
        content: (comment: HTMLElement): string | null => {
            const content = comment
                .querySelector('.reply-content')
                ?.textContent?.trim()
                ?.replace(/@[^@ ]+?( |$)/g, '')
                .replace(/^回复 *:?/, '')
                .trim()
            return content ? content : null
        },
        callUser: (comment: HTMLElement): string | null => {
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
            const c = comment.querySelector('.sub-user-info .sub-user-level')?.className
            const lv = c?.match(/level-([1-6])/)?.[1] // 忽略level-hardcore
            return lv ? parseInt(lv) : null
        },
    }
    // 检测评论列表
    const checkCommentList = (fullSite: boolean) => {
        if (!commentListContainer) {
            debug(`checkCommentList commentListContainer not exist`)
            return
        }
        try {
            let rootComments, subComments
            if (fullSite) {
                rootComments = commentListContainer.querySelectorAll<HTMLElement>(`.reply-item`)
                subComments = commentListContainer.querySelectorAll<HTMLElement>(`.sub-reply-item:not(.jump-link.user)`)
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
                            `.root-reply-container .jump-link.dynamic-time,
                            .root-reply-container .jump-link.normal,
                            .root-reply-container .jump-link.dynamic`,
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
                            `.jump-link.dynamic-time,
                            .jump-link.normal,
                            .jump-link.dynamic`,
                        ))

                if (isWhite) {
                    showEle(e)
                }
                return !isWhite
            })
            rootComments.length && coreCommentFilterInstance.checkAll([...rootComments], true, rootCommentSelectorFunc)
            debug(`check ${rootComments.length} root comments`)
            subComments.length && coreCommentFilterInstance.checkAll([...subComments], true, subCommentSelectorFunc)
            debug(`check ${subComments.length} sub comments`)
        } catch (err) {
            error(err)
            error('checkCommentList error')
        }
    }

    // 配置 行为实例
    const usernameAction = new UsernameAction(
        'dynamic-comment-username-filter-status',
        'global-comment-username-filter-value',
        checkCommentList,
    )
    const contentAction = new ContentAction(
        'dynamic-comment-content-filter-status',
        'global-comment-content-filter-value',
        checkCommentList,
    )
    const levelAction = new LevelAction(
        'dynamic-comment-level-filter-status',
        'global-comment-level-filter-value',
        checkCommentList,
    )
    const botAction = new BotAction('dynamic-comment-bot-filter-status', checkCommentList)
    const callBotAction = new CallBotAction('dynamic-comment-call-bot-filter-status', checkCommentList)
    const callUserAction = new CallUserAction('dynamic-comment-call-user-filter-status', checkCommentList)

    // 监听评论列表内部变化, 有变化时检测评论列表
    const watchCommentListContainer = () => {
        const check = async (fullSite: boolean) => {
            if (usernameAction.status || contentAction.status) {
                checkCommentList(fullSite)
            }
        }
        if (commentListContainer) {
            // 初次全站检测
            check(true).then().catch()
            const commentObserver = new MutationObserver(() => {
                // 增量检测
                check(false).then().catch()
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
            if (e.target instanceof HTMLElement) {
                const target = e.target
                if (
                    isContextMenuUsernameEnable &&
                    (target.classList.contains('user-name') || target.classList.contains('sub-user-name'))
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
        })
        debug('contextMenuFunc listen contextmenu')
    }

    //=======================================================================================
    // 构建UI菜单

    // UI组件, 用户名过滤part
    const usernameItems = [
        // 启用 动态页UP主过滤
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
    dynamicPageCommentFilterGroupList.push(
        new Group('comment-username-filter-group', '动态页 评论区 用户过滤', usernameItems),
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
    dynamicPageCommentFilterGroupList.push(new Group('comment-type-filter-group', '评论区 按类型过滤', typeItems))

    // UI组件, 评论内容过滤part
    const contentItems = [
        // 启用 动态页关键词过滤
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
    dynamicPageCommentFilterGroupList.push(new Group('comment-content-filter-group', '评论区 关键词过滤', contentItems))

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
    dynamicPageCommentFilterGroupList.push(
        new Group('comment-level-filter-whitelist-group', '评论区 等级过滤', levelItems),
    )

    // UI组件, 白名单part
    const whitelistItems = [
        // 一级评论 免过滤
        new CheckboxItem({
            itemID: 'dynamic-comment-root-whitelist-status',
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
            itemID: 'dynamic-comment-sub-whitelist-status',
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
            itemID: 'dynamic-comment-uploader-whitelist-status',
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
            itemID: 'dynamic-comment-pinned-whitelist-status',
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
            itemID: 'dynamic-comment-note-whitelist-status',
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
            itemID: 'dynamic-comment-link-whitelist-status',
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
    dynamicPageCommentFilterGroupList.push(
        new Group('comment-content-filter-whitelist-group', '评论区 白名单设置 (免过滤)', whitelistItems),
    )
}

export { dynamicPageCommentFilterGroupList }

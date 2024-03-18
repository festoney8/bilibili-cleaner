import { GM_getValue } from '$'
import { Group } from '../../../components/group'
import { CheckboxItem, ButtonItem } from '../../../components/item'
import settings from '../../../settings'
import { debugCommentFilter as debug, error } from '../../../utils/logger'
import { isPageBangumi, isPageVideo } from '../../../utils/page-type'
import { showEle, waitForEle } from '../../../utils/tool'
import coreCommentFilterInstance, { CommentSelectorFunc } from '../filters/core'
import { ContentAction, UsernameAction } from './actions/action'

const videoPageCommentFilterGroupList: Group[] = []

// 右键菜单功能
// let isContextMenuFuncRunning = false
// let isContextMenuUsernameEnable = false

// 白名单功能开关
let isRootCommentWhitelistEnable: boolean = GM_getValue('BILICLEANER_video-comment-root-whitelist-status', false)
let isSubCommentWhitelistEnable: boolean = GM_getValue('BILICLEANER_video-comment-sub-whitelist-status', false)
let isUploaderCommentWhitelistEnable: boolean = GM_getValue('BILICLEANER_video-comment-uploader-whitelist-status', true)
let isPinnedCommentWhitelistEnable: boolean = GM_getValue('BILICLEANER_video-comment-pinned-whitelist-status', true)
let isNoteCommentWhitelistEnable: boolean = GM_getValue('BILICLEANER_video-comment-note-whitelist-status', true)
let isLinkCommentWhitelistEnable: boolean = GM_getValue('BILICLEANER_video-comment-link-whitelist-status', true)

if (isPageVideo() || isPageBangumi()) {
    let commentListContainer: HTMLElement
    // 一级评论
    const rootCommentSelectorFunc: CommentSelectorFunc = {
        username: (comment: Element): string | null => {
            const username = comment.querySelector('.root-reply-container .user-name')?.textContent?.trim()
            return username ? username : null
        },
        content: (comment: Element): string | null => {
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
        username: (comment: Element): string | null => {
            const username = comment.querySelector('.sub-user-name')?.textContent?.trim()
            return username ? username : null
        },
        content: (comment: Element): string | null => {
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
    // 检测评论列表
    const checkCommentList = (fullSite: boolean) => {
        if (!commentListContainer) {
            debug(`checkCommentList commentListContainer not exist`)
            return
        }
        try {
            // 一级评论
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
            debug(rootComments.length, subComments.length)

            // 白名单过滤
            rootComments = Array.from(rootComments).filter((e) => {
                const isWhite =
                    isRootCommentWhitelistEnable ||
                    (isUploaderCommentWhitelistEnable && e.querySelector('.root-reply-container .up-icon')) ||
                    (isNoteCommentWhitelistEnable && e.querySelector('.root-reply-container .note-prefix')) ||
                    (isPinnedCommentWhitelistEnable && e.querySelector('.root-reply-container .top-icon')) ||
                    (isLinkCommentWhitelistEnable &&
                        e.querySelector(
                            '.root-reply-container .jump-link.video-time, .root-reply-container .jump-link.normal, .root-reply-container .jump-link.video',
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
                            '.root-reply-container .jump-link.video-time, .root-reply-container .jump-link.normal, .root-reply-container .jump-link.video',
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

    // 监听评论列表内部变化, 有变化时检测评论列表
    const watchCommentListContainer = () => {
        if (commentListContainer) {
            checkCommentList(true)
            const commentObverser = new MutationObserver(() => {
                checkCommentList(false)
            })
            commentObverser.observe(commentListContainer, { childList: true, subtree: true })
        }
    }

    try {
        waitForEle(document, '.reply-warp', (node: Node): boolean => {
            return node instanceof HTMLElement && (node as HTMLElement).className === 'reply-warp'
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
    //=======================================================================================

    // // 右键监听函数, 右键单击指定元素时修改右键菜单, 用于屏蔽评论用户
    // const contextMenuFunc = () => {
    //     if (isContextMenuFuncRunning) {
    //         return
    //     }
    //     isContextMenuFuncRunning = true
    //     // 监听右键单击
    //     document.addEventListener('contextmenu', (e) => {
    //         if (e.target instanceof HTMLElement) {
    //             // debug(e.target.classList)
    //             const target = e.target
    //             if (
    //                 isContextMenuUsernameEnable &&
    //                 target.classList.contains('name')
    //                 // target.closest('.upname span.name') === target
    //             ) {
    //                 // 命中UP主
    //                 const uploader = target.textContent
    //                 if (uploader) {
    //                     e.preventDefault()
    //                     const onclickBlack = () => {
    //                         usernameAction.add(uploader)
    //                     }
    //                     contextMenuInstance.registerMenu(`◎ 屏蔽UP主：${uploader}`, onclickBlack)
    //                     contextMenuInstance.show(e.clientX, e.clientY)
    //                 }
    //             } else if (
    //                 isContextMenuBvidEnable &&
    //                 target.classList.contains('title')
    //                 // target.closest('.info > a > p') === target
    //             ) {
    //                 // 命中评论标题, 提取bvid
    //                 const href = target.parentElement?.getAttribute('href')
    //                 if (href) {
    //                     const bvid = matchBvid(href)
    //                     if (bvid) {
    //                         e.preventDefault()
    //                         const onclick = () => {
    //                             commentBvidAction.add(bvid)
    //                         }
    //                         contextMenuInstance.registerMenu(`屏蔽评论：${bvid}`, onclick)
    //                         contextMenuInstance.show(e.clientX, e.clientY)
    //                     }
    //                 }
    //             } else {
    //                 contextMenuInstance.hide()
    //             }
    //         }
    //     })
    //     // 监听左键单击，关闭右键菜单
    //     document.addEventListener('click', () => {
    //         contextMenuInstance.hide()
    //     })
    //     debug('contextMenuFunc listen contextmenu')
    // }

    //=======================================================================================
    // 构建UI菜单

    // UI组件, 用户名过滤part
    const usernameItems = [
        // 启用 播放页UP主过滤
        new CheckboxItem({
            itemID: usernameAction.statusKey,
            description: '启用 评论区 用户名过滤',
            itemFunc: () => {
                // 启用右键菜单功能
                // isContextMenuUsernameEnable = true
                // contextMenuFunc()
                usernameAction.enable()
            },
            callback: () => {
                // 禁用右键菜单功能
                // isContextMenuUsernameEnable = false
                usernameAction.disable()
            },
        }),
        // 编辑 用户名黑名单
        new ButtonItem({
            itemID: 'comment-username-edit-button',
            description: '编辑 用户名黑名单',
            name: '编辑',
            itemFunc: () => {
                usernameAction.blacklist.show()
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-username-filter-group', '播放页 评论用户过滤 (右键单击用户名)', usernameItems),
    )

    // UI组件, 评论内容过滤part
    const contentItems = [
        // 启用 播放页关键词过滤
        new CheckboxItem({
            itemID: contentAction.statusKey,
            description: '启用 评论区 关键词过滤',
            itemFunc: () => {
                contentAction.enable()
            },
            callback: () => {
                contentAction.disable()
            },
        }),
        // 编辑 关键词黑名单
        new ButtonItem({
            itemID: 'comment-content-edit-button',
            description: '编辑 评论关键词黑名单（支持正则）',
            name: '编辑',
            itemFunc: () => {
                contentAction.blacklist.show()
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-content-filter-group', '播放页 评论关键词过滤', contentItems),
    )

    // UI组件, 白名单part
    const whitelistItems = [
        // 一级评论 免过滤
        new CheckboxItem({
            itemID: 'video-comment-root-whitelist-status',
            description: '一级评论(主评论) 免过滤',
            itemFunc: () => {
                isRootCommentWhitelistEnable = true
                checkCommentList(true)
            },
            callback: () => {
                isRootCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 二级评论 免过滤
        new CheckboxItem({
            itemID: 'video-comment-sub-whitelist-status',
            description: '二级评论(回复) 免过滤',
            itemFunc: () => {
                isSubCommentWhitelistEnable = true
                checkCommentList(true)
            },
            callback: () => {
                isSubCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // UP主的评论 免过滤
        new CheckboxItem({
            itemID: 'video-comment-uploader-whitelist-status',
            description: 'UP主的评论 免过滤',
            itemFunc: () => {
                isUploaderCommentWhitelistEnable = true
                checkCommentList(true)
            },
            callback: () => {
                isUploaderCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 置顶评论 免过滤
        new CheckboxItem({
            itemID: 'video-comment-pinned-whitelist-status',
            description: '置顶评论 免过滤',
            itemFunc: () => {
                isPinnedCommentWhitelistEnable = true
                checkCommentList(true)
            },
            callback: () => {
                isPinnedCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 笔记评论 免过滤
        new CheckboxItem({
            itemID: 'video-comment-note-whitelist-status',
            description: '笔记评论/图片评论 免过滤',
            itemFunc: () => {
                isNoteCommentWhitelistEnable = true
                checkCommentList(true)
            },
            callback: () => {
                isNoteCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
        // 含超链接的评论 免过滤
        new CheckboxItem({
            itemID: 'video-comment-link-whitelist-status',
            description: '含超链接的评论 免过滤',
            itemFunc: () => {
                isLinkCommentWhitelistEnable = true
                checkCommentList(true)
            },
            callback: () => {
                isLinkCommentWhitelistEnable = false
                checkCommentList(true)
            },
        }),
    ]
    videoPageCommentFilterGroupList.push(
        new Group('comment-content-filter-whitelist-group', '白名单设置 (免过滤)', whitelistItems),
    )
}

export { videoPageCommentFilterGroupList }

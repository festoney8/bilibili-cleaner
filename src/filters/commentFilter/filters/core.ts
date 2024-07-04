import settings from '../../../settings'
import { error, log } from '../../../utils/logger'
import { hideEle, isEleHide, showEle } from '../../../utils/tool'
import contentFilterInstance from './subfilters/content'
import usernameFilterInstance from './subfilters/username'

export interface ICommentSubFilter {
    isEnable: boolean
    setStatus(status: boolean): void
    setParams(value: string[]): void
    addParam?(value: string): void
    check(value: string): Promise<string>
}

export type CommentSelectorFunc = {
    username?: (comment: HTMLElement) => string | null
    content?: (comment: HTMLElement) => string | null
}

interface CommentInfo {
    username?: string | undefined
    content?: string | undefined
}

class CoreCommentFilter {
    /**
     * 检测评论列表中每个评论是否合法, 并隐藏不合法的评论
     * 对选取出的 发布人/评论内容 进行并发检测
     * @param comments 评论列表
     * @param sign 是否标记已过滤项
     * @param selectorFunc 使用selector选取元素的函数
     */
    checkAll(comments: HTMLElement[], sign = true, selectorFunc: CommentSelectorFunc) {
        try {
            const checkContent = contentFilterInstance.isEnable && selectorFunc.content !== undefined
            const checkUsername = usernameFilterInstance.isEnable && selectorFunc.username !== undefined

            if (!checkContent && !checkUsername) {
                // 黑名单全部关闭时 恢复全部评论
                comments.forEach((comment) => showEle(comment))
                return
            }

            comments.forEach((comment) => {
                const info: CommentInfo = {}

                // 构建黑白名单任务, 调用各个子过滤器的check()方法检测
                const blackTasks: Promise<string>[] = []
                const whiteTasks: Promise<string>[] = []
                if (checkContent) {
                    const content = selectorFunc.content!(comment)
                    if (content) {
                        blackTasks.push(contentFilterInstance.check(content))
                        info.content = content
                    }
                }
                if (checkUsername) {
                    const username = selectorFunc.username!(comment)
                    if (username) {
                        blackTasks.push(usernameFilterInstance.check(username))
                        info.username = username
                    }
                }

                // 执行检测
                Promise.all(blackTasks)
                    .then((_result) => {
                        // 未命中黑名单
                        // debug(_result)
                        showEle(comment)
                        Promise.all(whiteTasks)
                            .then((_result) => {})
                            .catch((_result) => {})
                    })
                    .catch((_result) => {
                        // 命中黑名单
                        // debug(_result)
                        if (whiteTasks.length) {
                            Promise.all(whiteTasks)
                                .then((_result) => {
                                    // 命中黑名单，未命中白名单
                                    // debug(_result)
                                    if (!isEleHide(comment)) {
                                        log(`hide comment\nusername: ${info.username}\ncontent: ${info.content}`)
                                    }
                                    hideEle(comment)
                                })
                                .catch((_result) => {
                                    // 命中白名单
                                    // debug(_result)
                                    showEle(comment)
                                })
                        } else {
                            if (!isEleHide(comment)) {
                                log(`hide comment\nusername: ${info.username}\ncontent: ${info.content}`)
                            }
                            hideEle(comment)
                        }
                    })

                // 标记已过滤评论
                sign && comment.setAttribute(settings.filterSign, '')
            })
        } catch (err) {
            error(err)
            error('CoreCommentFilter checkAll error')
        }
    }
}

const coreCommentFilterInstance = new CoreCommentFilter()
export default coreCommentFilterInstance

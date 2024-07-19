import { GM_getValue } from '$'
import { WordList } from '../../../../components/wordlist'
import commentFilterAgencyInstance from '../../agency/agency'
import contentFilterInstance from '../../filters/subfilters/content'
import usernameFilterInstance from '../../filters/subfilters/username'

// 定义各种黑名单功能、白名单功能的属性和行为
interface CommentFilterAction {
    statusKey: string
    status: boolean
    valueKey?: string
    value?: number | string | string[]
    // 检测评论列表的函数
    checkCommentList(fullSite: boolean): void
    blacklist?: WordList
    whitelist?: WordList

    enable(): void
    disable(): void
    change?(value: number): void
    add?(value: string): void
    edit?(value: string[]): void
}

/**
 * 将类的成员函数作为参数传递时，【必须】使用箭头函数包裹，避免出现this上下文丢失问题
 */

export class UsernameAction implements CommentFilterAction {
    statusKey: string
    valueKey: string
    checkCommentList: (fullSite: boolean) => void
    status: boolean
    value: string[]
    blacklist: WordList

    /**
     * 评论区用户过滤操作
     * @param statusKey 是否启用的GM key
     * @param valueKey 存储数据的GM key
     * @param checkCommentList 检测评论列表函数
     */
    constructor(statusKey: string, valueKey: string, checkCommentList: (fullSite: boolean) => void) {
        this.statusKey = statusKey
        this.valueKey = valueKey
        this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
        this.value = GM_getValue(`BILICLEANER_${this.valueKey}`, [])
        this.checkCommentList = checkCommentList

        // 配置子过滤器
        usernameFilterInstance.setStatus(this.status)
        usernameFilterInstance.setParams(this.value)
        // 初始化黑名单, callback触发edit, 必需用箭头函数
        this.blacklist = new WordList(
            this.valueKey,
            '用户名 黑名单',
            '每行一个用户名，保存时自动去重',
            (values: string[]) => {
                this.edit(values)
            },
        )
    }

    enable() {
        commentFilterAgencyInstance.notifyUsername('enable')
        this.checkCommentList(true)
        this.status = true
    }
    disable() {
        commentFilterAgencyInstance.notifyUsername('disable')
        this.checkCommentList(true)
        this.status = false
    }
    add(value: string) {
        this.blacklist.addValue(value)
        commentFilterAgencyInstance.notifyUsername('add', value)
        this.checkCommentList(true)
    }
    edit(values: string[]) {
        commentFilterAgencyInstance.notifyUsername('edit', values)
        this.checkCommentList(true)
    }
}

export class ContentAction implements CommentFilterAction {
    statusKey: string
    valueKey: string
    checkCommentList: (fullSite: boolean) => void
    status: boolean
    value: string[]
    blacklist: WordList

    /**
     * 评论内容关键字过滤操作
     * @param statusKey 是否启用的GM key
     * @param valueKey 存储数据的GM key
     * @param checkCommentList 检测评论列表函数
     */
    constructor(statusKey: string, valueKey: string, checkCommentList: (fullSite: boolean) => void) {
        this.statusKey = statusKey
        this.valueKey = valueKey
        this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
        this.value = GM_getValue(`BILICLEANER_${this.valueKey}`, [])
        this.checkCommentList = checkCommentList

        // 配置子过滤器
        contentFilterInstance.setStatus(this.status)
        contentFilterInstance.setParams(this.value)
        // 初始化黑名单, callback触发edit
        this.blacklist = new WordList(
            this.valueKey,
            '评论关键词 黑名单',
            `每行一个关键词或正则，不区分大小写\n正则无需flag（默认iv模式）语法：/abc|\\d+/`,
            (values: string[]) => {
                this.edit(values)
            },
        )
    }

    enable() {
        // 告知agency
        commentFilterAgencyInstance.notifyContent('enable')
        // 触发全站过滤
        this.checkCommentList(true)
        this.status = true
    }
    disable() {
        commentFilterAgencyInstance.notifyContent('disable')
        this.checkCommentList(true)
        this.status = false
    }
    add(value: string) {
        this.blacklist.addValue(value)
        commentFilterAgencyInstance.notifyContent('add', value)
        this.checkCommentList(true)
    }
    edit(values: string[]) {
        commentFilterAgencyInstance.notifyContent('edit', values)
        this.checkCommentList(true)
    }
}

export class BotAction implements CommentFilterAction {
    statusKey: string
    status: boolean
    checkCommentList: (fullSite: boolean) => void

    /**
     * 屏蔽AI发布的评论
     * @param statusKey 是否启用的GM key
     * @param checkCommentList 检测评论列表函数
     */
    constructor(statusKey: string, checkCommentList: (fullSite: boolean) => void) {
        this.statusKey = statusKey
        this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
        this.checkCommentList = checkCommentList

        contentFilterInstance.setStatus(this.status)
    }

    enable() {
        commentFilterAgencyInstance.notifyBot('enable')
        this.checkCommentList(true)
        this.status = true
    }
    disable() {
        commentFilterAgencyInstance.notifyBot('disable')
        this.checkCommentList(true)
        this.status = false
    }
}

export class CallBotAction implements CommentFilterAction {
    statusKey: string
    status: boolean
    checkCommentList: (fullSite: boolean) => void

    /**
     * 过滤召唤AI的评论
     * @param statusKey 是否启用的GM key
     * @param checkCommentList 检测评论列表函数
     */
    constructor(statusKey: string, checkCommentList: (fullSite: boolean) => void) {
        this.statusKey = statusKey
        this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
        this.checkCommentList = checkCommentList

        contentFilterInstance.setStatus(this.status)
    }

    enable() {
        commentFilterAgencyInstance.notifyCallBot('enable')
        this.checkCommentList(true)
        this.status = true
    }
    disable() {
        commentFilterAgencyInstance.notifyCallBot('disable')
        this.checkCommentList(true)
        this.status = false
    }
}

export class CallUserAction implements CommentFilterAction {
    statusKey: string
    status: boolean
    checkCommentList: (fullSite: boolean) => void

    /**
     * 过滤AT其他用户的评论
     * @param statusKey 是否启用的GM key
     * @param checkCommentList 检测评论列表函数
     */
    constructor(statusKey: string, checkCommentList: (fullSite: boolean) => void) {
        this.statusKey = statusKey
        this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
        this.checkCommentList = checkCommentList

        contentFilterInstance.setStatus(this.status)
    }

    enable() {
        commentFilterAgencyInstance.notifyCallUser('enable')
        this.checkCommentList(true)
        this.status = true
    }
    disable() {
        commentFilterAgencyInstance.notifyCallUser('disable')
        this.checkCommentList(true)
        this.status = false
    }
}

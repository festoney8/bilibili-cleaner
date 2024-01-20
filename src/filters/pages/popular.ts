import { GM_getValue } from '$'
import { debug, error } from '../../utils/logger'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import { ButtonItem, CheckboxItem } from '../../components/item'
import { Group } from '../../components/group'
import settings from '../../settings'
import bvidFilterInstance from '../filters/subfilters/bvid'
import titleKeywordFilterInstance from '../filters/subfilters/titleKeyword'
import uploaderFilterInstance from '../filters/subfilters/uploader'
import { isPagePopular } from '../../utils/page-type'
import uploaderAgencyInstance from '../agency/uploader'
import contextMenuInstance from '../../components/contextmenu'
import bvidAgencyInstance from '../agency/bvid'
import titleKeywordAgencyInstance from '../agency/titleKeyword'
import { WordList } from '../../components/wordlist'
import { matchBvid } from '../../utils/misc'

// 定义各种过滤功能的属性和行为
export interface Action {
    readonly statusKey: string
    readonly valueKey: string
    status: boolean
    value: number | string | string[]
    blacklist?: WordList
    enable(): void
    disable(): void
    change?(value: number): void
    add?(value: string): void
    edit?(value: string[]): void
}

const popularFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false
let contextMenuFunc: () => void

if (isPagePopular()) {
    // 页面载入后监听流程

    // 视频列表外层
    let videoListContainer: HTMLElement
    // 3. 检测视频列表
    const checkVideoList = (fullSite = false) => {
        debug('checkVideoList start')
        if (!videoListContainer) {
            debug(`checkVideoList videoListContainer not exist`)
            return
        }
        try {
            // 热门视频
            let hotVideos: NodeListOf<HTMLElement>
            // 每周必看
            let weeklyVideos: NodeListOf<HTMLElement>
            // 排行榜
            let rankVideos: NodeListOf<HTMLElement>
            if (!fullSite) {
                hotVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `.card-list .video-card:not([${settings.filterSign}])`,
                )
                weeklyVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `.video-list .video-card:not([${settings.filterSign}])`,
                )
                rankVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `.rank-list .rank-item:not([${settings.filterSign}])`,
                )
            } else {
                hotVideos = videoListContainer.querySelectorAll<HTMLElement>(`.card-list .video-card`)
                weeklyVideos = videoListContainer.querySelectorAll<HTMLElement>(`.video-list .video-card`)
                rankVideos = videoListContainer.querySelectorAll<HTMLElement>(`.rank-list .rank-item`)
            }

            // 构建SelectorFunc
            const rcmdSelectorFunc: SelectorFunc = {
                // popular页 无duration
                titleKeyword: (video: Element): string | null => {
                    const titleKeyword =
                        video.querySelector('.video-card__info .video-name')?.getAttribute('title') ||
                        video.querySelector('.video-card__info .video-name')?.textContent ||
                        video.querySelector('.info a.title')?.getAttribute('title') ||
                        video.querySelector('.info a.title')?.textContent
                    return titleKeyword ? titleKeyword : null
                },
                bvid: (video: Element): string | null => {
                    const href =
                        video.querySelector('.video-card__content > a')?.getAttribute('href') ||
                        video.querySelector('.content > .img > a')?.getAttribute('href')
                    if (href) {
                        return matchBvid(href)
                    }
                    return null
                },
                uploader: (video: Element): string | null => {
                    const uploader =
                        video.querySelector('span.up-name__text')?.textContent ||
                        video.querySelector('span.up-name__text')?.getAttribute('title') ||
                        video.querySelector('.data-box.up-name')?.textContent
                    return uploader ? uploader : null
                },
            }
            const feedSelectorFunc = rcmdSelectorFunc
            hotVideos.length && coreFilterInstance.checkAll([...hotVideos], true, feedSelectorFunc)
            debug(`checkVideoList check ${hotVideos.length} hotVideos`)
            weeklyVideos.length && coreFilterInstance.checkAll([...weeklyVideos], true, feedSelectorFunc)
            debug(`checkVideoList check ${weeklyVideos.length} weeklyVideos`)
            rankVideos.length && coreFilterInstance.checkAll([...rankVideos], true, feedSelectorFunc)
            debug(`checkVideoList check ${rankVideos.length} rankVideos`)
        } catch (err) {
            error(err)
            error('checkVideoList error')
        }
        debug('checkVideoList end')
    }
    // 2. 监听 videoListContainer 内部变化, 有变化时检测视频列表
    const watchVideoListContainer = () => {
        if (videoListContainer) {
            debug('watchVideoListContainer start')
            // 初次全站检测
            checkVideoList(true)
            const videoObverser = new MutationObserver(() => {
                // 增量检测
                checkVideoList(false)
            })
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debug('watchVideoListContainer OK')
        }
    }
    // 1. 检测/监听 videoListContainer 出现, 出现后监听 videoListContainer 内部变化
    const waitForVideoListContainer = () => {
        // 检测/监听视频列表父节点出现
        videoListContainer = document.querySelector('#app') as HTMLElement
        if (videoListContainer) {
            debug('videoListContainer exist')
            watchVideoListContainer()
        } else {
            const obverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as HTMLElement).id === 'app') {
                                debug('videoListContainer appear')
                                obverser.disconnect()
                                videoListContainer = document.querySelector('#app') as HTMLElement
                                watchVideoListContainer()
                            }
                        })
                    }
                })
            })
            obverser.observe(document, { childList: true, subtree: true })
            debug('videoListContainer obverser start')
        }
    }
    try {
        waitForVideoListContainer()
    } catch (err) {
        error(err)
        error(`waitForVideoListContainer ERROR`)
    }

    //=======================================================================================
    // 配置 行为实例
    class PopularUploaderAction implements Action {
        readonly statusKey = 'popular-uploader-filter-status'
        readonly valueKey = 'global-uploader-filter-value'
        status = false
        value: string[] = []
        blacklist: WordList

        constructor() {
            this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
            this.value = GM_getValue(`BILICLEANER_${this.valueKey}`, [])
            // 配置子过滤器
            uploaderFilterInstance.setStatus(this.status)
            uploaderFilterInstance.setParams(this.value)
            // 初始化黑名单, callback触发edit
            this.blacklist = new WordList(this.valueKey, 'UP主 黑名单', this.edit)
        }

        enable() {
            // 修改右键监听函数状态
            isContextMenuUploaderEnable = true
            contextMenuFunc()
            // 告知agency
            uploaderAgencyInstance.notify('enable')
            // 触发全站过滤
            checkVideoList(true)
        }
        disable() {
            // 修改右键监听函数状态
            isContextMenuUploaderEnable = false
            uploaderAgencyInstance.notify('disable')
            checkVideoList(true)
        }
        add(value: string) {
            this.blacklist.addValue(value)
            uploaderAgencyInstance.notify('add', value)
            checkVideoList(true)
        }
        // edit由编辑黑名单的保存动作回调
        edit(values: string[]) {
            // this.blacklist.saveList(values)
            uploaderAgencyInstance.notify('edit', values)
            checkVideoList(true)
        }
    }
    class PopularBvidAction implements Action {
        readonly statusKey = 'popular-bvid-filter-status'
        readonly valueKey = 'global-bvid-filter-value'
        status = false
        value: string[] = []
        blacklist: WordList

        constructor() {
            this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
            this.value = GM_getValue(`BILICLEANER_${this.valueKey}`, [])
            // 配置子过滤器
            bvidFilterInstance.setStatus(this.status)
            bvidFilterInstance.setParams(this.value)
            // 初始化黑名单, callback触发edit
            this.blacklist = new WordList(this.valueKey, 'BV号 黑名单', this.edit)
        }

        enable() {
            // 启用右键菜单功能
            isContextMenuBvidEnable = true
            contextMenuFunc()
            // 告知agency
            bvidAgencyInstance.notify('enable')
            // 触发全站过滤
            checkVideoList(true)
        }
        disable() {
            // 禁用右键菜单功能
            isContextMenuBvidEnable = false
            bvidAgencyInstance.notify('disable')
            checkVideoList(true)
        }
        add(value: string) {
            this.blacklist.addValue(value)
            bvidAgencyInstance.notify('add', value)
            checkVideoList(true)
        }
        // edit由编辑黑名单的保存动作回调
        edit(values: string[]) {
            // this.blacklist.saveList(values)
            bvidAgencyInstance.notify('edit', values)
            checkVideoList(true)
        }
    }
    class PopularTitleKeywordAction implements Action {
        readonly statusKey = 'popular-title-keyword-filter-status'
        readonly valueKey = 'global-title-keyword-filter-value'
        status = false
        value: string[] = []
        blacklist: WordList

        constructor() {
            this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
            this.value = GM_getValue(`BILICLEANER_${this.valueKey}`, [])
            // 配置子过滤器
            titleKeywordFilterInstance.setStatus(this.status)
            titleKeywordFilterInstance.setParams(this.value)
            // 初始化黑名单, callback触发edit
            this.blacklist = new WordList(this.valueKey, '标题关键词 黑名单', this.edit)
        }

        enable() {
            // 告知agency
            titleKeywordAgencyInstance.notify('enable')
            // 触发全站过滤
            checkVideoList(true)
        }
        disable() {
            titleKeywordAgencyInstance.notify('disable')
            checkVideoList(true)
        }
        add(value: string) {
            this.blacklist.addValue(value)
            titleKeywordAgencyInstance.notify('add', value)
            checkVideoList(true)
        }
        // edit由编辑黑名单的保存动作回调
        edit(values: string[]) {
            // this.blacklist.saveList(values)
            titleKeywordAgencyInstance.notify('edit', values)
            checkVideoList(true)
        }
    }

    // Todo: PopularWhiteListAction implements Action {}

    const popularUploaderAction = new PopularUploaderAction()
    const popularBvidAction = new PopularBvidAction()
    const popularTitleKeywordAction = new PopularTitleKeywordAction()

    //=======================================================================================

    // 右键监听函数, 热门页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
    contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            if (e.target instanceof HTMLElement) {
                const target = e.target
                if (
                    isContextMenuUploaderEnable &&
                    (target.classList.contains('up-name__text') || target.classList.contains('up-name'))
                ) {
                    // 命中UP主
                    const uploader = target.textContent
                    if (uploader) {
                        e.preventDefault()
                        const onclick = () => {
                            popularUploaderAction.add(uploader)
                        }
                        contextMenuInstance.registerMenu(`屏蔽UP主：${uploader}`, onclick)
                        contextMenuInstance.show(e.clientX, e.clientY)
                    }
                } else if (
                    isContextMenuBvidEnable &&
                    ((target.classList.contains('title') && target.closest('.info a') === target) ||
                        target.classList.contains('video-name') ||
                        target.classList.contains('lazy-image'))
                ) {
                    // 命中视频图片/视频标题, 提取bvid
                    let href = target.getAttribute('href') || target.parentElement?.getAttribute('href')
                    if (!href) {
                        href = target
                            .closest('.video-card')
                            ?.querySelector('.video-card__content > a')
                            ?.getAttribute('href')
                    }
                    if (href) {
                        const bvid = matchBvid(href)
                        if (bvid) {
                            e.preventDefault()
                            const onclick = () => {
                                popularBvidAction.add(bvid)
                            }
                            contextMenuInstance.registerMenu(`屏蔽视频：${bvid}`, onclick)
                            contextMenuInstance.show(e.clientX, e.clientY)
                        }
                    }
                } else {
                    contextMenuInstance.hide()
                }
            }
        })
        // 监听左键单击，关闭右键菜单
        document.addEventListener('click', () => {
            contextMenuInstance.hide()
        })
        debug('contextMenuFunc listen contextmenu')
    }

    //=======================================================================================
    // 构建UI菜单
    const titleKeywordItems: (CheckboxItem | ButtonItem)[] = []
    const bvidItems: (CheckboxItem | ButtonItem)[] = []
    const uploaderItems: (CheckboxItem | ButtonItem)[] = []

    // UI组件, UP主过滤part
    {
        uploaderItems.push(
            new CheckboxItem(
                popularUploaderAction.statusKey,
                '启用 热门页UP主过滤',
                false,
                popularUploaderAction.enable,
                false,
                null,
                popularUploaderAction.disable,
            ),
        )
        // 按钮功能：打开uploader黑名单编辑框
        uploaderItems.push(
            new ButtonItem(
                'popular-uploader-filter-edit-button',
                '编辑 UP主黑名单',
                '编辑',
                // 按钮功能
                () => popularUploaderAction.blacklist.show(),
            ),
        )
    }
    popularFilterGroupList.push(
        new Group('popular-uploader-filter-group', '热门页 UP主过滤 (右键单击UP主)', uploaderItems),
    )

    // UI组件, 标题关键词过滤part
    {
        titleKeywordItems.push(
            new CheckboxItem(
                popularTitleKeywordAction.statusKey,
                '启用 热门页关键词过滤',
                false,
                popularTitleKeywordAction.enable,
                false,
                null,
                popularTitleKeywordAction.disable,
            ),
        )
        // 按钮功能：打开titleKeyword黑名单编辑框
        titleKeywordItems.push(
            new ButtonItem(
                'popular-test-button',
                '编辑 关键词黑名单',
                '编辑',
                // 按钮功能
                () => popularTitleKeywordAction.blacklist.show(),
            ),
        )
    }
    popularFilterGroupList.push(
        new Group('popular-title-keyword-filter-group', '热门页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤part
    {
        bvidItems.push(
            new CheckboxItem(
                popularBvidAction.statusKey,
                '启用 热门页BV号过滤',
                false,
                popularBvidAction.enable,
                false,
                null,
                popularBvidAction.disable,
            ),
        )
        // 按钮功能：打开bvid黑名单编辑框
        bvidItems.push(
            new ButtonItem(
                'popular-bvid-filter-edit-button',
                '编辑 BV号黑名单',
                '编辑',
                // 按钮功能
                () => popularBvidAction.blacklist.show(),
            ),
        )
    }
    popularFilterGroupList.push(new Group('popular-bvid-filter-group', '热门页 视频BV号过滤 (右键单击标题)', bvidItems))
}

export { popularFilterGroupList }

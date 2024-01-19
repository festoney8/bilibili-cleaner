import { GM_getValue } from '$'
import { debug, error } from '../../utils/logger'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { Group } from '../../components/group'
import settings from '../../settings'
import bvidFilterInstance from '../filters/subfilters/bvid'
import durationFilterInstance from '../filters/subfilters/duration'
import titleKeywordFilterInstance from '../filters/subfilters/titleKeyword'
import uploaderFilterInstance from '../filters/subfilters/uploader'
import { isPageHomepage } from '../../utils/page-type'
import durationAgencyInstance from '../agency/duration'
import uploaderAgencyInstance from '../agency/uploader'
import contextMenuInstance from '../../components/contextmenu'
import bvidAgencyInstance from '../agency/bvid'
import titleKeywordAgencyInstance from '../agency/titleKeyword'
import { WordList } from '../../components/wordlist'

const homepageFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false
let contextMenuFunc: () => void

if (isPageHomepage()) {
    // 页面载入后监听流程

    // 视频列表外层
    let videoListContainer: HTMLElement
    // 3. 检测视频列表
    const checkVideoList = (fullSite = false) => {
        debug('checkVideoList start')
        const bvidPattern = /video\/(BV[1-9A-HJ-NP-Za-km-z]+)/
        try {
            let feedVideos: NodeListOf<HTMLElement>
            let rcmdVideos: NodeListOf<HTMLElement>
            if (!fullSite) {
                // 选取增量视频
                // feed: 10个顶部推荐位, 不含已过滤
                feedVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `:scope > .feed-card:not([${settings.filterSign}])`,
                )
                // rcmd: 瀑布推荐流, 不含feed, 不含已过滤, 不含未载入
                rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(
                    `:scope > .bili-video-card.is-rcmd:not([${settings.filterSign}])`,
                )
            } else {
                // 选取全站, 含已过滤的
                feedVideos = videoListContainer.querySelectorAll<HTMLElement>(`:scope > .feed-card`)
                rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(`:scope > .bili-video-card.is-rcmd`)
            }

            // 构建SelectorFunc
            const rcmdSelectorFunc: SelectorFunc = {
                duration: (video: Element): string | null => {
                    const duration = video.querySelector('span.bili-video-card__stats__duration')?.textContent
                    return duration ? duration : null
                },
                titleKeyword: (video: Element): string | null => {
                    const titleKeyword =
                        video.querySelector('h3.bili-video-card__info--tit')?.getAttribute('title') ||
                        video.querySelector('h3.bili-video-card__info--tit a')?.textContent
                    return titleKeyword ? titleKeyword : null
                },
                bvid: (video: Element): string | null => {
                    const href =
                        video.querySelector('h3.bili-video-card__info--tit a')?.getAttribute('href') ||
                        video.querySelector('a.bili-video-card__image--link')?.getAttribute('href') ||
                        video.querySelector('a.bili-video-card__image--link')?.getAttribute('data-target-url')
                    if (href) {
                        const match = bvidPattern.exec(href)
                        if (match && match.length >= 2) {
                            console.log(match[1])
                            return match[1]
                        }
                    }
                    return null
                },
                uploader: (video: Element): string | null => {
                    const uploader = video.querySelector('span.bili-video-card__info--author')?.textContent
                    return uploader ? uploader : null
                },
            }
            const feedSelectorFunc = rcmdSelectorFunc
            feedVideos.length && coreFilterInstance.checkAll([...feedVideos], true, feedSelectorFunc)
            debug(`checkVideoList check ${rcmdVideos.length} rcmd videos`)
            rcmdVideos.length && coreFilterInstance.checkAll([...rcmdVideos], true, rcmdSelectorFunc)
            debug(`checkVideoList check ${feedVideos.length} feed videos`)
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
            videoObverser.observe(videoListContainer, { childList: true })
            debug('watchVideoListContainer OK')
        }
    }
    // 1. 检测/监听 videoListContainer 出现, 出现后监听 videoListContainer 内部变化
    const waitForVideoListContainer = () => {
        // 检测/监听视频列表父节点出现
        videoListContainer = document.querySelector('.container.is-version8') as HTMLFormElement
        if (videoListContainer) {
            debug('videoListContainer exist')
            watchVideoListContainer()
        } else {
            const obverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as Element).className === 'container is-version8') {
                                debug('videoListContainer appear')
                                obverser.disconnect()
                                videoListContainer = document.querySelector('.container.is-version8') as HTMLFormElement
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
    waitForVideoListContainer()

    //=======================================================================================
    // 配置 行为实例
    class HomepageDurationAction {
        readonly statusKey = 'homepage-duration-filter-status'
        readonly valueKey = 'global-duration-filter-value'
        private status = false
        private value = 60

        constructor() {
            this.status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
            this.value = GM_getValue(`BILICLEANER_${this.valueKey}`, 60)
            // 配置子过滤器
            durationFilterInstance.setStatus(this.status)
            durationFilterInstance.setParams(this.value)
        }

        enable() {
            // 告知agency
            durationAgencyInstance.notify('enable')
            // 触发全站过滤
            checkVideoList(true)
        }
        disable() {
            durationAgencyInstance.notify('disable')
            checkVideoList(true)
        }
        change(value: number) {
            durationAgencyInstance.notify('change', value)
            checkVideoList(true)
        }
    }
    class HomepageUploaderAction {
        readonly statusKey = 'homepage-uploader-filter-status'
        readonly valueKey = 'global-uploader-filter-value'
        private status = false
        private value: string[] = []
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
    class HomepageBvidAction {
        readonly statusKey = 'homepage-bvid-filter-status'
        readonly valueKey = 'global-bvid-filter-value'
        private status = false
        private value: string[] = []
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
    class HomepageTitleKeywordAction {
        readonly statusKey = 'homepage-title-keyword-filter-status'
        readonly valueKey = 'global-title-keyword-filter-value'
        private status = false
        private value: string[] = []
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
    // Todo: HomepageWhiteListAction {}

    const homepageDurationAction = new HomepageDurationAction()
    const homepageUploaderAction = new HomepageUploaderAction()
    const homepageBvidAction = new HomepageBvidAction()
    const homepageTitleKeywordAction = new HomepageTitleKeywordAction()

    //=======================================================================================

    // 右键监听函数, 首页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
    contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            if (e.target instanceof HTMLElement) {
                debug(e.target.classList)
                if (isContextMenuUploaderEnable && e.target.classList.contains('bili-video-card__info--author')) {
                    // 命中UP主
                    const node = e.target
                    const uploader = node.textContent
                    if (uploader) {
                        e.preventDefault()
                        const onclick = () => {
                            homepageUploaderAction.add(uploader)
                        }
                        contextMenuInstance.registerMenu(`屏蔽UP主：${uploader}`, onclick)
                        contextMenuInstance.show(e.clientX, e.clientY)
                    }
                } else if (
                    isContextMenuBvidEnable &&
                    e.target.parentElement?.classList.contains('bili-video-card__info--tit')
                ) {
                    // 命中视频标题, 提取bvid
                    const node = e.target.parentElement
                    const href = node.querySelector(':scope > a')?.getAttribute('href')
                    if (href) {
                        let bvid: string
                        const bvidPattern = /video\/(BV[1-9A-HJ-NP-Za-km-z]+)/
                        const match = bvidPattern.exec(href)
                        if (match && match.length >= 2) {
                            bvid = match[1]
                            if (bvid) {
                                e.preventDefault()
                                const onclick = () => {
                                    homepageBvidAction.add(bvid)
                                }
                                contextMenuInstance.registerMenu(`屏蔽视频：${bvid}`, onclick)
                                contextMenuInstance.show(e.clientX, e.clientY)
                            }
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
    const durationItems: (CheckboxItem | NumberItem)[] = []
    const titleKeywordItems: (CheckboxItem | ButtonItem)[] = []
    const bvidItems: (CheckboxItem | ButtonItem)[] = []
    const uploaderItems: (CheckboxItem | ButtonItem)[] = []

    // UI组件, 时长过滤part
    {
        durationItems.push(
            new CheckboxItem(
                homepageDurationAction.statusKey,
                '启用 首页时长过滤',
                false,
                homepageDurationAction.enable,
                false,
                null,
                homepageDurationAction.disable,
            ),
        )
        durationItems.push(
            new NumberItem(
                homepageDurationAction.valueKey,
                '设定最低时长 (0~300s)',
                60,
                0,
                300,
                '秒',
                homepageDurationAction.change,
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-duration-filter-group', '首页 视频时长过滤', durationItems))

    // UI组件, UP主过滤part
    {
        uploaderItems.push(
            new CheckboxItem(
                homepageUploaderAction.statusKey,
                '启用 首页UP主过滤 (右键单击UP主)',
                false,
                homepageUploaderAction.enable,
                false,
                null,
                homepageUploaderAction.disable,
            ),
        )
        // 按钮功能：打开uploader黑名单编辑框
        uploaderItems.push(
            new ButtonItem(
                'homepage-uploader-filter-edit-button',
                '编辑 UP主黑名单',
                '编辑',
                // 按钮功能
                () => homepageUploaderAction.blacklist.show(),
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-uploader-filter-group', '首页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤part
    {
        titleKeywordItems.push(
            new CheckboxItem(
                homepageTitleKeywordAction.statusKey,
                '启用 首页关键词过滤',
                false,
                homepageTitleKeywordAction.enable,
                false,
                null,
                homepageTitleKeywordAction.disable,
            ),
        )
        // 按钮功能：打开titleKeyword黑名单编辑框
        titleKeywordItems.push(
            new ButtonItem(
                'homepage-test-button',
                '编辑 关键词黑名单',
                '编辑',
                // 按钮功能
                () => homepageTitleKeywordAction.blacklist.show(),
            ),
        )
    }
    homepageFilterGroupList.push(
        new Group('homepage-title-keyword-filter-group', '首页 标题关键词过滤', titleKeywordItems),
    )

    // UI组件, bvid过滤part
    {
        bvidItems.push(
            new CheckboxItem(
                homepageBvidAction.statusKey,
                '启用 首页BV号过滤 (右键单击视频标题)',
                false,
                homepageBvidAction.enable,
                false,
                null,
                homepageBvidAction.disable,
            ),
        )
        // 按钮功能：打开bvid黑名单编辑框
        bvidItems.push(
            new ButtonItem(
                'homepage-bvid-filter-edit-button',
                '编辑 BV号黑名单',
                '编辑',
                // 按钮功能
                () => homepageBvidAction.blacklist.show(),
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-bvid-filter-group', '首页 视频BV号过滤', bvidItems))
}

export { homepageFilterGroupList }

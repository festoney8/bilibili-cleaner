import { GM_getValue } from '$'
import { debug, error } from '../../utils/logger'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import { ButtonItem, CheckboxItem, NumberItem } from '../../components/item'
import { Group } from '../../components/group'
import bvidFilterInstance from '../filters/subfilters/bvid'
import durationFilterInstance from '../filters/subfilters/duration'
import titleKeywordFilterInstance from '../filters/subfilters/titleKeyword'
import uploaderFilterInstance from '../filters/subfilters/uploader'
import { isPageVideo } from '../../utils/page-type'
import durationAgencyInstance from '../agency/duration'
import uploaderAgencyInstance from '../agency/uploader'
import contextMenuInstance from '../../components/contextmenu'
import bvidAgencyInstance from '../agency/bvid'
import titleKeywordAgencyInstance from '../agency/titleKeyword'
import { WordList } from '../../components/wordlist'
import { Action } from './homepage'
import { matchBvid } from '../../utils/misc'

const videoFilterGroupList: Group[] = []

// 右键菜单功能, 全局控制
let isContextMenuFuncRunning = false
let isContextMenuUploaderEnable = false
let isContextMenuBvidEnable = false
let contextMenuFunc: () => void

if (isPageVideo()) {
    // 页面载入后监听流程

    // 视频列表外层
    let videoListContainer: HTMLElement
    // 3. 检测视频列表
    const checkVideoList = () => {
        debug('checkVideoList start')
        try {
            // 接下来播放
            const nextVideos = videoListContainer.querySelectorAll<HTMLElement>(
                `.next-play .video-page-card-small, .next-play .video-page-operator-card-small`,
            )
            // 推荐列表
            const rcmdVideos = videoListContainer.querySelectorAll<HTMLElement>(
                `.rec-list .video-page-card-small, .rec-list .video-page-operator-card-small`,
            )
            // 构建SelectorFunc
            const rcmdSelectorFunc: SelectorFunc = {
                duration: (video: Element): string | null => {
                    const duration = video.querySelector('.pic-box span.duration')?.textContent
                    return duration ? duration : null
                },
                titleKeyword: (video: Element): string | null => {
                    const titleKeyword =
                        video.querySelector('.info > a p')?.getAttribute('title') ||
                        video.querySelector('.info > a p')?.textContent
                    return titleKeyword ? titleKeyword : null
                },
                bvid: (video: Element): string | null => {
                    const href =
                        video.querySelector('.info > a')?.getAttribute('href') ||
                        video.querySelector('.pic-box .framepreview-box > a')?.getAttribute('href')
                    if (href) {
                        return matchBvid(href)
                    }
                    return null
                },
                uploader: (video: Element): string | null => {
                    const uploader = video.querySelector('.info > .upname a')?.textContent
                    return uploader ? uploader : null
                },
            }
            const nextSelectorFunc = rcmdSelectorFunc
            // Todo: 改为按需启用nextVideos筛选
            nextVideos.length && coreFilterInstance.checkAll([...nextVideos], true, nextSelectorFunc)
            debug(`checkVideoList check ${nextVideos.length} rcmd videos`)
            rcmdVideos.length && coreFilterInstance.checkAll([...rcmdVideos], true, rcmdSelectorFunc)
            debug(`checkVideoList check ${rcmdVideos.length} next videos`)
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
            // 播放页右栏载入慢, 始终做全站检测
            checkVideoList()
            const videoObverser = new MutationObserver(() => {
                checkVideoList()
            })
            // 播放页需监听subtree
            videoObverser.observe(videoListContainer, { childList: true, subtree: true })
            debug('watchVideoListContainer OK')
        }
    }
    // 1. 检测/监听 videoListContainer 出现, 出现后监听 videoListContainer 内部变化
    const waitForVideoListContainer = () => {
        // 检测/监听视频列表父节点出现
        videoListContainer = document.getElementById('reco_list') as HTMLFormElement
        if (videoListContainer) {
            debug('videoListContainer exist')
            watchVideoListContainer()
        } else {
            const obverser = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if ((node as HTMLElement).id === 'reco_list') {
                                debug('videoListContainer appear')
                                obverser.disconnect()
                                videoListContainer = node as HTMLElement
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
    class VideoDurationAction implements Action {
        readonly statusKey = 'video-duration-filter-status'
        readonly valueKey = 'global-duration-filter-value'
        status = GM_getValue(`BILICLEANER_${this.statusKey}`, false)
        value = GM_getValue(`BILICLEANER_${this.valueKey}`, 60)

        constructor() {
            // 配置子过滤器
            durationFilterInstance.setStatus(this.status)
            durationFilterInstance.setParams(this.value)
        }
        enable() {
            // 告知agency
            durationAgencyInstance.notify('enable')
            // 触发全站过滤
            checkVideoList()
        }
        disable() {
            durationAgencyInstance.notify('disable')
            checkVideoList()
        }
        change(value: number) {
            durationAgencyInstance.notify('change', value)
            checkVideoList()
        }
    }
    class VideoUploaderAction implements Action {
        readonly statusKey = 'video-uploader-filter-status'
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
            checkVideoList()
        }
        disable() {
            // 修改右键监听函数状态
            isContextMenuUploaderEnable = false
            uploaderAgencyInstance.notify('disable')
            checkVideoList()
        }
        add(value: string) {
            this.blacklist.addValue(value)
            uploaderAgencyInstance.notify('add', value)
            checkVideoList()
        }
        // edit由编辑黑名单的保存动作回调
        edit(values: string[]) {
            // this.blacklist.saveList(values)
            uploaderAgencyInstance.notify('edit', values)
            checkVideoList()
        }
    }
    class VideoBvidAction implements Action {
        readonly statusKey = 'video-bvid-filter-status'
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
            checkVideoList()
        }
        disable() {
            // 禁用右键菜单功能
            isContextMenuBvidEnable = false
            bvidAgencyInstance.notify('disable')
            checkVideoList()
        }
        add(value: string) {
            this.blacklist.addValue(value)
            bvidAgencyInstance.notify('add', value)
            checkVideoList()
        }
        // edit由编辑黑名单的保存动作回调
        edit(values: string[]) {
            // this.blacklist.saveList(values)
            bvidAgencyInstance.notify('edit', values)
            checkVideoList()
        }
    }
    class VideoTitleKeywordAction implements Action {
        readonly statusKey = 'video-title-keyword-filter-status'
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
            checkVideoList()
        }
        disable() {
            titleKeywordAgencyInstance.notify('disable')
            checkVideoList()
        }
        add(value: string) {
            this.blacklist.addValue(value)
            titleKeywordAgencyInstance.notify('add', value)
            checkVideoList()
        }
        // edit由编辑黑名单的保存动作回调
        edit(values: string[]) {
            // this.blacklist.saveList(values)
            titleKeywordAgencyInstance.notify('edit', values)
            checkVideoList()
        }
    }

    // Todo: VideoWhiteListAction implements Action {}

    const videoDurationAction = new VideoDurationAction()
    const videoUploaderAction = new VideoUploaderAction()
    const videoBvidAction = new VideoBvidAction()
    const videoTitleKeywordAction = new VideoTitleKeywordAction()

    //=======================================================================================

    // 右键监听函数, 播放页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
    contextMenuFunc = () => {
        if (isContextMenuFuncRunning) {
            return
        }
        isContextMenuFuncRunning = true
        // 监听右键单击
        document.addEventListener('contextmenu', (e) => {
            if (e.target instanceof HTMLElement) {
                debug(e.target.classList)
                const target = e.target
                if (
                    isContextMenuUploaderEnable &&
                    target.classList.contains('name')
                    // target.closest('.upname span.name') === target
                ) {
                    // 命中UP主
                    const uploader = target.textContent
                    if (uploader) {
                        e.preventDefault()
                        const onclick = () => {
                            videoUploaderAction.add(uploader)
                        }
                        contextMenuInstance.registerMenu(`屏蔽UP主：${uploader}`, onclick)
                        contextMenuInstance.show(e.clientX, e.clientY)
                    }
                } else if (
                    isContextMenuBvidEnable &&
                    target.classList.contains('title')
                    // target.closest('.info > a > p') === target
                ) {
                    // 命中视频标题, 提取bvid
                    const href = target.parentElement?.getAttribute('href')
                    if (href) {
                        const bvid = matchBvid(href)
                        if (bvid) {
                            e.preventDefault()
                            const onclick = () => {
                                videoBvidAction.add(bvid)
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
    const durationItems: (CheckboxItem | NumberItem)[] = []
    const titleKeywordItems: (CheckboxItem | ButtonItem)[] = []
    const bvidItems: (CheckboxItem | ButtonItem)[] = []
    const uploaderItems: (CheckboxItem | ButtonItem)[] = []

    // UI组件, 时长过滤part
    {
        durationItems.push(
            new CheckboxItem(
                videoDurationAction.statusKey,
                '启用 播放页 时长过滤',
                false,
                videoDurationAction.enable,
                false,
                null,
                videoDurationAction.disable,
            ),
        )
        durationItems.push(
            new NumberItem(
                videoDurationAction.valueKey,
                '设定最低时长 (0~300s)',
                60,
                0,
                300,
                '秒',
                videoDurationAction.change,
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-duration-filter-group', '播放页 视频时长过滤', durationItems))

    // UI组件, UP主过滤part
    {
        uploaderItems.push(
            new CheckboxItem(
                videoUploaderAction.statusKey,
                '启用 播放页 UP主过滤',
                false,
                videoUploaderAction.enable,
                false,
                null,
                videoUploaderAction.disable,
            ),
        )
        // 按钮功能：打开uploader黑名单编辑框
        uploaderItems.push(
            new ButtonItem(
                'video-uploader-filter-edit-button',
                '编辑 UP主黑名单',
                '编辑',
                // 按钮功能
                () => videoUploaderAction.blacklist.show(),
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-uploader-filter-group', '播放页 UP主过滤 (右键单击UP主)', uploaderItems))

    // UI组件, 标题关键词过滤part
    {
        titleKeywordItems.push(
            new CheckboxItem(
                videoTitleKeywordAction.statusKey,
                '启用 播放页 关键词过滤',
                false,
                videoTitleKeywordAction.enable,
                false,
                null,
                videoTitleKeywordAction.disable,
            ),
        )
        // 按钮功能：打开titleKeyword黑名单编辑框
        titleKeywordItems.push(
            new ButtonItem(
                'video-test-button',
                '编辑 关键词黑名单',
                '编辑',
                // 按钮功能
                () => videoTitleKeywordAction.blacklist.show(),
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-title-keyword-filter-group', '播放页 标题关键词过滤', titleKeywordItems))

    // UI组件, bvid过滤part
    {
        bvidItems.push(
            new CheckboxItem(
                videoBvidAction.statusKey,
                '启用 播放页 BV号过滤',
                false,
                videoBvidAction.enable,
                false,
                null,
                videoBvidAction.disable,
            ),
        )
        // 按钮功能：打开bvid黑名单编辑框
        bvidItems.push(
            new ButtonItem(
                'video-bvid-filter-edit-button',
                '编辑 BV号黑名单',
                '编辑',
                // 按钮功能
                () => videoBvidAction.blacklist.show(),
            ),
        )
    }
    videoFilterGroupList.push(new Group('video-bvid-filter-group', '播放页 BV号过滤 (右键单击标题)', bvidItems))
}

export { videoFilterGroupList }

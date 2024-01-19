import { GM_getValue } from '$'
import { debug, error } from '../../utils/logger'
import coreFilterInstance, { SelectorFunc } from '../filters/core'
import { CheckboxItem, NumberItem } from '../../components/item'
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

const homepageFilterGroupList: Group[] = []

if (isPageHomepage()) {
    // coreFilterInstance和各个子过滤器为全局实例, 必须包装在页面判断逻辑内配置状态
    // 否则各页面import时运行顶层代码, filter参数互相影响

    // 获取各过滤器当前状态, status与页面相关, value全站通用
    const homepageDurationFilterStatusKey = 'homepage-duration-filter-status'
    const homepageTitleKeywordFilterStatusKey = 'homepage-keyword-filter-status'
    const homepageBvidFilterStatusKey = 'homepage-bvid-filter-status'
    const homepageUploaderFilterStatusKey = 'homepage-uploader-filter-status'

    const globalDurationFilterValueKey = 'global-duration-filter-value'
    const globalTitleKeywordFilterValueKey = 'global-keyword-filter-value'
    const globalBvidFilterValueKey = 'global-bvid-filter-value'
    const globalUploaderFilterValueKey = 'global-uploader-filter-value'

    const homepageDurationFilterStatus: boolean = GM_getValue(`BILICLEANER_${homepageDurationFilterStatusKey}`, false)
    const homepageTitleKeywordFilterStatus: boolean = GM_getValue(
        `BILICLEANER_${homepageTitleKeywordFilterStatusKey}`,
        false,
    )
    const homepageBvidFilterStatus: boolean = GM_getValue(`BILICLEANER_${homepageBvidFilterStatusKey}`, false)
    const homepageUploaderFilterStatus: boolean = GM_getValue(`BILICLEANER_${homepageUploaderFilterStatusKey}`, false)

    const globalDurationFilterValue: number = GM_getValue(`BILICLEANER_VALUE_${globalDurationFilterValueKey}`, 90)
    const globalTitleKeywordFilterValue: string[] = GM_getValue(
        `BILICLEANER_VALUE_${globalTitleKeywordFilterValueKey}`,
        [],
    )
    const globalBvidFilterValue: string[] = GM_getValue(`BILICLEANER_VALUE_${globalBvidFilterValueKey}`, [])
    const globalUploaderFilterValue: string[] = GM_getValue(`BILICLEANER_VALUE_${globalUploaderFilterValueKey}`, [])

    // 配置子过滤器参数
    durationFilterInstance.setStatus(homepageDurationFilterStatus)
    durationFilterInstance.setParams(globalDurationFilterValue)
    debug('durationFilterInstance', homepageDurationFilterStatus, globalDurationFilterValue)

    titleKeywordFilterInstance.setStatus(homepageTitleKeywordFilterStatus)
    titleKeywordFilterInstance.setParams(globalTitleKeywordFilterValue)
    debug('titleKeywordFilterInstance', homepageTitleKeywordFilterStatus, globalTitleKeywordFilterValue.length)

    bvidFilterInstance.setStatus(homepageBvidFilterStatus)
    bvidFilterInstance.setParams(globalBvidFilterValue)
    debug('bvidFilterInstance', homepageBvidFilterStatus, globalBvidFilterValue.length)

    uploaderFilterInstance.setStatus(homepageUploaderFilterStatus)
    uploaderFilterInstance.setParams(globalUploaderFilterValue)
    debug('uploaderFilterInstance', homepageUploaderFilterStatus, globalUploaderFilterValue.length)

    //=======================================================================================
    // 0. 视频列表外层
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
    // 右键监听函数, 首页右键单击指定元素时修改右键菜单, 用于屏蔽视频BVID, 屏蔽UP主
    let isContextMenuFuncRunning = false
    let isContextMenuUploaderEnable = false
    let isContextMenuBvidEnable = false
    const contextMenuFunc = () => {
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
                            homepageUploaderFilterAddFunc(uploader)
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
                                    homepageBvidFilterAddFunc(bvid)
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
    // 时长过滤, 按钮开启, 功能函数
    const homepageDurationFilterEnableFunc = () => {
        // 告知agency
        durationAgencyInstance.notify('enable')
        // 触发全站过滤
        checkVideoList(true)
    }
    // 时长过滤, 按钮关闭, 回调
    const homepageDurationFilterDisableFunc = () => {
        durationAgencyInstance.notify('disable')
        checkVideoList(true)
    }
    // 时长过滤, 数值变化, 回调
    const globalDurationFilterChangeFunc = (value: number) => {
        durationAgencyInstance.notify('change', value)
        checkVideoList(true)
    }

    // UP主过滤, 按钮开启, 功能函数
    const homepageUploaderFilterEnableFunc = () => {
        // 启用右键菜单功能
        isContextMenuUploaderEnable = true
        contextMenuFunc()
        uploaderAgencyInstance.notify('enable')
        checkVideoList(true)
    }
    // UP主过滤, 按钮关闭, 回调
    const homepageUploaderFilterDisableFunc = () => {
        isContextMenuUploaderEnable = false
        uploaderAgencyInstance.notify('disable')
        checkVideoList(true)
    }
    // UP主过滤, 新增单项, 回调, 由右键菜单调用
    const homepageUploaderFilterAddFunc = (value: string) => {
        debug('homepageUploaderFilterAddFunc', value)
        uploaderAgencyInstance.notify('add', value)
        checkVideoList(true)
    }
    // UP主过滤, 更新列表, 回调
    const homepageUploaderFilterListChangeFunc = (value: string[]) => {
        uploaderAgencyInstance.notify('setList', value)
        checkVideoList(true)
    }

    // bvid过滤, 按钮开启, 功能函数
    const homepageBvidFilterEnableFunc = () => {
        // 启用右键菜单功能
        isContextMenuBvidEnable = true
        contextMenuFunc()
        bvidAgencyInstance.notify('enable')
        checkVideoList(true)
    }
    // bvid过滤, 按钮关闭, 回调
    const homepageBvidFilterDisableFunc = () => {
        isContextMenuBvidEnable = false
        bvidAgencyInstance.notify('disable')
        checkVideoList(true)
    }
    // bvid过滤, 新增单项, 回调, 由右键菜单调用
    const homepageBvidFilterAddFunc = (value: string) => {
        debug('homepageBvidFilterAddFunc', value)
        bvidAgencyInstance.notify('add', value)
        checkVideoList(true)
    }
    // bvid过滤, 更新列表, 回调
    const homepageBvidFilterListChangeFunc = (value: string[]) => {
        bvidAgencyInstance.notify('setList', value)
        checkVideoList(true)
    }

    //=======================================================================================
    // 构建UI菜单
    const durationItems: (CheckboxItem | NumberItem)[] = []
    const titleKeywordItems: (CheckboxItem | NumberItem)[] = []
    const bvidItems: (CheckboxItem | NumberItem)[] = []
    const uploaderItems: (CheckboxItem | NumberItem)[] = []

    // 时长过滤part, UI组件
    {
        durationItems.push(
            new CheckboxItem(
                homepageDurationFilterStatusKey,
                '启用 首页时长过滤',
                false,
                homepageDurationFilterEnableFunc,
                false,
                null,
                homepageDurationFilterDisableFunc,
            ),
        )
        durationItems.push(
            new NumberItem(
                globalDurationFilterValueKey,
                '设定最低时长 (0~300s)',
                60,
                0,
                300,
                '秒',
                globalDurationFilterChangeFunc,
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-duration-filter-group', '首页 视频时长过滤', durationItems))

    // UP主过滤part, UI组件
    {
        uploaderItems.push(
            new CheckboxItem(
                homepageUploaderFilterStatusKey,
                '启用 首页UP主过滤 (右键单击UP主)',
                false,
                homepageUploaderFilterEnableFunc,
                false,
                null,
                homepageUploaderFilterDisableFunc,
            ),
        )
        // 列表编辑器
    }
    homepageFilterGroupList.push(new Group('homepage-uploader-filter-group', '首页 UP主过滤', uploaderItems))

    // 标题关键词过滤part, UI组件
    {
        titleKeywordItems.push(
            new CheckboxItem(homepageTitleKeywordFilterStatusKey, '启用 首页关键词过滤', false, undefined, false, null),
        )
        // 列表编辑器
    }
    homepageFilterGroupList.push(
        new Group('homepage-title-keyword-filter-group', '首页 标题关键词过滤', titleKeywordItems),
    )

    // Bvid过滤part, UI组件
    {
        bvidItems.push(
            new CheckboxItem(
                homepageBvidFilterStatusKey,
                '启用 首页BV号过滤 (右键单击视频标题)',
                false,
                homepageBvidFilterEnableFunc,
                false,
                null,
                homepageBvidFilterDisableFunc,
            ),
        )
        // 列表编辑器
    }
    homepageFilterGroupList.push(new Group('homepage-bvid-filter-group', '首页 视频BV号过滤', bvidItems))
}
export { homepageFilterGroupList }

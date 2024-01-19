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

    const globalDurationFilterValue: number = GM_getValue(`BILICLEANER_${globalDurationFilterValueKey}`, 90)
    const globalTitleKeywordFilterValue: string[] = GM_getValue(`BILICLEANER_${globalTitleKeywordFilterValueKey}`, [])
    const globalBvidFilterValue: string[] = GM_getValue(`BILICLEANER_${globalBvidFilterValueKey}`, [])
    const globalUploaderFilterValue: string[] = GM_getValue(`BILICLEANER_${globalUploaderFilterValueKey}`, [])

    //=======================================================================================
    // 配置子过滤器参数
    durationFilterInstance.setStatus(homepageDurationFilterStatus)
    durationFilterInstance.setParams(globalDurationFilterValue)
    debug('durationFilterInstance', homepageDurationFilterStatus, globalDurationFilterValue)

    titleKeywordFilterInstance.setStatus(homepageTitleKeywordFilterStatus)
    // 直接读取列表传给子过滤器, 下同
    titleKeywordFilterInstance.setParams(globalTitleKeywordFilterValue)
    debug('titleKeywordFilterInstance', homepageTitleKeywordFilterStatus, globalTitleKeywordFilterValue.length)

    bvidFilterInstance.setStatus(homepageBvidFilterStatus)
    bvidFilterInstance.setParams(globalBvidFilterValue)
    debug('bvidFilterInstance', homepageBvidFilterStatus, globalBvidFilterValue.length)

    uploaderFilterInstance.setStatus(homepageUploaderFilterStatus)
    uploaderFilterInstance.setParams(globalUploaderFilterValue)
    debug('uploaderFilterInstance', homepageUploaderFilterStatus, globalUploaderFilterValue.length)

    //=======================================================================================
    // 页面载入后监听流程

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
    // 初始化 UP主黑名单
    const uploaderList = new WordList(
        globalUploaderFilterValueKey,
        '屏蔽UP主列表',
        // 保存列表callback, 通知agency, 触发全站过滤
        (values: string[]) => {
            uploaderAgencyInstance.notify('setList', values)
            checkVideoList(true)
        },
    )
    // 初始化 bvid黑名单
    const bvidList = new WordList(
        globalBvidFilterValueKey,
        'BV号 黑名单',
        // 保存列表callback, 通知agency, 触发全站过滤
        (values: string[]) => {
            bvidAgencyInstance.notify('setList', values)
            checkVideoList(true)
        },
    )
    // 初始化 标题关键词黑名单
    const titleKeywordList = new WordList(
        globalTitleKeywordFilterValueKey,
        '标题关键词 黑名单',
        // 保存列表callback, 通知agency, 触发全站过滤
        (values: string[]) => {
            titleKeywordAgencyInstance.notify('setList', values)
            checkVideoList(true)
        },
    )

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

    //=======================================================================================
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
    const homepageDurationFilterChangeFunc = (value: number) => {
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
    // UP主过滤, 右键菜单新增, 回调
    const homepageUploaderFilterAddFunc = (value: string) => {
        debug('homepageUploaderFilterAddFunc', value)
        uploaderList.addValue(value)
        uploaderAgencyInstance.notify('add', value)
        checkVideoList(true)
    }
    // 标题关键词过滤, 按钮开启, 功能函数
    const homepageTitleKeywordFilterEnableFunc = () => {
        debug('homepageTitleKeywordFilterEnableFunc')
        titleKeywordAgencyInstance.notify('enable')
        checkVideoList(true)
    }
    // 标题关键词过滤, 按钮关闭, 回调
    const homepageTitleKeywordFilterDisableFunc = () => {
        debug('homepageTitleKeywordFilterDisableFunc')
        titleKeywordAgencyInstance.notify('disable')
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
        bvidList.addValue(value)
        bvidAgencyInstance.notify('add', value)
        checkVideoList(true)
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
                homepageDurationFilterChangeFunc,
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-duration-filter-group', '首页 视频时长过滤', durationItems))

    // UI组件, UP主过滤part
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
        uploaderItems.push(
            new ButtonItem(
                'homepage-uploader-filter-edit-button',
                '编辑 UP主黑名单',
                '编辑',
                // 按钮功能：打开uploaderList编辑框
                () => uploaderList.show(),
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-uploader-filter-group', '首页 UP主过滤', uploaderItems))

    // UI组件, 标题关键词过滤part
    {
        titleKeywordItems.push(
            new CheckboxItem(
                homepageTitleKeywordFilterStatusKey,
                '启用 首页关键词过滤',
                false,
                homepageTitleKeywordFilterEnableFunc,
                false,
                null,
                homepageTitleKeywordFilterDisableFunc,
            ),
        )
        titleKeywordItems.push(
            new ButtonItem(
                'homepage-test-button',
                '编辑 关键词黑名单',
                '编辑',
                // 按钮功能：打开titleKeywordList编辑框
                () => titleKeywordList.show(),
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
                homepageBvidFilterStatusKey,
                '启用 首页BV号过滤 (右键单击视频标题)',
                false,
                homepageBvidFilterEnableFunc,
                false,
                null,
                homepageBvidFilterDisableFunc,
            ),
        )
        bvidItems.push(
            new ButtonItem(
                'homepage-bvid-filter-edit-button',
                '编辑 BV号黑名单',
                '编辑',
                // 按钮功能：打开bvidList编辑框
                () => bvidList.show(),
            ),
        )
    }
    homepageFilterGroupList.push(new Group('homepage-bvid-filter-group', '首页 视频BV号过滤', bvidItems))
}

export { homepageFilterGroupList }

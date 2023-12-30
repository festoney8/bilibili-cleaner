import { Group, TitleGroup } from '../core/group'
import { NormalItem } from '../core/item'

const basicItems: NormalItem[] = []
const sidebarItems: NormalItem[] = []
// GroupList
const searchGroupList: (Group | TitleGroup)[] = []

if (location.host === 'search.bilibili.com') {
    // 搜索页标题
    searchGroupList.push(new TitleGroup('当前是：搜索页'))

    // 基本功能part, basicItems
    {
        // 顶栏 滚动页面后不再吸附顶部
        basicItems.push(
            new NormalItem(
                'hide-search-page-search-sticky-header',
                '顶栏 滚动页面后不再吸附顶部',
                false,
                undefined,
                false,
                `.search-sticky-header {display: none !important;}`,
            ),
        )
        // 隐藏 搜索结果中的广告, 默认开启
        basicItems.push(
            new NormalItem(
                'hide-search-page-ad',
                '隐藏 搜索结果中的广告',
                true,
                undefined,
                false,
                `.video-list.row>div:has([href*="cm.bilibili.com"]) {display: none !important;}`,
            ),
        )
        // 隐藏 弹幕数量, 默认开启
        basicItems.push(
            new NormalItem(
                'hide-search-page-danmaku-count',
                '隐藏 弹幕数量',
                true,
                undefined,
                false,
                `.bili-video-card .bili-video-card__stats--left .bili-video-card__stats--item:nth-child(2) {display: none !important;}`,
            ),
        )
        // 隐藏 视频日期
        basicItems.push(
            new NormalItem(
                'hide-search-page-date',
                '隐藏 视频日期',
                false,
                undefined,
                false,
                `.bili-video-card .bili-video-card__info--date {display: none !important;}`,
            ),
        )
        // 隐藏 稍后再看按钮
        basicItems.push(
            new NormalItem(
                'hide-search-page-bili-watch-later',
                '隐藏 稍后再看按钮',
                false,
                undefined,
                false,
                `.bili-video-card .bili-watch-later {display: none !important;}`,
            ),
        )
    }
    searchGroupList.push(new Group('search-basic', '基本功能', basicItems))

    // 右下角part, sidebarItems
    {
        // 隐藏 右下角 客服, 默认开启
        sidebarItems.push(
            new NormalItem(
                'hide-search-page-customer-service',
                '隐藏 右下角 客服',
                true,
                undefined,
                false,
                `.side-buttons div:has(>a[href*="customer-service"]) {display: none !important;}`,
            ),
        )
        // 隐藏 右下角 回顶部
        sidebarItems.push(
            new NormalItem(
                'hide-search-page-btn-to-top',
                '隐藏 右下角 回顶部',
                false,
                undefined,
                false,
                `.side-buttons .btn-to-top-wrap {display: none !important;}`,
            ),
        )
    }
    searchGroupList.push(new Group('search-sidebar', '页面右下角', sidebarItems))
}

export { searchGroupList }

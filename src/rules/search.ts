import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageSearch } from '../utils/page-type'

const basicItems: CheckboxItem[] = []
const sidebarItems: CheckboxItem[] = []
// GroupList
const searchGroupList: Group[] = []

if (isPageSearch()) {
    // 基本功能part, basicItems
    {
        // 顶栏 滚动页面后不再吸附顶部
        basicItems.push(
            new CheckboxItem(
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
            new CheckboxItem(
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
            new CheckboxItem(
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
            new CheckboxItem(
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
            new CheckboxItem(
                'hide-search-page-bili-watch-later',
                '隐藏 稍后再看按钮',
                false,
                undefined,
                false,
                `.bili-video-card .bili-watch-later {display: none !important;}`,
            ),
        )
    }
    searchGroupList.push(new Group('search-basic', '搜索页 基本功能', basicItems))

    // 右下角part, sidebarItems
    {
        // 隐藏 客服, 默认开启
        sidebarItems.push(
            new CheckboxItem(
                'hide-search-page-customer-service',
                '隐藏 客服',
                true,
                undefined,
                false,
                `.side-buttons div:has(>a[href*="customer-service"]) {display: none !important;}`,
            ),
        )
        // 隐藏 回顶部
        sidebarItems.push(
            new CheckboxItem(
                'hide-search-page-btn-to-top',
                '隐藏 回顶部',
                false,
                undefined,
                false,
                `.side-buttons .btn-to-top-wrap {display: none !important;}`,
            ),
        )
    }
    searchGroupList.push(new Group('search-sidebar', '页面右下角 小按钮', sidebarItems))
}

export { searchGroupList }

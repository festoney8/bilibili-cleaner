import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageSearch } from '../utils/page-type'

const searchGroupList: Group[] = []

if (isPageSearch()) {
    // 基本功能
    const basicItems = [
        // 顶栏 滚动页面后不再吸附顶部
        new CheckboxItem({
            itemID: 'hide-search-page-search-sticky-header',
            description: '顶栏 滚动页面后不再吸附顶部',
            itemCSS: `.search-sticky-header {display: none !important;}`,
        }),
        // 隐藏 搜索结果中的广告, 默认开启
        new CheckboxItem({
            itemID: 'hide-search-page-ad',
            description: '隐藏 搜索结果中的广告',
            defaultStatus: true,
            itemCSS: `.video-list.row>div:has([href*="cm.bilibili.com"]) {display: none !important;}`,
        }),
        // 隐藏 弹幕数量, 默认开启
        new CheckboxItem({
            itemID: 'hide-search-page-danmaku-count',
            description: '隐藏 弹幕数量',
            defaultStatus: true,
            itemCSS: `.bili-video-card .bili-video-card__stats--left .bili-video-card__stats--item:nth-child(2) {display: none !important;}`,
        }),
        // 隐藏 视频日期
        new CheckboxItem({
            itemID: 'hide-search-page-date',
            description: '隐藏 视频日期',
            itemCSS: `.bili-video-card .bili-video-card__info--date {display: none !important;}`,
        }),
        // 隐藏 稍后再看按钮
        new CheckboxItem({
            itemID: 'hide-search-page-bili-watch-later',
            description: '隐藏 稍后再看按钮',
            itemCSS: `.bili-video-card .bili-watch-later {display: none !important;}`,
        }),
    ]
    searchGroupList.push(new Group('search-basic', '搜索页 基本功能', basicItems))

    // 右下角
    const sidebarItems = [
        // 隐藏 客服, 默认开启
        new CheckboxItem({
            itemID: 'hide-search-page-customer-service',
            description: '隐藏 客服',
            defaultStatus: true,
            itemCSS: `.side-buttons div:has(>a[href*="customer-service"]) {display: none !important;}`,
        }),
        // 隐藏 回顶部
        new CheckboxItem({
            itemID: 'hide-search-page-btn-to-top',
            description: '隐藏 回顶部',
            itemCSS: `.side-buttons .btn-to-top-wrap {display: none !important;}`,
        }),
    ]
    searchGroupList.push(new Group('search-sidebar', '页面右下角 小按钮', sidebarItems))
}

export { searchGroupList }

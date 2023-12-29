import { Group } from '../core/group'
import { NormalItem, SeparatorItem } from '../core/item'

const searchItems: (NormalItem | SeparatorItem)[] = []

if (location.host === 'search.bilibili.com') {
    // 基本功能part
    {
        // 顶栏 滚动页面后不再吸附顶部
        searchItems.push(
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
        searchItems.push(
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
        searchItems.push(
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
        searchItems.push(
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
        searchItems.push(
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

    // 杂项、右下角part
    searchItems.push(new SeparatorItem())
    {
        // 隐藏 右下角 客服, 默认开启
        searchItems.push(
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
        searchItems.push(
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
}

export const searchGroup = new Group('search', '当前是：搜索页', searchItems)

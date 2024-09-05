import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageSpace } from '../utils/pageType'
import fontFaceRegular from './styles/fontFaceRegular.scss?inline'

const spaceGroupList: Group[] = []

if (isPageSpace()) {
    // 基本功能
    const basicItems = [
        // 打开用户主页 自动跳转到投稿
        new CheckboxItem({
            itemID: 'space-page-redirect-to-video',
            description: '打开用户主页 自动跳转到投稿',
            enableFunc: () => {
                if (/\/\d+\/?($|\?)/.test(location.pathname)) {
                    const userid = location.pathname.match(/\d+/)?.[0]
                    if (userid) {
                        location.href = `https://space.bilibili.com/${userid}/video`
                    }
                }
            },
        }),
        // 修复字体
        new CheckboxItem({
            itemID: 'font-patch',
            description: '修复字体',
            itemCSS: `
                ${fontFaceRegular}
                body,
                .h .h-sign,
                .reply-item .root-reply-container .content-warp .user-info .user-name,
                .bili-comment.browser-pc * {
                    font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif !important;
                    font-weight: 400;
                }
                body,
                .n .n-text {
                    font-size: 14px;
                }
                #page-index .channel .channel-item .small-item,
                #page-video .page-head__left .be-tab-item,
                .n .n-data .n-data-k,
                .n .n-data .n-data-v {
                    font-size: 13px;
                }
            `,
        }),
    ]
    spaceGroupList.push(new Group('space-basic', '空间页 基本功能', basicItems))

    // 动态列表, 尽可能同步动态页
    const spaceDynItems = [
        // 隐藏 头像框
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-avatar-pendent',
            description: '隐藏 头像框',
            itemCSS: `
                .b-avatar__layer.center {width: 48px !important; height: 48px !important;}
                .b-avatar__layers .b-avatar__layer.center:nth-child(2) picture {display: none !important;}
                .b-avatar__layers:has(.b-avatar__layer__res[style^="background"]) {display: none !important;}
            `,
        }),
        // 隐藏 头像徽章
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-avatar-icon',
            description: '隐藏 头像徽章',
            itemCSS: `.b-avatar__layers .b-avatar__layer:last-child:not(.center) {display: none !important;}`,
        }),
        // 隐藏 动态右侧饰品
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-ornament',
            description: '隐藏 动态右侧饰品',
            itemCSS: `.bili-dyn-ornament, .bili-dyn-item__ornament {display: none !important;}`,
        }),
        // 隐藏 警告notice, 默认开启
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-dispute',
            description: '隐藏 警告notice',
            defaultStatus: true,
            itemCSS: `.bili-dyn-content__dispute {display: none !important;}`,
        }),
        // 隐藏 稍后再看按钮
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-watchlater',
            description: '隐藏 稍后再看按钮',
            itemCSS: `.bili-dyn-card-video__mark {display: none !important;}`,
        }),
        // 隐藏 官方话题Tag
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-official-topic',
            description: '隐藏 官方话题Tag',
            // 不得隐藏普通tag .bili-rich-text-topic
            itemCSS: `.bili-dyn-content__orig__topic, .bili-dyn-content__forw__topic {
                        display: none !important;
                    }`,
        }),
        // 禁用 普通话题#Tag#高亮
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-text-topic',
            description: '禁用 普通话题#Tag#高亮',
            itemCSS: `.bili-rich-text-topic {color: inherit !important;}
                    .bili-rich-text-topic:hover {color: var(--brand_blue) !important;}`,
        }),
        // 隐藏 动态精选互动 XXX赞了/XXX回复
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-item-interaction',
            description: '隐藏 动态精选互动 XXX赞了/XXX回复',
            itemCSS: `.bili-dyn-item__interaction {display: none !important;}`,
        }),
        // 隐藏 视频预约/直播预约动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-card-reserve',
            description: '隐藏 视频预约/直播预约动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-reserve) {display: none !important;}`,
        }),
        // 隐藏 带货动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-card-goods',
            description: '隐藏 带货动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-goods),
                    .bili-dyn-list__item:has(.bili-rich-text-module.goods),
                    .bili-dyn-list__item:has([data-type="goods"]) {
                        visibility: hidden !important;
                        height: 0 !important;
                        margin: 0 !important;
                    }`,
        }),
        // 隐藏 抽奖动态(含转发)
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-lottery',
            description: '隐藏 抽奖动态(含转发)',
            itemCSS: `.bili-dyn-list__item:has([data-type="lottery"]) {display: none !important;}`,
        }),
        // 隐藏 转发的动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-forward',
            description: '隐藏 转发的动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-content__orig.reference) {
                        display: none !important;
                    }`,
        }),
        // 隐藏 投票动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-vote',
            description: '隐藏 投票动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-vote) {
                        display: none !important;
                    }`,
        }),
        // 隐藏 直播通知动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-live',
            description: '隐藏 直播通知动态',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-live) {
                        display: none !important;
                    }`,
        }),
        // 隐藏 被block的充电动态
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-blocked',
            description: '隐藏 被block的充电动态',
            itemCSS: `.bili-dyn-list__item:has(.dyn-blocked-mask) {
                        display: none !important;
                    }`,
        }),
        // 隐藏 全部充电视频(含已充电)
        new CheckboxItem({
            itemID: 'hide-dynamic-page-bili-dyn-charge-video',
            description: '隐藏 全部充电视频(含已充电)',
            itemCSS: `.bili-dyn-list__item:has(.bili-dyn-card-video__badge [src*="qcRJ6sJU91"]) {
                        display: none !important;
                    }`,
        }),
    ]
    spaceGroupList.push(new Group('space-dyn', '动态列表', spaceDynItems))
}

export { spaceGroupList }

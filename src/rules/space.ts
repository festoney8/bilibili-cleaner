import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageSpace } from '../utils/page-type'
import fontFaceRegular from './styles/fontFaceRegular.scss?inline'

const spaceGroupList: Group[] = []

if (isPageSpace()) {
    // 基本功能
    const basicItems = [
        // 修复字体
        new CheckboxItem({
            itemID: 'font-patch',
            description: '修复字体 (实验功能)',
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
}

export { spaceGroupList }

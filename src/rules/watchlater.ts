import { Group } from '../components/group'
import { CheckboxItem } from '../components/item'
import { isPageWatchlater } from '../utils/page-type'
import fontFaceRegular from './styles/fontFaceRegular.scss?inline'
import fontFaceMedium from './styles/fontFaceMedium.scss?inline'

const watchlaterGroupList: Group[] = []

if (isPageWatchlater()) {
    // 基本功能
    const basicItems = [
        // 使用 双列布局
        new CheckboxItem({
            itemID: 'watchlater-page-layout-2-column',
            description: '使用 双列布局',
            itemCSS: `
                .list-box > span {
                    display: grid !important;
                    grid-template-columns: repeat(2, calc(50% - 10px)) !important;
                    column-gap: 20px !important;
                    row-gap: 16px !important;
                }
                .watch-later-list {
                    margin-bottom: 50px !important;
                }
                .watch-later-list header {
                    margin: 8px 0 16px !important;
                }
                .av-item {
                    width: unset !important;
                    margin: 0 !important;
                    border-radius: 8px !important;
                    padding: 8px 8px 8px 32px !important;
                }
                .av-item:hover {
                    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2) !important;
                    transition: box-shadow 0.1s linear;
                }
                .av-item .av-about {
                    display: flex !important;
                    flex-direction: column !important;
                    border-bottom: none !important;
                }
                .av-item .av-pic .branch,
                .av-item .av-pic .corner {
                    font-size: 13px !important;
                }
                .av-item .av-about .t {
                    font-size: 15px !important;
                    font-weight: 500 !important;
                    width: unset !important;
                    overflow: unset !important;
                    text-wrap: wrap !important;
                    line-height: 1.4em !important;
                }
                .av-item .av-about .info .state {
                    margin-left: auto !important;
                }
                .av-item .av-about .info .state .looked {
                    font-size: 14px !important;
                    margin-right: unset !important;
                }
                .info.clearfix {
                    margin-top: auto !important;
                    display: flex !important;
                    flex-direction: initial !important;
                    align-items: center !important;
                }
                .info.clearfix .user {
                    display: flex !important;
                    align-items: center !important;
                }
                .info.clearfix .user span:last-child {
                    margin: 0 0 0 6px !important;
                    font-size: 14px !important;
                    float: unset !important;
                }
            `,
        }),
        // 修复字体
        new CheckboxItem({
            itemID: 'font-patch',
            description: '修复字体',
            itemCSS: `
                ${fontFaceRegular}
                ${fontFaceMedium}
                body {
                    font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif !important;
                    font-weight: 400;
                    font-size: 14px;
                }
                .av-item .av-about .t {
                    font-family: PingFang SC, HarmonyOS_Medium, Helvetica Neue, Microsoft YaHei, sans-serif !important;
                    font-weight: 500 !important;
                }
            `,
        }),
    ]
    watchlaterGroupList.push(new Group('watchlater-basic', '稍后再看页 基本功能', basicItems))
}

export { watchlaterGroupList }

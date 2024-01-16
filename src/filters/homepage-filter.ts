import { Group } from '../core/group'
import { CheckboxItem, NumberItem } from '../core/item'
import { isPageHomepage } from '../utils/page-type'

const basicItems: (CheckboxItem | NumberItem)[] = []
// GroupList
const homepageFilterGroupList: Group[] = []

if (isPageHomepage()) {
    {
        // 启用 视频时长过滤
        basicItems.push(
            new CheckboxItem('homepage-hide-recommend-swipe', '启用 视频时长过滤', false, undefined, false, ``),
        )
        basicItems.push(new NumberItem('homepage-test-second', '设定最低时长 (刷新生效)', 90, 0, 300, 5, '秒'))
    }
}
homepageFilterGroupList.push(new Group('homepage-test', '测试组', basicItems))
export { homepageFilterGroupList }

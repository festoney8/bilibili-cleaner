import { BiliCleanerStorage } from './utils/storage'

export default {
    enableDebugRules: !!BiliCleanerStorage.get('debug-rules'),
    enableDebugFilter: !!BiliCleanerStorage.get('debug-filters'),
    filterVisitSign: 'bili-cleaner-filtered', // 标记视频过滤器检测过的视频
    filterHideSign: 'bili-cleaner-hide', // 标记视频过滤器隐藏的视频
}

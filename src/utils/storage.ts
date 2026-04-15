import { GM_deleteValue, GM_getValue, GM_listValues, GM_setValue } from '$'
import { log } from './logger'

/**
 * @version 4.4.0
 * 存储迁移逻辑，必须在 main 函数之前执行
 */
export const migrate = async () => {
    if (GM_getValue('__MIGRATED__') === '4.4.0') {
        return
    }
    // 移除prefix
    const prefix = 'BILICLEANER_'
    const keys = GM_listValues().filter((key) => key.startsWith(prefix))
    for (const key of keys) {
        const newKey = key.slice(prefix.length)
        const value = GM_getValue(key)
        GM_setValue(newKey, value)
    }
    // 移除旧key
    keys.forEach((key) => GM_deleteValue(key))
    log(`Migrate ${keys.length} storage keys`)

    // 部分value改名
    const renameMap: Record<string, Record<string, string>> = {
        'channel-layout': {
            'channel-layout-disable': '0',
            'channel-layout-2-column': '2',
            'channel-layout-3-column': '3',
            'channel-layout-4-column': '4',
            'channel-layout-5-column': '5',
            'channel-layout-6-column': '6',
        },
        'homepage-layout': {
            'homepage-layout-disable': '0',
            'homepage-layout-2-column': '2',
            'homepage-layout-3-column': '3',
            'homepage-layout-4-column': '4',
            'homepage-layout-5-column': '5',
            'homepage-layout-6-column': '6',
        },
        'popular-layout': {
            'popular-layout-disable': '0',
            'popular-layout-2-column': '2',
            'popular-layout-3-column': '3',
            'popular-layout-4-column': '4',
            'popular-layout-5-column': '5',
            'popular-layout-6-column': '6',
        },
        'watchlater-layout': {
            'watchlater-layout-disable': '0',
            'watchlater-layout-4-column': '4',
            'watchlater-layout-5-column': '5',
        },
        'common-theme-dark': {
            'common-theme-dark-off': 'off',
            'common-theme-dark-on': 'on',
            'common-theme-dark-auto': 'auto',
            'common-theme-dark-default': 'default',
        },
    }
    for (const [key, valueMap] of Object.entries(renameMap)) {
        const value = GM_getValue(key)
        if (value in valueMap) {
            GM_setValue(key, valueMap[value])
        }
    }
    log(`Convert storage values complete`)

    // 标记迁移完成
    GM_setValue('__MIGRATED__', '4.4.0')
    log(`Migrate storage complete`)
}

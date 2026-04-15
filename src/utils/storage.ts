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
    const prefix = 'BILICLEANER_'
    const keys = GM_listValues().filter((key) => key.startsWith(prefix))
    for (const key of keys) {
        const newKey = key.slice(prefix.length)
        const value = GM_getValue(key)
        GM_setValue(newKey, value)
    }
    // 移除旧key，标记迁移完成
    keys.forEach((key) => GM_deleteValue(key))
    GM_setValue('__MIGRATED__', '4.4.0')
    log(`Migrated ${keys.length} storage keys`)
}

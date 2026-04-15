import { onScopeDispose, ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import {
    GM_addValueChangeListener,
    GM_getValue,
    GM_removeValueChangeListener,
    GM_setValue,
    type GmValueListenerId,
} from 'vite-plugin-monkey/dist/client'

/**
 * 一个 GM Value 的响应式状态，支持双向同步和防抖写入
 * @param key 存储键
 * @param initialValue 初始值
 * @param options 配置项
 * - deep: 是否深度监听对象/数组变化（默认为 true）
 * - syncFromStorage: 是否监听 GM value change 事件以同步外部修改（默认为 true）
 * - debounce: 写入 GM_setValue 的防抖时间，单位毫秒（默认 1000，最小 200）
 * @returns 响应式状态
 */
export const useGMValue = <T>(
    key: string,
    initialValue: T,
    options: {
        deep?: boolean
        syncFromStorage?: boolean
        debounce?: number
    } = {},
) => {
    const { deep = true, syncFromStorage = true, debounce = 1000 } = options
    const state = ref(GM_getValue(key, initialValue))

    watchDebounced(
        state,
        (value) => {
            GM_setValue(key, value)
        },
        {
            deep,
            debounce: debounce > 200 ? debounce : 200,
        },
    )

    let listenerId: GmValueListenerId | undefined
    if (syncFromStorage) {
        listenerId = GM_addValueChangeListener(key, (_name, _oldValue, newValue) => {
            state.value = newValue as T
        })
    }

    onScopeDispose(() => {
        if (listenerId != null) {
            GM_removeValueChangeListener(listenerId)
        }
    })

    return state
}

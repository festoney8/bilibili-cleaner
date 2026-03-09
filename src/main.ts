import { GM_registerMenuCommand } from '$'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { loadModules } from './modules'
import { toggleDarkMode } from './modules/rules/common/groups/theme'
import {
    useCommentFilterPanelStore,
    useDynamicFilterPanelStore,
    useRulePanelStore,
    useSideBtnStore,
    useVideoFilterPanelStore,
} from './stores/view'
import css from './style.css?inline'
import { waitForBody } from './utils/init'
import { error, log } from './utils/logger'
import { isPageLive } from './utils/pageType'

const main = () => {
    // 创建插件面板用shadowDOM节点
    const wrap = document.createElement('div')
    wrap.id = 'bili-cleaner'
    const root = wrap.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = css
    root.appendChild(style)

    /**
     * dev mode inline css HMR
     * @see https://github.com/lisonge/vite-plugin-monkey/blob/47ac609/playground/test-shadow-dom/src/hmr_inline_css.ts
     */
    if (import.meta.env.DEV && import.meta.hot) {
        import.meta.hot.accept('./style.css?inline', (newModule) => {
            const newCSS = newModule?.default as string
            style.textContent = newCSS ?? ''
        })
    }
    waitForBody().then(() => document.body.appendChild(wrap))

    // 创建插件面板
    const app = createApp(App as any)
    app.config.errorHandler = (err, vm, info) => {
        error('Vue:', err)
        error('Component:', vm)
        error('Info:', info)
    }

    const pinia = createPinia()
    app.use(pinia)

    app.mount(
        (() => {
            const node = document.createElement('div')
            root.appendChild(node)
            return node
        })(),
    )
}

const menu = () => {
    // skip live page iframe
    if (isPageLive() && self !== top) {
        return
    }
    const ruleStore = useRulePanelStore()
    const videoStore = useVideoFilterPanelStore()
    const commentStore = useCommentFilterPanelStore()
    const dynamicStore = useDynamicFilterPanelStore()
    const sideBtnStore = useSideBtnStore()

    GM_registerMenuCommand('✅ 页面净化优化', () => {
        ruleStore.toggle()
    })
    if (videoStore.isPageValid()) {
        GM_registerMenuCommand('✅ 视频过滤设置', () => {
            videoStore.toggle()
        })
    } else {
        GM_registerMenuCommand('🚫 视频过滤设置', () => {
            alert('[bilibili-cleaner] 本页面不支持视频过滤')
        })
    }
    if (commentStore.isPageValid()) {
        GM_registerMenuCommand('✅ 评论过滤设置', () => {
            commentStore.toggle()
        })
    } else {
        GM_registerMenuCommand('🚫 评论过滤设置', () => {
            alert('[bilibili-cleaner] 本页面不支持评论过滤')
        })
    }
    if (dynamicStore.isPageValid()) {
        GM_registerMenuCommand('✅ 动态过滤设置', () => {
            dynamicStore.toggle()
        })
    } else {
        GM_registerMenuCommand('🚫 动态过滤设置', () => {
            alert('[bilibili-cleaner] 本页面不支持动态过滤')
        })
    }
    GM_registerMenuCommand('⚡ 夜间模式开关', () => {
        toggleDarkMode()
    })
    GM_registerMenuCommand('⚡ 快捷按钮开关', () => {
        sideBtnStore.toggle()
    })
}

log(`mode: ${import.meta.env.MODE}, url: ${location.href}`)
for (const fn of [loadModules, main, menu]) {
    try {
        fn()
    } catch (err) {
        error(`main.ts ${fn.name} error`, err)
    }
}

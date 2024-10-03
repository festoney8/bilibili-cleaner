import { GM_registerMenuCommand } from '$'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { loadModules } from './modules'
import {
    useCommentFilterPanelStore,
    useDynamicFilterPanelStore,
    useRulePanelStore,
    useSideBtnStore,
    useVideoFilterPanelStore,
} from './stores/view'
import css from './style.css?inline'
import { waitForBody } from './utils/init'
import { log } from './utils/logger'
import { upgrade } from './utils/upgrade'

log(`start, mode: ${import.meta.env.MODE}, url: ${location.href}`)

upgrade()

loadModules()

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
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.mount(
    (() => {
        const node = document.createElement('div')
        root.appendChild(node)
        return node
    })(),
)

const ruleStore = useRulePanelStore()
const videoStore = useVideoFilterPanelStore()
const commentStore = useCommentFilterPanelStore()
const dynamicStore = useDynamicFilterPanelStore()
const sideBtnStore = useSideBtnStore()

GM_registerMenuCommand('✅ 页面净化优化', () => {
    ruleStore.isShow ? ruleStore.hide() : ruleStore.show()
})
GM_registerMenuCommand('✅ 视频过滤设置', () => {
    videoStore.isShow ? videoStore.hide() : videoStore.show()
})
GM_registerMenuCommand('✅ 评论过滤设置', () => {
    commentStore.isShow ? commentStore.hide() : commentStore.show()
})
GM_registerMenuCommand('✅ 动态过滤设置', () => {
    dynamicStore.isShow ? dynamicStore.hide() : dynamicStore.show()
})
GM_registerMenuCommand('⚡ 快捷按钮开关', () => {
    sideBtnStore.isShow ? sideBtnStore.hide() : sideBtnStore.show()
})

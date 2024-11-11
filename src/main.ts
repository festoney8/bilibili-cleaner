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
import { error, log } from './utils/logger'
import {
    isPageBangumi,
    isPageChannel,
    isPageDynamic,
    isPageHomepage,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageSpace,
    isPageVideo,
} from './utils/pageType'

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
    const app = createApp(App)
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
    const ruleStore = useRulePanelStore()
    const videoStore = useVideoFilterPanelStore()
    const commentStore = useCommentFilterPanelStore()
    const dynamicStore = useDynamicFilterPanelStore()
    const sideBtnStore = useSideBtnStore()

    GM_registerMenuCommand('✅ 页面净化优化', () => {
        ruleStore.isShow ? ruleStore.hide() : ruleStore.show()
    })
    if (
        isPageHomepage() ||
        isPageVideo() ||
        isPagePlaylist() ||
        isPagePopular() ||
        isPageChannel() ||
        isPageSearch() ||
        isPageSpace()
    ) {
        GM_registerMenuCommand('✅ 视频过滤设置', () => {
            videoStore.isShow ? videoStore.hide() : videoStore.show()
        })
    } else {
        GM_registerMenuCommand('🚫 视频过滤设置', () => {
            alert('[bilibili-cleaner] 本页面不支持视频过滤')
        })
    }
    if (isPageVideo() || isPageBangumi() || isPageDynamic() || isPageSpace() || isPagePlaylist()) {
        GM_registerMenuCommand('✅ 评论过滤设置', () => {
            commentStore.isShow ? commentStore.hide() : commentStore.show()
        })
    } else {
        GM_registerMenuCommand('🚫 评论过滤设置', () => {
            alert('[bilibili-cleaner] 本页面不支持评论过滤')
        })
    }
    if (isPageDynamic()) {
        GM_registerMenuCommand('✅ 动态过滤设置', () => {
            dynamicStore.isShow ? dynamicStore.hide() : dynamicStore.show()
        })
    } else {
        GM_registerMenuCommand('🚫 动态过滤设置', () => {
            alert('[bilibili-cleaner] 本页面不支持动态过滤')
        })
    }
    GM_registerMenuCommand('⚡ 快捷按钮开关', () => {
        sideBtnStore.isShow ? sideBtnStore.hide() : sideBtnStore.show()
    })
}

try {
    log(`script start, mode: ${import.meta.env.MODE}, url: ${location.href}`)
    loadModules()
    main()
    menu()
    log(`script end`)
} catch (err) {
    error('main.ts error', err)
}

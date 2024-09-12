import { GM_registerMenuCommand } from '$'
import { loadModules } from './modules'
import { waitForBody } from './utils/init'
import { log } from './utils/logger'

log(`script start, mode: ${import.meta.env.MODE}, url: ${location.href}`)

loadModules()

waitForBody().then(() => {
    log(`body appear`)

    // createApp(App).mount(
    //     (() => {
    //         const wrap = document.createElement('div')
    //         wrap.id = 'bili-cleaner'
    //         const root = wrap.attachShadow({ mode: 'open' })

    //         const app = document.createElement('div')
    //         root.appendChild(app)

    //         /**
    //          * dev mode inline css HMR
    //          * @see https://github.com/lisonge/vite-plugin-monkey/blob/47ac609/playground/test-shadow-dom/src/hmr_inline_css.ts
    //          */
    //         if (import.meta.env.DEV) {
    //             const style = document.createElement('style')
    //             style.textContent = css
    //             root.appendChild(style)
    //             if (import.meta.hot) {
    //                 import.meta.hot.accept('./style.css?inline', (newModule) => {
    //                     const newCSS = newModule?.default as string
    //                     style.textContent = newCSS ?? ``
    //                 })
    //             }
    //             root.appendChild(style)
    //         } else {
    //             // prod mode
    //             const style = document.createElement('style')
    //             style.textContent = css
    //             root.appendChild(style)
    //         }

    //         document.body?.appendChild(wrap)
    //         return app
    //     })(),
    // )
})

const menu = () => {
    const register = () => {
        GM_registerMenuCommand('✅页面净化优化', () => {
            alert('✅页面净化优化')
        })

        GM_registerMenuCommand('✅视频过滤设置', () => {
            alert('✅视频过滤设置')
        })

        GM_registerMenuCommand('✅动态过滤设置', () => {
            alert('✅动态过滤设置')
        })

        GM_registerMenuCommand('✅评论过滤设置', () => {
            alert('✅评论过滤设置')
        })
    }
    register()
}

menu()

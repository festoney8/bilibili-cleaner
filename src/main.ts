import { createApp } from 'vue'
import { waitForBody, waitForHead } from './utils/init'
import { log } from './utils/logger'
import css from './style.css?inline'

log(`script start, mode: ${import.meta.env.MODE}, url: ${location.href}`)

waitForHead().then(() => {
    log('head appear')
})

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

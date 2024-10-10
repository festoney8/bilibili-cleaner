import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import monkey, { cdn } from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
    // https://github.com/sass/dart-sass/issues/2352
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.ts',
            userscript: {
                name: 'bilibili 页面净化大师',
                namespace: 'http://tampermonkey.net/',
                version: '4.0.1',
                description:
                    '净化 B站/哔哩哔哩 页面，支持「精简功能、播放器净化、过滤视频、过滤评论、全站黑白名单」，提供 300+ 功能，定制自己的 B 站',
                author: 'festoney8',
                homepage: 'https://github.com/festoney8/bilibili-cleaner',
                supportURL: 'https://github.com/festoney8/bilibili-cleaner',
                license: 'MIT',
                match: ['*://*.bilibili.com/*'],
                exclude: [
                    '*://message.bilibili.com/pages/nav/header_sync',
                    '*://message.bilibili.com/pages/nav/index_new_pc_sync',
                    '*://data.bilibili.com/*',
                    '*://cm.bilibili.com/*',
                    '*://link.bilibili.com/*',
                    '*://passport.bilibili.com/*',
                    '*://api.bilibili.com/*',
                    '*://api.*.bilibili.com/*',
                    '*://*.chat.bilibili.com/*',
                    '*://member.bilibili.com/*',
                    '*://www.bilibili.com/correspond/*',
                    '*://live.bilibili.com/p/html/*',
                    '*://live.bilibili.com/live-room-play-game-together',
                ],
                icon: 'https://www.bilibili.com/favicon.ico',
                'run-at': 'document-start',
                downloadURL:
                    'https://update.greasyfork.org/scripts/479861/bilibili%20%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96%E5%A4%A7%E5%B8%88.user.js',
                updateURL:
                    'https://update.greasyfork.org/scripts/479861/bilibili%20%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96%E5%A4%A7%E5%B8%88.meta.js',
            },
            build: {
                externalGlobals: {
                    vue: cdn.npmmirror('Vue', 'dist/vue.global.prod.js'),
                },
            },
        }),
    ],
})

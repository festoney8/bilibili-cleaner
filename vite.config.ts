import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.ts',
            userscript: {
                name: 'bilibili 页面净化大师',
                namespace: 'http://tampermonkey.net/',
                version: '3.3.1',
                description:
                    '净化 B站/哔哩哔哩 网页元素，去广告，BV号转AV号，播放器净化，过滤视频，过滤评论，提供300+项功能，定制自己的B站页面',
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
                ],
                icon: 'https://www.bilibili.com/favicon.ico',
                'run-at': 'document-start',
                downloadURL:
                    'https://update.greasyfork.org/scripts/479861/bilibili%20%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96%E5%A4%A7%E5%B8%88.user.js',
                updateURL:
                    'https://update.greasyfork.org/scripts/479861/bilibili%20%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96%E5%A4%A7%E5%B8%88.meta.js',
            },
        }),
    ],
    // pnpm run dev时实时编译, 但需手动刷新页面
    server: {
        hmr: false,
    },
})

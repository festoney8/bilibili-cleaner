import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.ts',
            userscript: {
                name: 'bilibili 页面净化大师',
                namespace: 'http://tampermonkey.net/',
                version: '2.0.0',
                description: '净化 B站/哔哩哔哩 页面内各种元素，去广告，BV号转AV号，提供300+项功能，定制自己的B站页面',
                author: 'festoney8',
                homepage: 'https://github.com/festoney8/bilibili-cleaner',
                license: 'MIT',
                match: ['*://*.bilibili.com/*'],
                exclude: [
                    '*://message.bilibili.com/pages/nav/header_sync',
                    '*://data.bilibili.com/*',
                    '*://cm.bilibili.com/*',
                    '*://passport.bilibili.com/*',
                    '*://api.bilibili.com/*',
                    '*://api.*.bilibili.com/*',
                    '*://*.chat.bilibili.com/*',
                ],
                icon: 'https://www.bilibili.com/favicon.ico',
                'run-at': 'document-start',
            },
        }),
    ],
})
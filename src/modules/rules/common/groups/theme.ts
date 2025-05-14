import { Item } from '@/types/item'
import { isPageDynamic, isPageLive, isPageMessage } from '@/utils/pageType'
import { useCookies } from '@vueuse/integrations/useCookies'

// 启用夜间模式
const enableDarkMode = async () => {
    // 直播页设定夜间模式, 拦截其他代码修改lab-style
    if (isPageLive()) {
        document.documentElement.setAttribute('common-theme-dark-live', '')
        document.documentElement.setAttribute('lab-style', 'dark')
        const origSetAttribute = Element.prototype.setAttribute
        Element.prototype.setAttribute = function (attr, value) {
            if (this === document.documentElement && attr === 'lab-style') {
                return origSetAttribute.call(this, attr, 'dark')
            }
            return origSetAttribute.call(this, attr, value)
        }
    }
    if (isPageDynamic()) {
        document.documentElement.setAttribute('common-theme-dark-dynamic', '')
    }
    if (isPageMessage()) {
        document.documentElement.setAttribute('common-theme-dark-message', '')
    } else {
        document.documentElement.setAttribute('common-theme-dark-common', '')
    }

    const cookies = useCookies()
    if (cookies.get('theme_style') === 'dark') {
        return
    }
    // 首次启用, 设置cookie, 修改样式
    const expires = new Date()
    expires.setDate(expires.getDate() + 3650)
    cookies.set('theme_style', 'dark', {
        path: '/',
        domain: '.bilibili.com',
        expires: expires,
    })
    const style = document.querySelector('head link#__css-map__') as HTMLLinkElement
    if (style?.href.includes('light.css')) {
        style.href = style.href.replace('light.css', 'dark.css')
    }
}

// 禁用夜间模式
const disableDarkMode = async () => {
    document.documentElement.removeAttribute('common-theme-dark-live')
    document.documentElement.removeAttribute('common-theme-dark-dynamic')
    document.documentElement.removeAttribute('common-theme-dark-message')
    document.documentElement.removeAttribute('common-theme-dark-common')
    if (isPageLive()) {
        document.documentElement.removeAttribute('lab-style')
    }

    const cookies = useCookies()
    if (cookies.get('theme_style') === 'light') {
        return
    }
    const expires = new Date()
    expires.setDate(expires.getDate() + 3650)
    cookies.set('theme_style', 'light', {
        path: '/',
        domain: '.bilibili.com',
        expires: expires,
    })
    const style = document.querySelector('head link#__css-map__') as HTMLLinkElement
    if (style?.href.includes('dark.css')) {
        style.href = style.href.replace('dark.css', 'light.css')
    }
}

export const commonThemeItems: Item[] = [
    {
        type: 'list',
        id: 'common-theme-dark',
        name: '夜间模式',
        description: ['实验功能，仅对常用页面生效'],
        defaultValue: 'common-theme-dark-off',
        disableValue: 'common-theme-dark-off',
        options: [
            {
                value: 'common-theme-dark-off',
                name: '禁用',
                fn: disableDarkMode,
            },
            {
                value: 'common-theme-dark-on',
                name: '启用',
                fn: enableDarkMode,
            },
            {
                value: 'common-theme-dark-auto',
                name: '跟随系统',
                fn: async () => {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        await enableDarkMode()
                    } else {
                        await disableDarkMode()
                    }
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            await enableDarkMode()
                        } else {
                            await disableDarkMode()
                        }
                    })
                },
            },
        ],
    },
]

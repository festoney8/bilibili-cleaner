import { useGMValue } from '@/composables/gmValue'
import { Item } from '@/types/item'
import { isPageDynamic, isPageHomepage, isPageLive, isPageMessage, isPageSpace } from '@/utils/pageType'

import { usePreferredDark } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref, watch } from 'vue'

// 夜间模式状态
export const isDarkMode = ref(false)

// 同步夜间模式状态
const themeState = useGMValue('common-theme-dark', 'off', {
    deep: false,
    debounce: 1000,
})

export const toggleDarkMode = async () => {
    if (isDarkMode.value) {
        await disableDarkMode()
        themeState.value = 'off'
    } else {
        await enableDarkMode()
        themeState.value = 'on'
    }
}

// 是否禁止修改lab-style属性
let labStyleLock = false

// 启用夜间模式
const enableDarkMode = async () => {
    isDarkMode.value = true

    // 直播页设定夜间模式, 拦截其他代码修改lab-style
    if (isPageLive()) {
        document.documentElement.setAttribute('common-theme-dark-page', 'live')
        document.documentElement.setAttribute('lab-style', 'dark')
        labStyleLock = true
        const origSetAttribute = Element.prototype.setAttribute
        Element.prototype.setAttribute = function (attr, value) {
            if (labStyleLock && this === document.documentElement && attr === 'lab-style') {
                return origSetAttribute.call(this, attr, 'dark')
            }
            return origSetAttribute.call(this, attr, value)
        }
    } else if (isPageDynamic()) {
        document.documentElement.setAttribute('common-theme-dark-page', 'dynamic')
        document.documentElement.classList.add('bili_dark')
    } else if (isPageMessage()) {
        document.documentElement.setAttribute('common-theme-dark-page', 'message')
        document.documentElement.classList.add('bili_dark')
    } else if (isPageSpace()) {
        document.documentElement.setAttribute('common-theme-dark-page', 'space')
    } else if (isPageHomepage()) {
        document.documentElement.classList.add('bili_dark')
    } else {
        document.documentElement.setAttribute('common-theme-dark-page', 'common')
    }

    const style = document.querySelector('head link#__css-map__') as HTMLLinkElement
    if (style?.href.includes('light.css')) {
        style.href = style.href.replace('light.css', 'dark.css')
    }

    const cookies = useCookies()
    if (cookies.get('theme_style') === 'dark') {
        return
    }
    const expires = new Date()
    expires.setDate(expires.getDate() + 3650)
    cookies.set('theme_style', 'dark', {
        path: '/',
        domain: '.bilibili.com',
        expires: expires,
    })
}

// 禁用夜间模式
const disableDarkMode = async () => {
    isDarkMode.value = false

    document.documentElement.removeAttribute('common-theme-dark-page')

    if (isPageLive()) {
        labStyleLock = false
        document.documentElement.setAttribute('lab-style', '')
    }
    if (isPageDynamic() || isPageMessage() || isPageHomepage()) {
        document.documentElement.classList.remove('bili_dark')
    }
    const style = document.querySelector('head link#__css-map__') as HTMLLinkElement
    if (style?.href.includes('dark.css')) {
        style.href = style.href.replace('dark.css', 'light.css')
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
}

// 监听状态切换
watch(themeState, async (value) => {
    if (value === 'on' && !isDarkMode.value) {
        isDarkMode.value = true
        await enableDarkMode()
    }
    if (value === 'off' && isDarkMode.value) {
        isDarkMode.value = false
        await disableDarkMode()
    }
})

export const commonThemeItems: Item[] = [
    {
        type: 'list',
        id: 'common-theme-dark',
        name: '夜间模式',
        description: [
            '实验功能，仅对常用页面生效',
            '插件会接管夜间模式，官方默认时不接管',
            '官方模式在顶栏头像菜单中设定',
        ],
        defaultValue: 'default',
        disableValue: 'default',
        options: [
            {
                value: 'off',
                name: '日间',
                fn: disableDarkMode,
            },
            {
                value: 'on',
                name: '夜间',
                fn: enableDarkMode,
            },
            {
                value: 'auto',
                name: '跟随系统',
                fn: async () => {
                    const isDark = usePreferredDark()
                    watch(
                        isDark,
                        async (v) => {
                            if (v) {
                                await enableDarkMode()
                            } else {
                                await disableDarkMode()
                            }
                        },
                        { immediate: true },
                    )
                },
            },
            {
                value: 'default',
                name: '官方默认',
            },
        ],
    },
]

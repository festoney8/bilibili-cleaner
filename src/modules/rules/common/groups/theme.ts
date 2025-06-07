import { Item } from '@/types/item'
import { isPageDynamic, isPageLive, isPageMessage, isPageSpace } from '@/utils/pageType'
import { BiliCleanerStorage } from '@/utils/storage'
import { useBroadcastChannel, usePreferredDark } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref, watch } from 'vue'

// 夜间模式状态
export const isDarkMode = ref(false)

// 多标签页同步(无法跨二级域名)
const { data, post } = useBroadcastChannel({ name: 'bili-cleaner-theme-channel' })

export const toggleDarkMode = async () => {
    if (isDarkMode.value) {
        await disableDarkMode()
        if (BiliCleanerStorage.get('common-theme-dark') !== 'common-theme-dark-off') {
            BiliCleanerStorage.set('common-theme-dark', 'common-theme-dark-off')
        }
        post('off')
    } else {
        await enableDarkMode()
        if (BiliCleanerStorage.get('common-theme-dark') !== 'common-theme-dark-on') {
            BiliCleanerStorage.set('common-theme-dark', 'common-theme-dark-on')
        }
        post('on')
    }
}

// 是否禁止修改lab-style属性
let labStyleLock = false

// 启用夜间模式
const enableDarkMode = async () => {
    isDarkMode.value = true

    // 直播页设定夜间模式, 拦截其他代码修改lab-style
    if (isPageLive()) {
        document.documentElement.setAttribute('common-theme-dark-live', '')
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
        document.documentElement.setAttribute('common-theme-dark-dynamic', '')
    } else if (isPageMessage()) {
        document.documentElement.setAttribute('common-theme-dark-message', '')
    } else if (isPageSpace()) {
        document.documentElement.setAttribute('common-theme-dark-space', '')
    } else {
        document.documentElement.setAttribute('common-theme-dark-common', '')
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

    document.documentElement.removeAttribute('common-theme-dark-live')
    document.documentElement.removeAttribute('common-theme-dark-dynamic')
    document.documentElement.removeAttribute('common-theme-dark-message')
    document.documentElement.removeAttribute('common-theme-dark-space')
    document.documentElement.removeAttribute('common-theme-dark-common')

    if (isPageLive()) {
        labStyleLock = false
        document.documentElement.setAttribute('lab-style', '')
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
watch(data, async () => {
    if (data.value === 'on') {
        isDarkMode.value = true
        await enableDarkMode()
    }
    if (data.value === 'off') {
        isDarkMode.value = false
        await disableDarkMode()
    }
})

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
        ],
    },
]

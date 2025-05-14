import { Item } from '@/types/item'
import { useCookies } from '@vueuse/integrations/useCookies'
import { isPageDynamic, isPageLive, isPageMessage } from '@/utils/pageType.ts'

export const commonThemeItems: Item[] = [
    {
        type: 'switch',
        id: 'common-theme-dark',
        name: '夜间模式',
        attrName: ((): string | undefined => {
            if (isPageDynamic()) {
                return 'common-theme-dark-dynamic'
            }
            if (isPageLive()) {
                return 'common-theme-dark-live'
            }
            if (isPageMessage()) {
                return 'common-theme-dark-message'
            }
            return 'common-theme-dark-common'
        })(),
        enableFn: async () => {
            // 直播页, 设定夜间模式, 拦截其他代码修改lab-style
            if (isPageLive()) {
                document.documentElement.setAttribute('lab-style', 'dark')
                const origSetAttribute = Element.prototype.setAttribute
                Element.prototype.setAttribute = function (attr, value) {
                    if (this === document.documentElement && attr === 'lab-style') {
                        return origSetAttribute.call(this, attr, 'dark')
                    }
                    return origSetAttribute.call(this, attr, value)
                }
            }

            const cookies = useCookies()
            if (cookies.get('theme_style') === 'dark') {
                return
            }

            // 首次启用, 设置cookie
            const expires = new Date()
            expires.setDate(expires.getDate() + 3650)
            cookies.set('theme_style', 'dark', {
                path: '/',
                domain: '.bilibili.com',
                expires: expires,
            })
            const style = document.querySelector('head link#__css-map__') as HTMLLinkElement
            if (style && style.href.includes('light.css')) {
                style.href = style.href.replace('light.css', 'dark.css')
            }
        },
        disableFn: () => {
            const cookies = useCookies()
            const expires = new Date()
            expires.setDate(expires.getDate() + 3650)
            cookies.set('theme_style', 'light', {
                path: '/',
                domain: '.bilibili.com',
                expires: expires,
            })
            const style = document.querySelector('head link#__css-map__') as HTMLLinkElement
            if (style && style.href.includes('dark.css')) {
                style.href = style.href.replace('dark.css', 'light.css')
            }
        },
    },
]

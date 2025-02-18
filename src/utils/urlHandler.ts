import { unsafeWindow } from '$'
import { error } from './logger'

class URLHandler {
    private static instance: URLHandler

    private origReplaceState = unsafeWindow.history.replaceState
    private origPushState = unsafeWindow.history.pushState

    // URL清理函数
    cleanFnArr: ((url: string) => string)[] = []

    private constructor() {
        try {
            this.hijack()
        } catch (err) {
            error('init URLHandler error', err)
        }
    }

    static getInstance() {
        if (!URLHandler.instance) {
            URLHandler.instance = new URLHandler()
        }
        return URLHandler.instance
    }

    private hijack() {
        unsafeWindow.history.replaceState = (data: any, unused: string, url?: string | URL | null): void => {
            try {
                if (typeof url === 'string') {
                    // 修补url
                    if (!url.startsWith(location.origin) && !url.startsWith(location.hostname)) {
                        url = `${location.origin}${url.startsWith('/') ? '' : '/'}${url}`
                    }
                    const cleanURL = this.cleanFnArr.reduce((curr, fn) => fn(curr), url)
                    if (location.href.endsWith(cleanURL)) {
                        return
                    }
                    return this.origReplaceState.apply(unsafeWindow.history, [data, unused, cleanURL])
                }
                return this.origReplaceState.apply(unsafeWindow.history, [data, unused, url])
            } catch (err) {
                error('URLHandler replaceState error', err)
                return this.origReplaceState.apply(unsafeWindow.history, [data, unused, url])
            }
        }
        unsafeWindow.history.pushState = (data: any, unused: string, url?: string | URL | null): void => {
            try {
                if (typeof url === 'string') {
                    if (!url.startsWith(location.origin) && !url.startsWith(location.hostname)) {
                        url = `${location.origin}${url.startsWith('/') ? '' : '/'}${url}`
                    }
                    const cleanURL = this.cleanFnArr.reduce((curr, fn) => fn(curr), url)
                    if (location.href.endsWith(cleanURL)) {
                        return
                    }
                    return this.origPushState.apply(unsafeWindow.history, [data, unused, cleanURL])
                }
                return this.origPushState.apply(unsafeWindow.history, [data, unused, url])
            } catch (err) {
                error('URLHandler pushState error', err)
                return this.origReplaceState.apply(unsafeWindow.history, [data, unused, url])
            }
        }
    }

    clean() {
        try {
            const cleanURL = this.cleanFnArr.reduce((curr, fn) => fn(curr), location.href)
            if (location.href !== cleanURL) {
                this.origReplaceState.apply(unsafeWindow.history, [null, '', cleanURL])
            }
        } catch (err) {
            error('init URLHandler error', err)
        }
    }
}

const URLHandlerInstance = URLHandler.getInstance()
export default URLHandlerInstance

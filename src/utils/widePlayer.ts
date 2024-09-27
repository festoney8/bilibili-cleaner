import { unsafeWindow } from '$'
import { isPagePlaylist, isPageVideo } from './pageType'

class WideScreenManager {
    private static instance: WideScreenManager
    private wideScreenLock = false

    private constructor() {
        if (isPageVideo() || isPagePlaylist()) {
            let _isWide = unsafeWindow.isWide
            Object.defineProperty(unsafeWindow, 'isWide', {
                get: () => _isWide,
                set: (value: boolean) => {
                    _isWide = value || this.wideScreenLock
                    if (_isWide) {
                        document.documentElement?.setAttribute('player-is-wide', '')
                    } else {
                        document.documentElement?.removeAttribute('player-is-wide')
                    }
                },
            })
        }
    }

    static getInstance(): WideScreenManager {
        if (!WideScreenManager.instance) {
            WideScreenManager.instance = new WideScreenManager()
        }
        return WideScreenManager.instance
    }

    lock() {
        this.wideScreenLock = true
    }

    unlock() {
        this.wideScreenLock = false
    }
}

export const wideScreenManager = WideScreenManager.getInstance()

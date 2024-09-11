import { unsafeWindow } from '$'
import { isPagePlaylist, isPageVideo } from './pageType'

// 宽屏模式监听
let _isWide = unsafeWindow.isWide
// 宽屏模式锁, 宽屏按钮单击后释放
const wideScreenLock = false

if (isPageVideo() || isPagePlaylist()) {
    Object.defineProperty(unsafeWindow, 'isWide', {
        get() {
            return _isWide
        },
        set(value) {
            _isWide = value || wideScreenLock
            if (typeof _isWide === 'boolean') {
                // 标记是否为宽屏模式，供播放设定功能的CSS使用
                if (unsafeWindow.isWide) {
                    document.documentElement?.setAttribute('player-is-wide', '')
                } else {
                    document.documentElement?.removeAttribute('player-is-wide')
                }
            }
        },
    })
}

////////////////////////////////////////

class WideScreenManager {
    private static instance: WideScreenManager
    private wideScreenLock = false

    private constructor() {
        if (isPageVideo() || isPagePlaylist()) {
            _isWide = unsafeWindow.isWide
            Object.defineProperty(unsafeWindow, 'isWide', {
                get: () => _isWide,
                set: (value: boolean) => {
                    _isWide = value || this.wideScreenLock
                    if (typeof _isWide === 'boolean') {
                        if (_isWide) {
                            document.documentElement?.setAttribute('player-is-wide', '')
                        } else {
                            document.documentElement?.removeAttribute('player-is-wide')
                        }
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

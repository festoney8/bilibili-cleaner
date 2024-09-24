import { unsafeWindow } from '$'
import { error } from './logger'
import { isPageInvalid } from './pageType'

class FetchHook {
    private static instance: FetchHook

    // 根据input和init对input进行预处理
    private preFnArr: ((input: RequestInfo | URL, init: RequestInit | undefined) => RequestInfo | URL)[] = []
    // 根据input,init,resp做返回resp前的后处理, 如克隆resp
    private postFnArr: ((
        input: RequestInfo | URL,
        init: RequestInit | undefined,
        resp?: Response,
    ) => Response | void | Promise<Response | void>)[] = []

    private constructor() {
        try {
            if (!isPageInvalid()) {
                this.hook()
            }
        } catch (err) {
            error('hook fetch error', err)
        }
    }

    static getInstance(): FetchHook {
        if (!FetchHook.instance) {
            FetchHook.instance = new FetchHook()
        }
        return FetchHook.instance
    }

    addPreFn(fn: (input: RequestInfo | URL, init: RequestInit | undefined) => RequestInfo | URL) {
        this.preFnArr.push(fn)
    }

    addPostFn(
        fn: (
            input: RequestInfo | URL,
            init: RequestInit | undefined,
            resp?: Response,
        ) => Response | void | Promise<Response | void>,
    ) {
        this.postFnArr.push(fn)
    }

    hook() {
        const origFetch = unsafeWindow.fetch
        unsafeWindow.fetch = async (input, init?) => {
            try {
                // 预处理
                this.preFnArr.forEach((fn) => {
                    input = fn(input, init)
                })
            } catch {
                return origFetch(input, init)
            }
            // 获取resp
            let resp = await origFetch(input, init)
            const origResp = resp.clone()
            try {
                // 后处理
                for (const fn of this.postFnArr) {
                    const ans = await fn(input, init, resp)
                    if (ans) {
                        resp = ans
                    }
                }
            } catch (err) {
                error('fetch hook postFnArr', err)
                return origResp
            }
            return resp
        }
    }
}

const fetchHook = FetchHook.getInstance()
export default fetchHook

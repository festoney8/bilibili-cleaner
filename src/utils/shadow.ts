import { error } from './logger'
import { isPageBangumi, isPageDynamic, isPagePlaylist, isPageVideo } from './pageType'

type TagName = string

export class Shadow {
    /**
     * 单例
     */
    private static instance: Shadow

    /**
     * 记录全部shadowRoot节点
     * key: tagName, value: ShadowRoot Set
     */
    shadowStore = new Map<TagName, Set<ShadowRoot>>()

    /**
     * 记录需注入的样式
     * key: tagName, value: css+className set
     */
    cssStore = new Map<
        TagName,
        Set<{
            className: string
            css: string
        }>
    >()

    /**
     * ShadowRoot内的MutationObserver
     * key: tagName, value: MutationObserver set
     */
    observerStore = new Map<TagName, Set<[MutationObserver, MutationObserverInit]>>()

    private constructor() {
        try {
            // 特定页面运行
            if (isPageVideo() || isPageBangumi() || isPageDynamic() || isPagePlaylist()) {
                this.hook()
            }
        } catch (err) {
            error('hook shadow failed', err)
        }
    }

    static getInstance() {
        if (!Shadow.instance) {
            Shadow.instance = new Shadow()
        }
        return Shadow.instance
    }

    /**
     * hook attachShadow，创建shadowRoot时注入自定义样式，启用自定义监听
     * 重载ShadowRoot.innerHTML，被调用时注入自定义样式
     */
    private hook() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        const origAttachShadow = Element.prototype.attachShadow

        Element.prototype.attachShadow = function (init) {
            const shadowRoot = origAttachShadow.call(this, init)
            const tag = this.tagName

            // 注入样式
            const styles = self.cssStore.get(tag)
            styles?.forEach((v) => {
                const style = document.createElement('style')
                style.textContent = v.css
                style.setAttribute('bili-cleaner-css', v.className)
                shadowRoot.appendChild(style)
            })

            // 记录节点
            if (self.shadowStore.has(tag)) {
                self.shadowStore.get(tag)!.add(shadowRoot)
            } else {
                self.shadowStore.set(tag, new Set([shadowRoot]))
            }

            // 监听节点
            if (self.observerStore.has(tag)) {
                for (const [observer, config] of self.observerStore.get(tag)!) {
                    observer.observe(shadowRoot, config)
                }
            }
            return shadowRoot
        }

        // 官方初始化节点有时会用shadowRoot.innerHTML破坏自定义style（如BILI-RICH-TEXT, BILI-AVATAR）
        const origShadowInnerHTML = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, 'innerHTML')
        Object.defineProperty(ShadowRoot.prototype, 'innerHTML', {
            get() {
                return origShadowInnerHTML!.get!.call(this)
            },
            set(value) {
                const tagName = this.host.tagName
                if (tagName && self.cssStore.has(tagName)) {
                    const shadowStyles = self.cssStore.get(tagName)
                    shadowStyles?.forEach((v) => {
                        value += `<style bili-cleaner-css="${v.className}">${v.css}</style>`
                    })
                }
                origShadowInnerHTML!.set!.call(this, value)
            },
        })
    }

    /**
     * 新增需要在shadowDOM内注入的样式
     * @param tag tagName
     * @param className css类名
     * @param css 样式
     */
    addShadowStyle(tag: TagName, className: string, css: string) {
        tag = tag.toUpperCase()
        const curr = this.cssStore.get(tag)
        if (curr) {
            curr.add({ className: className, css: css })
        } else {
            this.cssStore.set(tag, new Set([{ className: className, css: css }]))
        }

        if (this.shadowStore.size) {
            const nodes = this.shadowStore.get(tag)
            nodes?.forEach((node) => {
                const style = document.createElement('style')
                style.textContent = css
                style.setAttribute('bili-cleaner-css', className)
                node.appendChild(style)
            })
        }
    }

    /**
     * 移除需要在shadowDOM内注入的样式
     * @param tag tagName
     * @param className css类名
     */
    removeShadowStyle(tag: TagName, className: string) {
        tag = tag.toUpperCase()
        const curr = this.cssStore.get(tag)
        if (curr) {
            for (const value of curr) {
                if (value.className === className) {
                    curr.delete(value)
                    break
                }
            }
        }

        if (this.shadowStore.size) {
            const nodes = this.shadowStore.get(tag)
            nodes?.forEach((node) => {
                node.querySelectorAll(`style[bili-cleaner-css="${className}"]`).forEach((v) => v.remove())
            })
        }
    }

    /**
     * 新增shadowRoot内MutationObserver
     * @param tag tagName
     * @param observer MutationObserver
     * @param config Observer配置
     */
    addShadowObserver(tag: TagName, observer: MutationObserver, config: MutationObserverInit) {
        tag = tag.toUpperCase()
        const curr = this.observerStore.get(tag)
        if (curr) {
            curr.add([observer, config])
        } else {
            this.observerStore.set(tag, new Set([[observer, config]]))
        }

        if (this.shadowStore.size) {
            const nodes = this.shadowStore.get(tag)
            nodes?.forEach((node) => {
                observer.observe(node, config)
            })
        }
    }
}

const ShadowInstance = Shadow.getInstance()
export default ShadowInstance

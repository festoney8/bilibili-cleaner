import { error } from './logger'

type shadowCSS = {
    // tagName: string
    css: string
    className: string
}

export class Shadow {
    // shadowRoot节点列表
    shadowRootMap = new Map<string, ShadowRoot[]>()
    // shadowRoot内注入style列表
    shadowStyleMap = new Map<string, shadowCSS[]>()
    // 需记录shadowRoot的tag名单
    tagSet: Set<string>

    /**
     * @param tagArr 需记录shadowRoot元素的tagName列表
     */
    constructor(tagArr: string[]) {
        try {
            this.hook()
        } catch (err) {
            error('shadow hook error')
        }
        this.tagSet = new Set(tagArr.map((v) => v.toUpperCase()))
    }

    /**
     * hook attachShadow函数，创建shadowRoot时注入自定义规则
     */
    hook() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        const origAttachShadow = Element.prototype.attachShadow

        Element.prototype.attachShadow = function (init) {
            const shadowRoot = origAttachShadow.call(this, init)
            if (!self.tagSet.has(this.tagName)) {
                return shadowRoot
            }

            // 注入样式
            const styles = self.shadowStyleMap.get(this.tagName)
            styles?.forEach((v) => {
                const style = document.createElement('style')
                style.textContent = v.css
                style.setAttribute('bili-cleaner-css', v.className)
                shadowRoot.appendChild(style)
            })

            // 记录节点
            if (self.shadowRootMap.has(this.tagName)) {
                self.shadowRootMap.get(this.tagName)?.push(shadowRoot)
            } else {
                self.shadowRootMap.set(this.tagName, [shadowRoot])
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
                if (tagName && self.shadowStyleMap.has(tagName)) {
                    const shadowStyles = self.shadowStyleMap.get(tagName)
                    shadowStyles?.forEach((v) => {
                        value += `\n<style bili-cleaner-css="${v.className}">${v.css}</style>`
                    })
                }
                origShadowInnerHTML!.set!.call(this, value)
            },
        })
    }

    /**
     * 注册css规则
     * @param tagName shadowRoot父节点Tag名
     * @param cssClassName css类名
     * @param css 样式
     */
    register(tagName: string, cssClassName: string, css: string) {
        tagName = tagName.toUpperCase()
        css = css.replace(/\n\s*/g, '').trim()

        if (this.shadowStyleMap.has(tagName)) {
            this.shadowStyleMap.get(tagName)?.push({
                css: css,
                className: cssClassName,
            })
        } else {
            this.shadowStyleMap.set(tagName, [
                {
                    css: css,
                    className: cssClassName,
                },
            ])
        }
        this.shadowRootMap.get(tagName)?.forEach((root) => {
            const style = document.createElement('style')
            style.textContent = css
            style.setAttribute('bili-cleaner-css', cssClassName)
            root.appendChild(style)
        })
    }

    /**
     * 移除css规则
     * @param tagName shadowRoot父节点tag名
     * @param cssClassName css类名
     */
    unregister(tagName: string, cssClassName: string) {
        tagName = tagName.toUpperCase()

        const result = this.shadowStyleMap.get(tagName)?.filter((v) => v.className !== cssClassName)
        result && this.shadowStyleMap.set(tagName, result)

        this.shadowRootMap.get(tagName)?.forEach((root) => {
            root.querySelector(`style[bili-cleaner-css=${cssClassName}]`)?.remove()
        })
    }
}

type shadowCSS = {
    // tagName: string
    css: string
    className: string
}

export class Shadow {
    // shadowRoot节点列表
    private shadowRootMap = new Map<string, ShadowRoot[]>()
    // shadowRoot内注入style列表
    private shadowStyleMap = new Map<string, shadowCSS[]>()
    // 需记录shadowRoot的tag名单
    private tagSet: Set<string>

    /**
     * @param tagArr 需记录shadowRoot元素的tagName列表
     */
    constructor(tagArr: string[]) {
        this.tagSet = new Set(tagArr.map((v) => v.toUpperCase()))
        try {
            this.hook()
        } catch {}
    }

    hook() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        const origAttachShadow = Element.prototype.attachShadow

        Element.prototype.attachShadow = function (init) {
            const shadowRoot = origAttachShadow.call(this, init)
            // console.log(this.tagName, this.id, this.className)
            if (!self.tagSet.has(this.tagName)) {
                return shadowRoot
            }

            // 记录节点
            if (self.shadowRootMap.has(this.tagName)) {
                self.shadowRootMap.get(this.tagName)?.push(shadowRoot)
            } else {
                self.shadowRootMap.set(this.tagName, [shadowRoot])
            }

            // 注入样式
            const styles = self.shadowStyleMap.get(this.tagName)
            styles?.forEach((shadow) => {
                const style = document.createElement('style')
                style.textContent = shadow.css
                style.className = shadow.className
                shadowRoot.appendChild(style)
            })
            return shadowRoot
        }
        console.log('hook')
        console.log(this.shadowRootMap)
        console.log(this.shadowStyleMap)
    }

    register(tagName: string, cssClassName: string, css: string) {
        tagName = tagName.toUpperCase()

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
            style.className = cssClassName
            root.appendChild(style)
        })
        console.log('register')
        console.log(this.shadowRootMap)
        console.log(this.shadowStyleMap)
    }

    unregister(tagName: string, cssClassName: string) {
        tagName = tagName.toUpperCase()

        const result = this.shadowStyleMap.get(tagName)?.filter((v) => v.className !== cssClassName)
        result && this.shadowStyleMap.set(tagName, result)

        this.shadowRootMap.get(tagName)?.forEach((root) => {
            root.querySelector(`style.${cssClassName}`)?.remove()
        })
        console.log('unregister')
        console.log(this.shadowRootMap)
        console.log(this.shadowStyleMap)
    }
}

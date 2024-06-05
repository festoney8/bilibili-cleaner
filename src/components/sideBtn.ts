import { GM_getValue, GM_setValue } from '$'
import { error, debugComponents as debug } from '../utils/logger'
import sideBtnStyle from './sideBtn.scss?inline'

export class SideBtn {
    private nodeHTML = `<button class="bili-cleaner-side-btn" type="button"></button>`
    constructor(
        private btnID: string,
        private btnContent: string,
        private btnFunc: () => void,
    ) {}

    enable() {
        try {
            document.querySelector(`#bili-cleaner-${this.btnID}`)?.remove()
            document.querySelector(`style[bili-cleaner-css="${this.btnID}"]`)?.remove()

            GM_setValue(`BILICLEANER_${this.btnID}`, true)

            // 添加CSS
            const style = document.createElement('style')
            style.innerHTML = sideBtnStyle
            style.setAttribute('bili-cleaner-css', this.btnID)
            document.documentElement.appendChild(style)

            // 添加节点
            let node: HTMLElement = document.createElement('div')
            node.innerHTML = this.nodeHTML
            node = node.querySelector('.bili-cleaner-side-btn') as HTMLElement
            node.id = `bili-cleaner-${this.btnID}`
            node.innerHTML = this.btnContent

            // 添加inline CSS，更新按钮位置
            const right = GM_getValue(`BILICLEANER_${this.btnID}-right`)
            const bottom = GM_getValue(`BILICLEANER_${this.btnID}-bottom`)
            right && node.style.setProperty('right', `${right}px`)
            bottom && node.style.setProperty('bottom', `${bottom}px`)

            // 可拖拽
            let isDragging = false
            let initX: number, initY: number, initRight: number, initBottom: number
            node.addEventListener('mousedown', (e) => {
                isDragging = true
                initX = e.clientX
                initY = e.clientY
                const c = window.getComputedStyle(node)
                initRight = parseInt(c.getPropertyValue('right'))
                initBottom = parseInt(c.getPropertyValue('bottom'))
            })
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const diffX = e.clientX - initX
                    const diffY = e.clientY - initY
                    node.style.right = `${initRight - diffX}px`
                    node.style.bottom = `${initBottom - diffY}px`
                }
            })
            document.addEventListener('mouseup', () => {
                isDragging = false
                // 记录最终位置
                GM_setValue(`BILICLEANER_${this.btnID}-right`, parseInt(node.style.right))
                GM_setValue(`BILICLEANER_${this.btnID}-bottom`, parseFloat(node.style.bottom))
            })

            // 单击事件
            node.addEventListener('click', () => {
                this.btnFunc()
            })

            // 插入节点
            document.documentElement.appendChild(node)
            debug(`SideBtn ${this.btnID} enable OK`)
        } catch (err) {
            error(err)
            error(`SideBtn ${this.btnID} enable error`)
        }
    }

    disable() {
        GM_setValue(`BILICLEANER_${this.btnID}`, false)
        document.querySelector(`#bili-cleaner-${this.btnID}`)?.remove()
        document.querySelector(`style[bili-cleaner-css="${this.btnID}"]`)?.remove()
    }
}

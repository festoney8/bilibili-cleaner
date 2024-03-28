import { GM_getValue, GM_setValue } from '$'
import { debugComponents as debug, error } from '../utils/logger'

export class WordList {
    private wordArr: string[] = []
    private wordSet = new Set<string>()

    private readonly nodeHTML = `
    <div id="bili-cleaner-wordlist">
        <div class="wordlist-header"></div>
        <div class="wordlist-description"></div>
        <textarea class="wordlist-body" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
        <div class="wordlist-footer">
            <button class="wordlist-save-button">保存</button>
            <button class="wordlist-close-button">关闭</button>
        </div>
    </div>`

    /**
     * WordList用于维护各种string array（up主列表、BVID列表、关键词列表）
     * @param listID 列表唯一ID, 对应数据存储
     * @param title 列表标题
     * @param description 列表详情说明
     * @param callback 回调函数, 在保存列表时回调
     */
    constructor(
        private listID: string,
        private title: string,
        private description: string,
        private callback: (values: string[]) => void,
    ) {
        this.getValue()
    }

    private setValue() {
        GM_setValue(`BILICLEANER_${this.listID}`, this.wordArr)
    }
    private getValue() {
        debug(`key`, `BILICLEANER_${this.listID}`)
        this.wordArr = GM_getValue(`BILICLEANER_${this.listID}`, [])
        debug(`list ${this.listID} getValue ${this.wordArr.length} lines`)
        this.wordSet = new Set(this.wordArr)
    }

    /** 添加一个值到列表 */
    addValue(value: string) {
        try {
            this.getValue()
            value = value.trim()
            if (value && !this.wordSet.has(value)) {
                // 新增在列表开头, 便于编辑
                this.wordArr.unshift(value)
                this.wordSet.add(value)
                this.setValue()
            }
            debug(`list ${this.listID} add value ${value}, OK`)
        } catch (err) {
            error(err)
            error(`list ${this.listID} add value ${value}, ERROR`)
        }
    }

    /** 添加多个值到列表 */
    addValues(values: string[]) {
        try {
            this.getValue()
            values.forEach((value) => {
                value = value.trim()
                if (value && !this.wordSet.has(value)) {
                    this.wordArr.push(value)
                    this.wordSet.add(value)
                }
            })
            this.setValue()
            debug(`list ${this.listID} add ${values.length} lines, OK`)
        } catch (err) {
            error(err)
            error(`list ${this.listID} add ${values.length} lines, ERROR`)
        }
    }

    /**
     * 编辑整个列表
     * @param values 编辑框内输入的列表
     * @returns 保存是否成功
     */
    saveList(values: string[]): boolean {
        try {
            // 去重添加
            const tempSet = new Set<string>()
            const tempArr: string[] = []
            values.forEach((value) => {
                value = value.trim()
                if (value && !tempSet.has(value)) {
                    tempArr.push(value)
                    tempSet.add(value)
                }
            })
            this.wordArr = tempArr
            this.wordSet = tempSet
            this.setValue()
            // 带参回调
            this.callback(this.wordArr)
            debug(`list ${this.listID} saveList, OK`)
            return true
        } catch (err) {
            error(err)
            error(`list ${this.listID} saveList, ERROR`)
        }
        return false
    }

    /** 获取列表值, 用于编辑列表 or 初始化过滤器 */
    fetchList(): string[] {
        this.getValue()
        debug(`fetchList fetch ${this.wordArr.length} lines`)
        return this.wordArr
    }

    /** 插入节点, 显示编辑框 */
    insertNode() {
        document.getElementById('bili-cleaner-wordlist')?.remove()

        const e = document.createElement('div')
        e.innerHTML = this.nodeHTML.trim()
        e.querySelector('.wordlist-header')!.innerHTML = this.title.replace('\n', '<br>')
        e.querySelector('.wordlist-description')!.innerHTML = this.description.replace('\n', '<br>')
        debug(`insertNode, fetchList ${this.fetchList().length} lines`)
        let lines = this.fetchList().join('\n')
        if (lines) {
            lines += '\n'
        }
        e.querySelector('textarea')!.value = lines
        document.body?.appendChild(e.firstChild!)
    }

    /** 监听按钮, 保存和取消动作 */
    watchNode() {
        const node = document.getElementById('bili-cleaner-wordlist') as HTMLDivElement
        if (!node) {
            return
        }
        // 监听取消
        const cancel = node.querySelector('.wordlist-close-button') as HTMLButtonElement
        cancel?.addEventListener('click', () => {
            node.remove()
        })
        debug(`list ${this.listID} listen cancel button`)
        // 监听保存
        const save = node.querySelector('.wordlist-save-button') as HTMLButtonElement
        save?.addEventListener('click', () => {
            const textarea = node.querySelector('textarea')
            if (textarea) {
                debug('textarea value', textarea.value)
                const ok = this.saveList(textarea.value.split('\n'))
                if (ok) {
                    textarea.value = this.fetchList().join('\n')
                    if (textarea.value.trim()) {
                        textarea.value += '\n'
                    }
                    save.style.backgroundColor = '#99CC66'
                    save.style.color = 'white'
                    setTimeout(() => {
                        save.style.backgroundColor = 'white'
                        save.style.color = 'black'
                    }, 1000)
                } else {
                    save.innerHTML = '保存失败'
                    save.style.backgroundColor = '#FF6666'
                    save.style.color = 'white'
                }
            }
        })
        debug(`list ${this.listID} listen save button`)
    }

    /** 可拖拽bar */
    draggableBar() {
        try {
            const wordlist = document.getElementById('bili-cleaner-wordlist') as HTMLFormElement
            const bar = document.querySelector('#bili-cleaner-wordlist .wordlist-header') as HTMLFormElement
            let isDragging = false
            let initX: number, initY: number, initLeft: number, initTop: number

            bar.addEventListener('mousedown', (e) => {
                isDragging = true
                initX = e.clientX
                initY = e.clientY
                const c = window.getComputedStyle(wordlist)
                initLeft = parseInt(c.getPropertyValue('left'), 10)
                initTop = parseInt(c.getPropertyValue('top'), 10)
            })
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const diffX = e.clientX - initX
                    const diffY = e.clientY - initY
                    wordlist.style.left = `${initLeft + diffX}px`
                    wordlist.style.top = `${initTop + diffY}px`
                    // 限制bar不超出视口
                    const rect = bar.getBoundingClientRect()
                    if (rect.left < 0) {
                        wordlist.style.left = `${initLeft + diffX - rect.left}px`
                    }
                    if (rect.top < 0) {
                        wordlist.style.top = `${initTop + diffY - rect.top}px`
                    }
                    if (rect.right > window.innerWidth) {
                        wordlist.style.left = `${initLeft + diffX - (rect.right - window.innerWidth)}px`
                    }
                    if (rect.bottom > window.innerHeight) {
                        wordlist.style.top = `${initTop + diffY - (rect.bottom - window.innerHeight)}px`
                    }
                }
            })
            document.addEventListener('mouseup', () => {
                isDragging = false
            })
            debug('draggableBar OK')
        } catch (err) {
            error(`draggableBar failed`)
            error(err)
        }
    }

    /** 显示编辑框 */
    show() {
        this.insertNode()
        this.watchNode()
        this.draggableBar()
    }
}

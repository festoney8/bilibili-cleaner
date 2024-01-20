import { GM_getValue, GM_setValue } from '$'
import { debug, error } from '../utils/logger'

export class WordList {
    private wordArr: string[] = []
    private wordSet = new Set<string>()

    private readonly nodeHTML = `
    <div id="bili-cleaner-wordlist">
        <div class="wordlist-header"></div>
        <textarea class="wordlist-body" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
        <div class="wordlist-footer">
            <button class="wordlist-save-button">保存</button>
            <button class="wordlist-close-button">关闭</button>
        </div>
    </div>`

    /**
     * WordList用于维护各种string array（up主列表、BVID列表、关键词列表）
     * @param listID 列表唯一ID, 对应数据存储
     * @param description 列表说明, 会显示在编辑框头部作为标题
     * @param callback 回调函数, 在保存列表时回调
     */
    constructor(
        private listID: string,
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

    /**
     * 添加多个值到列表
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
        const node = document.getElementById('bili-cleaner-wordlist') as HTMLDivElement
        if (node) {
            return
        }
        const e = document.createElement('div')
        e.innerHTML = this.nodeHTML.trim()
        e.querySelector('.wordlist-header')!.innerHTML = this.description.replace('\n', '<br>')
        debug(`insertNode, fetchList ${this.fetchList().length} lines`)
        e.querySelector('textarea')!.value = this.fetchList().join('\n')
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

    /** 显示编辑框 */
    show() {
        this.insertNode()
        this.watchNode()
    }
}

import { GM_getValue, GM_setValue } from '$'
import { debug, error } from '../utils/logger'

class WordList {
    private wordArr: string[] = []
    private wordSet = new Set<string>()

    private readonly nodeHTML = `
    <div id="bili-cleaner-wordlist">
        <div class="wordlist-header"></div>
        <textarea class="wordlist-body"></textarea>
        <div class="wordlist-footer">
            <button class="wordlist-save-button">保存</button>
            <button class="wordlist-close-button">取消</button>
        </div>
    </div>
    `

    constructor(
        private listID: string,
        private description: string,
        private callback: (() => void) | undefined,
    ) {}

    private setValue() {
        GM_setValue(`BILICLEANER_${this.listID}`, this.wordArr)
    }
    private getValue() {
        this.wordArr = GM_getValue(`BILICLEANER_VALUE_${this.listID}`, [])
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
        return this.wordArr
    }

    /** 插入节点 */
    insertNode() {
        const node = document.getElementById('bili-cleaner-wordlist') as HTMLDivElement
        if (node) {
            return
        }
        const e = document.createElement('div')
        e.innerHTML = this.nodeHTML.trim()
        e.querySelector('.wordlist-header')!.innerHTML = this.description.replace('\n', '<br>')
        e.querySelector('textarea')!.innerHTML = this.fetchList().join('\n')
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
        // 监听保存
        const save = node.querySelector('.wordlist-save-button') as HTMLButtonElement
        save?.addEventListener('click', () => {
            const textarea = node.querySelector('textarea')
            if (textarea) {
                debug('textarea value', textarea.value)
                const ok = this.saveList(textarea.value.split('\n'))
                if (ok) {
                    save.innerHTML = '已保存'
                    save.style.backgroundColor = '#99CC66'
                    save.style.color = 'white'
                } else {
                    save.innerHTML = '保存失败'
                    save.style.backgroundColor = '#FF6666'
                    save.style.color = 'white'
                }
            }
        })
    }
}

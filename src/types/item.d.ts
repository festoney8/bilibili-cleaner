export type Item = ISwitchItem | INumberItem | IListItem | IEditorItem | IStringItem

interface IBaseItem {
    type: 'switch' | 'number' | 'radio' | 'editor'

    id: string
}

// 开关功能
export interface ISwitchItem extends IBaseItem {
    // item类型
    type: 'switch'

    // item id, 与GM Key对应, 记录当前功能是否开启
    id: string

    // 功能名
    name: string

    // 功能补充介绍，每个string显示为一行
    description?: string[]

    // 是否默认启用
    defaultEnable?: boolean

    // 是否无样式
    noStyle?: boolean

    // 在html节点注册用attribute名，控制样式是否生效，缺省时默认使用id
    attrName?: string

    // 启用时函数
    enableFn?: () => Promise<void> | void

    // 禁用时函数
    disableFn?: () => Promise<void> | void
    /**
     * 启用时函数运行时机
     * document-start: 立即运行
     * document-end: DOMContentLoaded触发
     * @default 'document-start'
     */
    enableFnRunAt?: 'document-start' | 'document-end'
}

// 数值设定功能
export interface INumberItem extends IBaseItem {
    // 功能类型
    type: 'number'

    // item id, 与GM key对应，记录当前功能值
    id: string

    // 功能名
    name: string

    // 功能补充介绍，每个string显示为一行
    description?: string[]

    // 最小值
    minValue: number

    // 最大值
    maxValue: number

    // 步进
    step: number

    // 默认值
    defaultValue: number

    // 禁用值
    disableValue: number

    // 附加文字，显示在输入框后（如数值单位）
    addonText?: string

    // 是否无样式
    noStyle?: boolean

    // 在html节点注册用attribute名，控制样式是否生效，缺省时默认使用id
    attrName?: string

    /**
     * 数值生效/数值变动时触发函数
     * @param value 当前数值
     */
    fn: (value: number) => Promise<void> | void
}

// 文本设定功能
export interface IStringItem extends IBaseItem {
    // 功能类型
    type: 'string'

    // item id, 与GM key对应，记录当前功能值
    id: string

    // 功能名
    name: string

    // 功能补充介绍，每个string显示为一行
    description?: string[]

    // 默认值
    defaultValue: string

    // 禁用值
    disableValue: string

    // 是否无样式
    noStyle?: boolean

    // 在html节点注册用attribute名，控制样式是否生效，缺省时默认使用id
    attrName?: string

    /**
     * 值生效/值变动时触发函数
     * @param value 当前内容
     */
    fn: (value: string) => Promise<void> | void
}

// 单选功能
export interface IListItem extends IBaseItem {
    // item类型
    type: 'list'

    // item id, 与GM key对应，GM value为选项id
    id: string

    // 功能名
    name: string

    // 功能补充介绍，每个string显示为一行
    description?: string[]

    // 默认值
    defaultValue: string

    // 禁用值
    disableValue: string

    // 选项列表
    options: {
        // value 与 GM value 对应
        value: string

        // 选项名
        name: string

        // 功能
        fn?: () => Promise<void> | void
    }[]
}

// 编辑器功能
export interface IEditorItem extends IBaseItem {
    // 功能类型
    type: 'editor'

    // item id, 与GM key对应，GM value为编辑器文字内容
    id: string

    // 功能名
    name: string

    // 功能补充介绍，每个string显示为一行
    description?: string[]

    // 编辑器标题
    editorTitle: string

    // 编辑器补充介绍
    editorDescription?: string[]

    // 保存时运行函数
    saveFn: () => Promise<void> | void
}

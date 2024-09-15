export type Item = ISwitchItem | INumberItem | IListItem | IButtonItem

interface IBaseItem {
  type: 'switch' | 'number' | 'radio' | 'button'

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

  // 功能补充介绍
  description?: string

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

  // 功能补充介绍
  description?: string

  // 最小值
  minValue: number

  // 最大值
  maxValue: number

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

// 普通按钮
export interface IButtonItem extends IBaseItem {
  // 功能类型
  type: 'button'

  // 功能名
  name: string

  // 按钮文字
  buttonText: string

  // 按钮功能函数
  fn: () => Promise<void> | void
}

// 单选功能
export interface IListItem extends IBaseItem {
  // item类型
  type: 'list'

  // item id, 与GM key对应，GM value为选项id
  id: string

  // 功能名
  name: string

  // 功能补充介绍
  description?: string

  // 默认值
  defaultValue: string

  // 禁用值
  disableValue: string

  // 选项列表
  options: {
    // id 与 GM value 对应
    id: string

    // 选项名
    name: string
  }[]
}

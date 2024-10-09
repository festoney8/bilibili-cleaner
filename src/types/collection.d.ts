import { Item } from './item'

export type Group = {
    // group name
    name: string

    // default unfold
    fold?: boolean

    // item list
    items: Item[]
}

export type Rule = {
    // 名称
    name: string

    // groups
    groups: Group[]

    // 附加样式
    style?: string

    // 特殊规则
    isSpecial?: boolean

    // 检测当前是否生效
    checkFn: () => boolean
}

export type Filter = {
    // 名称
    name: string

    // item groups
    groups: Group[]

    // 入口函数
    entry: () => Promise<void> | void

    // 检测当前是否生效
    checkFn: () => boolean
}

import { Item } from './item'

export type Group = {
    // group name
    name: string

    // item list
    items: Item[]
}

export type Collection = {
    // 名称
    name: string

    // groups
    groups: Group[]

    // 附加样式
    style?: string

    // 检测当前是否生效
    checkFn: () => boolean
}

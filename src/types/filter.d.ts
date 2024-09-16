export type SelectorResult = string | boolean | number | undefined
export type SubFilterType = BooleanFilter | StringFilter | KeywordFilter | NumberMinFilter | NumberMaxFilter
export type SelectorFn = (el: HTMLElement) => SelectorResult

// 子过滤器
export interface ISubFilter {
    isEnable: boolean

    enable(): void

    disable(): void

    // 新增一条过滤规则
    addParam?(value: string): void

    // 批量修改过滤规则
    setParam?(value: string[] | number): void

    // 检测元素
    check(el: HTMLElement, selectorFn: SelectorFn): Promise<void>
}

export type SubFilterPair = [SubFilterType, SelectorFn]

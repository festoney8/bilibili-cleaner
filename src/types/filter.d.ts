export type SelectorResult = string | boolean | number | undefined
export type SubFilterType = BooleanFilter | StringFilter | KeywordFilter | NumberMinFilter | NumberMaxFilter
export type SelectorFn = (el: HTMLElement) => SelectorResult
export type SubFilterPair = [SubFilterType, SelectorFn]

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

// 主过滤器
export abstract class IMainFilter {
    /**
     * 被观测元素，target内出现变化时触发check
     */
    target: HTMLElement | undefined

    /**
     * 初始化，与constructor功能相同，更新子过滤器的值
     * MainFilter不在constructor中初始化，方便在特定页面控制过滤器
     */
    init(): void

    /**
     * 等待target出现，并开始监听，内容变化时触发检测
     */
    observe(): void

    /**
     * 提取target内元素列表，用子过滤器检测元素
     * @param mode full: 全量检测 incr: 增量检测
     */
    async check(mode?: 'full' | 'incr') {}
}

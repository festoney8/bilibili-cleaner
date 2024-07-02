import settings from '../../../settings'
import { debugDynFilter as debug, error, log } from '../../../utils/logger'
import { hideEle, isEleHide, showEle } from '../../../utils/tool'
import dynUploaderFilterInstance from './subfilters/dynUploader'

export interface IDynSubFilter {
    isEnable: boolean
    setStatus(status: boolean): void
    setParams(value: string[]): void
    addParam?(value: string): void
    check(value: string): Promise<string>
}

export type DynSelectorFunc = {
    dynUploader?: (dyn: HTMLElement) => string | null
}

interface DynInfo {
    dynUploader?: string | undefined
}

class CoreDynFilter {
    /**
     * 对动态内容进行并发检测
     * @param dyns 动态列表
     * @param sign 是否标记已过滤项
     * @param selectorFunc 使用selector选取元素的函数
     */
    checkAll(dyns: HTMLElement[], sign = true, selectorFunc: DynSelectorFunc) {
        try {
            const checkDynUploader = dynUploaderFilterInstance.isEnable && selectorFunc.dynUploader !== undefined

            if (!checkDynUploader) {
                // 黑名单全部关闭时 恢复全部动态
                dyns.forEach((dyn) => showEle(dyn))
                return
            }

            dyns.forEach((dyn) => {
                const info: DynInfo = {}

                // 构建黑白名单任务, 调用各个子过滤器的check()方法检测
                const blackTasks: Promise<string>[] = []
                const whiteTasks: Promise<string>[] = []

                if (checkDynUploader) {
                    const dynUploader = selectorFunc.dynUploader!(dyn)
                    if (dynUploader) {
                        blackTasks.push(dynUploaderFilterInstance.check(dynUploader))
                        info.dynUploader = dynUploader
                    }
                }

                // 执行检测
                Promise.all(blackTasks)
                    .then((_result) => {
                        // 未命中黑名单
                        // debug(_result)
                        showEle(dyn)
                    })
                    .catch((_result) => {
                        // 命中黑名单
                        debug(_result)
                        if (whiteTasks.length) {
                            Promise.all(whiteTasks)
                                .then((_result) => {
                                    // 命中黑名单，未命中白名单
                                    // debug(_result)
                                    if (!isEleHide(dyn)) {
                                        log(`hide dyn\ndynUploader: ${info.dynUploader}`)
                                    }
                                    hideEle(dyn)
                                })
                                .catch((_result) => {
                                    // 命中白名单
                                    // debug(_result)
                                    showEle(dyn)
                                })
                        } else {
                            if (!isEleHide(dyn)) {
                                log(`hide dyn\ndynUploader: ${info.dynUploader}`)
                            }
                            hideEle(dyn)
                        }
                    })

                // 标记已过滤动态
                sign && dyn.setAttribute(settings.filterSign, '')
            })
        } catch (err) {
            error(err)
            error('CoreDynFilter checkAll error')
        }
    }
}

const coreDynFilterInstance = new CoreDynFilter()
export default coreDynFilterInstance

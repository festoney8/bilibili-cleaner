import { error } from '../../../../utils/logger'
import { ICommentSubFilter } from '../core'

class CallUserFilter implements ICommentSubFilter {
    isEnable = false

    setStatus(status: boolean) {
        this.isEnable = status
    }

    check(callUser: string): Promise<string> {
        callUser = callUser.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (this.isEnable && callUser.length) {
                    reject(`is callUser`)
                } else {
                    resolve(`not callUser`)
                }
            } catch (err) {
                error(err)
                resolve(`callUser resolve, error`)
            }
        })
    }
}

// 单例
const callUserFilterInstance = new CallUserFilter()
export default callUserFilterInstance

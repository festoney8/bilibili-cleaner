import { error } from '../../../../utils/logger'
import { ICommentSubFilter } from '../core'

class UsernameFilter implements ICommentSubFilter {
    isEnable = false
    private usernameSet = new Set<string>()

    setStatus(status: boolean) {
        this.isEnable = status
    }

    setParams(values: string[]) {
        this.usernameSet = new Set(values.map((v) => v.trim()).filter((v) => v))
    }

    addParam(username: string) {
        this.usernameSet.add(username.trim())
    }

    check(username: string): Promise<string> {
        username = username.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || username.length === 0 || this.usernameSet.size === 0) {
                    resolve('username resolve, disable or empty')
                } else if (this.usernameSet.has(username)) {
                    reject(`username reject, ${username} in blacklist`)
                } else {
                    resolve('username resolve')
                }
            } catch (err) {
                error(err)
                resolve(`username resolve, error`)
            }
        })
    }
}

// 单例
const usernameFilterInstance = new UsernameFilter()
export default usernameFilterInstance

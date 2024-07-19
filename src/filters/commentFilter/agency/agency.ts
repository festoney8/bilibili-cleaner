import botFilterInstance from '../filters/subfilters/bot'
import callBotFilterInstance from '../filters/subfilters/callBot'
import callUserFilterInstance from '../filters/subfilters/callUser'
import contentFilterInstance from '../filters/subfilters/content'
import usernameFilterInstance from '../filters/subfilters/username'

// 代理, 接收页面操作通知, 更新子过滤器的参数
class CommentFilterAgency {
    notifyUsername(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                usernameFilterInstance.setStatus(false)
                break
            case 'enable':
                usernameFilterInstance.setStatus(true)
                break
            case 'add':
                if (typeof value === 'string') {
                    if (value.trim()) {
                        usernameFilterInstance.addParam(value.trim())
                    }
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    usernameFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
    notifyContent(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                contentFilterInstance.setStatus(false)
                break
            case 'enable':
                contentFilterInstance.setStatus(true)
                break
            case 'add':
                if (typeof value === 'string' && value.trim()) {
                    contentFilterInstance.addParam(value.trim())
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    contentFilterInstance.setParams(value.map((v) => v.trim()).filter((v) => v))
                }
                break
        }
    }
    notifyBot(event: string) {
        switch (event) {
            case 'disable':
                botFilterInstance.setStatus(false)
                break
            case 'enable':
                botFilterInstance.setStatus(true)
                break
        }
    }
    notifyCallBot(event: string) {
        switch (event) {
            case 'disable':
                callBotFilterInstance.setStatus(false)
                break
            case 'enable':
                callBotFilterInstance.setStatus(true)
                break
        }
    }
    notifyCallUser(event: string) {
        switch (event) {
            case 'disable':
                callUserFilterInstance.setStatus(false)
                break
            case 'enable':
                callUserFilterInstance.setStatus(true)
                break
        }
    }
}

// 单例
const commentFilterAgencyInstance = new CommentFilterAgency()
export default commentFilterAgencyInstance

import { error } from '../../../../utils/logger'
import { ICommentSubFilter } from '../core'

class BotFilter implements ICommentSubFilter {
    isEnable = false
    // 8455326 @机器工具人
    // 234978716 @有趣的程序员
    // 1141159409 @AI视频小助理
    // 437175450 @AI视频小助理总结一下 (误伤)
    // 1692825065 @AI笔记侠
    // 690155730 @AI视频助手
    // 689670224 @哔哩哔理点赞姬
    // 3494380876859618 @课代表猫
    // 1168527940 @AI课代表呀
    // 439438614 @木几萌Moe
    // 1358327273 @星崽丨StarZai
    // 3546376048741135 @AI沈阳美食家
    // 1835753760 @AI识片酱
    // 9868463 @AI头脑风暴
    // 358243654 @GPT_5
    // 393788832 @Juice_AI
    // 91394217 @AI全文总结
    // 473018527 @AI视频总结
    // 3546639035795567 @AI总结视频
    private botSet = new Set<string>([
        '机器工具人',
        '有趣的程序员',
        'AI视频小助理',
        'AI视频小助理总结一下',
        'AI笔记侠',
        'AI视频助手',
        '哔哩哔理点赞姬',
        '课代表猫',
        'AI课代表呀',
        '木几萌Moe',
        '星崽丨StarZai',
        'AI沈阳美食家',
        'AI识片酱',
        'AI头脑风暴',
        'GPT_5',
        'Juice_AI',
        'AI全文总结',
        'AI视频总结',
        'AI总结视频',
    ])

    setStatus(status: boolean) {
        this.isEnable = status
    }

    check(username: string): Promise<string> {
        username = username.trim()
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isEnable || username.length === 0 || this.botSet.size === 0) {
                    resolve('bot resolve, disable or empty')
                } else if (this.botSet.has(username)) {
                    reject(`bot reject, ${username} in blacklist`)
                } else {
                    resolve('bot resolve')
                }
            } catch (err) {
                error(err)
                resolve(`bot resolve, error`)
            }
        })
    }
}

// 单例
const botFilterInstance = new BotFilter()
export default botFilterInstance

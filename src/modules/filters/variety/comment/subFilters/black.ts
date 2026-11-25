import { BooleanFilter } from '@/modules/filters/core/subFilters/booleanFilter'
import { KeywordFilter } from '@/modules/filters/core/subFilters/keywordFilter'
import { NumberMinFilter } from '@/modules/filters/core/subFilters/numberMinFilter'
import { StringFilter } from '@/modules/filters/core/subFilters/stringFilter'
import { ISubFilter, SelectorFn } from '@/types/filter'
import { logger } from '@/utils/logger'
import { AI_THRESHOLD_MAP } from '../ai/constants'
import { commentAiEngine } from '../ai/engine'
import { CommentAiInput } from '../ai/fusion'

export class CommentUsernameFilter extends StringFilter {}

export class CommentUsernameKeywordFilter extends KeywordFilter {}

export class CommentContentFilter extends KeywordFilter {}

export class CommentAdFilter extends KeywordFilter {}

export class CommentLevelFilter extends NumberMinFilter {}

export class CommentNoFaceFilter extends BooleanFilter {}

export class CommentBotFilter extends StringFilter {}

export class CommentCallBotFilter extends BooleanFilter {}

export class CommentCallUserFilter extends BooleanFilter {}

export class CommentCallUserOnlyFilter extends BooleanFilter {}

export class CommentEmojiOnlyFilter extends BooleanFilter {}

export class CommentChainFilter extends BooleanFilter {}

export class CommentAiFilter implements ISubFilter {
    isEnable = false
    private threshold = AI_THRESHOLD_MAP.balanced
    private readonly blockedLogKeys = new Set<string>()
    private static readonly MAX_BLOCKED_LOG_KEYS = 4000
    private onReadyCallback?: () => void

    enable(): void {
        this.isEnable = true
    }

    disable(): void {
        this.isEnable = false
        this.blockedLogKeys.clear()
        void commentAiEngine.dispose()
    }

    setParam(value: number): void {
        if (value !== this.threshold) {
            this.blockedLogKeys.clear()
        }
        this.threshold = value
    }

    isReady(): boolean {
        return commentAiEngine.isReady()
    }

    isCachedBlocked(rpid: string): boolean {
        if (!this.isEnable || !rpid) {
            return false
        }
        const score = commentAiEngine.getCachedScore(rpid)
        return score !== undefined && score >= this.threshold
    }

    triggerLoad(onReady?: () => void): void {
        if (onReady) {
            this.onReadyCallback = onReady
        }
        if (!this.isEnable) {
            return
        }
        void commentAiEngine.ensureLoaded(() => {
            if (this.isEnable) {
                this.onReadyCallback?.()
            }
        })
    }

    async check(el: HTMLElement, selectorFn: SelectorFn): Promise<void> {
        if (!this.isEnable || !commentAiEngine.isReady()) {
            return
        }
        const input = selectorFn(el) as CommentAiInput | undefined
        if (!input || !input.message.trim()) {
            return
        }
        const prob = await commentAiEngine.scoreComment(input)
        if (prob >= this.threshold) {
            const logKey = `${input.rpid || input.message}:${this.threshold}`
            if (!this.blockedLogKeys.has(logKey)) {
                if (this.blockedLogKeys.size >= CommentAiFilter.MAX_BLOCKED_LOG_KEYS) {
                    const oldest = this.blockedLogKeys.values().next().value
                    if (oldest !== undefined) {
                        this.blockedLogKeys.delete(oldest)
                    }
                }
                this.blockedLogKeys.add(logKey)
                const snippet = input.message.replace(/\s+/g, ' ').slice(0, 40)
                logger.info(
                    `[AI] block (${prob.toFixed(3)} >= ${this.threshold.toFixed(2)}) @${input.uname || 'unknown'} [Lv.${input.level ?? '?'}]: ${snippet}`,
                )
            }
            return Promise.reject()
        }
    }
}

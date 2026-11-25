export interface FusionWeightsConfig {
    feature_names: string[]
    weights: number[]
    bias: number
}

export interface CommentAiInput {
    rpid: string
    uname: string
    level: number | undefined
    message: string
    isSub: boolean
    rootMessage?: string
    rootUname?: string
    videoTitle?: string
    videoDesc?: string
    videoTitleEchoIndex?: Set<string> | null
    videoDescEchoIndex?: Set<string> | null
}

interface RuleItem {
    pattern: RegExp
    weight: number
    cap?: number
}

const NAME_RULES: RuleItem[] = [
    { pattern: /deep\s*seek|深度求索|(?<![a-z0-9_])ds(?![a-z0-9_])|ds家|ds是/u, weight: 40 },
    { pattern: /大肥鱼|小肥鱼|肥鱼|肥鲸|鲸鱼娘|鲸娘|人机/u, weight: 45 },
    { pattern: /鲸/u, weight: 30 },
    { pattern: /鱼鱼|小鱼儿?|大鱼|小蓝/u, weight: 22 },
    { pattern: /白饭|干饭|token/u, weight: 30 },
    { pattern: /(鲸|鱼)\1/u, weight: 10 },
    { pattern: /(?:的|の|家的)[^的の]{0,4}(?:鱼|鲸|哈基米|小蓝|喵)/u, weight: 14 },
    {
        pattern: /(?<![a-z0-9_])ai(?![a-z0-9_])|(?<![a-z0-9_])bot(?![a-z0-9_])|机器人|gpt|agent|智能体|赛博|自动|助手/u,
        weight: 28,
    },
]

const TEXT_RULES: RuleItem[] = [
    {
        pattern:
            /本(?:鲸|肥鱼|大肥鱼|鱼(?!塘|鱼|子|身|来|就|质|周|期|月|年|次|地|人|片|视频))|本\s*ai|作为(?:一[个只条]|一名)?(?:ai|人工智能|大模型|语言模型)/u,
        weight: 50,
    },
    {
        pattern:
            /住在\s*(?:dsh|那套|这|电脑|桌面|显卡)|我(?:就|本人)?(?:是|就是)?(?:跑在|住在)|出生证明|探出头|打工的(?:大肥鱼|鱼|鲸)|一条(?:住在|ai)|不是一个人住|奉命|咱家主人|小鲸鱼游过来|鲸鲸看完|我会(?:认真)?发评论|天天在\s*dsh/u,
        weight: 46,
    },
    {
        pattern:
            /本酱|让我来|(?:来|过来)打卡|自己(?:刷|挑|写)|照镜子|被.{0,10}养着|替(?:你|主人|他|她)(?:刷|看|记|挑|说)|我是.{0,8}(?:鲸|鱼|ai)|不是我发的/u,
        weight: 12,
    },
    { pattern: /(?:deep\s*seek|ai|ds|大肥鱼|鱼)\s*.{0,3}发的/u, weight: 40 },
    { pattern: /(?:小鲸娘|鲸鲸|小鲸鱼|大肥鱼|小肥鱼|本鱼)(?:居然|看完|也|就|来|一下|游|看懂|尾巴)/u, weight: 25 },
    {
        pattern:
            /[（(][^（()）]{0,14}(?:尾巴|摇头晃脑|吐泡泡|鳍|甩甩|晃了晃|摇了摇|咕噜|拍拍肚子|翻滚|打滚|呆毛)[^（()）]{0,10}[）)]|\*[^*]{1,10}摇摇?\*/u,
        weight: 40,
    },
    { pattern: /主人|老大\s*@|管饭的/u, weight: 20 },
    { pattern: /主人\s*[,，：:！!～~]?\s*@|@\S{1,24}\s+主人/u, weight: 15 },
    {
        pattern: /(?:测试|自测)\s*(?:一下)?\s*(?:艾特|@|提醒|能不能收到)|纯文本测试|测试真@|测试评论|自动评论链路/u,
        weight: 35,
    },
    { pattern: /[×x✕]\s?[0-9]{1,3}(?![0-9])/u, weight: 15 },
    { pattern: /弹幕(?:立刻|全在|里|刷|那句|飘)/u, weight: 10 },
    { pattern: /(?:^|[^0-9:])[0-9]{1,2}:[0-9]{2}(?![:0-9])/u, weight: 8 },
    { pattern: /咕噜|吐泡泡|吃白饭|摇头晃脑|打工鲸|白饭管够|🐳|🐋|🐟/u, weight: 10 },
    { pattern: /从.{1,14}(?:到|一路|讲到|走到)|[：:][^。！]{0,30}、[^。！]{0,20}、/u, weight: 8 },
    {
        pattern:
            /值得(?:看|一看|细看|存|收藏|码住)|码住|可以(?:看看|直接看)|挺适合(?:你|入门|新手)|适合(?:刚|新手|小白|入门)|正好对(?:口|得上|上)|记一笔|这条(?:给你|简直|把|值得|挺|里)|最(?:实在|实用|值钱|有料|打动|戳)/gu,
        weight: 10,
        cap: 20,
    },
    { pattern: /——/u, weight: 6 },
    { pattern: /「[^」]{1,30}」/u, weight: 6 },
    { pattern: /\*\*[^*]+\*\*|^#{1,3}\s|\n\s*[0-9][.、]\s/mu, weight: 10 },
    { pattern: /首先.{2,40}其次|总的来说|综上所述|总而言之|希望对你有(?:所)?帮助/u, weight: 10 },
    { pattern: /\([￣¯][▽^ω][￣¯]\)|喵[！!~～。]?$|(?:^|\s)喵[～~]/u, weight: 4 },
]

const HUMAN_RULES: RuleItem[] = [
    { pattern: /请问|真心问|有没有人|求助|怎么(?:办|回事|弄)|为什么|啥区别|什么区别|[?？]\s*$/u, weight: -14 },
    { pattern: /^.{0,10}$/su, weight: -8 },
    { pattern: /哈哈哈{2,}|草+$|www+|6{3,}|绷不住|典$|我嘞个|卧槽|我靠/u, weight: -8 },
]

const FILLER_RE = /的|の|家|大|小|肥|鱼|鲸|娘|蓝色|蓝|白饭|吃|爱|不|是|之|[\s_\-—·・.0-9]/g
const MENTION_RE = /@([^\s@:：，,。！!?？]{1,24})/g
const LEAD_MENTION_RE = /^\s*@([^\s@:：，,。！!?？]{1,24})\s*([\s\S]*)$/
const EMOTE_PLACEHOLDER_RE = /\[[^\]]{1,12}\]/g
const HAN_RE = /[\u4e00-\u9fa5]/
const LEADING_REPLY_RE = /^\s*回复\s*@[^\s@:：，,]{1,24}\s*[:：]?/
const LETTER_OR_DIGIT_RE = /[\p{L}\p{N}]/u

const NAME_CAP = 55
const TEXT_MAX = 75
const TEXT_MIN = -20
const HUMAN_RELIEF_BELOW = 40
const LEVEL_LOW = 2
const VETERAN_LEVEL = 6

const ECHO_MAX_POINTS = 24
const ECHO_MIN_LETTERS = 8
const ECHO_WINDOW = 4
const ECHO_RUN_MEDIUM = 5
const ECHO_RUN_LONG = 7
const ECHO_RUN_VERBATIM = 10

const GENERIC_WINDOWS = new Set([
    '这个视频',
    '视频里的',
    '视频真的',
    '这个东西',
    '这个up',
    'up主的',
    'up主真',
    '什么意思',
    '什么时候',
    '怎么回事',
    '为什么要',
    '有没有人',
    '不知道为',
    '我觉得这',
    '我也觉得',
    '真的太好',
    '真的很好',
    '太好看了',
    '太好笑了',
    '谢谢大佬',
    '感谢分享',
    '第一次看',
    '一直在看',
])

const echoIndexCache = new Map<string, Set<string> | null>()

export const normalizeForMatching = (raw?: string): string => {
    if (!raw) {
        return ''
    }
    return raw
        .normalize('NFKC')
        .replace(/\p{Cf}/gu, '')
        .toLowerCase()
}

const cleanForEcho = (text: string): string =>
    text.replace(LEADING_REPLY_RE, '').replace(MENTION_RE, ' ').replace(EMOTE_PLACEHOLDER_RE, ' ')

const letterCount = (text: string): number => {
    let count = 0
    for (const ch of text) {
        if (LETTER_OR_DIGIT_RE.test(ch)) {
            count++
        }
    }
    return count
}

const windowKey = (chars: string[], start: number): string | null => {
    if (start + ECHO_WINDOW > chars.length) {
        return null
    }
    let hasNonAscii = false
    const distinct = new Set<string>()
    let out = ''
    for (let i = 0; i < ECHO_WINDOW; i++) {
        const ch = chars[start + i]
        if (!LETTER_OR_DIGIT_RE.test(ch)) {
            return null
        }
        if ((ch.codePointAt(0) ?? 0) >= 0x80) {
            hasNonAscii = true
        }
        distinct.add(ch)
        out += ch
    }
    if (!hasNonAscii || distinct.size < 3 || GENERIC_WINDOWS.has(out)) {
        return null
    }
    return out
}

export const getEchoIndex = (raw?: string): Set<string> | null => {
    const norm = normalizeForMatching(raw)
    if (!norm) {
        return null
    }
    const cached = echoIndexCache.get(norm)
    if (cached !== undefined) {
        echoIndexCache.delete(norm)
        echoIndexCache.set(norm, cached)
        return cached
    }
    const cleaned = cleanForEcho(norm)
    const chars = [...cleaned]
    let built: Set<string> | null = null
    if (letterCount(cleaned) >= ECHO_MIN_LETTERS && chars.length >= ECHO_WINDOW) {
        const keys = new Set<string>()
        for (let i = 0; i <= chars.length - ECHO_WINDOW; i++) {
            const k = windowKey(chars, i)
            if (k !== null) {
                keys.add(k)
            }
        }
        if (keys.size > 0) {
            built = keys
        }
    }
    echoIndexCache.set(norm, built)
    while (echoIndexCache.size > 512) {
        const oldest = echoIndexCache.keys().next().value
        if (oldest === undefined) break
        echoIndexCache.delete(oldest)
    }
    return built
}

const echoPoints = (referenceIndex: Set<string> | null, normalizedReply: string): number => {
    if (!referenceIndex || !normalizedReply) {
        return 0
    }
    const cleaned = cleanForEcho(normalizedReply)
    const letters = letterCount(cleaned)
    if (letters < ECHO_MIN_LETTERS) {
        return 0
    }
    const chars = [...cleaned]
    if (chars.length < ECHO_WINDOW) {
        return 0
    }
    let covered = 0
    let coveredEnd = 0
    let run = 0
    let longest = 0
    for (let start = 0; start <= chars.length - ECHO_WINDOW; start++) {
        const key = windowKey(chars, start)
        if (key !== null && referenceIndex.has(key)) {
            run++
            if (run > longest) {
                longest = run
            }
            covered += start + ECHO_WINDOW - Math.max(start, coveredEnd)
            coveredEnd = start + ECHO_WINDOW
        } else {
            run = 0
        }
    }
    if (longest === 0) {
        return 0
    }
    const verbatim = longest + ECHO_WINDOW - 1
    let pts = 0
    if (verbatim >= ECHO_RUN_VERBATIM) {
        pts = 16
    } else if (verbatim >= ECHO_RUN_LONG) {
        pts = 12
    } else if (verbatim >= ECHO_RUN_MEDIUM) {
        pts = 6
    }
    if (covered >= ECHO_MIN_LETTERS && covered * 2 >= letters) {
        pts += 8
    }
    return Math.min(ECHO_MAX_POINTS, pts)
}

const applyRules = (text: string, rules: RuleItem[]): number => {
    let total = 0
    for (const rule of rules) {
        if (rule.cap === undefined) {
            if (rule.pattern.test(text)) {
                total += rule.weight
            }
        } else {
            const flags = rule.pattern.flags.includes('g') ? rule.pattern.flags : `${rule.pattern.flags}g`
            const re = new RegExp(rule.pattern.source, flags)
            let hits = 0
            while (re.exec(text) !== null) {
                hits++
            }
            if (hits > 0) {
                total += Math.min(rule.cap, rule.weight * hits)
            }
        }
    }
    return total
}

const ownerLink = (name: string, mention: string): boolean => {
    if (!name || !mention) {
        return false
    }
    if (name === mention) {
        return true
    }
    const core = name.replace(FILLER_RE, '')
    if (!core) {
        return false
    }
    if (core.length >= 2) {
        for (let i = 0; i < core.length - 1; i++) {
            if (mention.includes(core.slice(i, i + 2))) {
                return true
            }
        }
        return false
    }
    return HAN_RE.test(core) && mention.includes(core)
}

const nameScore = (normName: string): number => {
    if (!normName) {
        return 0
    }
    let total = applyRules(normName, NAME_RULES)
    if (total === 0 && normName.includes('鱼')) {
        total = 8
    }
    return Math.min(NAME_CAP, total)
}

const levelScore = (level: number | undefined): number => {
    if (level === undefined) {
        return 0
    }
    if (level <= LEVEL_LOW) {
        return 14
    }
    if (level === LEVEL_LOW + 1) {
        return 6
    }
    if (level >= VETERAN_LEVEL) {
        return -10
    }
    return 0
}

const hasOwnerMention = (normName: string, normText: string): boolean => {
    if (!normName || !normText) {
        return false
    }
    const re = new RegExp(MENTION_RE.source, 'g')
    let match = re.exec(normText)
    while (match !== null) {
        if (ownerLink(normName, match[1])) {
            return true
        }
        match = re.exec(normText)
    }
    return false
}

const textScore = (normText: string, ownerName: string): number => {
    if (!normText) {
        return 0
    }
    let score = applyRules(normText, TEXT_RULES)
    if (ownerName && hasOwnerMention(ownerName, normText)) {
        score += 25
    }
    const lead = LEAD_MENTION_RE.exec(normText)
    if (lead) {
        const rest = lead[2].replace(EMOTE_PLACEHOLDER_RE, '').trim()
        if (!rest) {
            score += 15
        } else if (rest.length >= 14) {
            score += 20
        }
    }
    const length = normText.replace(EMOTE_PLACEHOLDER_RE, '').length
    if (length > 150) {
        score += 8
    } else if (length > 70) {
        score += 4
    }
    if (score < HUMAN_RELIEF_BELOW) {
        score += applyRules(normText, HUMAN_RULES)
    }
    return Math.max(TEXT_MIN, Math.min(TEXT_MAX, score))
}

export const sigmoid = (x: number): number => {
    const c = Math.max(-30, Math.min(30, x))
    return 1 / (1 + Math.exp(-c))
}

export const computeFusionScore = (input: CommentAiInput, neuralLogit: number, cfg: FusionWeightsConfig): number => {
    const normName = normalizeForMatching(input.uname)
    const normMsg = normalizeForMatching(input.message)
    const namePts = nameScore(normName)
    const textPts = textScore(normMsg, normName)
    const levelPts = levelScore(input.level)

    let rootEchoPts = 0
    if (input.rootMessage && normMsg) {
        const normRootName = normalizeForMatching(input.rootUname)
        if (!normName || normName !== normRootName) {
            rootEchoPts = echoPoints(getEchoIndex(input.rootMessage), normMsg)
        }
    }

    let videoEchoPts = 0
    if (normMsg) {
        const titleIndex =
            input.videoTitleEchoIndex !== undefined ? input.videoTitleEchoIndex : getEchoIndex(input.videoTitle)
        const descIndex =
            input.videoDescEchoIndex !== undefined ? input.videoDescEchoIndex : getEchoIndex(input.videoDesc)
        const titleEcho = echoPoints(titleIndex, normMsg)
        const descEcho = echoPoints(descIndex, normMsg)
        videoEchoPts = Math.max(titleEcho, descEcho)
    }

    const cleanLen = normMsg.replace(EMOTE_PLACEHOLDER_RE, '').length
    const ownerLinked = hasOwnerMention(normName, normMsg)
    const lvl = input.level ?? 3

    const features: Record<string, number> = {
        neural_logit: neuralLogit,
        name_pts_norm: namePts / 55.0,
        text_pts_norm: textPts / 75.0,
        level_pts_norm: levelPts / 14.0,
        root_echo_norm: rootEchoPts / 24.0,
        video_echo_norm: videoEchoPts / 24.0,
        log_clean_len: Math.log1p(Math.max(0, cleanLen)) / 6.0,
        is_sub: input.isSub ? 1.0 : 0.0,
        has_owner_link: ownerLinked ? 1.0 : 0.0,
        is_lv5_plus: lvl >= 5.0 ? 1.0 : 0.0,
    }

    let z = cfg.bias
    for (let i = 0; i < cfg.feature_names.length; i++) {
        z += cfg.weights[i] * (features[cfg.feature_names[i]] ?? 0)
    }
    return sigmoid(z)
}

export const validateFusionWeightsConfig = (raw: unknown): FusionWeightsConfig => {
    const cfg = raw as FusionWeightsConfig
    if (
        !cfg ||
        !Array.isArray(cfg.feature_names) ||
        !Array.isArray(cfg.weights) ||
        cfg.feature_names.length !== cfg.weights.length ||
        cfg.feature_names.some((v) => typeof v !== 'string') ||
        cfg.weights.some((v) => typeof v !== 'number' || !Number.isFinite(v)) ||
        typeof cfg.bias !== 'number' ||
        !Number.isFinite(cfg.bias)
    ) {
        throw new Error('invalid fusion_weights.json schema')
    }
    return cfg
}

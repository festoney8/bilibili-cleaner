import { BooleanFilter } from '@/modules/filters/core/subFilters/booleanFilter'
import { KeywordFilter } from '@/modules/filters/core/subFilters/keywordFilter'
import { NumberMinFilter } from '@/modules/filters/core/subFilters/numberMinFilter'
import { StringFilter } from '@/modules/filters/core/subFilters/stringFilter'

export class CommentUsernameFilter extends StringFilter {}

export class CommentUsernameKeywordFilter extends KeywordFilter {}

export class CommentContentFilter extends KeywordFilter {}

export class CommentAdFilter extends KeywordFilter {}

export class CommentLevelFilter extends NumberMinFilter {}

export class CommentNoFaceFilter extends BooleanFilter {}

export class CommentBotFilter extends StringFilter {}

export class CommentCallBotFilter extends BooleanFilter {}

export class CommentCallUserFilter extends BooleanFilter {}

export class CommentCallUserNoReplyFilter extends BooleanFilter {}

export class CommentCallUserOnlyFilter extends BooleanFilter {}

export class CommentCallUserOnlyNoReplyFilter extends BooleanFilter {}

export class CommentEmojiOnlyFilter extends BooleanFilter {}

import { BooleanFilter } from '@/modules/filters/core/subFilters/booleanFilter'
import { KeywordFilter } from '@/modules/filters/core/subFilters/keywordFilter'
import { NumberMinFilter } from '@/modules/filters/core/subFilters/numberMinFilter'
import { StringFilter } from '@/modules/filters/core/subFilters/stringFilter'

export class CommentUsernameFilter extends StringFilter {}

export class CommentContentFilter extends KeywordFilter {}

export class CommentLevelFilter extends NumberMinFilter {}

export class CommentBotFilter extends StringFilter {}

export class CommentCallBotFilter extends StringFilter {}

export class CommentCallUserFilter extends KeywordFilter {}

export class CommentCallUserNoReplyFilter extends KeywordFilter {}

export class CommentCallUserOnlyFilter extends BooleanFilter {}

export class CommentCallUserOnlyNoReplyFilter extends BooleanFilter {}

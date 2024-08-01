import { KeywordFilter } from '../../core/subFilters/keywordFilter'
import { NumberMinFilter } from '../../core/subFilters/numberMinFilter'
import { StringFilter } from '../../core/subFilters/stringFilter'

export class CommentUsernameFilter extends StringFilter {}

export class CommentContentFilter extends KeywordFilter {}

export class CommentLevelFilter extends NumberMinFilter {}

export class CommentBotFilter extends StringFilter {}

export class CommentCallBotFilter extends StringFilter {}

export class CommentCallUserFilter extends KeywordFilter {}

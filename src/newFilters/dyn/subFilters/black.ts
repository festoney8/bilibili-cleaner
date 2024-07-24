import { KeywordFilter } from '../../core/subFilters/keywordFilter'
import { NumberFilter } from '../../core/subFilters/numberFilter'
import { StringFilter } from '../../core/subFilters/stringFilter'

export class DynUploaderFilter extends StringFilter {}

export class DynDurationFilter extends NumberFilter {}

export class DynVideoTitleFilter extends KeywordFilter {}

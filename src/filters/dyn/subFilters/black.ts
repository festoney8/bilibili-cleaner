import { KeywordFilter } from '../../core/subFilters/keywordFilter'
import { NumberMinFilter } from '../../core/subFilters/numberMinFilter'
import { StringFilter } from '../../core/subFilters/stringFilter'

export class DynUploaderFilter extends StringFilter {}

export class DynDurationFilter extends NumberMinFilter {}

export class DynVideoTitleFilter extends KeywordFilter {}

import { BooleanFilter } from '@/modules/filters/core/subFilters/booleanFilter'
import { KeywordFilter } from '@/modules/filters/core/subFilters/keywordFilter'
import { NumberMinFilter } from '@/modules/filters/core/subFilters/numberMinFilter'
import { StringFilter } from '@/modules/filters/core/subFilters/stringFilter'

export class DynUploaderFilter extends StringFilter {}

export class DynDurationFilter extends NumberMinFilter {}

export class DynVideoTitleFilter extends KeywordFilter {}

export class DynContentFilter extends KeywordFilter {}

export class DynDynVideoFilter extends BooleanFilter {}

export class DynPlaybackFilter extends BooleanFilter {}

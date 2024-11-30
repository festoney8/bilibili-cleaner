import { BooleanFilter } from '@/modules/filters/core/subFilters/booleanFilter'
import { KeywordFilter } from '@/modules/filters/core/subFilters/keywordFilter'
import { StringFilter } from '@/modules/filters/core/subFilters/stringFilter'

export class VideoUploaderWhiteFilter extends StringFilter {}

export class VideoTitleWhiteFilter extends KeywordFilter {}

export class VideoIsFollowWhiteFilter extends BooleanFilter {}

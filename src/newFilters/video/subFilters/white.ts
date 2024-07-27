import { BooleanFilter } from '../../core/subFilters/booleanFilter'
import { KeywordFilter } from '../../core/subFilters/keywordFilter'
import { StringFilter } from '../../core/subFilters/stringFilter'

export class VideoUploaderWhiteFilter extends StringFilter {}

export class VideoTitleWhiteFilter extends KeywordFilter {}

export class VideoIsFollowWhiteFilter extends BooleanFilter {}

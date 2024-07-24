import { BooleanFilter } from '../../core/subFilters/booleanFilter'
import { KeywordFilter } from '../../core/subFilters/keywordFilter'
import { NumberFilter } from '../../core/subFilters/numberFilter'
import { StringFilter } from '../../core/subFilters/stringFilter'

export class VideoBvidFilter extends StringFilter {}

export class VideoDimensionFilter extends BooleanFilter {}

export class VideoDurationFilter extends NumberFilter {}

export class VideoQualityFilter extends NumberFilter {}

export class VideoTitleFilter extends KeywordFilter {}

export class VideoUploaderFilter extends StringFilter {}

export class VideoUploaderKeywordFilter extends KeywordFilter {}

import { BooleanFilter } from '../../../core/subFilters/booleanFilter'
import { KeywordFilter } from '../../../core/subFilters/keywordFilter'
import { NumberMaxFilter } from '../../../core/subFilters/numberMaxFilter'
import { NumberMinFilter } from '../../../core/subFilters/numberMinFilter'
import { StringFilter } from '../../../core/subFilters/stringFilter'

export class VideoBvidFilter extends StringFilter {}

export class VideoDimensionFilter extends BooleanFilter {}

export class VideoDurationFilter extends NumberMinFilter {}

export class VideoQualityFilter extends NumberMinFilter {}

export class VideoTitleFilter extends KeywordFilter {}

export class VideoPubdateFilter extends NumberMaxFilter {}

export class VideoUploaderFilter extends StringFilter {}

export class VideoUploaderKeywordFilter extends KeywordFilter {}

export class VideoViewsFilter extends NumberMinFilter {}

export class VideoRelativityFilter extends BooleanFilter {}

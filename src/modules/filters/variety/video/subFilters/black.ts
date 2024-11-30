import { BooleanFilter } from '@/modules/filters/core/subFilters/booleanFilter'
import { KeywordFilter } from '@/modules/filters/core/subFilters/keywordFilter'
import { NumberMaxFilter } from '@/modules/filters/core/subFilters/numberMaxFilter'
import { NumberMinFilter } from '@/modules/filters/core/subFilters/numberMinFilter'
import { StringFilter } from '@/modules/filters/core/subFilters/stringFilter'

export class VideoBvidFilter extends StringFilter {}

export class VideoDimensionFilter extends BooleanFilter {}

export class VideoDurationFilter extends NumberMinFilter {}

export class VideoQualityFilter extends NumberMinFilter {}

export class VideoTitleFilter extends KeywordFilter {}

export class VideoPubdateFilter extends NumberMaxFilter {}

export class VideoUploaderFilter extends StringFilter {}

export class VideoUploaderKeywordFilter extends KeywordFilter {}

export class VideoViewsFilter extends NumberMinFilter {}

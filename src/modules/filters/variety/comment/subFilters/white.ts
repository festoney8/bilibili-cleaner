import { BooleanFilter } from '@/modules/filters/core/subFilters/booleanFilter'
import { NumberMaxFilter } from '@/modules/filters/core/subFilters/numberMaxFilter'

export class CommentIsUpFilter extends BooleanFilter {}

export class CommentIsPinFilter extends BooleanFilter {}

export class CommentIsNoteFilter extends BooleanFilter {}

export class CommentIsLinkFilter extends BooleanFilter {}

export class CommentIsMeFilter extends BooleanFilter {}

export class CommentLikeWhiteFilter extends NumberMaxFilter {}

export class CommentRcountWhiteFilter extends NumberMaxFilter {}

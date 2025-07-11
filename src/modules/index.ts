import { waitForHead } from '@/utils/init'
import { log } from '@/utils/logger'
import { loadFilters, loadFilterStyle } from './filters'
import { loadRules, loadRulesHotKey, loadStyles } from './rules'

export const loadModules = () => {
    waitForHead().then(() => {
        loadStyles()
        loadFilterStyle()
        log('loadStyles done')
    })

    loadRules()
    loadRulesHotKey()
    log('loadRules done')

    loadFilters()
    log('loadFilters done')
}

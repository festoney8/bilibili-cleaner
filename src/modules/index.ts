import { waitForHead } from '../utils/init'
import { log } from '../utils/logger'
import { loadFilters } from './filters'
import { loadRules, loadStyles } from './rules'

export const loadModules = () => {
    waitForHead().then(() => {
        log('loadStyles start')
        loadStyles()
        log('loadStyles done')
    })

    log('loadRules start')
    loadRules()
    log('loadRules done')

    log('loadFilters start')
    loadFilters()
    log('loadFilters done')
}

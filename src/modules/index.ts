import { waitForHead } from '../utils/init'
import { log } from '../utils/logger'
import { loadRules, loadStyles } from './rules'

export const loadModules = () => {
    log('loadRules start')
    loadRules()
    log('loadRules done')

    waitForHead().then(() => {
        log('loadStyles start')
        loadStyles()
        log('loadStyles done')
    })

    // log('loadFilters start')
    // loadFilters()
    // log('loadFilters done')
}

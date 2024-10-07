import { waitForHead } from '../utils/init'
import { log } from '../utils/logger'
import { loadFilters } from './filters'
import { loadRules, loadStyles } from './rules'

export const loadModules = () => {
    waitForHead().then(() => {
        loadStyles()
        log('loadStyles done')
    })

    loadRules()
    log('loadRules done')

    loadFilters()
    log('loadFilters done')
}

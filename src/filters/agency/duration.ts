import durationFilterInstance from '../filters/subfilters/duration'

class DurationAgency {
    constructor() {}

    notify(event: string, value?: number) {
        switch (event) {
            case 'disable':
                this.disableDurationFilter()
                break
            case 'enable':
                this.enableDurationFilter()
                break
            case 'change':
                if (typeof value === 'number') {
                    this.setParams(value)
                }
                break
        }
    }

    private disableDurationFilter() {
        durationFilterInstance.setStatus(false)
    }
    private enableDurationFilter() {
        durationFilterInstance.setStatus(true)
    }
    private setParams(threshold: number) {
        durationFilterInstance.setParams(threshold)
    }
}

const durationAgencyInstance = new DurationAgency()
export default durationAgencyInstance

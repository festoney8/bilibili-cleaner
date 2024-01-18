import bvidFilterInstance from '../filters/subfilters/bvid'

class BvidAgency {
    constructor() {}

    notify(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                this.disableBvidFilter()
                break
            case 'enable':
                this.enableBvidFilter()
                break
            case 'add':
                if (typeof value === 'string') {
                    this.addBvid(value)
                }
                break
            case 'setList':
                if (Array.isArray(value)) {
                    this.setBvidList(value)
                }
                break
        }
    }

    private disableBvidFilter() {
        bvidFilterInstance.setStatus(false)
    }
    private enableBvidFilter() {
        bvidFilterInstance.setStatus(true)
    }
    private addBvid(bvid: string) {
        if (bvid) {
            bvidFilterInstance.addParam(bvid)
        }
    }
    private setBvidList(bvidList: string[]) {
        bvidFilterInstance.setParams(bvidList.filter((bvid) => bvid))
    }
}

const bvidAgencyInstance = new BvidAgency()
export default bvidAgencyInstance

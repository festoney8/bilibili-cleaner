import titleKeywordFilterInstance from '../filters/subfilters/titleKeyword'

class TitleKeywordAgency {
    constructor() {}

    notify(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                this.disableTitleKeywordFilter()
                break
            case 'enable':
                this.enableTitleKeywordFilter()
                break
            case 'add':
                if (typeof value === 'string') {
                    this.addTitleKeyword(value)
                }
                break
            case 'edit':
                if (Array.isArray(value)) {
                    this.setTitleKeywordList(value)
                }
                break
        }
    }

    private disableTitleKeywordFilter() {
        titleKeywordFilterInstance.setStatus(false)
    }
    private enableTitleKeywordFilter() {
        titleKeywordFilterInstance.setStatus(true)
    }
    private addTitleKeyword(titleKeyword: string) {
        if (titleKeyword) {
            titleKeywordFilterInstance.addParam(titleKeyword)
        }
    }
    private setTitleKeywordList(titleKeywordList: string[]) {
        titleKeywordFilterInstance.setParams(titleKeywordList.filter((titleKeyword) => titleKeyword))
    }
}

const titleKeywordAgencyInstance = new TitleKeywordAgency()
export default titleKeywordAgencyInstance

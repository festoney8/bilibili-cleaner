import keywordFilterInstance from '../filters/subfilters/keyword'

class KeywordAgency {
    constructor() {}

    notify(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                this.disableKeywordFilter()
                break
            case 'enable':
                this.enableKeywordFilter()
                break
            case 'add':
                if (typeof value === 'string') {
                    this.addKeyword(value)
                }
                break
            case 'setList':
                if (Array.isArray(value)) {
                    this.setKeywordList(value)
                }
                break
        }
    }

    private disableKeywordFilter() {
        keywordFilterInstance.setStatus(false)
    }
    private enableKeywordFilter() {
        keywordFilterInstance.setStatus(true)
    }
    private addKeyword(keyword: string) {
        if (keyword) {
            keywordFilterInstance.addParam(keyword)
        }
    }
    private setKeywordList(keywordList: string[]) {
        keywordFilterInstance.setParams(keywordList.filter((keyword) => keyword))
    }
}

const keywordAgencyInstance = new KeywordAgency()
export default keywordAgencyInstance

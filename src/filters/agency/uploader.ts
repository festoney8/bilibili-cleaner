import uploaderFilterInstance from '../filters/subfilters/uploader'

class UploaderAgency {
    constructor() {}

    notify(event: string, value?: string | string[]) {
        switch (event) {
            case 'disable':
                this.disableUploaderFilter()
                break
            case 'enable':
                this.enableUploaderFilter()
                break
            case 'add':
                if (typeof value === 'string') {
                    this.addUploader(value)
                }
                break
            case 'setList':
                if (Array.isArray(value)) {
                    this.setUploaderList(value)
                }
                break
        }
    }

    private disableUploaderFilter() {
        uploaderFilterInstance.setStatus(false)
    }
    private enableUploaderFilter() {
        uploaderFilterInstance.setStatus(true)
    }
    private addUploader(uploader: string) {
        if (uploader) {
            uploaderFilterInstance.addParam(uploader)
        }
    }
    private setUploaderList(uploaderList: string[]) {
        uploaderFilterInstance.setParams(uploaderList.filter((uploader) => uploader))
    }
}

const uploaderAgencyInstance = new UploaderAgency()
export default uploaderAgencyInstance

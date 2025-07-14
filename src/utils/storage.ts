import { GM_deleteValue, GM_getValue, GM_setValue } from '$'

export const BiliCleanerStorage = {
    get: <T = unknown>(key: string, defaultValue?: T | undefined): T => {
        return GM_getValue(`BILICLEANER_${key}`, defaultValue)
    },

    set: <T = unknown>(key: string, value: T) => {
        GM_setValue(`BILICLEANER_${key}`, value)
    },

    delete: (key: string) => {
        GM_deleteValue(`BILICLEANER_${key}`)
    },
}

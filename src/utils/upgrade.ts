import { GM_getValue, GM_listValues, GM_setValue } from '$'

const removePrefix = () => {
    const prefix = 'BILICLEANER_'
    const keys = GM_listValues()
    keys.forEach((key) => {
        if (key.startsWith(prefix)) {
            const newKey = key.replaceAll(prefix, '')
            if (!keys.includes(newKey)) {
                const value = GM_getValue(key)
                GM_setValue(newKey, value)
            }
        }
    })
}

export const upgrade = () => {
    removePrefix()
}

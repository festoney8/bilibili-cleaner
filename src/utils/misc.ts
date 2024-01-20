const bvidPattern = /(BV[1-9A-HJ-NP-Za-km-z]+)/

export const matchBvid = (s: string): string | null => {
    const match = bvidPattern.exec(s)
    if (match && match.length >= 2) {
        return match[1]
    }
    return null
}

const avidbvidPattern = /(av\d+|BV[1-9A-HJ-NP-Za-km-z]+)/
export const matchAvidBvid = (s: string): string | null => {
    const match = avidbvidPattern.exec(s)
    if (match && match.length >= 2) {
        return match[1]
    }
    return null
}

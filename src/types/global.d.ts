export declare global {
    interface Window {
        isWide?: boolean
        __INITIAL_STATE__?: {
            related?: {
                bvid?: string
            }[]
        }
        __NEXT_DATA__?: any
        EmbedPlayer?: {
            instance?: {
                getPlayerInfo: () => {
                    quality?: string
                    qualityCandidates?: {
                        qn?: string
                        desc?: string
                    }[]
                }
                switchQuality?: function
            }
        }
        livePlayer?: {
            getPlayerInfo: () => {
                quality?: string
                qualityCandidates?: {
                    qn?: string
                    desc?: string
                }[]
            }
            switchQuality?: function
        }
    }
}

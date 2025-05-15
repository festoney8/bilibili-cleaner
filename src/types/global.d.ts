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
                    playerStatus?: number
                    quality?: string
                    qualityCandidates?: {
                        qn?: string
                        desc?: string
                    }[]
                }
                switchQuality?: function
                setFullscreenStatus?: function
            }
        }
        livePlayer?: {
            getPlayerInfo: () => {
                playerStatus?: number
                quality?: string
                qualityCandidates?: {
                    qn?: string
                    desc?: string
                }[]
            }
            switchQuality?: function
            setFullscreenStatus?: function
        }
        player?: {
            requestStatue?: function
        }
    }
}

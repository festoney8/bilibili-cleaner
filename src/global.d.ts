export declare global {
    interface Window {
        isWide?: boolean
        hasBlackSide?: boolean
        setSize?: function
        webAbTest?: {
            danmuku_block_version?: string
        }
        vd?: {
            aid?: number
            bvid?: string
        }
        player?: {
            __core: () => {
                uiStore: {
                    state: {
                        miniScreenBottom: number
                        miniScreenRight: number
                    }
                }
            }
        }
        __INITIAL_STATE__?: {
            abtest?: {
                comment_next_version?: 'ELEMENTS' | 'DEFAULT'
            }
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

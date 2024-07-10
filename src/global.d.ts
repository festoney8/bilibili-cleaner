export declare global {
    interface Window {
        isWide?: boolean
        hasBlackSide?: boolean
        setSize?: function
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
    }
}

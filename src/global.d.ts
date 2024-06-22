export declare global {
    interface Window {
        isWide?: boolean
        hasBlackSide?: boolean
        setSize?: function
        vd?: {
            aid?: number
            bvid?: string
        }
        player:
            | {
                  __core: () => {
                      uiStore: {
                          state: {
                              miniScreenBottom: number
                              miniScreenRight: number
                          }
                      }
                  }
              }
            | undefined
    }
}

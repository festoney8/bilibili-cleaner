export declare global {
    type myCSS = string
    type myHTML = string
    interface Window {
        isWide?: boolean
        hasBlackSide?: boolean
        setSize?: function
    }
}

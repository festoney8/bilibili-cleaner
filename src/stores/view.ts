import {
    isPageBangumi,
    isPageChannel,
    isPageDynamic,
    isPageHomepage,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageSpace,
    isPageVideo,
} from '@/utils/pageType'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 控制几种view的显示/隐藏状态
 */

export const useRulePanelStore = defineStore('RulePanel', () => {
    const isShow = ref(false)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    const toggle = () => {
        isShow.value = !isShow.value
    }
    const isPageValid = () => true
    return { isShow, show, hide, toggle, isPageValid }
})

export const useVideoFilterPanelStore = defineStore('VideoFilterPanel', () => {
    const isShow = ref(false)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    const toggle = () => {
        isShow.value = !isShow.value
    }
    const isPageValid = () => {
        return (
            isPageHomepage() ||
            isPageVideo() ||
            isPagePlaylist() ||
            isPagePopular() ||
            isPageChannel() ||
            isPageSearch() ||
            isPageSpace()
        )
    }
    return { isShow, show, hide, toggle, isPageValid }
})

export const useCommentFilterPanelStore = defineStore('CommentFilterPanel', () => {
    const isShow = ref(false)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    const toggle = () => {
        isShow.value = !isShow.value
    }
    const isPageValid = () => {
        return isPageVideo() || isPageBangumi() || isPageDynamic() || isPageSpace() || isPagePlaylist()
    }
    return { isShow, show, hide, toggle, isPageValid }
})

export const useDynamicFilterPanelStore = defineStore('DynamicFilterPanel', () => {
    const isShow = ref(false)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    const toggle = () => {
        isShow.value = !isShow.value
    }
    const isPageValid = () => {
        return isPageDynamic() || isPageSpace()
    }
    return { isShow, show, hide, toggle, isPageValid }
})

// 快捷按钮
export const useSideBtnStore = defineStore('SideBtn', () => {
    // turn on sideBtn for safari #291
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    const isShow = useStorage('bili-cleaner-side-btn-show', isSafari, localStorage)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    const toggle = () => {
        isShow.value = !isShow.value
    }
    return { isShow, show, hide, toggle }
})

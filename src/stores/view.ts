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
    return { isShow, show, hide }
})

export const useVideoFilterPanelStore = defineStore('VideoFilterPanel', () => {
    const isShow = ref(false)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    return { isShow, show, hide }
})

export const useCommentFilterPanelStore = defineStore('CommentFilterPanel', () => {
    const isShow = ref(false)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    return { isShow, show, hide }
})

export const useDynamicFilterPanelStore = defineStore('DynamicFilterPanel', () => {
    const isShow = ref(false)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    return { isShow, show, hide }
})

// 快捷按钮
export const useSideBtnStore = defineStore('SideBtn', () => {
    const isShow = useStorage('bili-cleaner-side-btn-show', false, localStorage)
    const show = () => {
        isShow.value = true
    }
    const hide = () => {
        isShow.value = false
    }
    return { isShow, show, hide }
})

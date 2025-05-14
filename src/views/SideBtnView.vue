<template>
    <div
        class="group fixed flex flex-col justify-end text-opacity-50 will-change-[right,bottom] hover:text-opacity-100"
        v-if="sideBtnStore.isShow"
        ref="target"
        :style="{ right: btnPos.right + 'px', bottom: btnPos.bottom + 'px' }"
        :class="[isDarkMode ? 'text-white' : 'text-black', isPageBangumi() || isPageVideo() ? 'z-[100]' : 'z-[2000]']"
    >
        <div
            class="mt-1 h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white"
            v-for="(btn, index) in buttons.filter((btn) => btn.isValid)"
            :key="index"
            :class="[
                // 主题
                isDarkMode ? 'border-[#2f3134] bg-[#242628]' : 'border-gray-200 bg-white',
                // 显示
                btn.defaultHidden && !isDragging ? 'hidden group-hover:flex' : 'flex',
            ]"
            @click="btn.click()"
        >
            <div>
                <p class="select-none text-center text-[13px] leading-4">{{ btn.text.value.substring(0, 2) }}</p>
                <p class="select-none text-center text-[13px] leading-4">{{ btn.text.value.substring(2, 4) }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isDarkMode, toggleDarkMode } from '@/modules/rules/common/groups/theme'
import {
    useCommentFilterPanelStore,
    useDynamicFilterPanelStore,
    useRulePanelStore,
    useSideBtnStore,
    useVideoFilterPanelStore,
} from '@/stores/view'
import { isPageBangumi, isPageVideo } from '@/utils/pageType'
import { Position, useDraggable, useElementBounding, useStorage, useWindowSize } from '@vueuse/core'
import { computed, Ref, ref } from 'vue'

const ruleStore = useRulePanelStore()
const videoStore = useVideoFilterPanelStore()
const commentStore = useCommentFilterPanelStore()
const dynamicStore = useDynamicFilterPanelStore()
const sideBtnStore = useSideBtnStore()

const target = ref<HTMLElement | null>(null)
const { width, height } = useElementBounding(target, { windowScroll: false })

const btnPos = useStorage('bili-cleaner-side-btn-pos', { right: 10, bottom: 180 }, localStorage)

const isDragging = ref(false)

const windowSize = useWindowSize({ includeScrollbar: false })

const maxPos = computed(() => {
    return {
        x: windowSize.width.value - width.value,
        y: windowSize.height.value - height.value,
    }
})

// 功能按钮列表
const buttons: {
    text: Ref<string>
    defaultHidden: boolean
    isValid: boolean
    click: () => void
}[] = [
    {
        text: computed(() => (isDarkMode.value ? '日间模式' : '夜间模式')),
        defaultHidden: true,
        isValid: true,
        click: toggleDarkMode,
    },
    {
        text: ref('动态过滤'),
        defaultHidden: true,
        isValid: dynamicStore.isPageValid(),
        click: () => dynamicStore.toggle(),
    },
    {
        text: ref('评论过滤'),
        defaultHidden: true,
        isValid: commentStore.isPageValid(),
        click: () => commentStore.toggle(),
    },
    {
        text: ref('视频过滤'),
        defaultHidden: true,
        isValid: videoStore.isPageValid(),
        click: () => videoStore.toggle(),
    },
    {
        text: ref('页面净化'),
        defaultHidden: false,
        isValid: ruleStore.isPageValid(),
        click: () => {
            if (!isDragging.value) {
                ruleStore.toggle()
            }
        },
    },
]

let rAF = 0
useDraggable(target, {
    initialValue: {
        x: windowSize.width.value - btnPos.value.right,
        y: windowSize.height.value - btnPos.value.bottom,
    },
    preventDefault: true,
    handle: computed(() => target.value),
    onMove: (pos: Position) => {
        isDragging.value = true
        btnPos.value.right = maxPos.value.x - pos.x
        btnPos.value.bottom = maxPos.value.y - pos.y

        // 限制拖拽范围
        cancelAnimationFrame(rAF)
        rAF = requestAnimationFrame(() => {
            if (btnPos.value.right < 0) {
                btnPos.value.right = 0
            }
            if (btnPos.value.bottom < 0) {
                btnPos.value.bottom = 0
            }
            if (btnPos.value.bottom > maxPos.value.y) {
                btnPos.value.bottom = maxPos.value.y
            }
            if (btnPos.value.right > maxPos.value.x) {
                btnPos.value.right = maxPos.value.x
            }
        })
    },
    onEnd: () => {
        setTimeout(() => {
            isDragging.value = false
        }, 50)
    },
})
</script>

<template>
    <div
        v-if="sideBtnStore.isShow"
        :style="{ right: btnPos.right + 'px', bottom: btnPos.bottom + 'px' }"
        class="group fixed flex flex-col justify-end text-black text-opacity-50 will-change-[right,bottom] hover:text-opacity-100"
        :class="{
            'z-[100]': !isPageLive(),
            'z-[1000]': isPageLive(),
        }"
    >
        <div
            v-if="isPageDynamic()"
            class="mt-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white group-hover:flex"
            @click="dynamicStore.isShow ? dynamicStore.hide() : dynamicStore.show()"
        >
            <div>
                <p class="select-none text-center text-[13px] leading-4">动态</p>
                <p class="select-none text-center text-[13px] leading-4">过滤</p>
            </div>
        </div>
        <div
            v-if="isPageVideo() || isPageBangumi() || isPagePlaylist() || isPageDynamic() || isPageSpace()"
            class="mt-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white group-hover:flex"
            @click="commentStore.isShow ? commentStore.hide() : commentStore.show()"
        >
            <div>
                <p class="select-none text-center text-[13px] leading-4">评论</p>
                <p class="select-none text-center text-[13px] leading-4">过滤</p>
            </div>
        </div>
        <div
            v-if="
                isPageVideo() ||
                isPageChannel() ||
                isPageChannelNext() ||
                isPageHomepage() ||
                isPagePlaylist() ||
                isPageSearch() ||
                isPagePopular()
            "
            class="mt-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white group-hover:flex"
            @click="videoStore.isShow ? videoStore.hide() : videoStore.show()"
        >
            <div>
                <p class="select-none text-center text-[13px] leading-4">视频</p>
                <p class="select-none text-center text-[13px] leading-4">过滤</p>
            </div>
        </div>
        <div
            ref="target"
            class="mt-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white"
            @click="!isDragging && (ruleStore.isShow ? ruleStore.hide() : ruleStore.show())"
        >
            <div>
                <p class="select-none text-center text-[13px] leading-4">页面</p>
                <p class="select-none text-center text-[13px] leading-4">净化</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    useCommentFilterPanelStore,
    useDynamicFilterPanelStore,
    useRulePanelStore,
    useSideBtnStore,
    useVideoFilterPanelStore,
} from '@/stores/view'
import {
    isPageBangumi,
    isPageChannel,
    isPageChannelNext,
    isPageDynamic,
    isPageHomepage,
    isPageLive,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageSpace,
    isPageVideo,
} from '@/utils/pageType'
import { Position, useDraggable, useElementBounding, useStorage, useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

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

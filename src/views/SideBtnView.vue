<template>
    <div
        v-if="sideBtnStore.isShow"
        :style="{ right: btnPos.right + 'px', bottom: btnPos.bottom + 'px' }"
        class="group fixed z-[10000] flex flex-col justify-end text-black text-opacity-50 hover:text-opacity-100"
    >
        <div
            class="mt-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white group-hover:flex"
            @click="dynamicStore.isShow ? dynamicStore.hide() : dynamicStore.show()"
        >
            <div>
                <p class="select-none text-center text-[13px] leading-4">动态</p>
                <p class="select-none text-center text-[13px] leading-4">过滤</p>
            </div>
        </div>
        <div
            class="mt-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white group-hover:flex"
            @click="commentStore.isShow ? commentStore.hide() : commentStore.show()"
        >
            <div>
                <p class="select-none text-center text-[13px] leading-4">评论</p>
                <p class="select-none text-center text-[13px] leading-4">过滤</p>
            </div>
        </div>
        <div
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
            @click="ruleStore.isShow ? ruleStore.hide() : ruleStore.show()"
        >
            <div>
                <p class="select-none text-center text-[13px] leading-4">页面</p>
                <p class="select-none text-center text-[13px] leading-4">净化</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Position, useDraggable, useElementBounding, useStorage } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import {
    useCommentFilterPanelStore,
    useDynamicFilterPanelStore,
    useRulePanelStore,
    useSideBtnStore,
    useVideoFilterPanelStore,
} from '../stores/view'

const ruleStore = useRulePanelStore()
const videoStore = useVideoFilterPanelStore()
const commentStore = useCommentFilterPanelStore()
const dynamicStore = useDynamicFilterPanelStore()
const sideBtnStore = useSideBtnStore()

const target = ref<HTMLElement | null>(null)
const { width, height } = useElementBounding(target, { windowScroll: false })

const btnPos = useStorage('bili-cleaner-side-btn-pos', { right: 6, bottom: 165 }, localStorage)

useDraggable(target, {
    initialValue: {
        x: innerWidth - btnPos.value.right,
        y: innerHeight - btnPos.value.bottom,
    },
    preventDefault: true,
    onMove: (position: Position) => {
        btnPos.value.right = innerWidth - position.x - width.value
        btnPos.value.bottom = innerHeight - position.y - height.value
    },
    handle: computed(() => target.value),
})

// 限制拖拽范围
watch(btnPos.value, (newBtnPosition) => {
    if (newBtnPosition.right < 0) {
        btnPos.value.right = 0
    }
    if (newBtnPosition.bottom < 0) {
        btnPos.value.bottom = 0
    }
    if (newBtnPosition.bottom + height.value > innerHeight) {
        btnPos.value.bottom = innerHeight - height.value
    }
    if (newBtnPosition.right + width.value > innerWidth) {
        btnPos.value.right = innerWidth - width.value
    }
})
</script>

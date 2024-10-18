<template>
    <div
        ref="panel"
        :style="[panelStyle, style]"
        class="no-scrollbar fixed z-[10000000] select-none overflow-auto overscroll-none rounded-xl bg-white shadow-lg will-change-scroll"
    >
        <div ref="bar" class="sticky top-0 z-10 w-full cursor-move bg-[#00AEEC] py-1.5 text-center">
            <div class="text-xl font-black text-white">{{ title }}</div>
            <i
                class="absolute right-0 top-0 m-1 cursor-pointer text-white hover:rounded-full hover:bg-white hover:bg-opacity-40"
                @click="emit('close')"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    class="size-8"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </i>
        </div>
        <div class="no-scrollbar flex min-h-[calc(100%-2.5rem)] flex-1 flex-col p-2">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Position, useDraggable, useElementBounding, useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

const emit = defineEmits(['close'])

const props = defineProps<{
    title: string
    widthPercent: number // 单位vw
    heightPercent: number // 单位vh
    minWidth: number // 单位px
    minHeight: number // 单位px
}>()

const panel = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)

const windowSize = useWindowSize({ includeScrollbar: false })
const { width, height } = useElementBounding(bar, { windowScroll: false }) // bar元素长宽

const maxPos = computed(() => {
    return {
        x: windowSize.width.value - width.value,
        y: windowSize.height.value - height.value,
    }
})
let rAF = 0
const { style } = useDraggable(panel, {
    initialValue: {
        x:
            windowSize.width.value / 2 -
            Math.max((windowSize.width.value * props.widthPercent) / 100, props.minWidth) / 2,
        y:
            windowSize.height.value / 2 -
            Math.max((windowSize.height.value * props.heightPercent) / 100, props.minHeight) / 2,
    },
    handle: computed(() => bar.value),
    preventDefault: true,
    // 限制拖拽范围
    onMove: (pos: Position) => {
        cancelAnimationFrame(rAF)
        rAF = requestAnimationFrame(() => {
            if (pos.x < 0) {
                pos.x = 0
            }
            if (pos.y < 0) {
                pos.y = 0
            }
            if (pos.x > maxPos.value.x) {
                pos.x = maxPos.value.x
            }
            if (pos.y > maxPos.value.y) {
                pos.y = maxPos.value.y
            }
        })
    },
})

const panelStyle = computed(() => {
    return {
        width: props.widthPercent + 'vw',
        height: props.heightPercent + 'vh',
        minWidth: props.minWidth + 'px',
        minHeight: props.minHeight + 'px',
    }
})
</script>

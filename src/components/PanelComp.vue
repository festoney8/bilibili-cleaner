<template>
    <div
        ref="panel"
        :style="[
            {
                width: widthPercent + 'vw',
                height: heightPercent + 'vh',
                minWidth: minWidth + 'px',
                minHeight: minHeight + 'px',
            },
            style,
        ]"
        class="no-scrollbar fixed z-[10000000] select-none overflow-auto overscroll-none rounded-xl bg-white shadow-lg"
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
import { useDraggable, useElementBounding } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    title: string
    widthPercent: number // 单位vw
    heightPercent: number // 单位vh
    minWidth: number // 单位px
    minHeight: number // 单位px
}>()

const emit = defineEmits(['close'])

const panel = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)
const { width, height } = useElementBounding(bar, { windowScroll: false }) // bar元素长宽

const { x, y, style } = useDraggable(panel, {
    initialValue: {
        x: innerWidth / 2 - Math.max((innerWidth * props.widthPercent) / 100, props.minWidth) / 2,
        y: innerHeight / 2 - Math.max((innerHeight * props.heightPercent) / 100, props.minHeight) / 2,
    },
    handle: computed(() => bar.value),
    preventDefault: true,
})

// 限制拖拽范围
watch([x, y], ([newX, newY]) => {
    if (newX < 0) {
        x.value = 0
    }
    if (newY < 0) {
        y.value = 0
    }
    if (newY + height.value > innerHeight) {
        y.value = innerHeight - height.value
    }
    if (newX + width.value > innerWidth) {
        x.value = innerWidth - width.value
    }
})
</script>

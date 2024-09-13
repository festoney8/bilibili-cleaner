<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { computed, onMounted, reactive, ref, watch } from 'vue'

const wrap = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)
const disabled = ref(false)

const { x, y, style } = useDraggable(wrap, {
  initialValue: { x: 40, y: 40 },
  handle: computed(() => bar.value),
  preventDefault: true,
  disabled: disabled,
})

const panelSize = reactive({ width: 0, height: 0 })

onMounted(() => {
  if (bar.value) {
    const rect = bar.value.getBoundingClientRect()
    panelSize.height = rect.height
    panelSize.width = rect.width
  }
})

// 限制拖拽范围
watch([x, y], ([newX, newY]) => {
  if (newX < 0) {
    x.value = 0
  }
  if (newY < 0) {
    y.value = 0
  }
  if (newY + panelSize.height > innerHeight) {
    y.value = innerHeight - panelSize.height
  }
  if (newX + panelSize.width > innerWidth) {
    x.value = innerWidth - panelSize.width
  }
})
</script>

<template>
  <div ref="wrap" :style="style" class="fixed z-[99999] h-80 w-80 select-none bg-yellow-400">
    <div ref="bar" class="cursor-move select-none bg-blue-200 text-2xl font-black">title</div>
    <div class="mt-8 select-none bg-red-100">body {{ x }} {{ y }}</div>
  </div>
</template>

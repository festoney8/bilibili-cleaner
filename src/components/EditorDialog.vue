<template>
    <PanelComp
        v-bind="{
            title: currentItem?.editorTitle ?? '',
            widthPercent: 28,
            heightPercent: 85,
            minWidth: 360,
            minHeight: 600,
        }"
        v-if="isEditorShow"
        @close="closeEditor"
    >
        <div class="mx-2 mb-2 flex flex-1 flex-col p-1 text-black">
            <DescriptionComp
                class="mb-3"
                v-if="currentItem?.editorDescription?.length"
                :description="currentItem.editorDescription"
            ></DescriptionComp>
            <textarea
                v-model="editorData"
                @keydown.stop
                class="flex-1 resize-none overscroll-none rounded-md border-2 border-gray-300 bg-white p-2 text-[15px] outline-hidden focus:border-gray-400"
                style="scrollbar-width: thin; scrollbar-color: #999 #00000000"
                spellcheck="false"
                placeholder="请输入内容..."
            ></textarea>
        </div>
    </PanelComp>
</template>

<script setup lang="ts">
import { IEditorItem } from '@/types/item'
import { logger } from '@/utils/logger'
import { orderedUniq } from '@/utils/tool'
import { GM_getValue, GM_setValue } from '$'
import { onUnmounted, ref, type WatchStopHandle } from 'vue'
import { watchDebounced } from '@vueuse/core'
import PanelComp from './PanelComp.vue'
import DescriptionComp from './items/DescriptionComp.vue'

const isEditorShow = ref(false)
const editorData = ref('')
const currentItem = ref<IEditorItem | null>(null)

let stopWatch: WatchStopHandle | null = null

const openEditor = (item: IEditorItem) => {
    currentItem.value = item

    const val = GM_getValue(item.id, []).join('\n')
    editorData.value = val ? val + '\n' : val

    stopWatch = watchDebounced(
        editorData,
        (value) => {
            if (!currentItem.value) {
                return
            }
            try {
                const data = orderedUniq(value.split('\n').filter((v) => v.trim() !== ''))
                GM_setValue(currentItem.value.id, data)
                currentItem.value.saveFn()
            } catch (err) {
                logger.error(`EditorDialog ${currentItem.value.id} saveData error`, err)
            }
        },
        { debounce: 1000 },
    )

    isEditorShow.value = true
}

const closeEditor = () => {
    if (currentItem.value) {
        try {
            const data = orderedUniq(editorData.value.split('\n').filter((v) => v.trim() !== ''))
            GM_setValue(currentItem.value.id, data)
            currentItem.value.saveFn()
        } catch (err) {
            logger.error(`EditorDialog ${currentItem.value.id} closeEditor error`, err)
        }
    }
    isEditorShow.value = false
}

onUnmounted(() => {
    if (stopWatch) {
        stopWatch()
    }
})

defineExpose({ openEditor })
</script>

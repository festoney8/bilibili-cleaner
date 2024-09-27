<template>
    <div class="flex w-full py-1">
        <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent bg-white px-2 py-1 text-sm text-blue-900 outline-none ring-1 ring-gray-300 hover:bg-blue-50 hover:ring-blue-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:ring-offset-1"
            @click="isEditorShow = true"
        >
            编辑
        </button>
        <div class="ml-2 self-center text-black">{{ name }}</div>
    </div>
    <DescriptionComp class="pl-10" v-if="description?.length" :description="description"></DescriptionComp>

    <PanelComp
        ref="panel"
        v-bind="{
            title: editorTitle,
            widthPercent: 28,
            heightPercent: 85,
            minWidth: 360,
            minHeight: 600,
        }"
        v-if="isEditorShow"
        @close="isEditorShow = false"
    >
        <div class="mx-2 mb-2 flex flex-1 flex-col p-1 text-black">
            <DescriptionComp
                class="mb-3"
                v-if="editorDescription?.length"
                :description="editorDescription"
            ></DescriptionComp>
            <textarea
                v-model="editorData"
                class="flex-1 resize-none overscroll-none rounded-md border-2 border-gray-300 p-2 text-[15px] outline-none focus:border-gray-400"
                style="scrollbar-width: thin; scrollbar-color: #999 #00000000"
                placeholder="请输入内容..."
            ></textarea>
            <div class="mt-4 flex justify-around">
                <button
                    class="w-24 self-center rounded-md border-2 border-gray-300 bg-white py-0.5 text-center text-lg hover:border-blue-400 hover:bg-blue-50"
                    :class="saveSuccess ? 'border-green-400 bg-green-50 hover:border-green-400 hover:bg-green-50' : ''"
                    @click="saveData"
                >
                    保存
                </button>
                <button
                    class="w-24 self-center rounded-md border-2 border-gray-300 bg-white py-0.5 text-center text-lg hover:border-red-300 hover:bg-red-50"
                    @click="isEditorShow = false"
                >
                    关闭
                </button>
            </div>
        </div>
    </PanelComp>
</template>

<script setup lang="ts">
import { GM_getValue, GM_setValue } from '$'
import { onBeforeUpdate, ref } from 'vue'
import { IEditorItem } from '../../types/item'
import { error } from '../../utils/logger'
import PanelComp from '../PanelComp.vue'
import DescriptionComp from './DescriptionComp.vue'

const item = defineProps<IEditorItem>()

const panel = ref<HTMLElement | null>(null)

const isEditorShow = ref(false)
const saveSuccess = ref(false)
const editorData = ref(GM_getValue(item.id, []).join('\n') + '\n') // 末尾空行

const saveData = () => {
    try {
        const data = editorData.value.split('\n').filter((v) => v.trim() !== '')
        GM_setValue(item.id, data)
        saveSuccess.value = true
        setTimeout(() => {
            saveSuccess.value = false
        }, 1500)
        item.saveFn()
    } catch (err) {
        error(`editor item ${item.id} saveData error`, err)
    }
}

onBeforeUpdate(() => {
    if (panel.value) {
        editorData.value = GM_getValue(item.id, []).join('\n') + '\n'
    }
})
</script>

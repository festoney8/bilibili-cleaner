<template>
    <label class="flex w-full py-1 hover:bg-blue-50/50">
        <button
            type="button"
            class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-blue-900 outline-hidden"
            @click="emit('edit', item)"
        >
            编辑
        </button>
        <span class="ml-2 self-center text-black">{{ name }}</span>
    </label>
    <DescriptionComp class="pl-9" v-if="description?.length" :description="description"></DescriptionComp>
</template>

<script setup lang="ts">
import { IEditorItem } from '@/types/item'
import DescriptionComp from './DescriptionComp.vue'

const item = defineProps<IEditorItem>()
const emit = defineEmits<{
    edit: [item: IEditorItem]
}>()
</script>

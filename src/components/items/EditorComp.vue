<template>
    <div class="flex w-full py-1">
        <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent bg-white px-2 py-1 text-sm text-blue-900 outline-none ring-1 ring-gray-300 hover:bg-blue-50 hover:ring-blue-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:ring-offset-1"
            @click="onClick"
        >
            编辑
        </button>
        <div class="ml-2 self-center text-black">{{ name }}</div>
    </div>
</template>

<script setup lang="ts">
import { IEditorItem } from '../../types/item'

const item = defineProps<IEditorItem>()

const onClick = () => {}
</script>

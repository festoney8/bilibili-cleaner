<template>
    <div class="my-1 flex items-center py-1 text-black">
        <div>{{ name }}</div>
        <input
            type="number"
            v-model="currValue"
            class="ml-auto block w-1/5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm outline-none invalid:border-red-500 focus:border-gray-500 focus:invalid:border-red-500"
        />
        <div v-if="addonText" class="ml-2">{{ addonText }}</div>
    </div>
    <DescriptionComp class="pl-1" v-if="description?.length" :description="description"></DescriptionComp>
</template>

<script setup lang="ts">
import { GM_getValue, GM_setValue } from '$'
import { ref, watch } from 'vue'
import { INumberItem } from '../../types/item'
import DescriptionComp from './DescriptionComp.vue'

const item = defineProps<INumberItem>()

const currValue = ref(GM_getValue(item.id, item.defaultValue))

watch(currValue, (newValue, oldValue) => {
    if (newValue > item.maxValue) {
        currValue.value = item.maxValue
    }
    if (newValue < item.minValue) {
        currValue.value = item.minValue
    }

    // 样式生效、失效
    if (oldValue === item.disableValue) {
        if (!item.noStyle) {
            document.documentElement.setAttribute(item.attrName ?? item.id, '')
        }
    }
    if (newValue === item.disableValue) {
        if (!item.noStyle) {
            document.documentElement.removeAttribute(item.attrName ?? item.id)
        }
    } else if (currValue.value !== oldValue) {
        item.fn(currValue.value)?.then().catch()
    }
    GM_setValue(item.id, currValue.value)
})
</script>

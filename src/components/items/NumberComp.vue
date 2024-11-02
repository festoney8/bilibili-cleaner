<template>
    <div class="my-1 flex items-center py-1 text-black">
        <div>{{ name }}</div>
        <input
            type="number"
            :step="step"
            v-model="currValue"
            @keydown.stop
            class="ml-auto block w-1/5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm outline-none invalid:border-red-500 focus:border-gray-500 focus:invalid:border-red-500"
        />
        <div v-if="addonText" class="ml-2">{{ addonText }}</div>
    </div>
    <DescriptionComp class="pl-1" v-if="description?.length" :description="description"></DescriptionComp>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { ref } from 'vue'
import { INumberItem } from '../../types/item'
import { error } from '../../utils/logger'
import { BiliCleanerStorage } from '../../utils/storage'
import DescriptionComp from './DescriptionComp.vue'

const item = defineProps<INumberItem>()

const currValue = ref(BiliCleanerStorage.get(item.id, item.defaultValue))

watchDebounced(
    currValue,
    (newValue, oldValue) => {
        try {
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
                item
                    .fn(currValue.value)
                    ?.then()
                    .catch((err) => {
                        throw err
                    })
            }
            BiliCleanerStorage.set<number>(item.id, currValue.value)
        } catch (err) {
            error(`NumberComp ${item.id} error`, err)
        }
    },
    { debounce: 100 },
)
</script>

<template>
    <div class="mb-0.5 mt-1 flex items-center py-1 text-black">
        <div>{{ name }}</div>
        <input
            type="text"
            v-model="currValue"
            @keydown.stop
            class="ml-4 block flex-1 rounded-md border border-gray-300 bg-white p-1.5 text-sm outline-none invalid:border-red-500 focus:border-gray-500 focus:invalid:border-red-500"
        />
    </div>
    <DescriptionComp v-if="description?.length" :description="description"></DescriptionComp>
</template>

<script setup lang="ts">
import { IStringItem } from '@/types/item'
import { error } from '@/utils/logger'
import { BiliCleanerStorage } from '@/utils/storage'
import { watchThrottled } from '@vueuse/core'
import { ref } from 'vue'
import DescriptionComp from './DescriptionComp.vue'

const item = defineProps<IStringItem>()

const currValue = ref(BiliCleanerStorage.get(item.id, item.defaultValue))

watchThrottled(
    currValue,
    (newValue, oldValue) => {
        try {
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
            BiliCleanerStorage.set<string>(item.id, currValue.value)
        } catch (err) {
            error(`StringComp ${item.id} error`, err)
        }
    },
    { throttle: 50 },
)
</script>

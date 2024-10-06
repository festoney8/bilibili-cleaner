<template>
    <div class="mb-0.5 mt-1 flex items-center py-1 text-black">
        <div>{{ name }}</div>
        <input
            type="text"
            v-model="currValue"
            class="ml-4 block flex-1 rounded-md border border-gray-300 bg-white p-1.5 text-sm outline-none invalid:border-red-500 focus:border-gray-500 focus:invalid:border-red-500"
        />
    </div>
    <DescriptionComp v-if="description?.length" :description="description"></DescriptionComp>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IStringItem } from '../../types/item'
import { error } from '../../utils/logger'
import DescriptionComp from './DescriptionComp.vue'
import { BiliCleanerStorage } from '../../utils/storage'

const item = defineProps<IStringItem>()

const currValue = ref(BiliCleanerStorage.get(item.id, item.defaultValue))

watch(currValue, (newValue, oldValue) => {
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
            console.log(newValue, oldValue)
            item
                .fn(currValue.value)
                ?.then()
                .catch((err) => {
                    throw err
                })
        }
        BiliCleanerStorage.set<string>(item.id, currValue.value)
    } catch (err) {
        error(`string item ${item.id} error`, err)
    }
})
</script>

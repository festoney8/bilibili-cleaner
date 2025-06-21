<template>
    <SwitchGroup class="m-0.5 h-fit w-full rounded-lg py-1 hover:bg-blue-50 hover:bg-opacity-50">
        <div class="flex items-center">
            <SwitchLabel class="flex flex-1 flex-row text-black">
                <Switch
                    v-model="enabled"
                    :class="enabled ? 'bg-[#00AEEC]' : 'bg-gray-200'"
                    class="relative inline-flex h-6 w-11 items-center rounded-full outline-none transition-colors"
                >
                    <span
                        :class="enabled ? 'translate-x-6' : 'translate-x-1'"
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    />
                </Switch>
                <p class="ml-2 flex-1">{{ name }}</p>
            </SwitchLabel>
        </div>
    </SwitchGroup>
    <DescriptionComp class="pl-9" v-if="description?.length" :description="description"></DescriptionComp>
</template>

<script setup lang="ts">
import { ISwitchItem } from '@/types/item'
import { error } from '@/utils/logger'
import { BiliCleanerStorage } from '@/utils/storage'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { ref, watch } from 'vue'
import DescriptionComp from './DescriptionComp.vue'

const item = defineProps<ISwitchItem>()

const enabled = ref(BiliCleanerStorage.get(item.id, item.defaultEnable))

watch(enabled, () => {
    try {
        if (enabled.value) {
            if (!item.noStyle) {
                document.documentElement.setAttribute(item.attrName ?? item.id, '')
            }
            if (item.enableFn) {
                item.enableFn()?.catch(() => {})
            }
            BiliCleanerStorage.set<boolean>(item.id, true)
        } else {
            if (!item.noStyle) {
                document.documentElement.removeAttribute(item.attrName ?? item.id)
            }
            if (item.disableFn) {
                item.disableFn()?.catch((err) => {
                    throw err
                })
            }
            BiliCleanerStorage.set<boolean>(item.id, false)
        }
    } catch (err) {
        error(`SwitchComp ${item.id} error`, err)
    }
})
</script>

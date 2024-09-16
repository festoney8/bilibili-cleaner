<template>
    <SwitchGroup class="m-0.5 h-fit w-full rounded-lg py-1 hover:bg-blue-50 hover:bg-opacity-50">
        <div class="flex items-center">
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
            <SwitchLabel class="ml-2 flex-1 text-black"> {{ name }}</SwitchLabel>
        </div>
    </SwitchGroup>
    <DescriptionComp class="pl-10" v-if="description?.length" :description="description"></DescriptionComp>
</template>

<script setup lang="ts">
import { GM_getValue, GM_setValue } from '$'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { ref, watch } from 'vue'
import { ISwitchItem } from '../../types/item'
import DescriptionComp from './DescriptionComp.vue'

const item = defineProps<ISwitchItem>()

const enabled = ref(GM_getValue(item.id, item.defaultEnable))

watch(enabled, () => {
    if (enabled.value) {
        if (!item.noStyle) {
            document.documentElement.setAttribute(item.attrName ?? item.id, '')
        }
        // Todo: enableFn run at
        if (item.enableFn) {
            item.enableFn()?.then().catch()
        }
        GM_setValue(item.id, true)
    } else {
        if (!item.noStyle) {
            document.documentElement.removeAttribute(item.attrName ?? item.id)
        }
        if (item.disableFn) {
            item.disableFn()?.then().catch()
        }
        GM_setValue(item.id, false)
    }
})
</script>

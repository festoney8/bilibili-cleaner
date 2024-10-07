<template>
    <div class="mx-auto w-full bg-white p-1.5">
        <Disclosure v-slot="{ open }" :default-open="!isFold">
            <DisclosureButton
                class="flex w-full justify-between rounded-lg px-4 py-1.5 text-left font-bold outline-none"
                :class="{
                    'bg-blue-100/60 text-blue-900 hover:bg-blue-100': !isSpecial,
                    'bg-purple-100/60 text-purple-900 hover:bg-purple-100': isSpecial,
                }"
            >
                <span>{{ title || 'Disclosure Title' }}</span>
                <ChevronUpIcon
                    :class="{
                        'rotate-180': open,
                        'rotate-90': !open,
                        'text-blue-500': !isSpecial,
                        'text-purple-500': isSpecial,
                    }"
                    class="h-6 w-6"
                />
            </DisclosureButton>
            <DisclosurePanel :unmount="false" class="pl-3 pr-2 pt-2 text-gray-500">
                <slot />
            </DisclosurePanel>
        </Disclosure>
    </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'

defineProps<{
    // 小标题
    title: string

    // 是否折叠
    isFold?: boolean

    // 是否为特殊组
    isSpecial?: boolean
}>()
</script>

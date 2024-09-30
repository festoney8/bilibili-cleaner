<template>
    <div class="mx-auto w-full bg-white p-1.5">
        <Disclosure v-slot="{ open }" :default-open="true">
            <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-blue-100/60 px-4 py-1.5 text-left font-bold text-blue-900 outline-none hover:bg-blue-100"
            >
                <span>{{ title || 'Disclosure Title' }}</span>
                <ChevronUpIcon :class="open ? 'rotate-180 transform' : 'rotate-90'" class="h-6 w-6 text-blue-500" />
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
    title: string
}>()
</script>

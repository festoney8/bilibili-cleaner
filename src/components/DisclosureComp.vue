<template>
  <div class="mx-auto w-full bg-white px-2 py-1.5">
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="flex w-full justify-between rounded-lg bg-blue-100/45 px-4 py-1.5 text-left text-lg font-bold text-blue-900 hover:bg-blue-100/80"
      >
        <span>{{ title || 'Disclosure Title' }}</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : 'rotate-90'" class="h-6 w-6 text-blue-500" />
      </DisclosureButton>
      <DisclosurePanel class="pl-3 pr-2 pt-2 text-base text-gray-500">
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

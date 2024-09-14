<template>
  <div class="mx-auto w-full bg-white p-2">
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-base font-bold text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
      >
        <span>{{ title || 'Disclosure Title' }}</span>
        <ChevronUpIcon :class="open ? 'rotate-180 transform' : 'rotate-90'" class="h-6 w-6 text-purple-500" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="px-4 pb-2 pt-4 text-sm text-gray-500">
          <slot />
        </DisclosurePanel>
      </transition>
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

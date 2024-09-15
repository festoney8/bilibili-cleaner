<template>
  <div class="flex w-full py-1.5">
    <button
      type="button"
      class="focus: focus: inline-flex justify-center rounded-md border border-transparent bg-white px-2 py-1 text-sm text-blue-900 ring-1 ring-gray-300 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
      @click="onClick"
    >
      {{ item.buttonText }}
    </button>
    <div class="ml-2 self-center text-base text-black">{{ item.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { IButtonItem } from '../../types/item'

const item = defineProps<IButtonItem>()

const onClick = () => {
  item.fn()?.then().catch()
}
</script>

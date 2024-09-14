<template>
  <div class="flex flex-row justify-between">
    <div>{{ props.name }}</div>
    <Listbox v-model="seletedOption">
      <ListboxButton>{{ props.defaultValue }}</ListboxButton>
      <ListboxOptions>
        <ListboxOption v-for="option in props.options" :key="option.id" :value="option">
          {{ option.name }}
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { IListItem } from '../../types/item'

const props = defineProps<IListItem>()
console.log(props)
const seletedOption = props.options.filter((v) => v.id === props.defaultValue)?.[0]
</script>

<template>
    <div class="flex items-center justify-between py-1">
        <div class="text-black">{{ name }}</div>
        <Listbox v-model="selectedOption">
            <div class="relative w-2/5">
                <ListboxButton
                    class="relative w-full cursor-pointer rounded-lg bg-white px-3 py-1.5 text-left ring-1 ring-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:ring-white/75 sm:text-sm"
                >
                    <span class="block truncate text-gray-800">{{ selectedOption.name }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </ListboxButton>

                <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <ListboxOptions
                        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    >
                        <ListboxOption
                            v-slot="{ active, selected }"
                            v-for="(option, index) in options"
                            :key="index"
                            :value="option"
                            as="template"
                        >
                            <li
                                :class="[
                                    active ? 'bg-purple-100 text-black' : 'text-gray-900',
                                    'relative cursor-default py-2 pl-10 pr-4 transition-colors duration-200',
                                ]"
                            >
                                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                                    option.name
                                }}</span>
                                <span
                                    v-if="selected"
                                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600"
                                >
                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                            </li>
                        </ListboxOption>
                    </ListboxOptions>
                </transition>
            </div>
        </Listbox>
    </div>
    <DescriptionComp class="pl-1" v-if="description?.length" :description="description"></DescriptionComp>
</template>

<script setup lang="ts">
import { IListItem } from '@/types/item'
import { error } from '@/utils/logger'
import { BiliCleanerStorage } from '@/utils/storage'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { ref, watch } from 'vue'
import DescriptionComp from './DescriptionComp.vue'

const item = defineProps<IListItem>()
const options = item.options
const currValue = BiliCleanerStorage.get(item.id, item.defaultValue)
const currOption = options.find((v) => v.id === currValue)
const selectedOption = ref(currOption ?? options[0])

watch(selectedOption, (newSelected) => {
    try {
        for (const option of options) {
            if (option.id === newSelected.id && newSelected.id !== item.disableValue) {
                document.documentElement.setAttribute(option.id, '')
            } else {
                document.documentElement.removeAttribute(option.id)
            }
        }
        BiliCleanerStorage.set<string>(item.id, newSelected.id)
    } catch (err) {
        error(`ListComp ${item.id} error`, err)
    }
})
</script>

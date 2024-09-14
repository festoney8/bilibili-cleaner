<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'
import ButtonComp from '../components/items/ButtonComp.vue'
import ListComp from '../components/items/ListComp.vue'
import NumberComp from '../components/items/NumberComp.vue'
import SwitchComp from '../components/items/SwitchComp.vue'
import PanelComp from '../components/PanelComp.vue'
import { currPageRules } from '../modules/rules'
</script>

<template>
  <PanelComp v-bind="{ title: '标题', widthPercent: 28, heightPercent: 85, minWidth: 350, minHeight: 500 }">
    <div class="flex items-center justify-between text-center">
      <div class="text-2xl">当前页面 {{ 'xx页' }}</div>
      <div class="relative right-1 text-right">
        <Menu as="div" class="relative inline-block text-left">
          <div>
            <MenuButton
              class="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            >
              选择页面
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    Edit
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    Duplicate
                  </button>
                </MenuItem>
              </div>
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    Archive
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    Move
                  </button>
                </MenuItem>
              </div>

              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    Delete
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
    <main>
      <div v-for="(group, i) in currPageRules()" :key="i">
        <Disclosure v-slot="{ open }">
          <DisclosureButton
            class="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
          >
            <span class="text-xl">{{ group.name }}</span>
            <ChevronUpIcon :class="!open ? 'rotate-90 transform' : 'rotate-180'" class="h-5 w-5 text-purple-500" />
          </DisclosureButton>
          <DisclosurePanel class="px-4 pb-2 pt-4 text-sm text-gray-500">
            <div v-for="(item, j) in group.items" :key="j">
              <SwitchComp v-if="item.type === 'switch'" v-bind="item"></SwitchComp>
              <NumberComp v-if="item.type === 'number'" v-bind="item"></NumberComp>
              <ButtonComp v-if="item.type === 'button'" v-bind="item"></ButtonComp>
              <ListComp v-if="item.type === 'list'" v-bind="item"></ListComp>
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </main>
  </PanelComp>
</template>

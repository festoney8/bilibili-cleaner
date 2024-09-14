<template>
  <SwitchGroup class="m-0.5 h-fit w-full rounded-lg py-1 hover:bg-blue-50 hover:bg-opacity-50">
    <div class="flex items-center">
      <Switch
        v-model="enabled"
        :class="enabled ? 'bg-[#00AEEC]' : 'bg-gray-200'"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      >
        <span
          :class="enabled ? 'translate-x-6' : 'translate-x-1'"
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        />
      </Switch>
      <SwitchLabel class="ml-2 flex-1 select-none text-base text-black"> {{ props.name }}</SwitchLabel>
    </div>
  </SwitchGroup>
</template>

<script setup lang="ts">
import { GM_getValue, GM_setValue } from '$'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { ref, watch } from 'vue'
import { ISwitchItem } from '../../types/item'

const props = defineProps<ISwitchItem>()

const enabled = ref(GM_getValue(props.id, props.defaultEnable))

watch(enabled, () => {
  if (enabled.value) {
    if (!props.noStyle) {
      document.documentElement.setAttribute(props.attrName ?? props.id, '')
    }
    // Todo: enableFn run at
    if (props.enableFn) {
      props.enableFn()?.then().catch()
    }
    GM_setValue(props.id, true)
    console.log('enable', props.name, props.id)
  } else {
    if (!props.noStyle) {
      document.documentElement.removeAttribute(props.attrName ?? props.id)
    }
    if (props.disableFn) {
      props.disableFn()?.then().catch()
    }
    GM_setValue(props.id, false)
    console.log('disable', props.name, props.id)
  }
})
</script>

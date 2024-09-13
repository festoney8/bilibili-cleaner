<template>
  <PanelComp v-bind="info"><div>test slot</div></PanelComp>
</template>

<script setup lang="ts">
import PanelComp from './components/PanelComp.vue'
const info = {
  title: 'Hell World!',
}
</script>

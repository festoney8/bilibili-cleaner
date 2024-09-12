<template>
    <div
        class="fixed left-1/2 top-1/2 z-50 flex h-96 w-96 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-yellow-300"
    >
        <div class="h-fit text-3xl underline">{{ msg }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hell World!')
</script>

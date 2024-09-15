<template>
    <div v-if="description?.length" class="mb-1.5">
        <div class="text-sm leading-6 text-orange-900">
            <div v-for="(line, index) in description" :key="index">
                <p><span class="mr-2">•</span>{{ line }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    description: string[] | undefined
}>()
</script>

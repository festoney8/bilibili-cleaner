<template>
    <PanelComp
        v-bind="{
            title: '评论过滤',
            widthPercent: 28,
            heightPercent: 85,
            minWidth: 360,
            minHeight: 600,
        }"
        v-if="isShow"
        @close="isShow = false"
    >
        <div v-for="(group, index) in currPageGroups" :key="index">
            <DisclosureComp v-bind="{ title: group.name }">
                <div v-for="(item, innerIndex) in group.items" :key="innerIndex">
                    <SwitchComp v-if="item.type === 'switch'" v-bind="item"></SwitchComp>
                    <NumberComp v-else-if="item.type === 'number'" v-bind="item"></NumberComp>
                    <EditorComp v-else-if="item.type === 'editor'" v-bind="item"></EditorComp>
                    <ListComp v-else-if="item.type === 'list'" v-bind="item"></ListComp>
                </div>
            </DisclosureComp>
        </div>
    </PanelComp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DisclosureComp from '../components/DisclosureComp.vue'
import EditorComp from '../components/items/EditorComp.vue'
import ListComp from '../components/items/ListComp.vue'
import NumberComp from '../components/items/NumberComp.vue'
import SwitchComp from '../components/items/SwitchComp.vue'
import PanelComp from '../components/PanelComp.vue'
import { commentFilters } from '../modules/filters'
import { Group } from '../types/collection'

const isShow = ref(true)

let currPageGroups: Group[] = []

for (const commentFilter of commentFilters) {
    if (commentFilter.checkFn()) {
        currPageGroups = [...currPageGroups, ...commentFilter.groups]
    }
}
</script>

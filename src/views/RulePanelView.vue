<template>
    <PanelComp
        v-bind="{ title: 'bilibili 页面净化大师', widthPercent: 28, heightPercent: 85, minWidth: 360, minHeight: 600 }"
        v-if="store.isShow"
        @close="store.hide"
    >
        <div v-for="(group, index) in currPageGroups" :key="index">
            <DisclosureComp v-bind="{ title: group.name }">
                <div v-for="(item, innerIndex) in group.items" :key="innerIndex">
                    <SwitchComp v-if="item.type === 'switch'" v-bind="item"></SwitchComp>
                    <NumberComp v-else-if="item.type === 'number'" v-bind="item"></NumberComp>
                    <StringComp v-else-if="item.type === 'string'" v-bind="item"></StringComp>
                    <EditorComp v-else-if="item.type === 'editor'" v-bind="item"></EditorComp>
                    <ListComp v-else-if="item.type === 'list'" v-bind="item"></ListComp>
                </div>
            </DisclosureComp>
        </div>
    </PanelComp>
</template>

<script setup lang="ts">
import DisclosureComp from '../components/DisclosureComp.vue'
import EditorComp from '../components/items/EditorComp.vue'
import ListComp from '../components/items/ListComp.vue'
import NumberComp from '../components/items/NumberComp.vue'
import StringComp from '../components/items/StringComp.vue'
import SwitchComp from '../components/items/SwitchComp.vue'
import PanelComp from '../components/PanelComp.vue'
import { rules } from '../modules/rules'
import { useRulePanelStore } from '../stores/view'
import { Group } from '../types/collection'

const store = useRulePanelStore()

let currPageGroups: Group[] = []

for (const rule of rules) {
    if (rule.checkFn()) {
        currPageGroups = currPageGroups.concat(rule.groups)
    }
}
</script>

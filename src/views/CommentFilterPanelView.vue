<template>
    <PanelComp
        v-bind="{
            title: '评论过滤（全站通用）',
            widthPercent: 28,
            heightPercent: 85,
            minWidth: 360,
            minHeight: 600,
        }"
        v-show="store.isShow"
        @close="store.hide"
    >
        <div v-for="(group, index) in currPageGroups" :key="index">
            <DisclosureComp v-bind="{ title: group.name, isFold: group.fold }">
                <div v-for="(item, innerIndex) in group.items" :key="innerIndex">
                    <SwitchComp v-if="item.type === 'switch'" v-bind="item"></SwitchComp>
                    <NumberComp v-else-if="item.type === 'number'" v-bind="item"></NumberComp>
                    <StringComp v-else-if="item.type === 'string'" v-bind="item"></StringComp>
                    <EditorComp v-else-if="item.type === 'editor'" v-bind="item" @edit="handleEdit"></EditorComp>
                    <ListComp v-else-if="item.type === 'list'" v-bind="item"></ListComp>
                </div>
            </DisclosureComp>
        </div>
        <EditorDialog ref="editorDialogRef"></EditorDialog>
    </PanelComp>
</template>

<script setup lang="ts">
import DisclosureComp from '@/components/DisclosureComp.vue'
import EditorDialog from '@/components/EditorDialog.vue'
import EditorComp from '@/components/items/EditorComp.vue'
import ListComp from '@/components/items/ListComp.vue'
import NumberComp from '@/components/items/NumberComp.vue'
import StringComp from '@/components/items/StringComp.vue'
import SwitchComp from '@/components/items/SwitchComp.vue'
import PanelComp from '@/components/PanelComp.vue'
import { commentFilters } from '@/modules/filters'
import { useCommentFilterPanelStore } from '@/stores/view'
import { Group } from '@/types/collection'
import { IEditorItem } from '@/types/item'
import { ref } from 'vue'

const store = useCommentFilterPanelStore()
const editorDialogRef = ref<InstanceType<typeof EditorDialog> | null>(null)

const handleEdit = (item: IEditorItem) => {
    editorDialogRef.value?.openEditor(item)
}

let currPageGroups: Group[] = []

for (const commentFilter of commentFilters) {
    if (commentFilter.checkFn()) {
        currPageGroups = [...currPageGroups, ...commentFilter.groups]
    }
}
</script>

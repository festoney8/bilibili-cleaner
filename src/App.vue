<template>
    <div>
        <RulePanelView></RulePanelView>
        <VideoFilterPanelView></VideoFilterPanelView>
        <CommentFilterPanelView></CommentFilterPanelView>
        <DynamicFilterPanelView></DynamicFilterPanelView>
        <ContextMenuView></ContextMenuView>
    </div>
</template>
<script setup lang="ts">
import CommentFilterPanelView from './views/CommentFilterPanelView.vue'
import ContextMenuView from './views/ContextMenuView.vue'
import DynamicFilterPanelView from './views/DynamicFilterPanelView.vue'
import RulePanelView from './views/RulePanelView.vue'
import VideoFilterPanelView from './views/VideoFilterPanelView.vue'
</script>

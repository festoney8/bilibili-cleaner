<template>
    <div
        v-if="show"
        class="fixed z-[100000] block cursor-pointer overflow-hidden rounded-md bg-white text-[15px] text-black shadow-lg shadow-black/20"
        :style="{ left: pos.left + 'px', top: pos.top + 'px' }"
    >
        <div v-for="(menu, index) in menuList" :key="index">
            <div @click="menu.fn()?.catch(() => {})" class="px-2.5 py-1 hover:bg-[#00aeec] hover:text-white">
                <span class="mr-0.5">◎</span>
                {{ menu.name }}
            </div>
            <hr v-if="index < menuList.length - 1" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { filterContextMenuHandlers } from '@/modules/filters'
import { FilterContextMenu } from '@/types/filter'
import { error } from '@/utils/logger'
import { useEventListener } from '@vueuse/core'
import { reactive, ref } from 'vue'

const show = ref(false)
const pos = reactive({
    left: -9999,
    top: -9999,
})
const menuList = ref<FilterContextMenu[]>([])

useEventListener(window, 'contextmenu', (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Event/composedPath
        const target = e.composedPath()?.[0] as HTMLElement
        if (!target.closest('.bilibili-app-recommend-root')) {
            handleTarget(target)
        }
    }

    if (menuList.value.length) {
        e.preventDefault()
        show.value = true
        if (show.value) {
            pos.left = e.x
            pos.top = e.y
        }
        useEventListener(window, 'wheel', () => {
            show.value = false
        })
        useEventListener(document, 'click', () => {
            show.value = false
        })
    }
})

const handleTarget = (target: HTMLElement) => {
    menuList.value = []

    for (const handler of filterContextMenuHandlers) {
        try {
            menuList.value = menuList.value.concat(handler(target))
        } catch (err) {
            error('ContextMenuVuew handleTarget failed', err)
        }
    }
}
</script>

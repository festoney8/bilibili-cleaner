<script setup lang="ts">
import DisclosureComp from './components/DisclosureComp.vue'
import NumberComp from './components/items/NumberComp.vue'
import PanelComp from './components/PanelComp.vue'
import { INumberItem } from './types/item'

const items: INumberItem[] = [
    {
        id: '' + Date.now(),
        type: 'number',
        name: '调节AAA的宽度',
        defaultValue: 100,
        fn: (value: number) => {
            console.log('fn', value)
        },
        minValue: -1,
        maxValue: 100,
        disableValue: -1,
        addonText: 'vw',
    },
    {
        id: '' + Date.now(),
        type: 'number',
        name: '调节BBBBBB的宽度',
        defaultValue: 500,
        fn: (value: number) => {
            console.log('fn', value)
        },
        minValue: 0,
        maxValue: 500,
        disableValue: 0,
        addonText: 'px',
    },
]
</script>

<template>
    <PanelComp
        v-bind="{ title: 'bilibili 页面净化大师', widthPercent: 28, heightPercent: 80, minWidth: 350, minHeight: 500 }"
    >
        <DisclosureComp title="基本功能">
            <div v-for="item in items" :key="item.id">
                <NumberComp v-bind="item"></NumberComp>
            </div>
        </DisclosureComp>
    </PanelComp>
</template>

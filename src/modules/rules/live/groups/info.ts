import { Item } from '@/types/item'
import { isEditableElement } from '@/utils/tool'

// 拦截 G 键关注
const handleKeyGPress = (e: KeyboardEvent) => {
    if (e.key.toLocaleLowerCase() !== 'g' || e.ctrlKey || e.altKey || e.metaKey) {
        return
    }
    if (isEditableElement(e.target as Element)) {
        return
    }
    e.stopImmediatePropagation()
    e.preventDefault()
}

export const liveInfoItems: Item[] = [
    {
        type: 'switch',
        id: 'live-page-head-info-avatar-pendant',
        name: '隐藏 头像饰品',
    },
    {
        type: 'switch',
        id: 'live-page-head-info-vm-upper-row-follow-ctnr',
        name: '隐藏 关注主播/加粉丝团',
    },
    {
        type: 'switch',
        id: 'live-page-disable-hotkey-g-follow',
        name: '禁用 快捷键 G 关注主播',
        enableFn: () => {
            for (const type of ['keydown', 'keypress', 'keyup'] as const) {
                window.addEventListener(type, handleKeyGPress, true)
            }
        },
        disableFn: () => {
            for (const type of ['keydown', 'keypress', 'keyup'] as const) {
                window.removeEventListener(type, handleKeyGPress, true)
            }
        },
    },
    {
        type: 'switch',
        id: 'live-page-head-info-vm-upper-row-hotrank',
        name: '隐藏 榜单',
    },
    {
        type: 'switch',
        id: 'live-page-head-info-vm-upper-row-activity',
        name: '隐藏 活动',
    },
    {
        type: 'switch',
        id: 'live-page-head-info-vm',
        name: '隐藏 信息栏',
    },
]

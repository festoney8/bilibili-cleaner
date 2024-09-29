<template>
    <div
        v-if="show"
        class="fixed z-50 block cursor-pointer overflow-hidden rounded-md bg-white font-[15px] text-black shadow-lg shadow-black/20"
        :style="{ left: pos.left + 'px', top: pos.top + 'px' }"
    >
        <div v-for="(menu, index) in menuList" :key="index">
            <div @click="menu.fn" class="px-2.5 py-1 hover:bg-[#00aeec] hover:text-white">
                <span class="mr-0.5">◎</span>
                {{ menu.name }}
            </div>
            <hr v-if="index < menuList.length - 1" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { reactive, ref } from 'vue'
import { commentFilterDynamicAddUsername } from '../modules/filters/variety/comment/pages/dynamic'
import { commentFilterSpaceAddUsername } from '../modules/filters/variety/comment/pages/space'
import { commentFilterVideoAddUsername } from '../modules/filters/variety/comment/pages/video'
import { dynamicFilterDynamicAddUploader } from '../modules/filters/variety/dynamic/pages/dynamic'
import {
    videoFilterChannelAddBvid,
    videoFilterChannelAddUploader,
    videoFilterChannelAddUploaderWhite,
} from '../modules/filters/variety/video/pages/channel'
import {
    videoFilterHomepageAddBvid,
    videoFilterHomepageAddUploader,
    videoFilterHomepageAddUploaderWhite,
} from '../modules/filters/variety/video/pages/homepage'
import {
    videoFilterPopularAddBvid,
    videoFilterPopularAddUploader,
    videoFilterPopularAddUploaderWhite,
} from '../modules/filters/variety/video/pages/popular'
import {
    videoFilterSearchAddBvid,
    videoFilterSearchAddUploader,
    videoFilterSearchAddUploaderWhite,
} from '../modules/filters/variety/video/pages/search'
import {
    videoFilterVideoAddBvid,
    videoFilterVideoAddUploader,
    videoFilterVideoAddUploaderWhite,
} from '../modules/filters/variety/video/pages/video'
import { error } from '../utils/logger'
import {
    isPageBangumi,
    isPageChannel,
    isPageDynamic,
    isPageHomepage,
    isPagePlaylist,
    isPagePopular,
    isPageSearch,
    isPageSpace,
    isPageVideo,
} from '../utils/pageType'
import { matchBvid } from '../utils/tool'

type Menu = {
    name: string
    fn: () => void
}
type TargetHandler = (target: HTMLElement) => boolean

const show = ref(false)
const pos = reactive({
    left: -9999,
    top: -9999,
})
const menuList = reactive<Menu[]>([])

useEventListener(window, 'contextmenu', (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Event/composedPath
        const target = e.composedPath()?.[0] as HTMLElement
        if (target) {
            handleTarget(target)
        }
    }

    if (menuList.length) {
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
    menuList.splice(0, menuList.length)

    const handlerArr = [
        handleHomepage,
        handleChannel,
        handleVideo,
        handleSearch,
        handlePopular,
        handleDynamic,
        handleSpace,
    ]
    try {
        for (const handler of handlerArr) {
            const ok = handler(target)
            if (ok) {
                break
            }
        }
    } catch (err) {
        error(`ContextMenu handleTarget failed`, target, err)
    }
}

// 首页: UP主、标题
const handleHomepage: TargetHandler = (target: HTMLElement): boolean => {
    if (!isPageHomepage()) {
        return false
    }
    // UP主
    if (target.closest('.bili-video-card__info--owner')) {
        const uploader = target
            .closest('.bili-video-card__info--owner')
            ?.querySelector('.bili-video-card__info--author')
            ?.textContent?.trim()
        const url = target.closest<HTMLAnchorElement>('.bili-video-card__info--owner')?.href.trim()
        const spaceUrl = url?.match(/space\.bilibili\.com\/\d+/)?.[0]

        if (uploader) {
            menuList.push({
                name: `屏蔽UP主：${uploader}`,
                fn: () => videoFilterHomepageAddUploader(uploader),
            })
            menuList.push({
                name: `将UP主加入白名单`,
                fn: () => {
                    videoFilterHomepageAddUploaderWhite(uploader)
                },
            })
        }
        if (spaceUrl) {
            menuList.push({
                name: `复制主页链接`,
                fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`).then().catch(),
            })
        }
    }
    // BVID
    if (target instanceof HTMLAnchorElement && target.closest('.bili-video-card__info--tit')) {
        const url = target.closest('.bili-video-card__info--tit')?.querySelector('a')?.href
        if (url) {
            const bvid = matchBvid(url)
            if (bvid) {
                menuList.push({
                    name: `屏蔽视频 ${bvid}`,
                    fn: () => {
                        videoFilterHomepageAddBvid(bvid)
                    },
                })
                menuList.push({
                    name: '复制视频链接',
                    fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch(),
                })
            }
        }
    }
    return true
}

// 频道页: UP主、标题
const handleChannel: TargetHandler = (target: HTMLElement): boolean => {
    if (!isPageChannel()) {
        return false
    }
    // UP主
    if (target.closest('.bili-video-card__info--owner')) {
        const uploader = target
            .closest('.bili-video-card__info--owner')
            ?.querySelector('.bili-video-card__info--author')
            ?.textContent?.trim()
        const url = target.closest<HTMLAnchorElement>('.bili-video-card__info--owner')?.href.trim()
        const spaceUrl = url?.match(/space\.bilibili\.com\/\d+/)?.[0]

        if (uploader) {
            menuList.push({
                name: `屏蔽UP主：${uploader}`,
                fn: () => videoFilterChannelAddUploader(uploader).then().catch(),
            })
            menuList.push({
                name: `将UP主加入白名单`,
                fn: () => videoFilterChannelAddUploaderWhite(uploader).then().catch(),
            })
        }
        if (spaceUrl) {
            menuList.push({
                name: `复制主页链接`,
                fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`),
            })
        }
    }
    // BVID
    if (target instanceof HTMLAnchorElement && target.closest('.bili-video-card__info--tit')) {
        const url = target.closest('.bili-video-card__info--tit')?.querySelector('a')?.href
        if (url) {
            const bvid = matchBvid(url)
            if (bvid) {
                menuList.push({
                    name: `屏蔽视频 ${bvid}`,
                    fn: () => videoFilterChannelAddBvid(bvid).then().catch(),
                })
                menuList.push({
                    name: '复制视频链接',
                    fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch(),
                })
            }
        }
    }
    return true
}

// 搜索页: UP主、标题
const handleSearch: TargetHandler = (target: HTMLElement): boolean => {
    if (!isPageSearch()) {
        return false
    }
    // UP主
    if (target.closest('.bili-video-card__info--owner')) {
        const uploader = target
            .closest('.bili-video-card__info--owner')
            ?.querySelector('.bili-video-card__info--author')
            ?.textContent?.trim()
        const url = target.closest<HTMLAnchorElement>('.bili-video-card__info--owner')?.href.trim()
        const spaceUrl = url?.match(/space\.bilibili\.com\/\d+/)?.[0]

        if (uploader) {
            menuList.push({
                name: `屏蔽UP主：${uploader}`,
                fn: () => videoFilterSearchAddUploader(uploader).then().catch(),
            })
            menuList.push({
                name: `将UP主加入白名单`,
                fn: () => videoFilterSearchAddUploaderWhite(uploader).then().catch(),
            })
        }
        if (spaceUrl) {
            menuList.push({
                name: `复制主页链接`,
                fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`),
            })
        }
    }
    // BVID
    if (target.classList.contains('bili-video-card__info--tit')) {
        const url = (target.parentNode as HTMLAnchorElement)?.href
        if (url) {
            const bvid = matchBvid(url)
            if (bvid) {
                menuList.push({
                    name: `屏蔽视频 ${bvid}`,
                    fn: () => videoFilterSearchAddBvid(bvid).then().catch(),
                })
                menuList.push({
                    name: '复制视频链接',
                    fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch(),
                })
            }
        }
    }
    return true
}

// 热门页: UP主、标题
const handlePopular: TargetHandler = (target: HTMLElement): boolean => {
    if (!isPagePopular()) {
        return false
    }
    // UP主
    if (target.closest('.up-name')) {
        const uploader = target.textContent?.trim()
        if (uploader) {
            menuList.push({
                name: `屏蔽UP主：${uploader}`,
                fn: () => videoFilterPopularAddUploader(uploader).then().catch(),
            })
            menuList.push({
                name: `将UP主加入白名单`,
                fn: () => videoFilterPopularAddUploaderWhite(uploader).then().catch(),
            })
        }
    }
    // BVID
    if (
        (target.classList.contains('title') && target.closest('.info a')) ||
        target.classList.contains('video-name') ||
        target.classList.contains('lazy-image')
    ) {
        let href = target.getAttribute('href') || target.parentElement?.getAttribute('href')
        if (!href) {
            href = target.closest('.video-card')?.querySelector('.video-card__content > a')?.getAttribute('href')
        }
        if (href) {
            const bvid = matchBvid(href)
            if (bvid) {
                menuList.push({
                    name: `屏蔽视频 ${bvid}`,
                    fn: () => videoFilterPopularAddBvid(bvid).then().catch(),
                })
                menuList.push({
                    name: '复制视频链接',
                    fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch(),
                })
            }
        }
    }
    return true
}

// 播放页: UP主、标题、评论用户
const handleVideo: TargetHandler = (target: HTMLElement): boolean => {
    if (!(isPageVideo() || isPagePlaylist() || isPageBangumi())) {
        return false
    }
    // UP主
    if (
        target.classList.contains('name') ||
        target.classList.contains('up-name') ||
        target.parentElement?.classList.contains('up-name') ||
        target.closest('.staff-info')
    ) {
        const uploader =
            target.closest('.staff-info')?.querySelector('.staff-name')?.textContent?.trim() ||
            target.textContent?.trim() ||
            target.parentElement?.textContent?.trim()
        const url = target.closest('.upname')?.querySelector(':scope a')?.getAttribute('href')
        const spaceUrl = url?.match(/space\.bilibili\.com\/\d+/)?.[0]

        if (uploader) {
            menuList.push({
                name: `屏蔽UP主：${uploader}`,
                fn: () => videoFilterVideoAddUploader(uploader).then().catch(),
            })
            menuList.push({
                name: `将UP主加入白名单`,
                fn: () => videoFilterVideoAddUploaderWhite(uploader).then().catch(),
            })
        }
        if (spaceUrl) {
            menuList.push({
                name: `复制主页链接`,
                fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`),
            })
        }
    }
    // BVID
    if (target.classList.contains('title')) {
        const url = target.parentElement?.getAttribute('href')
        if (url) {
            const bvid = matchBvid(url)
            if (bvid) {
                menuList.push({
                    name: `屏蔽视频 ${bvid}`,
                    fn: () => videoFilterVideoAddBvid(bvid).then().catch(),
                })
                menuList.push({
                    name: '复制视频链接',
                    fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch(),
                })
            }
        }
    }
    // 评论用户
    if (
        target.parentElement?.id === 'user-name' ||
        target.classList.contains('user-name') ||
        target.classList.contains('sub-user-name')
    ) {
        const username = target.textContent?.trim()
        if (username) {
            menuList.push({
                name: `屏蔽用户：${username}`,
                fn: () => commentFilterVideoAddUsername(username).then().catch(),
            })
        }
    }
    return true
}

// 动态页: 动态发布人、评论用户
const handleDynamic: TargetHandler = (target: HTMLElement): boolean => {
    if (!isPageDynamic()) {
        return false
    }
    // 动态发布人
    if (target.classList.contains('bili-dyn-title__text')) {
        const uploader = target.textContent?.trim()
        if (uploader) {
            menuList.push({
                name: `隐藏用户动态：${uploader}`,
                fn: () => dynamicFilterDynamicAddUploader(uploader).then().catch(),
            })
        }
    }
    // 评论用户
    if (
        target.parentElement?.id === 'user-name' ||
        target.classList.contains('user-name') ||
        target.classList.contains('sub-user-name')
    ) {
        const username = target.textContent?.trim()
        if (username) {
            menuList.push({
                name: `屏蔽用户：${username}`,
                fn: () => commentFilterDynamicAddUsername(username).then().catch(),
            })
        }
    }
    return true
}

// 空间页: 评论用户
const handleSpace: TargetHandler = (target: HTMLElement): boolean => {
    if (!isPageSpace()) {
        return false
    }
    // 评论用户
    if (
        target.parentElement?.id === 'user-name' ||
        target.classList.contains('user-name') ||
        target.classList.contains('sub-user-name')
    ) {
        const username = target.textContent?.trim()
        if (username) {
            menuList.push({
                name: `屏蔽用户：${username}`,
                fn: () => commentFilterSpaceAddUsername(username).then().catch(),
            })
        }
    }
    return true
}
</script>

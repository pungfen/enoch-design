<template>
  <div ref="targetRef" class="inline-block" @click="onClick" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <slot></slot>
  </div>

  <popper-container :teleport-to="teleportTo">
    <transition name="en-fade-in-linear">
      <div v-if="showRender" v-show="show" class="en-popover" ref="popperRef">
        <slot name="popper"></slot>
      </div>
    </transition>
  </popper-container>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch, watchEffect } from 'vue'
import { createPopper, type Instance } from '@popperjs/core'
import { onClickOutside, useMouseInElement } from '@vueuse/core'

import { props } from './popper'

import { POPPER_CONTAINER_ID } from '../hooks'

import PopperContainer from './container.vue'

import type { WatchStopHandle } from 'vue'

const {
  virtualTriggering,
  virtualRef,
  placement = 'auto',
  offset,
  teleportTo = `#${POPPER_CONTAINER_ID}`,
  trigger = 'click',
  persistent = true
} = defineProps(props)

const popperRef = $ref<HTMLDivElement>()
const targetRef = $ref<HTMLDivElement>()

let show = $ref(false)
let showRender = $computed(() => true)
let popper = $ref<Instance | null>()

const targetComputedRef = $computed(() => (virtualTriggering && virtualRef ? virtualRef.$el : targetRef))

const init = () => {
  popper = createPopper(targetComputedRef, popperRef)
}

const setOptions = () => {
  popper?.setOptions({ placement, modifiers: [{ name: 'offset', options: { offset } }] })
}

const update = () => {
  popper?.update()
}

const destroy = () => {
  popper?.destroy()
  popper = null
}

const onClick = () => {
  if (trigger === 'click') open()
}

const onMouseenter = () => {
  if (trigger === 'hover') open()
}

const { isOutside } = useMouseInElement($$(popperRef))

let watchHandler: WatchStopHandle | null
let triggered = $ref(false)
const onMouseleave = () => {
  if (trigger === 'hover') {
    watchHandler = watch(isOutside, () => {
      if (isOutside.value) {
        close()
        watchHandler?.()
        watchHandler = null
        triggered = false
      } else {
        console.log('xxx')
        triggered = true
      }
    })

    setTimeout(() => {
      if (!triggered) close()
    }, 100)
  }
}

const open = () => (show = true)
const close = () => (show = false)

onBeforeUnmount(() => {
  destroy()
})

onClickOutside($$(popperRef), close)

watch(
  () => targetComputedRef,
  () => {
    if (!popper) init()
  }
)

watchEffect(() => {
  if (popper) setOptions()
})
</script>

<style scoped>
.fade-in-linear-enter-active,
.fade-in-linear-leave-active {
  transition: 'linear';
}

.fade-in-linear-enter-from,
.fade-in-linear-leave-to {
  opacity: 0;
}

.en-fade-in-linear-enter-active,
.en-fade-in-linear-leave-active {
  transition: 'linear';
}
.en-fade-in-linear-enter-from,
.en-fade-in-linear-leave-to {
  opacity: 0;
}
</style>

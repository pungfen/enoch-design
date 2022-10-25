<template>
  <teleport :to="teleportTo">
    <div class="en-popprt-container">
      <slot></slot>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { usePopperContaier } from '../hooks'
import { containerProps } from './popper'

const { teleportTo } = defineProps(containerProps)

usePopperContaier()
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import type { Theme } from './config'
import { useTheme } from '../hooks'

export interface Props {
  theme?: Theme
}

const { theme = {} } = defineProps<Props>()

const { colors, button } = useTheme()

watchEffect(() => {
  Object.assign(colors.value, theme.colors)
  Object.assign(button.value, theme.button)
})
</script>

<style scoped></style>

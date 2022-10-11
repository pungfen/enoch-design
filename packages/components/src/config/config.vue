<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { merge } from 'lodash-es'
import { watchEffect } from 'vue'
import type { Theme } from './config'
import { useTheme } from '../hooks'

export interface Props {
  theme?: Theme
}

const { theme = {} } = defineProps<Props>()

const { colors, button } = useTheme()

watchEffect(() => {
  merge(colors.value, theme.colors)
  merge(button.value, theme.button)
})
</script>

<style scoped></style>

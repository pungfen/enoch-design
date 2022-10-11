<template>
  <button :aria-disabled="_disabled" :class="['en-button', buttonStyle.style]">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../hooks'

export interface Props {
  disabled?: boolean
  loading?: boolean
}

const { disabled, loading } = defineProps<Props>()
const { colors, button } = useTheme()

const _disabled = computed(() => loading || disabled)
</script>

<style scoped module="buttonStyle">
.style {
  background-color: v-bind('colors.main');
  border-radius: v-bind('button.borderRadius');
  color: v-bind('button.color');
  padding: v-bind('button.padding');
}
</style>

<style scoped>
.en-button {
  border: none;
  cursor: pointer;
}
</style>

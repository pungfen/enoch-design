<template>
  <button :aria-disabled="_disabled" :class="['en-button']">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  disabled?: boolean
  loading?: boolean
}

const { loading, disabled } = defineProps<Props>()

const _disabled = computed(() => loading || disabled)
</script>

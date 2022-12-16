<template>
  <button :aria-disabled="_disabled" :class="['en-button', `en-button--${type}`, { 'en-button__disabled': disabled, 'en-button__text': text }]">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Props } from './button'

const props = withDefaults(defineProps<Props>(), { type: 'default' })
const emit = defineEmits()

const _disabled = computed(() => props.loading || props.disabled)
</script>

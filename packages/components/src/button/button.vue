<template>
  <button :aria-disabled="_disabled" :class="['en-button', `en-button--${type}`]" @click="onClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import type { ButtonType } from './button'

export interface Props {
  type?: ButtonType
  disabled?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'click', event: Event): void
}

const { loading, disabled, type = 'default' } = defineProps<Props>()
const emit = defineEmits<Emits>()

const _disabled = $computed(() => loading || disabled)
const _loading = $computed(() => loading)

const onClick = (e: Event) => {
  if (_disabled || _loading) return
  emit('click', e)
}
</script>

<style>
#--unocss-- {
  layer: __ALL__;
}

:root {
  --button-height: 2rem;
  --button-font-size: 0.875rem;
  --button-line-height: 1.25rem;
}
</style>

<style scoped>
.en-button {
  --at-apply: 'relative outline-0 border-none cursor-pointer';
  height: var(--button-height);
  font-size: var(--button-font-size);
  line-height: var(--button-line-height);
  border-radius: var(--button-radius, 'rounded-sm');
}

.en-button--default {
  color: var(--button-color, theme('colors.neutral.800'));
  background-color: var(--button-default-backgroung-color, theme('colors.white'));
}

.en-button--primary {
  color: theme('colors.white');
  background-color: theme('colors.primary');
}
</style>

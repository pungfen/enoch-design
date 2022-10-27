<template>
  <button
    :aria-disabled="_disabled"
    :class="['en-button', `en-button--${type}`, { 'en-button__disabled': disabled, 'en-button__text': text }]"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { Props, Emits } from './button'

const { loading, disabled, type } = defineProps(Props)
const emit = defineEmits(Emits)

const _disabled = $computed(() => loading || disabled)
const _loading = $computed(() => loading)

const onClick = (e: MouseEvent) => {
  if (_disabled || _loading) return
  emit('click', e)
}
</script>

<style>
#--unocss-- {
  layer: __ALL__;
}
</style>

<style scoped>
.en-button {
  --at-apply: 'relative inline-flex justify-center items-center outline-0 border-none cursor-pointer';
  height: var(--button-height, 2rem);
  padding: var(--button-padding-y, 0) var(--button-padding-x, 0.8rem);
  border-radius: var(--button-radius, 0.125rem);
  font-size: var(--button-font-size, theme('fontSize.sm'));
  color: var(--button-color, theme('colors.neutral.800'));
}

.en-button--default {
  border: var(--button-default-border-width, 1px) var(--button-default-border-style, solid)
    var(--button-default-border-color, theme('colors.gray.300'));
  background-color: var(--button-default-backgroung-color, theme('colors.white'));
}

.en-button--default.en-button__text {
  --at-apply: 'border-none';
}

.en-button--default.en-button__text.en-button__disabled {
  color: theme('colors.gray.300');
}

.en-button--primary {
  color: var(--button-primary-color, theme('colors.white'));
  background-color: var(--button-primary-backgroung-color, theme('colors.primary.900'));
}

.en-button__disabled {
  --at-apply: 'cursor-not-allowed';
  background-color: theme('colors.gray.300');
}

.en-button--primary.en-button__disabled {
  background-color: var(--button-primary-backgroung-color, theme('colors.gray.300'));
}

.en-button--primary.en-button__text {
  --at-apply: 'bg-white';
  color: theme('colors.primary.900');
}

.en-button__text {
  --at-apply: 'bg-white';
}
</style>

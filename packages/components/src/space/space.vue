<template>
  <div
    v-if="$slots.default"
    :class="[
      'en-space',
      `en-space--${spacing}`,
      {
        'en-space__wrap': wrap,
        'en-space__vertical': vertical
      }
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { Props } from './space'
const { spacing } = defineProps(Props)
</script>

<style scoped>
.en-space {
  --at-apply: 'inline-flex';
}

.en-space__vertical {
  --at-apply: 'flex-col';
}

.en-space__wrap {
  --at-apply: 'flex-wrap';
}

.en-space--large {
  gap: var(--space-large-gap, 3rem);
}

.en-space--middle {
  gap: var(--space-middle-gap, 1.5rem);
}

.en-space--small {
  gap: var(--space-small-gap, 1rem);
}

.en-space--mini {
  gap: var(--space-mini-gap, 0.5rem);
}
</style>

<template>
  <div class="en-input">
    <div :class="['en-input__wrap', { 'en-input__disabled': disabled }]">
      <input
        ref="inputRef"
        :type="type"
        :value="_modelValue"
        :placeholder="placeholder"
        @input="onInput"
        @keyup.enter="onKeyupEnter"
        @blur="onBlur"
        @focus="onFocus"
        class="en-input__input"
      />
    </div>

    <div>
      <!-- <en-icon @click="onClearClick" class="en-input__clear">
        <Close />
      </en-icon> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { Props, Emits } from './input'

const { clearable, disabled, modelValue, placeholder = '请输入', type = 'text' } = defineProps(Props)
const emit = defineEmits(Emits)

const inputRef = ref<HTMLInputElement | null>()

const _modelValue = computed(() => modelValue || '')

const onInput = (e: InputEvent | Event) => {
  let { value } = e.target as HTMLInputElement
  emit('update:modelValue', value)
  emit('input', value)
}

const onKeyupEnter = (evt: Event) => {
  emit('enter', evt)
}
const onBlur = (evt: FocusEvent) => emit('blur', evt)
const onFocus = (evt: FocusEvent) => emit('focus', evt)

const onClearClick = () => {
  emit('update:modelValue', '')
  emit('input', '')
}
</script>

<style scoped>
.en-input {
  --at-apply: 'inline-flex justify-center items-center nowrap';
}

.en-input__wrap {
  --at-apply: 'flex-1 inline-flex justify-center items-center';
  padding: var(--input-padding-y, 0) var(--input-padding-x, 0.5rem);
  height: var(--input-height, 2rem);
  border: 1px solid var(--input-border-color, theme('colors.neutral.300'));
}

.en-input__wrap:focus-within {
  --at-apply: 'border-transparent ring-1 shadow-sm';
  border-color: var(--input-border-focus-color, theme('colors.primary.900'));
}

.en-input__input {
  --at-apply: 'h-full w-full border-none bg-none outline-none box-border';
  font-size: vat(--button-font-size, theme('fontSize.sm'));
  color: vat(--button-color, theme('colors.neutral.900'));
}
</style>

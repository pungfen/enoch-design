<template>
  <div :class="['en-input', inputStyle.style]">
    <input ref="inputRef" :type="_type" :placeholder="placeholder" @input="onInput" class="en-input__input" />
    <en-icon @click="onClearClick" class="en-input__clear">
      <Close />
    </en-icon>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { Close } from '@vicons/carbon'

import { EnIcon } from '../icon'
import { useTheme } from '../hooks'

export interface Props {
  clearable?: boolean
  modelValue?: string | null
  placeholder?: string
  type?: 'text'
}

interface Emits {
  (name: 'update:modelValue', value: Props['modelValue']): void
  (name: 'change', value: Props['modelValue']): void
  (name: 'focus', e: FocusEvent): void
  (name: 'blur', e: FocusEvent): void
  (name: 'clear'): void
}

type TargetElement = HTMLInputElement | HTMLTextAreaElement

const props = withDefaults(defineProps<Props>(), { modelValue: '', placeholder: '请输入', type: 'text' })
const emits = defineEmits<Emits>()
const { colors, input } = useTheme()

const inputRef = ref<TargetElement>()

const _modelValue = computed(() => props.modelValue || '')
const _type = computed(() => props.type)

const onInput = (e: InputEvent | Event) => {
  let { value } = e.target as TargetElement
  emits('update:modelValue', value)
  nextTick(setInputValue)
}

const onClearClick = () => {
  emits('update:modelValue', '')
  nextTick(setInputValue)
}

const setInputValue = () => {
  const input = inputRef.value
  if (!input || input.value === _modelValue.value) return
  input.value = _modelValue.value
}
</script>

<style scoped module="inputStyle">
.style {
  border-radius: v-bind('input.borderRadius');
  padding: v-bind('input.padding');
}
</style>

<style scoped>
.en-input {
  border: 1px solid v-bind('colors.gray');
  display: flex;
}

.en-input__input {
  border: none;
  flex: 1;
}

.en-input__input:focus-visible {
  outline: none;
}

.en-input__clear {
  cursor: pointer;
}

.en-input__clear:hover {
  color: v-bind('colors.white');
  background-color: v-bind('colors.gray');
  border-radius: 50%;
}
</style>

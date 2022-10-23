<template>
  <div :class="['en-input']">
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

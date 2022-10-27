import type { PropType, ExtractPropTypes } from 'vue'

export const Props = {
  clearable: Boolean as PropType<boolean>,
  disabled: Boolean as PropType<boolean>,
  modelValue: [String, null] as PropType<string | null>,
  placeholder: String as PropType<string>,
  type: String as PropType<string>
} as const

export const Emits = {
  'update:modelValue': (val: string): string => val,
  input: (val: string): string => val,
  enter: (evt: Event): Event => evt,
  blur: (evt: FocusEvent): FocusEvent => evt,
  focus: (evt: FocusEvent): FocusEvent => evt
} as const

export type InputPropsType = ExtractPropTypes<typeof Props>

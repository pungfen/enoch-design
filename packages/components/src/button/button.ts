import type { PropType, ExtractPropTypes } from 'vue'

export type ButtonType = 'default' | 'primary'

export const Props = {
  disabled: Boolean as PropType<boolean>,
  loading: Boolean as PropType<boolean>,
  text: Boolean as PropType<boolean>,
  type: {
    type: String as PropType<ButtonType>,
    default: (): ButtonType => 'default',
    validator: (val: ButtonType): boolean => {
      return ['default', 'primary'].includes(val)
    }
  }
} as const

export const Emits = {
  click: (evt: MouseEvent): MouseEvent => evt
} as const

export type ButtonPropsType = ExtractPropTypes<typeof Props>

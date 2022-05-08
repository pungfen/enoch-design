import type { PropType } from 'vue'

type ButtonType = '' | 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text'

export const buttonProps = {
  type: { type: String as PropType<ButtonType>, default: 'default' }
} as const

import type { PropType } from 'vue'
import type { ButtonType } from 'element-plus'

export const buttonProps = {
  type: { type: String as PropType<ButtonType>, default: 'default' }
} as const

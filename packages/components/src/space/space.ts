import type { PropType, ExtractPropTypes } from 'vue'

export type SpaceSizeType = 'large' | 'middle' | 'small' | 'mini'

export const Props = {
  vertical: Boolean as PropType<boolean>,
  wrap: Boolean as PropType<boolean>,
  text: Boolean as PropType<boolean>,
  spacing: {
    type: String as PropType<SpaceSizeType>,
    default: (): SpaceSizeType => 'middle',
    validator: (val: SpaceSizeType): boolean => {
      return ['large', 'middle', 'small', 'mini'].includes(val)
    }
  }
} as const

export type SpacePropsType = ExtractPropTypes<typeof Props>

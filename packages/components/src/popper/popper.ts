import { pick } from 'lodash-unified'

import type { PropType } from 'vue'
import type { Placement } from '@popperjs/core'

export interface Measurable {
  getBoundingClientRect: () => DOMRect
}

type Trigger = 'click' | 'hover'

export const props = {
  virtualRef: Object as PropType<any>,
  virtualTriggering: Boolean as PropType<boolean>,
  offset: Array as PropType<Array<number>>,
  placement: String as PropType<Placement>,
  teleportTo: String as PropType<string>,
  trigger: String as PropType<Trigger>,
  persistent: Boolean as PropType<boolean>
}

export const containerProps = {
  ...pick(props, 'teleportTo')
}

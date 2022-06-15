import { reactive } from 'vue'

import { block, type Config } from './converter'

export const defineFactory = <T extends Config>(config: T) => {
  const origin = block(config)
  const state = reactive(origin)
  return state
}

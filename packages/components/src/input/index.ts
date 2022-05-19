import { assign } from 'lodash'

import Input from './input.vue'
import type { App } from 'vue'

export * from './input'

export const EnInput = assign(Input, {
  install: (app: App) => app.component(Input.name, Input)
})

// test

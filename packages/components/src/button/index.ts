import { assign } from 'lodash'

import Button from './button.vue'
import type { App } from 'vue'

export * from './button'

export const EnButton = assign(Button, {
  install: (app: App) => app.component(Button.name, Button)
})

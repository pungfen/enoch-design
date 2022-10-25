import type { App } from 'vue'

import { EnButton, EnPopper } from './components'

const components = [EnButton, EnPopper]

export * from './components'

export default {
  install: (app: App) => {
    components.forEach((component) => app.component(component.name, component))
  }
}

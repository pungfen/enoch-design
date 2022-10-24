import type { App } from 'vue'

import { EnButton } from './components'

const components = [EnButton]

export * from './components'

export default {
  install: (app: App) => {
    components.forEach((component) => app.component(component.name, component))
  }
}

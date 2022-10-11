import type { App } from 'vue'

import { EnButton, EnConfig, EnInput } from './components'

const components = [EnButton, EnConfig, EnInput]

export * from './components'

export default {
  install: (app: App) => {
    components.forEach((component) => app.component(component.name, component))
  }
}

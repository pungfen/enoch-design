import type { App } from 'vue'

import { EnButton, EnConfig, EnInput } from './src'

const components = [EnButton, EnConfig, EnInput]

export * from './src'

export default {
  install: (app: App) => {
    components.forEach((component) => app.component(component.name, component))
  }
}

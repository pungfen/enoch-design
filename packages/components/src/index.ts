import { EnButton } from './button'
import { EnInput } from './input'

import type { App } from 'vue'

const components = [EnButton, EnInput]

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { EnButton, EnInput }

export default { install }

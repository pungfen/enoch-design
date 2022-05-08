import { EnButton } from './button'

import type { App } from 'vue'

const version = '0.0.1'

const components = [EnButton]

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { EnButton }

export default { version, install }

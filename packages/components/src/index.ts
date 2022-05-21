import { EnButton } from './button'

import type { App } from 'vue'

const components = [EnButton]

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { EnButton }

export default { install }

import type { App } from 'vue'

import * as components from './components'

import { version } from '../package.json'

export default {
  version,
  install: (app: App) => {
    Object.entries(components).forEach(([name, component]) => app.component(name, component))
    return app
  }
}

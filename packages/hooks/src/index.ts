import { assign } from 'lodash'

import ConfigProvider from './config-provider.vue'
import type { App } from 'vue'

export const FactoryConfigProvider = assign(ConfigProvider, {
  install: (app: App) => app.component(ConfigProvider.name, ConfigProvider)
})

export * from './config'
export * from './use-factory'

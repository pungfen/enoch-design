import type { App } from 'vue'

export * from './core'

export interface InstallOptions {
  axios?: any
}

export default {
  install: (app: App, options?: InstallOptions) => {
    app.config.globalProperties.$factory = {}
  }
}

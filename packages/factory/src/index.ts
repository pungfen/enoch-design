import type { App } from 'vue'

export * from './factory'

export interface InstallOptions {
  axios?: any
}

export default {
  install: (app: App, options?: InstallOptions) => {
    app.config.globalProperties.$factory = {}
    app.config.globalProperties.$factory.axios = options?.axios
  }
}

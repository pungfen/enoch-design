import type { App } from 'vue'

export * from './core'

export interface InstallOptions {
  fetch?: {
    headers?: Record<string, any>
  }
  paging?: Record<string, any>
}

export default {
  install: (app: App, options?: InstallOptions) => {
    app.config.globalProperties.$factory = {
      fetch: {
        headers: options?.fetch?.headers
      },
      paging: options?.paging || {
        itemCount: 0,
        pageCount: 0,
        pageIndex: 1,
        pageSize: 20
      }
    }
  }
}

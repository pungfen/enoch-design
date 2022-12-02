import { defineComponent, reactive } from 'vue'

import { block } from './convert'

import type { App } from 'vue'
import type { FactoryConfig, FactoryOptions } from './types'
import { assign, isObject } from 'lodash-es'

export interface InstallOptions {}

export default (options?: InstallOptions) => {
  return {
    install: (app: App) => {
      app.config.globalProperties.$factory = {}
    }
  }
}

export * from './convert'
export * from './types'

export const factory = (config: FactoryConfig, options?: FactoryOptions) => {
  return defineComponent({
    props: options?.props,

    setup() {
      const origin = reactive({})

      const data = block(config, '', origin)

      return origin
    }
  })
}

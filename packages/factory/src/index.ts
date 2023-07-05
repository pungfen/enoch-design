import { defineComponent, type DefineComponent, type App } from 'vue'

import { Context } from './context'

import type { Children, Options, Props } from './types'

export const factory = <PropsOptions extends Props, ChildrenOptions extends Children>(
  options: Options<PropsOptions, ChildrenOptions>
): DefineComponent<any, any, any> => {
  const { setup } = new Context(options)
  return defineComponent({ setup })
}

export const createFactory = () => {
  return {
    install(app: App) {
      app.config.globalProperties.$factory ??= {}
    }
  }
}

export * from './types'

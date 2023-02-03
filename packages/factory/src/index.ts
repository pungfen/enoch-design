import { defineComponent, h } from 'vue'

import type { DefineComponent, Component } from 'vue'

export * from './config'

type ChildrenType<T> = keyof any | Array<T>

interface ConfigChildren {
  is: string | Component
  class?: string | Array<string>
  children?: ChildrenType<ConfigChildren>
}

interface Config {
  [index: string]: any
  children?: ChildrenType<ConfigChildren>
}

type OptionsConfig = Record<string, Config>

interface Options {
  layout: Component
  mounted?: () => void
  unmounted?: () => void
  config?: OptionsConfig
}

export const factory = <O extends Options>(options: O): DefineComponent<{}, {}> => {
  const { layout } = options

  const render = () => {
    return h(layout, null, {
      default: () => h('div', 'slots')
    })
  }

  const component = defineComponent({ render }) as any

  return component
}

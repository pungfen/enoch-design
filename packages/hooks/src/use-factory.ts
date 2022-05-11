import { getCurrentInstance, reactive, useSlots } from 'vue'

import type { UnwrapRef, SetupContext } from 'vue'
import type { Any, Object } from 'ts-toolbelt'
import type { Method } from 'axios'

type ComponentType = 'table' | 'form' | 'tree' | 'dialog' | 'drawer'

enum Component {
  Table = 1,
  Form = 2
}

interface TableConfig extends AjaxConfig {
  type?: 'table'
  data?: unknown[]
}

interface FormConfig extends AjaxConfig {
  initializer?: () => Record<string, any>
}

type AjaxActionConfig = {
  action: `${Method} /${string}`
  params?: string | ((this: Record<string, any>, ...args: []) => any) | any[]
  discriminant?: string
  slient?: boolean
  message?: string | string[]
  convert?: {
    client?: (...args: any) => any
    server?: (...args: any) => any
  }
}

interface FactoryBaseState {
  $emit?: SetupContext['emit']
  $slots?: SetupContext['slots']
  [index: string]: any
}

interface AjaxConfig {
  ajax?: AjaxActionConfig
}

type test2 = Any.Contains<{ a: string }, { a: string; b: number }> // False
type test3 = Object.Has<{ type: 'table'; name: 'xxx' }, 'type', 'table', 'equals'>

// type IsComponent<Config> = 'type' extends keyof Config ? (Config['type'] extends ComponentType ? Config : never) : never
type FactoryIndexConfig<Config extends Record<string, any>> = Object.Has<Config, 'type', 'table', 'equals'> extends 0
  ? TableConfig
  : Object.Has<Config, 'type', 'form', 'equals'> extends 0
  ? FormConfig
  : never

type FactoryConfig<Config extends Record<string, any> = Record<string, any>> = {
  [Key in keyof Config]: Config[Key] extends Record<string, any> ? FactoryIndexConfig<Config[Key]> : Config[Key]
}

type UseFactoryReturn = UnwrapRef<FactoryBaseState>

export const useFactory = <Config extends Record<string, any>>(config: FactoryConfig<Config>): UseFactoryReturn => {
  const vm = getCurrentInstance()
  const slots = useSlots()

  const state: FactoryBaseState = { $emit: vm?.emit, $slots: slots }

  const stateProxy = reactive(state)

  return stateProxy
}

const xx = useFactory({
  name: '',
  table: {
    type: 'table',
    data: []
  },
  form: {
    type: 'form'
  }
})

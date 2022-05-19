import { getCurrentInstance, reactive, useSlots, type UnwrapRef, type SetupContext } from 'vue'

import type { Method } from 'axios'

type ComponentType = 'table' | 'form' | 'tree' | 'dialog' | 'drawer'
type KeyWord = 'type' | 'ajax' | 'data'

type TablePaging = { current: number; size: number }

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

interface IndexConfig {
  type?: ComponentType
  ajax?: Record<string, AjaxActionConfig>
  data?: any
}

interface TableConfig {
  data: unknown[]
  paging?: TablePaging
}

interface TableReturn {
  data: unknown[]
  paging: TablePaging
}

interface FormConfig {
  data?: Record<string, any>
  initializer?: () => Record<string, any>
}

interface FormReturn {
  data: object
}

interface FactoryBaseState {
  $emit?: SetupContext['emit']
  $slots?: SetupContext['slots']
  [index: string]: any
}

// type FactoryThisType<Config> = {
//   [Key in keyof Config]: Config[Key] extends infer SubConfig
//     ? SubConfig extends Record<string, any>
//       ? Object.Has<SubConfig, 'type', ComponentType, '<-extends'> extends 1
//         ? Object.Merge<
//             MutableRecord<{
//               ['table']: TableReturn
//               ['form']: FormReturn
//             }>,
//             FactoryThisType<Object.Omit<SubConfig, KeyWord>>
//           >
//         : SubConfig
//       : SubConfig
//     : Config[Key]
// }

// type convertComponentConfig<Config extends object = object> = {
//   [Key in keyof Config]: Config[Key] extends object
//     ? Object.Has<Config[Key], 'type', ComponentType, '<-extends'> extends 1
//       ? MutableRecord<{
//           ['table']: TableConfig
//           ['form']: FormConfig
//         }>
//       : never
//     : never
// }

type OmitNever<T> = Pick<T, { [P in keyof T]: T[P] extends never ? never : P }[keyof T]>

type ConvertIndexConfig<Config extends object = object> = {
  [Key in keyof Config]: { name: string }
}[keyof Config]

type ConvertTypeConfig<Config extends object> = 'type' extends keyof Config
  ? 'table' extends Config['type']
    ? TableConfig & ConvertIndexConfig<Omit<Config, keyof TableConfig>>
    : never
  : never

// ? 'table' extends SubConfig['type']
//           ? IndexConfig & TableConfig & FactoryConfig<Omit<SubConfig, 'type' | 'ajax'>>
//           : 'form' extends SubConfig['type']
//           ? IndexConfig & FormConfig & FactoryConfig<Omit<SubConfig, 'type' | 'ajax'>>
//           : never
//ThisType<Object.Merge<FactoryThisType<Config>, FactoryBaseState>>

type FactoryConfig<Config extends object = object> = ConvertIndexConfig<Config>

// keyof Omit<SubConfig, 'type' | 'ajax'>]?: SubConfig[SubKey] extends object
// ? { name: string }
// : SubConfig[SubKey]
// }

// Config[Key] extends infer SubConfig
//     ? Any.Equals<SubConfig, object> extends 1
//       ? IndexConfig
//       : SubConfig
//     : never

// ? Object.Has<SubConfig, 'type', ComponentType, '<-extends'> extends 1
//         ? Object.Merge<
//             MutableRecord<{
//               ['table']: TableConfig
//               ['form']: FormConfig
//             }>,
//             // [
//             //   { ajax: AjaxConfig },
//             //   {
//             //     [SubKey in keyof Object.Omit<Config[Key], KeyWord>]: Config[Key] extends infer SubConfig
//             //       ? SubConfig extends object
//             //         ? FactoryConfig<SubConfig>
//             //         : SubConfig
//             //       : never
//             //   }
//             // ]
//             {}
//           >
//         : FactoryConfig<SubConfig>
//       : SubConfig

type UseFactoryReturn<Config> = UnwrapRef<FactoryBaseState>

export const useFactory = <Config extends object>(config: FactoryConfig<Config>): UseFactoryReturn<Config> => {
  const vm = getCurrentInstance()
  const slots = useSlots()

  const state: FactoryBaseState = { $emit: vm?.emit, $slots: slots }

  const stateProxy = reactive(state)

  return stateProxy
}

import { computed as vComputed, defineComponent, isReadonly, reactive, type ComponentPropsOptions, type ExtractPropTypes } from 'vue'

import { isFunction, isPlainObject } from '@enochfe/shared'

interface Definitions {
  TestDto: {
    id?: number
    name: string
  }
}

export interface FactoryAjaxActions {
  'GET /test': {
    Data: Definitions['TestDto']
  }
}

type AjaxConfig = {}

type Ajax<C extends _FactoryConfig> = {}

type Computed<C extends _FactoryConfig, U extends C['computed'] = never> = {
  [K in keyof U]: U[K] extends (...args: Array<any>) => any
    ? ReturnType<U[K]>
    : U[K] extends { get: infer R }
    ? R extends (...args: Array<any>) => any
      ? ReturnType<R>
      : never
    : never
}

type Index<C extends _FactoryConfig> = Setup<Omit<C, 'ajax' | 'children' | 'computed'>>

type Children<C extends _FactoryConfig> = {
  [K in keyof C['children']]: C['children'][K] extends _FactoryConfig ? Setup<C['children'][K]> : {}
}

type Setup<C extends _FactoryConfig> = {
  [K in keyof C]: C[K] extends (...args: Array<any>) => any ? C[K] : C[K] extends Record<string, any> ? Children<C[K]> & Index<C[K]> : C[K]
}

type _FactoryConfig = {
  ajax?: AjaxConfig
  children?: Record<string, _FactoryConfig>
  computed?: Record<string, any> | { get: () => any; set: (...args: Array<any>) => any }
  [index: string]: any
}

interface FactoryConfig {
  name?: string
  props?: Readonly<ComponentPropsOptions>
  setup: Record<string, _FactoryConfig>
  mounted?: () => void
  unmounted?: () => void
}

const ajax = function <C extends FactoryConfig['setup']>(this: any, config: C, expression: string) {
  const origin: any = {}
  return origin
}

const computed = function <C extends FactoryConfig['setup']>(this: any, config: C, expression: string) {
  const origin: any = {}

  if (config.computed) {
    Object.entries(config.computed).forEach(([key, value]) => {
      if (isFunction(value)) return (origin[key] = vComputed(value.bind(this)))
      else if (isPlainObject(value)) {
        origin[key] = vComputed(
          Object.entries(value).reduce((res, [methodName, methodFn]) => {
            res[methodName] = (methodFn as Function).bind(this)
            return res
          }, {} as any)
        )
      }
    })
  }

  return origin
}

const children = function <C extends FactoryConfig['setup']>(this: any, config: C, expression: string) {
  const origin: any = {}

  if (config.children) {
    Object.entries(config.children).forEach(([name, subConfig]) => {
      origin[name] = setup.call(this, subConfig, expression ? `${expression}.${name}` : name)
    })
  }

  return origin
}

const index = function <C extends FactoryConfig['setup']>(this: any, config: C, expression: string) {
  const origin: any = {}

  Object.entries(config).forEach(([name, value]) => {
    if (isReadonly(value)) return (origin[name] = value)
    if (['children', 'ajax', 'computed'].includes(name)) return
    origin[name] = isPlainObject(value)
      ? setup.call(this, value, `${expression}.${name}`)
      : isFunction(value)
      ? (value as Function).bind(this)
      : value
  })

  return origin
}

const setup = function <C extends FactoryConfig['setup']>(this: any, config: C, expression: string) {
  const origin: any = this ? {} : reactive({})

  Object.assign(
    origin,
    ajax.call(this || origin, config, expression),
    computed.call(this || origin, config, expression),
    children.call(this || origin, config, expression),
    index.call(this || origin, config, expression)
  )

  return origin
}

export const factory = <FC extends FactoryConfig, P extends FC['props']>(
  config: FC & ThisType<Readonly<P extends ComponentPropsOptions ? ExtractPropTypes<P> : P> & Setup<FC['setup']>>
) => {
  return defineComponent({
    props: config.props!,

    setup(props) {
      const proxy = Object.assign(setup.call(null, config.setup, ''), props)

      return proxy as Setup<FC['setup']> & Readonly<P extends ComponentPropsOptions ? ExtractPropTypes<P> : P>
    },

    mounted() {
      config.mounted?.call(this)
    },

    unmounted() {
      config.unmounted?.call(this)
    }
  })
}

import {
  computed as vComputed,
  defineComponent,
  isProxy,
  isReadonly,
  onMounted,
  onUnmounted,
  reactive,
  type ComponentPropsOptions,
  type ExtractPropTypes
} from 'vue'

import { chain, isFunction, isPlainObject } from 'lodash-es'

type DataType = 'array' | 'object' | 'string' | 'none'

interface SetupConfig {
  ajax?: AjaxConfig
  children?: Record<string, SetupConfig>
  computed?: Record<string, any> | { get: () => any; set: (...args: Array<any>) => any }
  [index: string]: any
}

interface Config {
  onMounted?: () => void
  onUnmounted?: () => void
  props?: Readonly<ComponentPropsOptions>
  setup: Record<string, SetupConfig>
}

type AjaxConfig = {
  action: string
  data?: DataType
}

type Ajax<C extends SetupConfig> = C['ajax'] extends AjaxConfig ? {} : {}

type Index<C extends Record<string, SetupConfig>> = Setup<Omit<C, 'ajax' | 'children' | 'computed'>>

type Children<C extends Record<string, SetupConfig>> = Setup<C>

type Computed<C extends Record<string, SetupConfig>> = {
  [K in keyof C]: C[K] extends (...args: Array<any>) => any
    ? ReturnType<C[K]>
    : C[K] extends { get: infer R }
    ? R extends (...args: Array<any>) => any
      ? ReturnType<R>
      : never
    : never
}

type Setup<C extends SetupConfig> = {
  [K in keyof C]: C[K] extends keyof any
    ? C[K]
    : C[K] extends (...args: any[]) => any
    ? C[K]
    : C[K] extends Record<string, any>
    ? Ajax<C[K]> & Computed<C[K]['computed']> & Children<C[K]['children']> & Index<C[K]>
    : never
}

const ajax = function <C extends SetupConfig>(this: any, config: C, expression: string): Ajax<C> {
  const origin: any = {}

  return origin
}

const computed = function <C extends SetupConfig>(this: any, config: C, expression: string): Computed<C> {
  const origin: any = {}

  if (config.computed) {
    chain(config.computed)
      .entries()
      .forEach(([key, value]) => {
        if (isFunction(value)) return (origin[key] = vComputed(value.bind(this)))
        else if (isPlainObject(value)) {
          origin[key] = vComputed(
            chain(value)
              .entries()
              .reduce((res, [methodName, methodFn]) => {
                res[methodName] = methodFn.bind(this)
                return res
              }, {} as any)
              .value()
          )
        }
      })
      .value()
  }
  return origin
}

const children = function <C extends SetupConfig>(this: any, config: C, expression: string): Children<C> {
  const origin: any = {}

  if (config.children) {
    chain(config.children)
      .entries()
      .forEach(([name, subConfig]) => {
        origin[name] = setup.call(this, subConfig, expression ? `${expression}.${name}` : name)
      })
      .value()
  }

  return origin
}

const index = function <C extends SetupConfig>(this: any, config: C, expression: string): Index<C> {
  const origin: any = {}

  chain(config)
    .entries()
    .forEach(([name, value]) => {
      if (isProxy(value) && isReadonly(value)) return (origin[name] = value)
      if (['children', 'ajax', 'computed'].includes(name)) return
      origin[name] = isPlainObject(value) ? setup.call(this, value, `${expression}.${name}`) : isFunction(value) ? value.bind(this) : value
    })
    .value()

  return origin
}

const setup = function <C extends SetupConfig>(this: any, config: C, expression: string): Setup<C> {
  const origin: any = this ? {} : reactive({})

  chain(origin)
    .assign(ajax.call(this || origin, config, expression))
    .assign(computed.call(this || origin, config, expression))
    .assign(children.call(this || origin, config, expression))
    .assign(index.call(this || origin, config, expression))
    .value()

  return origin
}

export const factory = <C extends Config>(config: C & ThisType<ExtractPropTypes<C['props']> & Setup<C['setup']>>) => {
  return defineComponent({
    props: config.props!,
    setup(props) {
      const proxy = chain(setup.call(null, config.setup, '')).assign(props).value()

      onMounted(() => config?.onMounted?.call(proxy))
      onUnmounted(() => config?.onUnmounted?.call(proxy))

      return proxy as ExtractPropTypes<C['props']> & Setup<C['setup']>
    }
  })
}

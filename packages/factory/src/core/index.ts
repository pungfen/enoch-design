import { computed as vComputed, defineComponent, isReadonly, reactive, type ComponentPropsOptions } from 'vue'

import { isFunction, isPlainObject } from '@enochfe/shared'

type Index = {}

type Children<C> = {}

type _FactoryConfig = {
  children: Record<string, _FactoryConfig>
  [index: string]: any
}

interface FactoryConfig {
  name?: string
  props?: Readonly<ComponentPropsOptions>
  setup: Record<string, _FactoryConfig>
  mount?: () => void
  unmount?: () => void
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

export const factory = <FC extends FactoryConfig>(config: FC) => {
  return defineComponent({
    props: config.props!,

    setup: (props) => Object.assign(setup.call(null, config.setup, ''), props),

    mounted() {},

    unmounted() {}
  })
}

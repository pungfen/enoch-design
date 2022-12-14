import { computed, defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive, ref } from 'vue'

import type { App, Ref } from 'vue'
import type { Block, FactoryConfig, FactoryOptions } from './types'
import { assign, chain, entries, forEach, isFunction, isObject, isPlainObject, set } from 'lodash-es'

export interface InstallOptions {
  ajax: { instance: any }
  store: Record<string, any>
}

export const createFactory = (options?: InstallOptions) => {
  return {
    install: (app: App) => {
      app.config.globalProperties.$factory = { ...options }
    }
  }
}

export * from './convert'
export * from './types'

const IS_PROXY = Symbol('is_proxy')
const PATH = Symbol('path')
const PARENT = Symbol('parent')

type IProxy<T = any> = T & {
  [IS_PROXY]?: boolean
  [PATH]?: string
  [PARENT]?: any
}

type MaybeRef<T> = T | Ref<T>

const ajax = (config: FactoryConfig) => {
  const origin: any = {}
  if (config.ajax) {
    chain(config.ajax)
      .entries()
      .forEach(([key, value]) => {
        const { action, converter, data, loading, params, pagination } = value

        switch (data) {
          case 'object':
            origin.data = {}
            break
          case 'array':
            origin.data = []
            break
        }

        if (pagination) {
          origin.paging = {}
        }

        const method = async function (this: any) {
          console.log('parent', this)

          // const [httpMethod, path] = action.split(' ')
          // const _params: { query?: any; body?: any; path?: any } = {}
          // params?.(_params)

          // const url = path
          //   .split('/')
          //   .map((str) => (str.startsWith(':') ? _params.path[str.replace(':', '')] : str))
          //   .join('/')

          // let data = (converter?.server as (body: any) => any)?.call(this, _params.body) || _params.body

          // if (loading) parent.loading = true

          // try {
          //   const res = await fetch(url)
          // } finally {
          //   if (loading) parent.loading = false
          // }
        }

        origin[key] = method
      })
      .value()
  }
  return origin
}

const children = (config: FactoryConfig) => {
  const origin: any = {}
  if (config.children) {
    chain(config.children)
      .entries()
      .forEach(([key, value]) => {
        origin[key] = block(value)
      })
      .value()
  }
  return origin
}

const index = (config: FactoryConfig) => {
  const origin: any = {}
  forEach(entries(config), ([key, value]) => {
    if (['ajax', 'children', 'computed', 'watch'].includes(key)) return
    origin[key] = value
  })
  return origin
}

const block = (config: FactoryConfig) => {
  const origin: any = {}
  assign(origin, ajax(config), children(config), index(config))
  return origin
}

const proxy = <T extends MaybeRef<object>>(target: T, parent: any, state: any, isRoot: boolean): IProxy<T> => {
  const _proxy = new Proxy(target, {
    get(target, p, receiver) {
      const res = Reflect.get(target, p, receiver)

      console.log('get', p)

      if (isObject(res) || (isFunction(res) && p in target)) {
        return proxy(res, null, state, false)
      }

      return res
    },
    set(target, p, receiver) {
      const res = Reflect.set(target, p, receiver)
      console.log('set', p)
      return res
    },
    apply(target, thisArg, argArray) {
      return Reflect.apply(target as Function, state, argArray)
    }
  })

  return isRoot ? target : _proxy
}

export const factory = <C extends FactoryConfig>(config: C & ThisType<Block<C>>, options?: FactoryOptions & ThisType<Block<C>>) => {
  return defineComponent<any, Block<C>, unknown, {}, {}, any, any, {}, string, {}, string>({
    props: options?.props,

    setup() {
      const instance = getCurrentInstance()
      const _block = block(config)
      const state = ref()

      proxy(state, null, state, true)

      state.value = { name: 'xx' }

      console.log(state)
      if (options?.debug) {
      }

      // onMounted(() => options?.mounted?.call(state))
      // onUnmounted(() => options?.unmounted?.call(state))

      return reactive(state) as Block<C>
    }
  })
}

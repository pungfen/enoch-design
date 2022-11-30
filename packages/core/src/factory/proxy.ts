import { reactive } from 'vue'
import { isObject, isFunction, has } from 'lodash-es'

export const PARENT = Symbol('parent')
export const PATH = Symbol('path')
export const RAW = Symbol('raw')
export const ROOT = Symbol('root')

const createProxy = <T extends object>(target: T, root: T, path?: string, parent?: any) => {
  const proxyHandler: ProxyHandler<T> = {
    get(target: T, key: PropertyKey, receiver: object) {
      switch (key) {
        case PARENT:
          return parent
        case PATH:
          return path
        case RAW:
          return target
        case ROOT:
          return root
      }
      const res = Reflect.get(target, key, receiver)

      // if (isObject(res) || (isFunction(res) && has(target, key))) {
      //   const subpath = ''
      //   return createProxy(res, root, subpath, proxy)
      // }

      return res
    },

    set(target: T, key: PropertyKey, value: unknown, receiver: object): boolean {
      const res = Reflect.set(target, key, value, receiver)
      return res
    },

    apply(target: T & Function, _this: any, args: any[]) {
      return Reflect.apply(target, _this, args)
    }
  }

  const proxy = new Proxy(target, proxyHandler)

  return proxy
}

export const proxy = <T extends object>(target: T) => {
  const origin = reactive({})

  createProxy(target, origin)

  return origin
}

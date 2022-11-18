import { reactive as _reactive } from 'vue'

export const reactive = <T extends object>(target: T, path?: string, root?: any, parent?: any) => {
  const origin = _reactive({})

  const proxyHandler: ProxyHandler<T> = {
    get(target: T, key: PropertyKey, receiver: object) {
      const res = Reflect.get(target, key, receiver)

      return res
    },
    set(target: T, key: PropertyKey, value: unknown, receiver: object): boolean {
      const res = Reflect.set(target, key, value, receiver)

      console.log(target, key)

      return res
    }
  }

  const proxy = new Proxy(target, proxyHandler)

  console.log(proxy)

  return origin
}

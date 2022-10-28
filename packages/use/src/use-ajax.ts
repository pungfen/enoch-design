import { ref, shallowRef } from 'vue'
import type { Ref, ShallowRef } from 'vue'

export interface AjaxActions {
  'GET /test': {
    Data: { name: string; age: number }
    Params: { xx: string }
  }
}

type DataType = 'array' | 'object' | 'string' | 'none'
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ActionPath = `${HttpMethod} /${string}`

interface DtoMapValue<Server, Client> {
  server: Server
  client: Client
}

export type DtoMap = {
  [Action in keyof AjaxActions]: Action extends ActionPath
    ? Action extends `${infer M} /${string}`
      ? AjaxActions[Action] extends {
          Data?: infer D
          Params?: infer P
        }
        ? M extends 'GET'
          ? DtoMapValue<P, D>
          : M extends 'POST'
          ? DtoMapValue<D, number>
          : M extends 'PUT'
          ? DtoMapValue<D, void>
          : M extends 'DELETE'
          ? DtoMapValue<void, void>
          : never
        : never
      : never
    : never
}

type ClientDto<A> = A extends keyof DtoMap ? DtoMap[A]['client'] : never

type _AjaxConfig<A, D> = A extends keyof DtoMap
  ? D extends DataType
    ? {
        action: A
        data?: D
        converter?: {
          server?: (payload: DtoMap[A]['server']) => DtoMap[A]['server'] | void
          client?: (data: D extends 'object' ? ClientDto<A> : ClientDto<A>[]) => (D extends 'object' ? ClientDto<A> : ClientDto<A>[]) | void
        }
        params?: (params: { paths?: (string | number | undefined)[]; payload?: DtoMap[A]['server'] }) => void
      }
    : never
  : never

export type UseAjaxConfig = _AjaxConfig<keyof DtoMap, DataType>

export interface UseAjaxRunOptions {
  addition?: any
}

type BlockData<A, D> = D extends 'array' ? ClientDto<A>[] : D extends 'object' ? ClientDto<A> : never

type AjaxData<U> = Extract<U, { data: 'array' } | { data: 'object' }> extends {
  action: infer A
  data: infer D
}
  ? BlockData<A, D>
  : never

type UseAjaxReturn<C> = _UseAjaxReturn<AjaxData<C>>

interface _UseAjaxReturn<D> {
  /**
   * Ajax Response
   */
  response: ShallowRef<any>

  /**
   * Ajax response data
   */
  data: Ref<D | undefined>

  /**
   * Indicates if the Ajax is currently loading
   */
  loading: Ref<boolean>

  run: (options?: AjaxRunOptions) => PromiseLike<any>
}

export interface FetchOptions extends RequestInit {
  params?: object
  data?: any
}

export const fetch = async <T extends any>(url: string, options: FetchOptions = {}): Promise<T> => {
  options.method ??= 'GET'
  options.credentials = 'include'

  if (options.method === 'post' && options.data) options.body = JSON.stringify(options.data)

  return new Promise(async (resolve, reject) => {
    try {
      const res = await window.fetch(url, options).then((res) => res.json())
      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

export const useAjax = <C extends UseAjaxConfig>(config: C): UseAjaxReturn<C> => {
  const response = shallowRef()
  const data = ref()
  const loading = ref(false)

  const dataType = config.data
  const [httpMethod, path] = config.action.split(' ')

  const run = async (options: UseAjaxRunOptions = {}) => {
    const params: { paths?: (string | number)[]; payload?: any } = {}

    config.params?.(params)

    let index = 0
    let fetchOptions = {} as FetchOptions
    let url = path
      .split('/')
      .map((str) => (str.startsWith(':') ? params.paths![index++] : str))
      .join('/')

    let payload = Object.assign({}, params.payload, options.addition)

    fetchOptions.method = httpMethod
    fetchOptions.params = ['GET', 'DELETE', 'get', 'delete'].includes(httpMethod) ? payload : {}
    fetchOptions.data = ['PUT', 'POST'].includes(httpMethod) ? { data: [].concat(payload) } : {}

    loading.value = true

    try {
      const res = await fetch<any>(url, fetchOptions)
      response.value = res
      let resData = dataType === 'object' ? res.data[0] : res.data
      resData = (config.converter?.client as (...args: any[]) => any)?.call(this, resData, res) || resData
      data.value = resData
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, response, run }
}

import {
  computed as vComputed,
  defineComponent,
  getCurrentInstance,
  isReadonly,
  reactive,
  type Component,
  type ComponentPropsOptions,
  type ExtractPropTypes
} from 'vue'

import { isFunction, isPlainObject, result } from '@enochfe/shared'

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

type DataType = 'array' | 'object' | 'string' | 'none'
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ActionPath = `${HttpMethod} /${string}`

interface DtoMapValue<Server, Client> {
  server: Server
  client: Client
}

type DtoMap = {
  [Action in keyof FactoryAjaxActions]: Action extends ActionPath
    ? Action extends `${infer M} /${string}`
      ? FactoryAjaxActions[Action] extends {
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

type IData<A, D> = D extends 'array' ? ClientDto<A>[] : D extends 'object' ? ClientDto<A> : never

type AjaxData<U> = Extract<U, { data: 'array' } | { data: 'object' }> extends {
  action: infer A
  data: infer D
}
  ? IData<A, D> extends never
    ? {}
    : { data: IData<A, D> }
  : {}

type AjaxLoading<U> = Extract<U, { loading: true }> extends never ? {} : { loading: boolean }

type AjaxPagination<U> = Extract<U, { pagination: true }> extends never
  ? {}
  : { paging: { itemCount: number; pageCount: number; pageIndex: number; pageSize: number } }

type _AjaxConfig<A extends keyof DtoMap, D extends DataType> = {
  action: A
  data?: D
  converter?: {
    server?: (payload: DtoMap[A]['server']) => DtoMap[A]['server'] | void
    client?: (data: D extends 'object' ? ClientDto<A> : ClientDto<A>[]) => (D extends 'object' ? ClientDto<A> : ClientDto<A>[]) | void
  }
  by?: string
  loading?: boolean
  pagination?: boolean
  params?: (params: { paths?: (string | number | undefined)[]; payload?: DtoMap[A]['server'] }) => void
}

type AjaxConfig = _AjaxConfig<keyof DtoMap, DataType>

interface AjaxMethodOptions {
  addition?: any
  invokedByScroll?: boolean
  invokedByPagination?: boolean
}

type Ajax<C extends _FactoryConfig> = C['ajax'] extends AjaxConfig
  ? {
      [K in keyof Pick<C, 'ajax'>]: (
        options?: AjaxMethodOptions
      ) => Promise<C[K] extends { action: infer A; data: infer D } ? IData<A, D> : C extends { action: infer A } ? ClientDto<A>[] : never>
    } & AjaxData<C['ajax']> &
      AjaxLoading<C['ajax']> &
      AjaxPagination<C['ajax']>
  : {}

type Computed<C extends _FactoryConfig> = {
  [K in keyof C['computed']]: C['computed'][K] extends (...args: Array<any>) => any
    ? ReturnType<C['computed'][K]>
    : C['computed'][K] extends { get: infer R }
    ? R extends (...args: Array<any>) => any
      ? ReturnType<R>
      : never
    : never
}

type Index<C extends _FactoryConfig> = Setup<Omit<C, 'ajax' | 'children' | 'computed'>>

type Children<C extends _FactoryConfig> = {
  [K in keyof C['children']]: C['children'][K] extends _FactoryConfig ? Setup<C['children'][K]> : never
}

type Setup<C extends _FactoryConfig> = {
  [K in keyof C]: C[K] extends (...args: Array<any>) => any
    ? C[K]
    : C[K] extends Record<string, any>
    ? Ajax<C[K]> & Computed<C[K]> & Setup<C[K]['children']> & Index<C[K]>
    : C[K]
}

interface _FactoryConfig {
  ajax?: AjaxConfig
  children?: Record<string, _FactoryConfig>
  computed?: Record<string, any> | { get: () => any; set: (...args: Array<any>) => any }
  [index: string]: any
}

interface FactoryConfig {
  name?: string
  components?: Record<string, Component>
  props?: Readonly<ComponentPropsOptions>
  setup: Record<string, _FactoryConfig>
  mounted?: () => void
  unmounted?: () => void
}

interface Response<T> {
  confirmations: Array<any>
  data: Array<T>
  errors: Array<any>
  extraData: Record<string, any>
  meta: Record<string, any>
  warnings: Array<any>
}

const getDataFromExpresion = (data: any, expression: string): Record<string, any> => {
  return result(data, expression.substring(expression.startsWith('.') ? 1 : 0), {})
}

const fetch = async <T extends any>(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response<T>> => {
  const app = getCurrentInstance()

  init.headers = Object.assign(init.headers || {}, app?.appContext.config.globalProperties.$factory?.fetch.headers)

  return new Promise(async (resolve, reject) => {
    try {
      const res = await window.fetch(input, init).then((res) => res.json())
      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

const ajax = function <C extends _FactoryConfig>(this: any, config: C, expression: string): Ajax<C> {
  const origin: any = {}

  if (config.ajax) {
    const app = getCurrentInstance()

    const { action, params, converter, loading, pagination, data: dataType } = config.ajax
    loading && (origin.loading = false)
    pagination && (origin.paging = Object.assign({}, app?.appContext.config.globalProperties.$factory?.paging))
    dataType === 'array' && (origin.data = [])
    dataType === 'object' && (origin.data = {})
    dataType === 'string' && (origin.data = '')

    const [httpMethod, path] = action.split(' ')

    const method = async function (this: any, options?: AjaxMethodOptions) {
      if (!app?.appContext.config.globalProperties.$factory?.axios) {
        return Promise.reject(`please install factory in 'main.js/ts' and define axios options`)
      }

      const parent = getDataFromExpresion(this, expression)
      const _params: { paths?: (string | number)[]; payload?: any } = {}
      params?.call(this, _params)

      let index = 0
      let arc = {} as any
      let data = Object.assign({}, (converter?.server as any)?.call(this, _params.payload) || _params.payload, options?.addition)
      let url = path
        .split('/')
        .map((str) => (str.startsWith(':') ? _params.paths![index++] : str))
        .join('/')

      arc.url = url
      arc.method = httpMethod
      arc.params = ['GET', 'DELETE'].includes(httpMethod) ? data : {}
      arc.data = ['PUT', 'POST'].includes(httpMethod) ? { data: [].concat(data) } : {}

      parent.loading = true

      try {
        const res = await fetch<any>(arc)
        let data = dataType === 'object' ? res.data[0] : res.data
        data = (converter?.client as (data: any) => any)?.call(this, data) || data
        dataType !== 'none' && (parent.data = options?.invokedByScroll ? [...parent.data, ...data] : data)
        pagination && (parent.paging = res.meta.paging)
        return Promise.resolve(res)
      } catch (err) {
        return Promise.reject(err)
      } finally {
        parent.loading = false
      }
    }

    origin.ajax = method.bind(this)
  }

  return origin
}

const computed = function <C extends _FactoryConfig>(this: any, config: C, expression: string): Computed<C> {
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

const children = function <C extends _FactoryConfig>(this: any, config: C, expression: string): Children<C> {
  const origin: any = {}

  if (config.children) {
    Object.entries(config.children).forEach(([name, subConfig]) => {
      origin[name] = setup.call(this, subConfig, expression ? `${expression}.${name}` : name)
    })
  }

  return origin
}

const index = function <C extends _FactoryConfig>(this: any, config: C, expression: string): Index<C> {
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

const setup = function <C extends _FactoryConfig>(this: any, config: C, expression: string): Setup<C> {
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

    components: config.components,

    setup(props) {
      const proxy = Object.assign(setup.call(null, config.setup, ''), props)

      return proxy as unknown as Setup<FC['setup']> & Readonly<P extends ComponentPropsOptions ? ExtractPropTypes<P> : P>
    },

    mounted() {
      config.mounted?.call(this)
    },

    unmounted() {
      config.unmounted?.call(this)
    }
  })
}

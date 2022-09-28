import {
  computed as vComputed,
  defineComponent,
  getCurrentInstance,
  isProxy,
  isReadonly,
  onMounted,
  onUnmounted,
  reactive,
  watch,
  watchEffect,
  type ComponentPropsOptions,
  type ExtractPropTypes,
  type WatchCallback,
  type WatchOptions
} from 'vue'

import { assign, chain, isArray, isFunction, isObject, isPlainObject, result } from 'lodash-es'

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
type OnCleanup = (cleanupFn: () => void) => void

interface SetupConfig {
  ajax?: AjaxConfig | AjaxConfig[]
  children?: Record<string, SetupConfig>
  computed?: Record<string, any> | { get: () => any; set: (...args: Array<any>) => any }
  [index: string]: any
}

interface Config {
  onMounted?: () => void
  onUnmounted?: () => void
  props?: Readonly<ComponentPropsOptions>
  setup: Record<string, SetupConfig>
  watchEffect?: (onCleanup?: OnCleanup) => void
  watch?: Record<
    string,
    | WatchCallback
    | ({
        handler: WatchCallback | string
      } & WatchOptions)
  >
}

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

type _Ajaxconfig<A extends keyof DtoMap, D extends DataType> = {
  action: A
  data?: D
  converter?: any
  by?: string
  loading?: boolean
  pagination?: boolean
  params?: (params: { paths?: (string | number | undefined)[]; payload?: any }) => void
}

type AjaxConfig = _Ajaxconfig<keyof DtoMap, DataType>

interface AjaxMethodOptions {
  addition?: any
  invokedByScroll?: boolean
  invokedByPagination?: boolean
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

type Ajax<C extends SetupConfig> = C['ajax'] extends AjaxConfig
  ? {
      [K in keyof Pick<C, 'ajax'>]: (
        options?: AjaxMethodOptions
      ) => Promise<C[K] extends { action: infer A; data: infer D } ? IData<A, D> : C extends { action: infer A } ? ClientDto<A>[] : never>
    } & AjaxData<C['ajax']> &
      AjaxLoading<C['ajax']> &
      AjaxPagination<C['ajax']>
  : {}

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
  [K in keyof C]: C[K] extends (...args: Array<any>) => any
    ? C[K]
    : C[K] extends Record<string, any>
    ? Ajax<C[K]> & Computed<C[K]['computed']> & Children<C[K]['children']> & Index<C[K]>
    : C[K]
}

const getDataFromExpresion = (data: any, expression: string): Record<string, any> => {
  return chain(data)
    .result(expression.substring(expression.startsWith('.') ? 1 : 0), {})
    .value()
}

const paginationInit = () => {
  return {
    itemCount: 0,
    pageCount: 0,
    pageIndex: 1,
    pageSize: 20
  }
}

const ajax = function <C extends SetupConfig>(this: any, config: C, expression: string): Ajax<C> {
  const origin: any = {}

  if (config.ajax) {
    if (isObject(config.ajax)) {
      const { loading, pagination, data } = config.ajax as AjaxConfig
      loading && (origin.loading = false)
      pagination && (origin.paging = paginationInit())
      data === 'array' && (origin.data = [])
      data === 'object' && (origin.data = {})
      data === 'string' && (origin.data = '')
    }

    if (!isArray(config.ajax)) config.ajax = [config.ajax]

    const { action, by, params, converter, data: dataType, pagination } = config.ajax[0]
    const [httpMethod, path] = action.split(' ')
    if (by) origin.by = by

    const app = getCurrentInstance()

    const method = async function (this: any, options?: AjaxMethodOptions) {
      if (!app?.appContext.config.globalProperties.$factory?.axios) {
        return Promise.reject(`please install factory in 'main.js/ts' and define axios options`)
      }

      const parent = getDataFromExpresion(this, expression)
      const _params: { paths?: (string | number)[]; payload?: any } = {}
      params?.call(this, _params)

      let index = 0
      let arc = {} as any
      let data = assign({}, (converter?.server as any)?.call(this, _params.payload) || _params.payload, options?.addition)
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
        const res = await app?.appContext.config.globalProperties.$factory.axios(arc)
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

export const factory = <C extends Config, P extends C['props']>(
  config: C & ThisType<Readonly<P extends ComponentPropsOptions ? ExtractPropTypes<P> : P> & Setup<C['setup']>>
) => {
  return defineComponent({
    props: config.props!,
    setup(props) {
      const proxy = chain(setup.call(null, config.setup, '')).assign(props).value()

      onMounted(() => config?.onMounted?.call(proxy))
      onUnmounted(() => config?.onUnmounted?.call(proxy))

      if (config?.watchEffect) watchEffect((onCleanup) => config?.watchEffect?.call(proxy, onCleanup))

      if (config.watch) {
        chain(config.watch)
          .entries()
          .forEach(([key, value]) => {
            watch(
              () => result(proxy, key) as any,
              isFunction(value) ? value.bind(proxy) : isFunction(value.handler) ? value.handler.bind(proxy) : () => {},
              value as WatchOptions
            )
          })
          .value()
      }

      return proxy as unknown as Readonly<P extends ComponentPropsOptions ? ExtractPropTypes<P> : P> & Setup<C['setup']>
    }
  })
}

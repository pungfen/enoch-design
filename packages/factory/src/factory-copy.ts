import { assign, chain, isArray, isFunction, isObject, isPlainObject } from 'lodash-es'
import { computed as vComputed, defineComponent, isProxy, isReadonly, onMounted, onUnmounted, reactive, type ComponentPropsOptions } from 'vue'
import Axios, { type AxiosRequestConfig } from 'axios'

interface DefinitionsActions {
  'GET /TEST': {
    Data: { name: string }
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type DataType = 'array' | 'object' | 'string' | 'none'
type ActionPath = `${HttpMethod} /${string}`

interface DtoMapValue<Server, Client> {
  server: Server
  client: Client
}

type DtoMap = {
  [Action in keyof DefinitionsActions]: Action extends ActionPath
    ? Action extends `${infer M} /${string}`
      ? DefinitionsActions[Action] extends {
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

type _AjaxConfig<A extends keyof DtoMap, D extends DataType> = {
  action: A
  data?: D
  params?: (params: { paths?: (string | number | undefined)[]; payload?: DtoMap[A]['server'] }) => void
  pagination?: boolean
  loading?: boolean
  by?: string
  converter?: any
}

interface AjaxMethodOptions {
  addition?: any
  invokedByScroll?: boolean
  invokedByPagination?: boolean
}

type AjaxConfig = _AjaxConfig<keyof DtoMap, DataType>

interface SetupConfig {
  ajax?: AjaxConfig | AjaxConfig[]
  children?: Record<string, SetupConfig>
  computed: Record<string, any>
  [index: string]: any
}

interface Config {
  components?: any
  onMounted?: () => void
  onUnmounted?: () => void
  props?: Readonly<ComponentPropsOptions<any>> & ThisType<void>
  setup: SetupConfig
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
  : C['ajax'] extends Array<AjaxConfig>
  ? {
      [K in keyof Pick<C, 'ajax'>]: (
        options?: AjaxMethodOptions
      ) => Promise<C[K] extends { action: infer A; data: infer D } ? IData<A, D> : C extends { action: infer A } ? ClientDto<A>[] : never>
    }
  : {}

type Index<C extends SetupConfig> = {
  [K in Exclude<keyof C, 'is' | 'ajax' | 'children'>]: C[K]
}

type Setup<C extends SetupConfig> = {
  [K in keyof C]: C[K] extends keyof any
    ? C[K]
    : C[K] extends (...args: any[]) => any
    ? C[K]
    : C[K] extends Record<string, any>
    ? Ajax<C[K]> & Index<C[K]> & Setup<C[K]['children']>
    : never
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

const ajax = function <C extends SetupConfig>(this: any, config: C, expression: string) {
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

    const method = async function (this: any, options?: AjaxMethodOptions) {
      const parent = getDataFromExpresion(this, expression)
      const _params: { paths?: (string | number)[]; payload?: any } = {}
      params?.call(this, _params)

      let index = 0
      let arc = {} as AxiosRequestConfig
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
        const res: any = await Axios(arc)
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

const computed = function <C extends SetupConfig>(this: any, config: C, expression: string) {
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

const children = function <C extends SetupConfig>(this: any, config: C, expression: string) {
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

const index = function <C extends SetupConfig>(this: any, config: C, expression: string) {
  const origin: any = {}
  chain(config)
    .entries()
    .forEach(([name, value]) => {
      if (isProxy(value) && isReadonly(value)) return (origin[name] = value)
      if (['children', 'ajax', 'computed', 'initializer', 'is'].includes(name)) return
      origin[name] = isPlainObject(value) ? setup.call(this, value, `${expression}.${name}`) : isFunction(value) ? value.bind(this) : value
    })
    .value()
  return origin
}

const setup = function <C extends SetupConfig>(this: any, config: C, expression: string) {
  const origin: any = this ? {} : reactive({})
  chain(origin)
    .assign(ajax.call(this || origin, config, expression))
    .assign(computed.call(this || origin, config, expression))
    .assign(children.call(this || origin, config, expression))
    .assign(index.call(this || origin, config, expression))
    .value()
  return origin
}

export const factory = <C extends Config>(config: C & ThisType<Setup<C['setup']> & C['props']>) => {
  return defineComponent({
    components: config.components,
    props: config.props,
    setup(props) {
      const proxy = assign(setup.call(null, config.setup, ''), props)

      onMounted(() => config?.onMounted?.call(proxy))
      onUnmounted(() => config?.onUnmounted?.call(proxy))

      return proxy
    }
  })
}

let c = defineComponent({
  setup() {
    return { c: 2 }
  }
})

let xx = defineComponent({
  components: { c }
})

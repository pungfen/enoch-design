interface DtoMapValue<Server, Client> {
  server: Server
  client: Client
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type _DtoMap<Action extends `${HttpMethod} /${string}`, Data = any, Params = any> = Action extends `${infer M} /${string}`
  ? Record<
      Action,
      M extends 'GET'
        ? DtoMapValue<Params, Data>
        : M extends 'POST'
        ? DtoMapValue<Data, number>
        : M extends 'PUT'
        ? DtoMapValue<Data, void>
        : M extends 'DELETE'
        ? DtoMapValue<void, void>
        : never
    >
  : never

interface DtoMap extends _DtoMap<'GET /test', Test> {}

interface Test {
  name: string
}

type DataType = 'object' | 'array' | 'none'

type _AjaxConfig<A, D> = A extends keyof DtoMap
  ? D extends DataType
    ? {
        action: A
        data: D
        loading?: true
        pagination?: true
        params?: (params: { paths?: (string | number)[]; payload?: DtoMap[A]['server'] }) => void
        converter?: {
          server?: (payload: DtoMap[A]['server']) => DtoMap[A]['server'] | void
          client?: (data: D extends 'object' ? ClientDto<A> : ClientDto<A>[]) => (D extends 'object' ? ClientDto<A> : ClientDto<A>[]) | void
        }
      }
    : never
  : never

type AjaxConfig = _AjaxConfig<keyof DtoMap, DataType>

type AjaxMethodOptions = {
  invokedByScroll: boolean
}

export interface Config {
  ajax?: Record<string, AjaxConfig>
  children?: Record<string, Config>
  [index: string]: any
}

type ClientDto<A> = A extends keyof DtoMap ? DtoMap[A]['client'] : never

type BlockData<A, D> = D extends 'array' ? ClientDto<A>[] : D extends 'object' ? ClientDto<A> : never

type AjaxData<U> = Extract<U, { data: 'array' } | { data: 'object' }> extends {
  action: infer A
  data: infer D
}
  ? BlockData<A, D> extends never
    ? {}
    : { data: BlockData<A, D> }
  : never

type AjaxLoading<U> = Extract<U, { loading: true }> extends never ? {} : { loading: boolean }

type AjaxPagination<U> = Extract<U, { pagination: true }> extends never
  ? {}
  : { paging: { itemCount: number; pageCount: number; pageIndex: number; pageSize: number } }

type AjaxMethod<C> = {
  [P in keyof C]: () => Promise<
    C[P] extends { action: infer A; data: infer D } ? BlockData<A, D> : C[P] extends { action: infer A } ? ClientDto<A>[] : never
  >
}

type Ajax<T extends Config> = T['ajax'] extends Record<string, infer U>
  ? AjaxData<U> & AjaxLoading<U> & AjaxPagination<U> & AjaxMethod<T['ajax']>
  : {}

type Children<T extends Config> = {
  [P in keyof T['children']]: Block<T['children'][P]>
}

type Index<T extends Config> = {
  [P in Exclude<keyof T, 'ajax' | 'children'>]: T[P]
}

export type Block<T extends Config> = Ajax<T> & Children<T> & Index<T>

export const ajax = <T extends Config>(config: T) => {
  const origin = {}

  if (config.ajax) {
    Object.entries(config.ajax).forEach(([methodName, ajaxConfig]) => {
      const [httpMethod, path] = ajaxConfig.action.split(' ')
    })
  }

  return origin
}

export const block = <T extends Config>(config: T): Block<T> => {
  const origin: any = {}

  Object.assign(config, ajax(config))

  return origin
}

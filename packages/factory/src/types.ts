type method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type DataType = 'array' | 'object' | 'string' | 'number' | 'none'
type ActionPath = `${method} /${string}`

export interface DataResponse<T> {
  confirmations: any[]
  data: T
  meta?: { paging?: { pageIndex: number; pageSize: number; itemCount: number; pageCount: number } }
  errors: { reason: string; code: string; message: string; shouldNotNotification?: boolean }[]
}

interface FactoryAjaxActions {
  'GET /enocloud/service/query': {
    client: { name: string }
    payload: { name: string }
  }
}

interface PathsMap<Client, Payload, Paths> {
  client: Client
  payload: Payload
  paths: Paths
}

type _AjaxActionMap<Action extends ActionPath, Client = any, Payload = any, Paths = any> = Action extends `${infer M} /${string}`
  ? M extends 'GET'
    ? PathsMap<Client, Payload, Paths>
    : M extends 'POST'
    ? PathsMap<number, Payload, Paths>
    : M extends 'PUT'
    ? PathsMap<void, Payload, Paths>
    : M extends 'DELETE'
    ? PathsMap<void, void, Paths>
    : never
  : never

type AjaxActionMap = {
  [Action in keyof FactoryAjaxActions]: _AjaxActionMap<
    Action,
    FactoryAjaxActions[Action] extends { client?: infer C } ? C : never,
    FactoryAjaxActions[Action] extends { payload?: infer P } ? P : never,
    FactoryAjaxActions[Action] extends { paths: infer P } ? P : never
  >
}

type _AjaxConfig<A extends keyof AjaxActionMap, D> = D extends DataType
  ? {
      action: A
      data?: D
      loading?: true
      pagination?: true
      params?: (params: { payload?: AjaxActionMap[A]['payload']; paths?: AjaxActionMap[A]['paths'] }) => void
      converter?: {
        client?: (data: any) => void
        server?: (payload: AjaxActionMap[A]['payload']) => AjaxActionMap[A]['payload'] | void
      }
    }
  : never

type AjaxConfig = _AjaxConfig<keyof AjaxActionMap, DataType>

export interface FactoryConfig {
  ajax?: Record<string, AjaxConfig>
  children?: Record<string, FactoryConfig>
  computed?: Record<string, any>
  [index: string]: any
}

export interface FactoryOptions {
  props?: any
  mounted?: () => void
  unmounted?: () => void
}

type ClientDto<A> = A extends keyof AjaxActionMap ? AjaxActionMap[A]['client'] : never

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

type Ajax<C extends FactoryConfig> = C['ajax'] extends Record<string, infer U>
  ? AjaxData<U> &
      AjaxLoading<U> &
      AjaxPagination<U> & {
        [K in keyof C['ajax']]: () => Promise<C['ajax'][K] extends { action: infer A; data: infer D } ? DataResponse<BlockData<A, D>> : never>
      }
  : {}

type Computed<C extends FactoryConfig> = {
  [K in keyof C['computed']]: C['computed'][K] extends (...args: any[]) => any ? ReturnType<C['computed'][K]> : never
}

type Index<C extends FactoryConfig> = {
  [K in Exclude<keyof C, 'ajax' | 'children' | 'computed'>]: C[K]
}

type Children<C extends FactoryConfig> = {
  [K in keyof C['children']]: C['children'][K] extends FactoryConfig ? Block<C['children'][K]> : {}
}

export type Block<C extends FactoryConfig> = Index<C> & Children<C> & Ajax<C> & Computed<C>

export interface AjaxMethodOptions {
  invokedByPagination?: boolean
  invokedByScroll?: boolean
  addition?: Record<string, any>
}

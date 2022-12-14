type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type DataType = 'array' | 'object' | 'string' | 'number' | 'none'
type ActionPath = `${Method} /${string}`

export interface FactoryAjaxActions {}

interface PathsMap<R, Q, B, P> {
  response: R
  query: Q
  body: B
  path: P
}

type _AjaxActionMap<Action extends ActionPath, R = any, Q = any, B = any, P = any[]> = Action extends `${infer M} /${string}`
  ? M extends 'GET'
    ? PathsMap<R, Q, void, P>
    : M extends 'POST'
    ? PathsMap<number, void, B, P>
    : M extends 'PUT'
    ? PathsMap<void, void, B, P>
    : M extends 'DELETE'
    ? PathsMap<void, void, B, P>
    : never
  : never

type AjaxActionMap = {
  [Action in keyof FactoryAjaxActions]: _AjaxActionMap<
    Action,
    FactoryAjaxActions[Action] extends {
      responses: {
        200: {
          schema: infer R
        }
      }
    }
      ? R
      : never,
    FactoryAjaxActions[Action] extends {
      parameters: {
        query: infer Q
      }
    }
      ? Q
      : never,
    FactoryAjaxActions[Action] extends {
      parameters: {
        body: infer B
      }
    }
      ? B extends { data: infer D }
        ? D extends Array<infer B>
          ? B
          : never
        : never
      : never,
    FactoryAjaxActions[Action] extends {
      parameters: {
        path: infer P
      }
    }
      ? P
      : never
  >
}

type _AjaxConfig<A, D> = A extends keyof AjaxActionMap
  ? D extends DataType
    ? {
        action: A
        data?: D
        loading?: true
        pagination?: true
        params?: (params: { query?: AjaxActionMap[A]['query']; body?: any; path?: AjaxActionMap[A]['path'] }) => void
        converter?: {
          client?: (data: any) => void
          server?: (params: { query?: AjaxActionMap[A]['query']; body?: AjaxActionMap[A]['body']; path?: AjaxActionMap[A]['path'] }) => void
        }
      }
    : never
  : never

type AjaxConfig = {
  action: keyof AjaxActionMap
  data: DataType
  loading?: true
  pagination?: true
  params?: (params: { query?: any; body?: any; path?: any }) => void
  converter?: {
    client?: (data: any) => void
    server?: (data: any) => void
  }
}

export interface FactoryConfig {
  ajax?: Record<string, AjaxConfig>
  children?: Record<string, FactoryConfig>
  computed?: Record<string, any>
  [index: string]: any
}

export interface FactoryOptions {
  debug?: boolean
  props?: any
  mounted?: () => void
  unmounted?: () => void
}

type ClientDto<A> = A extends keyof AjaxActionMap
  ? AjaxActionMap[A]['response'] extends { data: infer R }
    ? R extends Array<infer F>
      ? F
      : never
    : never
  : never

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
        [K in keyof C['ajax']]: (
          options?: AjaxMethodOptions
        ) => Promise<C['ajax'][K] extends { action: infer A } ? (A extends keyof AjaxActionMap ? AjaxActionMap[A]['response'] : unknown) : unknown>
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

export type Block<C extends FactoryConfig> = Index<C> & Children<C> & Ajax<C> & Computed<C> & Internal

export type Internal = {
  refs: Record<string, any>
}

export interface AjaxMethodOptions {
  invokedByPagination?: boolean
  invokedByScroll?: boolean
  addition?: Record<string, any>
}

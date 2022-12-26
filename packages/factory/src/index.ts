import { computed as vComputed, defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive } from 'vue'
import Axios from 'axios'

import type { App, ComputedGetter } from 'vue'
import type { AxiosResponse, AxiosInterceptorOptions, AxiosRequestConfig } from 'axios'
import type { AjaxMethodOptions, Block, FactoryConfig, FactoryOptions } from './types'
import { assign, chain, entries, forEach, get, isFunction, trimStart } from 'lodash-es'

interface InstallOptionsAxios {
  config?: AxiosRequestConfig
  interceptors?: {
    response: {
      onFulfilled?: (value: AxiosResponse) => Promise<AxiosResponse>
      onRejected?: (error: any) => any
      options?: AxiosInterceptorOptions
    }
  }
}

export interface InstallOptions {
  ajax: InstallOptionsAxios
  store: Record<string, any>
  plugins?: Record<string, any>
}

export const createFactory = (options?: InstallOptions) => {
  return {
    install: (app: App) => {
      const axios = Axios.create(options?.ajax.config)

      axios.interceptors.response.use(
        options?.ajax.interceptors?.response.onFulfilled,
        options?.ajax.interceptors?.response.onRejected,
        options?.ajax.interceptors?.response.options
      )

      app.config.globalProperties.$factory = { axios, store: options?.store, ...options?.plugins }
    }
  }
}

export * from './types'

const ajax = (config: FactoryConfig, expression: string, state: any) => {
  const origin: any = {}
  if (config.ajax) {
    chain(config.ajax)
      .entries()
      .forEach(([key, value]) => {
        const { action, converter, data: dataType, loading, params, pagination } = value

        switch (dataType) {
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

        const method = async function (this: any, options?: AjaxMethodOptions) {
          const instance = getCurrentInstance()
          const parent = get(state, trimStart(expression, '.'))
          const [httpMethod, path] = action.split(' ')
          const _params: { payload?: any; path?: any } = {}
          params?.call(state, _params)
          const url = path
            .split('/')
            .map((str) => (str.startsWith(':') ? _params.path[str.replace(':', '')] : str))
            .join('/')
          let data = (converter?.server as (payload: any) => any)?.call(this, _params.payload) || _params.payload

          if (options?.invokedByScroll && pagination) {
            assign(parent.paging, { pageIndex: parent.paging.pageIndex++ })
          }

          if (options?.invokedByPagination && pagination) {
            data = assign({}, data, parent.paging)
          }

          data = assign({}, data, options?.addition)

          const requestOptions: any = {}
          requestOptions.method = httpMethod
          switch (httpMethod.toLowerCase()) {
            case 'get':
              requestOptions.params = data
              break
            case 'post':
            case 'put':
            case 'delete':
              requestOptions.data = data
              break
          }

          if (loading) parent.loading = true
          try {
            const res = await instance?.appContext.config.globalProperties.$factory.axios(url, requestOptions)

            switch (dataType) {
              case 'array':
                parent.data = res.data.data
                if (res.data.meta.paging && pagination) parent.paging = res.data.meta.paging
                break
              case 'object':
                parent.data = res.data.data[0]
                break
            }

            return Promise.resolve(res)
          } catch (err) {
            return Promise.reject(err)
          } finally {
            if (loading) parent.loading = false
          }
        }

        origin[key] = method.bind(state)
      })
      .value()
  }
  return origin
}

const computed = (config: FactoryConfig, expression: string, state: any) => {
  const origin: any = {}
  if (config.computed) {
    chain(config.computed)
      .entries()
      .forEach(([key, value]) => {
        origin[key] = vComputed((isFunction(value) ? value.bind(state) : value) as ComputedGetter<any>)
      })
      .value()
  }
  return origin
}

const children = (config: FactoryConfig, expression: string, state: any) => {
  const origin: any = {}
  if (config.children) {
    chain(config.children)
      .entries()
      .forEach(([key, value]) => {
        origin[key] = block(value, `${expression}.${key}`, state)
      })
      .value()
  }
  return origin
}

const index = (config: FactoryConfig, expression: string, state: any) => {
  const origin: any = {}
  forEach(entries(config), ([key, value]) => {
    if (['ajax', 'children', 'computed', 'watch'].includes(key)) return
    origin[key] = isFunction(value) ? value.bind(state) : value
  })
  return origin
}

const block = (config: FactoryConfig, expression: string, state: any) => {
  const origin: any = {}
  assign(
    origin,
    ajax(config, expression, state),
    children(config, expression, state),
    index(config, expression, state),
    computed(config, expression, state)
  )
  return origin
}

export const factory = <C extends FactoryConfig>(config: C & ThisType<Block<C>>, options?: FactoryOptions & ThisType<Block<C>>) => {
  return defineComponent<any, Block<C>, unknown, {}, {}, any, any, {}, string, {}, string>({
    components: options?.components,

    props: options?.props,

    setup() {
      const instance = getCurrentInstance()
      const state = reactive({})
      assign(state, block(config, '', state), { store: instance?.appContext.config.globalProperties.$factory.store })
      onMounted(() => options?.mounted?.call(state))
      onUnmounted(() => options?.unmounted?.call(state))
      return reactive(state) as Block<C>
    }
  })
}

import { computed as _computed, getCurrentInstance } from 'vue'
import { assign, bind, entries, forEach, get, isFunction, trimStart } from 'lodash-es'
import type { AjaxMethodOptions, DataResponse, FactoryConfig } from './types'

const index = function <C extends FactoryConfig>(this: any, config: C, expression: string, data: any) {
  const origin: any = {}
  Object.entries(config).forEach(([key, value]) => {
    if (['ajax', 'children', 'computed', 'watch'].includes(key)) return
    origin[key] = isFunction(value) ? bind(value, data) : value
  })
  return origin
}

const children = function <C extends FactoryConfig>(this: any, config: C, expression: string, data: any) {
  const origin: any = {}
  if (config.children) {
    forEach(entries(config.children), ([key, value]) => (origin[key] = block.call(data, value, `${expression}.${key}`, data)))
  }
  return origin
}

const ajax = function <C extends FactoryConfig>(this: any, config: C, expression: string, data: any) {
  const origin: any = {}

  if (config.ajax) {
    forEach(entries(config.ajax), ([key, value]) => {
      const app = getCurrentInstance()

      const { action, loading, params, data: dataType, pagination, converter } = value
      const [httpMethod, path] = action.split(' ')
      dataType === 'array' && (origin.data = [])
      dataType === 'object' && (origin.data = {})
      dataType === 'string' && (origin.data = '')
      pagination && (origin.paging = { pageCount: 0, itemCount: 0, pageIndex: 0, pageSize: 0 })

      const method = async function (this: any, options: AjaxMethodOptions = {}) {
        const parent: any = get(this, trimStart(expression, '.'))

        const _params: { query?: any; body?: any; path?: any } = {}
        params?.call(this, _params)

        const url = path
          .split('/')
          .map((str) => (str.startsWith(':') ? _params.path[str.replace(':', '')] : str))
          .join('/')

        let data = (converter?.server as (payload: any) => any)?.call(this, _params.body) || _params.body

        if (options.invokedByScroll && pagination) {
          parent.paging.pageIndex++
          data = assign({}, data, parent.paging)
        }

        if (loading) parent.loading = true

        const request = app?.appContext.config.globalProperties.$factory.ajax.instance

        try {
          const res = (await request(url, { method: httpMethod, data, params })).data

          switch (dataType) {
            case 'array':
              res.data = res.data || []
              res.data = (converter?.client as any)?.call(this, res.data) || res.data
              if (pagination && (options.invokedByPagination || options.invokedByScroll)) {
                parent.data = [...parent.data, ...res.data]
              } else {
                parent.data = res.data
              }
              break
            case 'object':
              res.data = res.data || {}
              res.data = (converter?.client as any)?.call(this, res.data) || res.data
              parent.data = res.data
              break
          }

          if (res.meta?.paging) parent.paging = res.meta.paging

          return Promise.resolve(res)
        } catch (err) {
          return Promise.reject(err)
        } finally {
          if (loading) parent.loading = false
        }
      }

      origin[key] = bind(method, data)
    })
  }

  return origin
}

const computed = function <C extends FactoryConfig>(this: any, config: C, expression: string, data: any) {
  const origin: any = {}

  if (config.computed) {
    forEach(entries(config.computed), ([key, value]) => {
      if (isFunction(value)) origin[key] = _computed(bind(value, data))
    })
  }

  return origin
}

export const block = function <C extends FactoryConfig>(this: any, config: C, expression: string, data: any) {
  const origin = {}

  assign(
    origin,
    index.call(origin, config, expression, data),
    children.call(origin, config, expression, data),
    ajax.call(origin, config, expression, data),
    computed.call(origin, config, expression, data)
  )

  return origin
}

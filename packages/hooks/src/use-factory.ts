import {
  getCurrentInstance,
  reactive,
  useSlots,
  inject,
  isReadonly,
  toRaw,
  isRef,
  nextTick,
  watch,
  onMounted,
  onUnmounted,
  onBeforeUpdate,
  computed
} from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate, type RouteLocationNormalizedLoaded, type Router } from 'vue-router'

import _ from 'lodash'

import { FactoryConfigInjectionKey, type FactoryConfigCtx } from './config'

type FactoryConfig<Config extends object = object> = ThisType<any> & any
type UseFactoryReturn<Config extends object = object> = ThisType<any> & any

const configIndexs = ['ajax', 'initializer', 'ruiles']
const hookIndexs = ['watch', 'computed', 'onMounted', 'onBeforeRouteUpdate', 'onBeforeRouteLeave', 'onBeforeRouteLeave']
const indexs = _.concat(configIndexs, hookIndexs)
const nullFunction = () => {}

const convertAjaxMethodParamsConfig = function (this: Record<string, any>, expression: any): any {
  let params = {}
  if (_.isString(expression)) params = _.get(this, expression)
  else if (_.isFunction(expression)) params = expression.call(this)
  else if (_.isArray(expression)) params = _.reduce(params, (result, value) => _.assign(result, convertAjaxMethodParamsConfig.call(this, value)), {})
  if (_.isPlainObject(params)) params = _.assign(params)
  return params
}

const convertAjaxConfigProcessor = function (
  this: Record<string, any>,
  expression: string,
  config: Record<PropertyKey, any>,
  data: Record<PropertyKey, any>
) {
  const convert = ([actionType, actionConfig]: [string, any]) => {
    if (!_.isArray(actionConfig)) actionConfig = [actionConfig]

    const { discriminant } = actionConfig[0]
    if (discriminant) data.discriminant = discriminant

    const method = async function (
      this: Record<string, any>,
      //@ts-ignore
      { addition, delay = true, silent = false, invokedByPagination = false, invokedByScroll = false, resetParams = false }: any = {}
    ) {
      if (delay) {
        setTimeout(() => {
          return Promise.resolve(null)
        }, 0)
      }
      const model = _.get(this, _.trimStart(expression, '.'))
      const modelRef = model.ref

      if (_.eq(actionType, 'submit')) {
        let valid = (await modelRef?.validate()) || true
        if (!valid) return Promise.reject(valid)
      }

      let config = _.isArray(actionConfig)
        ? (_.eq(actionType, 'submit')
            ? model.data.id
              ? _.find(actionConfig, (config) => _.startsWith(config.action, 'PUT'))
              : _.find(actionConfig, (config) => _.startsWith(config.action, 'POST'))
            : _.find(actionConfig, (config) => _.eq(config.discriminant, model.discriminant))) || actionConfig[0]
        : actionConfig

      let { params, action, convert } = config
      let [httpVerb, path] = _.split(action, ' ')
      const rawParamsisFunction = _.isFunction(params)
      if (!_.isArray(params)) params = [params]
      params = _.map(params, (param) => convertAjaxMethodParamsConfig.call(this, param))
      if (_.isArray(params[0]) && rawParamsisFunction) params = params[0]

      if (_.isPlainObject(addition)) {
        const lastParam = params.pop()
        if (_.isPlainObject(lastParam)) {
          params.push(invokedByPagination ? _.assign({}, lastParam, addition) : _.assign(lastParam, addition))
        } else {
          if (lastParam) params.push(lastParam)
          params.push(addition)
        }
      }

      model.$_params = params
      if (resetParams) return

      if (convert && _.isFunction(convert.server)) {
        const lastParam = params.pop()
        params.push(convert.server.call(this, lastParam) || lastParam)
      }

      let method = httpVerb.toLowerCase()
      const [, target] = path.split('/')
      let url = ['enospray', 'enoquote'].includes(target) ? '' : '/enocloud'

      path.split('/').forEach((str) => str && (url += `/${_.startsWith(str, ':') ? _.head(params) && _.pullAt(params, 0) : str}`))
      params = params[0]

      const arc = { method, url } as Record<string, any>

      switch (method) {
        case 'put':
        case 'post':
          arc.data = { data: _.concat(params) }
          break
        case 'get':
        case 'delete':
          arc.params = params
          break
      }

      !silent && (model.loading = true)

      const cbs = [
        (res: any) => {
          !silent && (model.loading = false)
          return Promise.resolve(res)
        },
        (err: any) => {
          !silent && (model.loading = false)
          return Promise.reject(err)
        }
      ]

      if (_.eq(actionType, 'get')) {
        cbs[0] = (res) => {
          model.loading = false
          const {
            meta: { paging }
          } = res
          let data = _.isArray(model.data) ? (invokedByScroll ? _.concat(res.data, model.data) : res.data) : res.data[0]
          model.data = convert?.client?.call(this, data, res) || data
          if (paging) model.paging = paging
          modelRef?.clearValidate?.()
          return Promise.resolve(res)
        }
      }

      return () => {}
    }

    data[actionType] = method.bind(this)
  }

  _.forEach(_.entries(config), convert)
}

const convertInitializerConfigProcessor = function (this: Record<string, any>, expression: string, config: Function, data: Record<PropertyKey, any>) {
  data.data = config()
  data.initializer = config
  data.init = async () => {
    data.data = config()
    await nextTick()
    _.eq(_.get(data, 'type'), 'form') && _.get(data, 'ref')?.clearValidate
  }
}

const convertHookConfigProcessor = function (this: Record<string, any>, expression: string, config: Function, hookName: string) {
  if (
    hookName === 'onMounted' ||
    hookName === 'onUnmounted' ||
    hookName === 'onBeforeUpdate' ||
    hookName === 'onBeforeRouteUpdate' ||
    hookName === 'onBeforeRouteLeave'
  ) {
    if (_.isFunction(config)) {
      this.$hooks[hookName][_.trimStart(expression, '.')] = _.bind(config, this)
    }
  } else {
    _.forEach(_.entries(config), ([subKey, subConfig]) => {
      const source = expression
      const key = _.trimStart(`${expression}.${subKey}`, '.')
      let cb
      switch (hookName) {
        case 'watch':
          cb = _.bind(
            _.isPlainObject(subConfig) ? _.get(subConfig, 'handler', nullFunction) : _.isFunction(subConfig) ? subConfig : nullFunction,
            this
          )
          break
        case 'computed':
          cb = _.isPlainObject(subConfig)
            ? {
                get: _.bind(_.get(subConfig, 'get', nullFunction), this),
                set: _.bind(_.get(subConfig, 'set', nullFunction), this)
              }
            : _.isFunction(subConfig)
            ? _.bind(subConfig, this)
            : nullFunction
          break
      }

      const options = _.isPlainObject(subConfig) ? _.pick(subConfig, ['immediate', 'deep']) : {}
      this.$hooks[hookName][key] = _.get(this.$hooks[hookName], key)
        ? _.concat(toRaw(_.get(this.$hooks[hookName], key)), [{ source, cb, options }])
        : { source, cb, options }
    })
  }
}

const convertConfig = function (this: Record<string, any>, expression: string, config: Record<PropertyKey, any>, data: Record<PropertyKey, any>) {
  const convert = ([subKey, subConfig]: [string, any]) => {
    if (_.includes(indexs, subKey)) {
      switch (subKey) {
        case 'ajax':
          convertAjaxConfigProcessor.call(this, expression, subConfig, data)
          break
        case 'initializer':
          convertInitializerConfigProcessor.call(this, expression, subConfig, data)
          break
        case 'rules':
          data.rules = subConfig
          break
        case 'watch':
        case 'computed':
        case 'onMounted':
        case 'onBeforeRouteUpdate':
        case 'onBeforeRouteLeave':
          convertHookConfigProcessor.call(this, expression, subConfig, subKey)
          break
      }
    } else {
      const key = _.trimStart(`${expression}.${subKey}`, '.')
      if (subConfig) {
        if (isRef(subConfig) as any) {
          if (_.get(subConfig, '__v_isRef') && _.has(subConfig, '__v_isReadonly')) {
            if (!_.has(subConfig.effect.fn, 'prototype')) {
              console.error(`you can't define arrow function in factory config when value is ComputedRef`)
            }
            let cb = {
              get: _.bind(subConfig.effect.fn, this),
              set: _.bind(subConfig._setter, this)
            }
            return _.set(
              this.$hooks.computed,
              key,
              _.get(this.$hooks.computed, key)
                ? _.concat(toRaw(_.get(this.$hooks.computed, key)), [{ source: expression, cb, options: {} }])
                : { source: expression, cb, options: {} }
            )
          }
          return _.set(data, subKey, subConfig)
        }
        if (isReadonly(subConfig)) {
          const recursion = function (this: Record<PropertyKey, any>, config: any, expression: string, target: Record<PropertyKey, any>) {
            _.forEach(_.entries(config), ([subKey, subConfig]) => {
              _.set(target, _.trimStart(`${expression}.${subKey}`, '.'), {})
              if (!_.isPlainObject(subConfig)) {
                if (_.isFunction(subConfig)) {
                  return _.set(target, _.trimStart(`${expression}.${subKey}`, '.'), _.bind(subConfig, this))
                }
                return _.set(target, _.trimStart(`${expression}.${subKey}`, '.'), subConfig)
              }

              recursion.call(this, subConfig, _.trimStart(`${expression}.${subKey}`, '.'), target)
            })

            return target
          }

          return (data[subKey] = _.isPlainObject(subConfig) ? recursion.call(this, subConfig, '', {}) : subConfig)
        }
        const subData = (data[subKey] = data[subKey] || reactive({}))
        switch (subConfig.type) {
          case 'table':
            subData.data = []
            subData.paging = {
              itemCount: 0,
              pageCount: 0,
              pageIndex: 1,
              pageSize: 20
            }
            subData.loading = false
            subData.currentRow = null
            subData.currentChange = (currentRow: any) => (subData.currentRow = currentRow)
            subData.ref = null
            subData.setRef = (el: any) => (subData.ref = el)
            break
          case 'tree':
            subData.data = []
            subData.loading = false
            subData.currentRow = null
            subData.currentChange = (currentRow: any) => (subData.currentRow = currentRow)
            subData.ref = null
            subData.setRef = (el: any) => (subData.ref = el)
            break
          case 'form':
            subData.data = {}
            subData.ref = null
            subData.setRef = (el: any) => (subData.ref = el)
            break
          case 'drawer':
          case 'dialog':
            subData.visible = false
            subData.open = () => (subData.visible = true)
            subData.close = () => (subData.visible = false)
            break
          default:
            if (!_.isPlainObject(subConfig)) {
              if (_.isFunction(subConfig)) {
                return _.set(data, subKey, _.bind(subConfig, this))
              }
              return _.set(data, subKey, subConfig)
            }
        }
        convertConfig.call(this, `${expression}.${subKey}`, subConfig, subData)
      } else {
        return (data[subKey] = null)
      }
    }
  }

  _.forEach(_.entries(config), convert)
}

const makeHookEffective = function (this: Record<string, any>, config: Record<string, any>) {
  _.forEach(_.entries(config), ([hookName, hookConfig]) => {
    _.entries(hookConfig).forEach(([subKey, subConfig]) => {
      if (!_.isArray(subConfig)) subConfig = [subConfig]
      _.forEach(subConfig as any[], (hookSubConfig) => {
        if (hookName === 'watch') {
          watch(() => _.get(this, subKey), _.isFunction(hookSubConfig.cb) ? hookSubConfig.cb : nullFunction, hookSubConfig.options)
        } else if (hookName === 'computed') {
          _.set(this, subKey, computed(hookSubConfig.cb))
        } else if (hookName === 'onMounted') onMounted(hookSubConfig)
        else if (hookName === 'onBeforeUpdate') onBeforeUpdate(hookSubConfig)
        else if (hookName === 'onUnmounted') onUnmounted(hookSubConfig)
        else if (hookName === 'onBeforeRouteUpdate') onBeforeRouteUpdate(hookSubConfig)
        else if (hookName === 'onBeforeRouteLeave') onBeforeRouteLeave(hookSubConfig)
      })
    })
  })
}

export const useFactory = <Config extends object>(config: FactoryConfig<Config>): UseFactoryReturn<Config> => {
  const factoryConfig = inject<FactoryConfigCtx>(FactoryConfigInjectionKey)

  const vm = getCurrentInstance()
  const slots = useSlots()
  const route = useRoute()
  const router = useRouter()

  const state = reactive(config)
  convertConfig.call(state, '', config, state)

  _.assign(state, {
    route,
    router,
    store: factoryConfig?.store,
    $emit: vm?.emit,
    $slots: slots,
    setRef: (expression: string) => (el: any) => {
      el && _.set(state, expression, el)
    },
    $hooks: hookIndexs.reduce((acc, key) => ({ ...acc, [key]: {} }), {} as Record<string, any>)
  })

  makeHookEffective.call(state, state.$hooks)

  return state
}

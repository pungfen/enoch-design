import { assign, bind, entries, forEach, isFunction } from 'lodash-es'
import { onMounted, onUnmounted, reactive } from 'vue'
import type { FactoryConfig, FactoryOptions } from './types'

export const index = function <C extends FactoryConfig>(this: any, config: C) {
  const origin: any = {}
  Object.entries(config).forEach(([key, value]) => {
    if (['ajax', 'children', 'initializer', 'watch'].includes(key)) return
    origin[key] = isFunction(value) ? bind(value, this) : value
  })
  return origin
}

export const children = function <C extends FactoryConfig>(this: any, config: C) {
  const origin: any = {}
  if (config.children) {
    forEach(entries(config.children), ([key, value]) => (origin[key] = block.call(this, value)))
  }
  return origin
}

export const block = function <C extends FactoryConfig>(this: any, config: C) {
  const origin = this ? reactive({}) : {}

  assign(origin, index.call(origin, config), children.call(origin, config))

  return origin
}

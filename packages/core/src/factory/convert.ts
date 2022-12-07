import { assign, bind, entries, forEach, isFunction } from 'lodash-es'
import { onMounted, onUnmounted, reactive } from 'vue'
import type { FactoryConfig, FactoryOptions } from './types'

export const index = <C extends FactoryConfig>(config: C, root: Record<string, any>) => {
  const origin: any = {}
  Object.entries(config).forEach(([key, value]) => {
    if (['ajax', 'children', 'initializer', 'watch'].includes(key)) return
    origin[key] = isFunction(value) ? bind(value, root) : value
  })
  return origin
}

export const children = <C extends FactoryConfig>(config: C, root: Record<string, any>) => {
  const origin: any = {}
  if (config.children) {
    forEach(entries(config.children), ([key, value]) => (origin[key] = block(value, root)))
  }
  return origin
}

export const block = <C extends FactoryConfig>(config: C, root: Record<string, any>) => {
  const origin: any = {}
  assign(origin, children(config, root), index(config, root))
  return origin
}

export const convert = <C extends FactoryConfig>(config: C) => {
  const origin = reactive({})
  assign(origin, block(config, origin))
  return origin
}

export const options = <O extends FactoryOptions>(options: O) => {
  onMounted(() => options?.mounted?.())
  onUnmounted(() => options?.unmounted?.())
}

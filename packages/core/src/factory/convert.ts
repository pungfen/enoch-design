import { onMounted, onUnmounted } from 'vue'
import type { FactoryConfig, FactoryOptions } from './types'

export const index = <C extends FactoryConfig>(config: C) => {
  const origin: any = {}
  Object.entries(config).forEach(([key, value]) => {
    if (['ajax', 'children', 'initializer'].includes(key)) return
    origin[key] = value
  })
  return origin
}

export const children = <C extends FactoryConfig>(config: C) => {
  const origin: any = {}
  if (config.children) {
    Object.entries(config.children).forEach(([key, value]) => (origin[key] = block(value)))
  }
  return origin
}

export const block = <C extends FactoryConfig>(config: C) => {
  const origin: any = {}
  Object.assign(origin, children(config), index(config))
  return origin
}

export const options = <O extends FactoryOptions>(options: O) => {
  onMounted(() => options?.mounted?.())
  onUnmounted(() => options?.unmounted?.())
}

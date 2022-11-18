import { reactive } from 'vue'
import { block } from './convert'
import type { FactoryConfig, FactoryOptions } from './types'

export const defineFactory = <C extends FactoryConfig, O extends FactoryOptions>(factoryConfig: C, factoryOptions?: O) => {
  const proxy = reactive({})
  block(factoryConfig)
  console.log(proxy)
  return proxy
}

import type { FactoryConfig, FactoryOptions } from './types'

export const defineFactory = <C extends FactoryConfig, O extends FactoryOptions>(factoryConfig: C, factoryOptions?: O) => {
  return factoryConfig
}

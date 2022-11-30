import type { FactoryConfig, FactoryOptions } from './types'

export const defineFactory = <C extends FactoryConfig, O extends FactoryOptions>(
  factoryConfig: C & ThisType<any>,
  factoryOptions?: O & ThisType<any>
) => {
  return factoryConfig
}

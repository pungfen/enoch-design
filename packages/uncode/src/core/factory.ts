import { normalizedConfig, type FactoryConfig } from './config'

export const defineFactory = (config: FactoryConfig) => {
  const _config = normalizedConfig(config)

  return _config
}

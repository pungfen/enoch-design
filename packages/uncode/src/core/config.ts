export interface FactoryConfig {
  el?: string
  children?: Record<string, FactoryConfig>
  [index: string]: any
}

export const normalizedConfig = (config: FactoryConfig) => {
  return config
}

export const defineFactoryComponent = (config: FactoryConfig) => {}

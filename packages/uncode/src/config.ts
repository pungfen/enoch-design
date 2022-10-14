export interface FactoryConfig {
  el: string
  [index: string]: any
}

export const definefactory = (config: FactoryConfig) => {
  return config
}

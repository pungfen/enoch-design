export interface FactoryConfig {
  children?: Record<string, FactoryConfig>
  [index: string]: any
}

export interface FactoryOptions {
  props?: any
  mounted?: () => void
  unmounted?: () => void
}

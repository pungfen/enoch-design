export interface FactoryConfig {
  children?: Record<string, FactoryConfig>
  [index: string]: any
}

export interface FactoryOptions {
  mounted?: () => void
  unmounted?: () => void
}

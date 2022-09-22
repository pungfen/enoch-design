type BlockType = 'table' | 'form'

interface FactoryConfig {
  children?: Record<string, FactoryConfig & { type?: BlockType }>
}

export const factory = (config: FactoryConfig) => {}

factory({
  children: {
    xx: {
      type: 'form',
      children: {
        yy: {}
      }
    }
  }
})

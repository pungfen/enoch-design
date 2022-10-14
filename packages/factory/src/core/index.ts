import type { ComponentPublicInstance } from 'vue'

type Index = {}

type Children<C> = {}

type _FactoryConfig = {
  children?: Record<string, _FactoryConfig>
  [index: string]: any
}

interface FactoryConfig {
  name: string
  children?: Record<string, _FactoryConfig>
  mount?: () => void
  unmount?: () => void
}

export const factory = <FC extends FactoryConfig>(config: FC) => {}

factory({
  name: '',
  children: {
    header: {
      children: {}
    },
    form: {}
  }
})

import { computed, defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive } from 'vue'

import { block } from './convert'

import type { App } from 'vue'
import type { Block, FactoryConfig, FactoryOptions } from './types'
import { assign } from 'lodash-es'

export interface InstallOptions {
  ajax: { instance: any }
}

export const createFactory = (options?: InstallOptions) => {
  return {
    install: (app: App) => {
      app.config.globalProperties.$factory = { ...options }
    }
  }
}

export * from './convert'
export * from './types'

export const factory = <C extends FactoryConfig>(config: C & ThisType<Block<C>>, options?: FactoryOptions & ThisType<Block<C>>) => {
  return defineComponent<any, Block<C>, unknown, {}, {}, any, any, {}, string, {}, string>({
    props: options?.props,

    setup() {
      const instance = getCurrentInstance()
      const origin = reactive({})

      assign(origin, block.call(origin, config, '', origin), { refs: computed(() => instance?.refs) })

      onMounted(() => options?.mounted?.call(origin))
      onUnmounted(() => options?.unmounted?.call(origin))

      return origin as Block<C>
    }
  })
}

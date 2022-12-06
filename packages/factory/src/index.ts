import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'

import { block } from './convert'

import type { App } from 'vue'
import type { Block, DataResponse, FactoryConfig, FactoryOptions } from './types'
import { assign } from 'lodash-es'

export interface InstallOptions {
  paging?: { pageIndex: string; pageSize: string; itemCount: string; pageCount: string }
  ajax?: {
    headers?: Record<string, any>
    interceptor?: (response: DataResponse<unknown>) => Promise<unknown>
  }
}

export const createFactory = (options?: InstallOptions) => {
  return {
    install: (app: App) => {
      app.config.globalProperties.$factory = {
        ajax: options?.ajax
      }
    }
  }
}

export * from './convert'
export * from './types'

export const factory = <C extends FactoryConfig>(config: C & ThisType<Block<C>>, options?: FactoryOptions & ThisType<Block<C>>) => {
  return defineComponent<any, Block<C>, unknown, {}, {}, any, any, {}, string, {}, string>({
    props: options?.props,

    setup() {
      const origin = reactive({})

      assign(origin, block.call(origin, config, '', origin))

      onMounted(() => options?.mounted?.call(origin))
      onUnmounted(() => options?.unmounted?.call(origin))

      return origin as Block<C>
    }
  })
}

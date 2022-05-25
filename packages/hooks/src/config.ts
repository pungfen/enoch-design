import type { InjectionKey } from 'vue'
import type { DefineStoreOptions, StateTree, _GettersTree, _ActionsTree } from 'pinia'

export interface FactoryConfig {
  hooks: ('onMounted' | 'onUnmounted')[]
  store: Omit<DefineStoreOptions<string, StateTree, _GettersTree<any>, _ActionsTree>, 'id'>
}

export interface UserConfigFactory extends Partial<FactoryConfig> {}

export interface FactoryConfigCtx {
  config: UserConfigFactory
  store: any
}

export const FactoryConfigInjectionKey: InjectionKey<FactoryConfigCtx> = Symbol('FactoryConfigProvider')

export const getDefaultConfig = (): FactoryConfig => {
  return {
    hooks: ['onMounted', 'onUnmounted'],
    store: {
      state() {
        return {}
      }
    }
  }
}

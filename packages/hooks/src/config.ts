import type { InjectionKey, onMounted, onUnmounted } from 'vue'

export interface UserConfigFactory {
  onMounted?: typeof onMounted
  onUnmounted?: typeof onUnmounted
  hooks?: ('onMounted' | 'onUnmounted')[]
}

export interface FactoryConfigCtx {
  config: UserConfigFactory
}

export const FactoryConfigInjectionKey: InjectionKey<FactoryConfigCtx> = Symbol('FactoryConfigProvider')

export const getDefaultConfig = (): UserConfigFactory => {
  return {
    hooks: ['onMounted', 'onUnmounted']
  }
}

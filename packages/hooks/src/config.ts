import type { InjectionKey } from 'vue'

export interface UserConfigExport {}

export interface FactoryConfigCtx {}

export const FactoryConfigInjectionKey: InjectionKey<FactoryConfigCtx> = Symbol('FactoryConfig')

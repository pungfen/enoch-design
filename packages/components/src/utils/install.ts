import type { Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <C, E extends Record<string, any>>(com: C, extra?: E) => {
  ;(com as SFCWithInstall<C>).install = (app) => [com, ...Object.values(extra ?? {})].forEach((c) => app.component(c.name, c))

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) (com as any)[key] = comp
  }

  return com as SFCWithInstall<C> & E
}

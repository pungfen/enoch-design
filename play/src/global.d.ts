export {}

declare global {
  interface Definitions extends EnocloudAdminDefinitions {}
}

declare module '@enochfe/factory' {
  export interface FactoryAjaxActions extends AjaxActions {}
}

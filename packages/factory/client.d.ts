export {}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $factory: {
      fetch: {
        client?: (data: unknown, response: DataResponse<unknown>) => Promise<unknown>
        server?: (data: unknown) => Promise<unknown>
      }
    }
  }
}

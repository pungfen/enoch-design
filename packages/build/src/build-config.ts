export interface BuildConfig {
  build: {
    packageManager: 'pnpm'
  }
}

type DeepPartial<T, K extends keyof T = keyof T> = Partial<T[K]>

export const defineConfig = (config: DeepPartial<BuildConfig>) => config

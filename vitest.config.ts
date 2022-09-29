import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@enochfe/factory': resolve(__dirname, 'packages/factory/src/index.ts')
    }
  },
  test: {}
})

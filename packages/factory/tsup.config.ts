import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@enochfe/factory',
  clean: true,
  dts: true,
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  splitting: true,
  sourcemap: true
})

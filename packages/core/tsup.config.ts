import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@enochfe/core',
  clean: true,
  dts: true,
  entry: ['./src/index.ts', './src/node/vite.ts'],
  format: ['cjs', 'esm'],
  splitting: true,
  sourcemap: true
})

import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['./src/**/*.ts'],
  format: ['cjs', 'esm'],
  splitting: true,
  target: 'node14',
  watch: !!process.env.DEV
})

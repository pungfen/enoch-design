import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['esm'],
  dts: true
})

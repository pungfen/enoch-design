import { defineConfig } from 'tsup'

import vue from 'unplugin-vue/esbuild'

// import vue from 'esbuild-plugin-vue'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,
  format: ['esm', 'cjs'],
  esbuildPlugins: [vue()],
  dts: true,
  tsconfig: '../../tsconfig.web.json',
  legacyOutput: true
})

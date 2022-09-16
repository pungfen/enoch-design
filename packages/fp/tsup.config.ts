import { defineConfig } from 'tsup'
import Vue from 'unplugin-vue/esbuild'

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  legacyOutput: true,
  minify: true,
  outExtension({ format }) {
    return {
      js: `.${format}.js`
    }
  },
  splitting: false,
  treeshake: true,
  esbuildPlugins: [Vue()],
  dts: true,
  tsconfig: './tsconfig.build.json'
})

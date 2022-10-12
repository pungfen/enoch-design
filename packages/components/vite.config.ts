import { rm } from 'node:fs/promises'
import { defineConfig } from 'vite'
import { resolve } from 'path'

import Vue from '@vitejs/plugin-vue'
import Dts from 'vite-plugin-dts'

await rm('dist', { recursive: true, force: true })

export default defineConfig({
  build: {
    target: 'modules',
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: '@enochfe/components',
      formats: ['es', 'cjs'],
      fileName: (x) => `[name].${x}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named'
      }
    }
  },
  plugins: [Vue(), Dts({ tsConfigFilePath: '../../tsconfig.json' })]
})

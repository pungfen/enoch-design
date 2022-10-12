import { rm } from 'node:fs/promises'
import { defineConfig } from 'vite'
import { resolve } from 'path'

import Vue from '@vitejs/plugin-vue'
import Dts from 'vite-plugin-dts'

await rm('dist', { recursive: true, force: true })

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: '@enochfe/components',
      formats: ['es', 'cjs'],
      fileName: (format) => `[name].${format}.js`
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

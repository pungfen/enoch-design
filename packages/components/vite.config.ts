import { defineConfig } from 'vite'
import { resolve } from 'path'

import Vue from '@vitejs/plugin-vue'
import Dts from 'vite-plugin-dts'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'main.ts'),
      name: '@enochfe/components'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [Vue(), Dts({ tsConfigFilePath: '../../tsconfig.json' }), UnoCSS()]
})

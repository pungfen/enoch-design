import { rm } from 'node:fs/promises'

import { defineConfig } from 'vite'
import Dts from 'vite-plugin-dts'

await rm('dist', { recursive: true, force: true })

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: '@enochfe/factory',
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
  plugins: [Dts({ tsConfigFilePath: '../../tsconfig.json' })]
})

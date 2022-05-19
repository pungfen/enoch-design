import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: '@enochfe/components'
    },
    rollupOptions: {
      external: ['vue', 'lodash', 'element-plus'],
      output: [
        {
          format: 'umd',
          exports: 'named',
          name: '@enochfe/components',
          sourcemap: true,
          entryFileNames: 'index.js',
          chunkFileNames: '[name].js',
          namespaceToStringTag: true,
          globals: { 'element-plus': 'ElementPlus', lodash: 'lodash', vue: 'Vue' },
          banner: '/* umd----- */'
        },
        {
          format: 'esm',
          sourcemap: true,
          entryFileNames: 'index.esm.mjs',
          chunkFileNames: '[name].mjs',
          namespaceToStringTag: true,
          banner: '/* esm----- */'
        }
      ]
    }
  }
})

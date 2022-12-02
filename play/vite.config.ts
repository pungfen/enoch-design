import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import VueRouter from 'unplugin-vue-router/vite'
import UnoCSS from 'unocss/vite'
import { presetUno } from 'unocss'

import Inspect from 'vite-plugin-inspect'

function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, ' $1').trim()
  return result.split(' ').join('-').toLowerCase()
}

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${resolve('./src/element.scss')}" as *;`
      }
    }
  },
  plugins: [vue({ reactivityTransform: true }), Inspect(), UnoCSS({ presets: [presetUno()] }), VueRouter({ dts: './src/router.d.ts' })]
})

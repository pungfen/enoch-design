import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'

import Components from 'unplugin-vue-components/vite'

function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, ' $1').trim()
  return result.split(' ').join('-').toLowerCase()
}

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${resolve('./src/styles/element-variables.scss')}" as *;`
      }
    }
  },
  plugins: [
    vue({ reactivityTransform: true }),
    Pages({
      dirs: ['src/pages']
    }),
    Layouts({
      defaultLayout: 'index'
    }),
    Components({
      dts: './components.d.ts',
      resolvers: [
        (componentName) => {
          if (componentName.startsWith('En')) {
            const name = componentName.slice(2)
            const esComponentsFolder = 'element-plus/es/components'
            return {
              name: componentName,
              from: '@enoch/components',
              sideEffects: [`${esComponentsFolder}/${kebabCase(name)}/style/index`]
            }
          }
        }
      ]
    })
  ]
})

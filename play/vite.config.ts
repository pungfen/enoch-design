import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import UnoCSS from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirective from '@unocss/transformer-directives'

// import Components from 'unplugin-vue-components/vite'

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
    UnoCSS({
      shortcuts: [],
      presets: [presetUno(), presetAttributify(), presetIcons()],
      transformers: [transformerDirective()],
      theme: {
        colors: {
          primary: '#4C58D9'
        }
      }
    })
    // Components({
    //   dts: './components.d.ts',
    //   resolvers: [
    //     (componentName) => {
    //       if (componentName.startsWith('En')) {
    //         const name = componentName.slice(2)
    //         const esComponentsFolder = 'element-plus/es/components'
    //         return {
    //           name: componentName,
    //           from: '@enoch/components',
    //           sideEffects: [`${esComponentsFolder}/${kebabCase(name)}/style/index`]
    //         }
    //       }
    //     }
    //   ]
    // })
  ]
})

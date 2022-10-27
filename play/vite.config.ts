import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import UnoCSS from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirective from '@unocss/transformer-directives'
import colors from 'tailwindcss/colors'

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
          ...colors,
          primary: {
            900: '#4C58D9'
          }
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem'
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

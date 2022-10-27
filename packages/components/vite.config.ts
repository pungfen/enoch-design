import { resolve } from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirective from '@unocss/transformer-directives'
import colors from 'tailwindcss/colors'

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    dts(),
    unocss({
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
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'EnochComponent',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})

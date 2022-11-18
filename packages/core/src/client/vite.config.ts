import { resolve } from 'path'
import { defineConfig } from 'vite'

import React from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { presetUno } from 'unocss'

export default defineConfig({
  base: './',

  plugins: [
    React(),
    Unocss({
      presets: [presetUno()]
    })
  ],

  build: {
    outDir: resolve(__dirname, '../../dist/client'),
    minify: false
  }
})

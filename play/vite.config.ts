import { defineConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import UnoCSS from 'unocss/vite'

import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [Vue(), Pages(), UnoCSS()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }
})

import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import Enochfe from '@enochfe/core/vite'

export default defineConfig({
  plugins: [Vue(), Enochfe({})],
  test: {
    globals: true,
    environment: 'jsdom'
  }
})

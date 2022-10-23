import { defineConfig } from '@enochfe/cli'

export default defineConfig({
  entry: ['src/**/*.ts'],
  platform: 'browser',
  vue: true,
  dts: false,
  minify: false
})

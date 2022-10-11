import { defineConfig, presetAttributify, presetUno, type UserConfig } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify()]
})

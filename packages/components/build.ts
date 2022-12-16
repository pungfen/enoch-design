import { fileURLToPath } from 'node:url'

import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'

const Button = fileURLToPath(new URL('src/button/button.vue', import.meta.url))

console.log(Button)

rollup({
  input: [Button],
  plugins: [vue()]
})

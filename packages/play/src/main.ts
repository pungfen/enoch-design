import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'

import App from './app.vue'

import routes from '~pages'

// import EnochComponents from '@enoch/components'

// console.log(EnochComponents)

export const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHashHistory()
})

createApp(App).use(router).mount('#app')

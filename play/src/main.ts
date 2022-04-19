import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
//@ts-ignore
import { setupLayouts } from 'virtual:generated-layouts'

import App from './app.vue'

//@ts-ignore
import routes from '~pages'

export const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHashHistory()
})

createApp(App).use(router).mount('#app')

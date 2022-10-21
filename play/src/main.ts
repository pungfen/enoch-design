import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import routes from '~pages'
import 'uno.css'

import Factory from '@enochfe/factory'

import App from './app.vue'

export const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHashHistory()
})

createApp(App)
  .use(router)
  .use(
    Factory({
      paging: {
        itemCount: 0,
        pageCount: 0,
        pageIndex: 1,
        pageSize: 20
      }
    })
  )
  .mount('#app')

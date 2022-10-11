import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import Factory from '@enochfe/factory'
import routes from '~pages'
import 'uno.css'

import { axios } from './axios'

import App from './app.vue'

export const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHashHistory()
})

createApp(App).use(router).use(Factory, { axios }).mount('#app')

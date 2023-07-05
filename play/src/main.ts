import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createFactory } from '@enochfe/factory'

import 'uno.css'
import routes from '~pages'

import App from '@/app.vue'
import '@/style.css'

const Router = createRouter({
  history: createWebHistory(),
  routes
})

const Factory = createFactory()

createApp(App).use(Router).use(Factory).mount('#app')

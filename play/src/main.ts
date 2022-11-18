import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'

import '@unocss/reset/tailwind.css'
import 'uno.css'

import App from './app.vue'

export const router = createRouter({ history: createWebHashHistory() })

createApp(App).use(router).mount('#app')

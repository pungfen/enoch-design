import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'

import { createFactory } from '@enochfe/factory'

import '@unocss/reset/tailwind.css'
import 'uno.css'

import App from './app.vue'

import { axios } from './axios'

import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/loading.scss'
import 'element-plus/theme-chalk/src/notification.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

export const router = createRouter({ history: createWebHashHistory() })

const factory = createFactory({
  ajax: {
    instance: axios
  }
})

createApp(App).use(router).use(factory).mount('#app')

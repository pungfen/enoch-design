import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'

import { ElNotification } from 'element-plus'

import { createFactory } from '@enochfe/factory'

import '@unocss/reset/tailwind.css'
import 'uno.css'

import App from './app.vue'

import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/loading.scss'
import 'element-plus/theme-chalk/src/notification.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

export const router = createRouter({ history: createWebHashHistory() })

const factory = createFactory({
  ajax: {
    async interceptor(data) {
      if (data.errors && data.errors.length) {
        if (!data.errors[0].shouldNotNotification) {
          ElNotification({ title: '请求失败', message: data.errors[0].message })
        }
      }

      return Promise.resolve(data)
    }
  }
})

createApp(App).use(router).use(factory).mount('#app')

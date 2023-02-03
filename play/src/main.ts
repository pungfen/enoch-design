import { createApp } from 'vue'
import 'uno.css'

import App from '@/app.vue'
import { Router } from '@/router'

import '@/style.css'

createApp(App).use(Router).mount('#app')

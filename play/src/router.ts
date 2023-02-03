import { createRouter, createWebHistory } from 'vue-router'

export const Router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/factory',
      component: () => import('@/pages/factory.vue')
    },
    {
      path: '/unocss',
      component: () => import('@/pages/unocss.vue')
    }
  ]
})

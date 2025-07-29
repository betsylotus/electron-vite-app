import type { RouteRecordRaw } from 'vue-router'

// 静态路由
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@renderer/views/Home/index.vue')
  }
]

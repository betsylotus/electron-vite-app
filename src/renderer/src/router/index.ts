import { type Router, createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import { staticRoutes } from './modules'

// 白名单
const WHITE_NAME_LIST: string[] = []

// 创建路由实例
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRoutes],
  // 是否应该禁止尾部斜杠,默认为false
  strict: false,
  scrollBehavior: () => ({
    left: 0,
    top: 0
  })
})

router.beforeEach(() => {})

router.afterEach(() => {})

router.onError((error) => {
  console.warn('路由错误', error.message)
})

// 配置路由器
const setupRouter = (app: App<Element>) => {
  app.use(router)
}

// 重置路由
const resetRouter = () => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export { router, setupRouter, resetRouter }

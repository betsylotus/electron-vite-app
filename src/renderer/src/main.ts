import App from '@renderer/App.vue'
import { createApp } from 'vue'
import { setupStore } from '@renderer/store'
import { setupRouter, router } from '@renderer/router'

const app = createApp(App)

const bootstrap = async () => {
  // 配置store
  setupStore(app)

  // 配置路由
  setupRouter(app)

  // 等待路由准备就绪
  await router.isReady()

  app.mount('#app')
}

bootstrap()

import { defineStore, storeToRefs } from 'pinia'

import type { Pinia } from 'pinia'

import type { App } from 'vue'

import { createPinia } from 'pinia'

let pinia: Pinia

// 初始化pinia
const setupStore = (app: App) => {
  pinia = createPinia()
  app.use(pinia)
  return pinia
}

// 重置pinia所有store
const resetAllStores = () => {
  if (!pinia) {
    console.error('Pinia is not installed')
    return
  }
  const allStores = (pinia as any)._s
  for (const [_key, store] of allStores) {
    store.$reset()
  }
}

export { defineStore, storeToRefs, setupStore, resetAllStores }

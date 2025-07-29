/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 应用名称
  readonly VITE_APP_NAME: string
  // 应用模块ID
  readonly VITE_APP_MODULE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
